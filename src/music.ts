export type TuningString = {
  id: 'E2' | 'A2' | 'D3' | 'G3' | 'B3' | 'E4';
  label: string;
  note: string;
  octave: number;
  frequency: number;
  fullName: string;
};

export const STANDARD_TUNING: TuningString[] = [
  { id: 'E2', label: 'Low E', note: 'E', octave: 2, frequency: 82.41, fullName: 'E2' },
  { id: 'A2', label: 'A', note: 'A', octave: 2, frequency: 110.0, fullName: 'A2' },
  { id: 'D3', label: 'D', note: 'D', octave: 3, frequency: 146.83, fullName: 'D3' },
  { id: 'G3', label: 'G', note: 'G', octave: 3, frequency: 196.0, fullName: 'G3' },
  { id: 'B3', label: 'B', note: 'B', octave: 3, frequency: 246.94, fullName: 'B3' },
  { id: 'E4', label: 'High E', note: 'E', octave: 4, frequency: 329.63, fullName: 'E4' },
];

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

export function getTuningString(stringId: TuningString['id']) {
  return STANDARD_TUNING.find((string) => string.id === stringId) ?? STANDARD_TUNING[0];
}

export function getClosestTuningString(frequency: number) {
  return STANDARD_TUNING.reduce((closest, current) => {
    const closestDistance = Math.abs(closest.frequency - frequency);
    const currentDistance = Math.abs(current.frequency - frequency);

    return currentDistance < closestDistance ? current : closest;
  }, STANDARD_TUNING[0]);
}

export function frequencyToMidi(frequency: number) {
  return Math.round(69 + 12 * Math.log2(frequency / 440));
}

export function midiToFrequency(midi: number) {
  return 440 * 2 ** ((midi - 69) / 12);
}

export function describeFrequency(frequency: number) {
  const midi = frequencyToMidi(frequency);
  const note = NOTE_NAMES[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  const reference = midiToFrequency(midi);

  return {
    midi,
    note,
    octave,
    fullName: `${note}${octave}`,
    reference,
  };
}

export function centsBetween(frequency: number, reference: number) {
  return 1200 * Math.log2(frequency / reference);
}

export function tuningStateFromCents(cents: number) {
  if (Math.abs(cents) <= 4) {
    return 'in-tune' as const;
  }

  return cents < 0 ? ('flat' as const) : ('sharp' as const);
}
