import { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import {
  RecordingPresets,
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { PitchDetector } from 'pitchy';

import {
  centsBetween,
  describeFrequency,
  getClosestTuningString,
  getTuningString,
  STANDARD_TUNING,
  tuningStateFromCents,
  type TuningString,
} from '../music';

type PermissionState = 'checking' | 'granted' | 'denied' | 'undetermined';

type DetectedPitch = {
  clarity: number;
  centsToNearest: number;
  centsToTarget: number;
  frequency: number;
  fullName: string;
  matchedStringId: TuningString['id'];
};

export const TUNER_SIGNAL_MIN = 0.18;

const recordingOptions = {
  clarityThreshold: 0.82,
  maxFrequency: 360,
  minFrequency: 60,
  onsetStabilizationMs: 220,
} as const;

const meteringRecordingOptions = {
  ...RecordingPresets.HIGH_QUALITY,
  isMeteringEnabled: true,
};

export function useTuner() {
  const [permissionStatus, setPermissionStatus] = useState<PermissionState>('checking');
  const [selectedStringId, setSelectedStringId] = useState<TuningString['id']>(STANDARD_TUNING[0].id);
  const [detectedPitch, setDetectedPitch] = useState<DetectedPitch | null>(null);
  const [webAmplitude, setWebAmplitude] = useState(0);
  const [nativeAmplitude, setNativeAmplitude] = useState(0);
  const recorder = useAudioRecorder(meteringRecordingOptions);
  const recorderState = useAudioRecorderState(recorder, 120);
  const activeStringId = detectedPitch?.matchedStringId ?? selectedStringId;
  const target = useMemo(() => getTuningString(activeStringId), [activeStringId]);

  useEffect(() => {
    async function loadPermissions() {
      const nativeAudio = Platform.OS === 'web' ? null : getNativeAudioModule();
      const response =
        Platform.OS === 'web' || !nativeAudio
          ? await getRecordingPermissionsAsync()
          : await nativeAudio.getMicrophonePermissionsAsync();
      setPermissionStatus(resolvePermissionState(response.granted, response.canAskAgain));
    }

    void loadPermissions();
  }, []);

  useEffect(() => {
    if (permissionStatus !== 'granted' || Platform.OS === 'web') {
      return;
    }

    const nativeAudio = getNativeAudioModule();
    if (!nativeAudio) {
      return;
    }
    const liveNativeAudio = nativeAudio;

    let mounted = true;
    let microphoneSubscription: { remove: () => void } | null = null;
    let levelSubscription: { remove: () => void } | null = null;
    const detector = PitchDetector.forFloat32Array(2048);
    const signalTracker = createSignalStabilityTracker();

    async function startNativePitch() {
      try {
        await liveNativeAudio.initialize();

        microphoneSubscription = liveNativeAudio.addExpoTwoWayAudioEventListener(
          'onMicrophoneData',
          (event: { data: Uint8Array }) => {
            if (!mounted) {
              return;
            }

            const frames = decodePcm16Chunk(event.data);
            if (frames.length < 256) {
              return;
            }

            const signalLevel = normalizeRms(getRms(frames));
            const isStableSignal = signalTracker.isStable(signalLevel);
            const [frequency, clarity] = detector.findPitch(frames, 16000);

            if (
              isStableSignal &&
              Number.isFinite(frequency) &&
              clarity > recordingOptions.clarityThreshold &&
              frequency > recordingOptions.minFrequency &&
              frequency < recordingOptions.maxFrequency
            ) {
              const described = describeFrequency(frequency);
              const closestString = getClosestTuningString(frequency);

              setSelectedStringId((current) => {
                return current === closestString.id ? current : closestString.id;
              });
              setDetectedPitch({
                clarity,
                centsToNearest: centsBetween(frequency, described.reference),
                centsToTarget: centsBetween(frequency, closestString.frequency),
                frequency,
                fullName: described.fullName,
                matchedStringId: closestString.id,
              });
            } else {
              setDetectedPitch(null);
            }
          }
        );

        levelSubscription = liveNativeAudio.addExpoTwoWayAudioEventListener(
          'onInputVolumeLevelData',
          (event: { data: number }) => {
            if (!mounted) {
              return;
            }

            setNativeAmplitude(Math.max(0, Math.min(1, event.data)));
          }
        );

        liveNativeAudio.toggleRecording(true);
      } catch {
        if (mounted) {
          setDetectedPitch(null);
          setNativeAmplitude(0);
        }
      }
    }

    void startNativePitch();

    return () => {
      mounted = false;
      liveNativeAudio.toggleRecording(false);
      microphoneSubscription?.remove();
      levelSubscription?.remove();
    };
  }, [permissionStatus]);

  useEffect(() => {
    if (permissionStatus !== 'granted' || Platform.OS === 'web' || getNativeAudioModule()) {
      return;
    }

    let mounted = true;

    async function startMeteringFallback() {
      try {
        await setAudioModeAsync({
          allowsRecording: true,
          interruptionMode: 'doNotMix',
          playsInSilentMode: true,
        });
        await recorder.prepareToRecordAsync(meteringRecordingOptions);
        recorder.record();
      } catch {
        if (mounted) {
          setNativeAmplitude(0);
        }
      }
    }

    void startMeteringFallback();

    return () => {
      mounted = false;
      if (recorder.isRecording) {
        void recorder.stop().catch(() => undefined);
      }
    };
  }, [permissionStatus, recorder]);

  useEffect(() => {
    if (permissionStatus !== 'granted' || Platform.OS !== 'web') {
      if (Platform.OS === 'web') {
        setDetectedPitch(null);
        setWebAmplitude(0);
      } else {
        setNativeAmplitude(0);
      }
      return;
    }

    let animationFrame = 0;
    let stream: MediaStream | null = null;
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;

    async function startWebPitch() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const AudioContextCtor = window.AudioContext;
        audioContext = new AudioContextCtor();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.12;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        const detector = PitchDetector.forFloat32Array(analyser.fftSize);
        const buffer = new Float32Array(analyser.fftSize);
        const signalTracker = createSignalStabilityTracker();

        const update = () => {
          if (!analyser || !audioContext) {
            return;
          }

          analyser.getFloatTimeDomainData(buffer);
          const [frequency, clarity] = detector.findPitch(buffer, audioContext.sampleRate);
          const signalLevel = normalizeRms(getRms(buffer));
          const isStableSignal = signalTracker.isStable(signalLevel);
          setWebAmplitude(signalLevel);

          if (
            isStableSignal &&
            Number.isFinite(frequency) &&
            clarity > recordingOptions.clarityThreshold &&
            frequency > recordingOptions.minFrequency &&
            frequency < recordingOptions.maxFrequency
          ) {
            const described = describeFrequency(frequency);
            const closestString = getClosestTuningString(frequency);

            setSelectedStringId((current) => {
              return current === closestString.id ? current : closestString.id;
            });
            setDetectedPitch({
              clarity,
              centsToNearest: centsBetween(frequency, described.reference),
              centsToTarget: centsBetween(frequency, closestString.frequency),
              frequency,
              fullName: described.fullName,
              matchedStringId: closestString.id,
            });
          } else {
            setDetectedPitch(null);
          }

          animationFrame = window.requestAnimationFrame(update);
        };

        animationFrame = window.requestAnimationFrame(update);
      } catch {
        setDetectedPitch(null);
      }
    }

    void startWebPitch();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      analyser?.disconnect();
      stream?.getTracks().forEach((track) => track.stop());
      void audioContext?.close();
    };
  }, [permissionStatus]);

  const amplitude = useMemo(() => {
    if (Platform.OS === 'web') {
      return webAmplitude;
    }

    if (getNativeAudioModule()) {
      return nativeAmplitude;
    }

    const metering = recorderState.metering ?? -60;
    return Math.max(0, Math.min(1, (metering + 60) / 60));
  }, [nativeAmplitude, recorderState.metering, webAmplitude]);

  return {
    target,
    amplitude,
    detectedPitch,
    isLivePitch: Platform.OS === 'web' && Boolean(detectedPitch),
    permissionStatus,
    requestPermission: async () => {
      setPermissionStatus('checking');
      const nativeAudio = Platform.OS === 'web' ? null : getNativeAudioModule();
      const response =
        Platform.OS === 'web' || !nativeAudio
          ? await requestRecordingPermissionsAsync()
          : await nativeAudio.requestMicrophonePermissionsAsync();
      setPermissionStatus(resolvePermissionState(response.granted, response.canAskAgain));
    },
    setSelectedStringId,
    tuningState: detectedPitch ? tuningStateFromCents(detectedPitch.centsToTarget) : 'in-tune',
  };
}

function getNativeAudioModule() {
  if (Platform.OS === 'web') {
    return null;
  }

  try {
    const nativeAudio = require('@speechmatics/expo-two-way-audio') as {
      addExpoTwoWayAudioEventListener: (
        eventName: 'onMicrophoneData' | 'onInputVolumeLevelData',
        handler: (event: any) => void
      ) => { remove: () => void };
      getMicrophonePermissionsAsync: () => Promise<{ granted: boolean; canAskAgain: boolean }>;
      initialize: () => Promise<boolean>;
      requestMicrophonePermissionsAsync: () => Promise<{ granted: boolean; canAskAgain: boolean }>;
      toggleRecording: (value: boolean) => boolean;
    };

    return nativeAudio;
  } catch {
    return null;
  }
}

function decodePcm16Chunk(data: Uint8Array) {
  const byteOffset = data.byteOffset ?? 0;
  const byteLength = data.byteLength ?? data.length;
  const usableLength = byteLength - (byteLength % 2);
  const sampleCount = usableLength / 2;
  const pcm = new Int16Array(data.buffer, byteOffset, sampleCount);
  const frames = new Float32Array(sampleCount);

  for (let index = 0; index < sampleCount; index += 1) {
    frames[index] = pcm[index] / 32768;
  }

  return frames;
}

function createSignalStabilityTracker() {
  let signalStartedAt: number | null = null;

  return {
    isStable(signalLevel: number) {
      const now = Date.now();

      if (signalLevel < TUNER_SIGNAL_MIN) {
        signalStartedAt = null;
        return false;
      }

      signalStartedAt ??= now;
      return now - signalStartedAt >= recordingOptions.onsetStabilizationMs;
    },
  };
}

function getRms(buffer: Float32Array) {
  let sum = 0;

  for (let index = 0; index < buffer.length; index += 1) {
    sum += buffer[index] * buffer[index];
  }

  return Math.sqrt(sum / buffer.length);
}

function normalizeRms(rms: number) {
  return Math.max(0, Math.min(1, rms * 12));
}

function resolvePermissionState(granted: boolean, canAskAgain: boolean) {
  if (granted) {
    return 'granted' as const;
  }

  return canAskAgain ? ('undetermined' as const) : ('denied' as const);
}
