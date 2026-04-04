import Svg, { Circle, Line, Path, Polygon, Polyline, Rect } from 'react-native-svg';

export type IconName =
  | 'back'
  | 'close'
  | 'cloud'
  | 'edit'
  | 'heart'
  | 'heart-filled'
  | 'library'
  | 'link'
  | 'menu'
  | 'mic'
  | 'music-note'
  | 'plus'
  | 'save'
  | 'search'
  | 'spark'
  | 'star'
  | 'star-filled'
  | 'trash'
  | 'tuner'
  | 'wave';

export function Icon({
  color,
  name,
  size = 20,
  strokeWidth = 1.7,
}: {
  color: string;
  name: IconName;
  size?: number;
  strokeWidth?: number;
}) {
  const commonProps = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none' as const,
  };

  switch (name) {
    case 'menu':
      return (
        <Svg height={size} viewBox="0 0 24 24" width={size}>
          <Line x1="5" x2="19" y1="7" y2="7" {...commonProps} />
          <Line x1="5" x2="16" y1="12" y2="12" {...commonProps} />
          <Line x1="5" x2="19" y1="17" y2="17" {...commonProps} />
        </Svg>
      );
    case 'back':
      return (
        <Svg height={size} viewBox="0 0 24 24" width={size}>
          <Line x1="19" x2="6" y1="12" y2="12" {...commonProps} />
          <Polyline points="11 7 6 12 11 17" {...commonProps} />
        </Svg>
      );
    case 'plus':
      return (
        <Svg height={size} viewBox="0 0 24 24" width={size}>
          <Line x1="12" x2="12" y1="5" y2="19" {...commonProps} />
          <Line x1="5" x2="19" y1="12" y2="12" {...commonProps} />
        </Svg>
      );
    case 'search':
      return (
        <Svg height={size} viewBox="0 0 24 24" width={size}>
          <Circle cx="11" cy="11" r="6" {...commonProps} />
          <Line x1="16" x2="21" y1="16" y2="21" {...commonProps} />
        </Svg>
      );
    case 'star':
      return (
        <Svg height={size} viewBox="0 0 24 24" width={size}>
          <Polygon
            points="12 3.5 14.9 9.4 21.4 10.3 16.7 14.9 17.8 21.3 12 18.2 6.2 21.3 7.3 14.9 2.6 10.3 9.1 9.4 12 3.5"
            {...commonProps}
          />
        </Svg>
      );
    case 'star-filled':
      return (
        <Svg height={size} viewBox="0 0 24 24" width={size}>
          <Polygon
            fill={color}
            points="12 3.5 14.9 9.4 21.4 10.3 16.7 14.9 17.8 21.3 12 18.2 6.2 21.3 7.3 14.9 2.6 10.3 9.1 9.4 12 3.5"
          />
        </Svg>
      );
    case 'heart':
      return (
        <Svg height={size} viewBox="0 0 24 24" width={size}>
          <Path
            d="M12 20.5 4.9 13.8a4.5 4.5 0 0 1 6.3-6.4L12 8.2l.8-.8a4.5 4.5 0 0 1 6.3 6.4L12 20.5Z"
            {...commonProps}
          />
        </Svg>
      );
    case 'heart-filled':
      return (
        <Svg height={size} viewBox="0 0 24 24" width={size}>
          <Path
            d="M12 20.5 4.9 13.8a4.5 4.5 0 0 1 6.3-6.4L12 8.2l.8-.8a4.5 4.5 0 0 1 6.3 6.4L12 20.5Z"
            fill={color}
          />
        </Svg>
      );
    case 'edit':
      return (
        <Svg height={size} viewBox="0 0 24 24" width={size}>
          <Path d="M4 20h4l10.5-10.5-4-4L4 16v4Z" {...commonProps} />
          <Line x1="13.5" x2="17.5" y1="6.5" y2="10.5" {...commonProps} />
        </Svg>
      );
    case 'trash':
      return (
        <Svg height={size} viewBox="0 0 24 24" width={size}>
          <Path d="M5 7h14" {...commonProps} />
          <Path d="M9 7V5h6v2" {...commonProps} />
          <Rect height="12" rx="2" width="10" x="7" y="7" {...commonProps} />
          <Line x1="10" x2="10" y1="10" y2="16" {...commonProps} />
          <Line x1="14" x2="14" y1="10" y2="16" {...commonProps} />
        </Svg>
      );
    case 'close':
      return (
        <Svg height={size} viewBox="0 0 24 24" width={size}>
          <Line x1="6" x2="18" y1="6" y2="18" {...commonProps} />
          <Line x1="18" x2="6" y1="6" y2="18" {...commonProps} />
        </Svg>
      );
    case 'mic':
      return (
        <Svg height={size} viewBox="0 0 24 24" width={size}>
          <Rect height="11" rx="4" width="8" x="8" y="3" {...commonProps} />
          <Path d="M6 11a6 6 0 0 0 12 0" {...commonProps} />
          <Line x1="12" x2="12" y1="17" y2="21" {...commonProps} />
          <Line x1="9" x2="15" y1="21" y2="21" {...commonProps} />
        </Svg>
      );
    case 'link':
      return (
        <Svg height={size} viewBox="0 0 24 24" width={size}>
          <Path d="M10 13.5 8 15.5a3.5 3.5 0 1 1-5-5l3-3a3.5 3.5 0 0 1 5 0" {...commonProps} />
          <Path d="M14 10.5 16 8.5a3.5 3.5 0 1 1 5 5l-3 3a3.5 3.5 0 0 1-5 0" {...commonProps} />
          <Line x1="9" x2="15" y1="15" y2="9" {...commonProps} />
        </Svg>
      );
    case 'save':
      return (
        <Svg height={size} viewBox="0 0 24 24" width={size}>
          <Path d="M5 5h11l3 3v11H5Z" {...commonProps} />
          <Rect height="4" rx="1" width="7" x="8.5" y="5.5" {...commonProps} />
          <Rect height="5" rx="1" width="8" x="8" y="14" {...commonProps} />
        </Svg>
      );
    case 'music-note':
      return (
        <Svg height={size} viewBox="0 0 24 24" width={size}>
          <Path d="M14 5v9.5a2.5 2.5 0 1 1-2.5-2.5c.52 0 1 .15 1.4.4V7.2l6-1.2v7.5a2.5 2.5 0 1 1-2.5-2.5c.52 0 1 .15 1.4.4V7.2L14 8" {...commonProps} />
        </Svg>
      );
    case 'spark':
      return (
        <Svg height={size} viewBox="0 0 24 24" width={size}>
          <Path d="M12 4v4" {...commonProps} />
          <Path d="M12 16v4" {...commonProps} />
          <Path d="M4 12h4" {...commonProps} />
          <Path d="M16 12h4" {...commonProps} />
          <Path d="m6.5 6.5 2.8 2.8" {...commonProps} />
          <Path d="m14.7 14.7 2.8 2.8" {...commonProps} />
          <Path d="m17.5 6.5-2.8 2.8" {...commonProps} />
          <Path d="m9.3 14.7-2.8 2.8" {...commonProps} />
        </Svg>
      );
    case 'cloud':
      return (
        <Svg height={size} viewBox="0 0 24 24" width={size}>
          <Path d="M7 18h9.5a4 4 0 0 0 .4-8A5.5 5.5 0 0 0 6.4 8.7 3.6 3.6 0 0 0 7 18Z" {...commonProps} />
          <Polyline points="12 9 12 15 9.5 12.5" {...commonProps} />
          <Polyline points="12 15 14.5 12.5" {...commonProps} />
        </Svg>
      );
    case 'library':
      return (
        <Svg height={size} viewBox="0 0 24 24" width={size}>
          <Rect height="16" rx="2" width="14" x="5" y="4" {...commonProps} />
          <Line x1="9" x2="9" y1="4" y2="20" {...commonProps} />
          <Line x1="12.5" x2="15.5" y1="9" y2="9" {...commonProps} />
          <Line x1="12.5" x2="15.5" y1="13" y2="13" {...commonProps} />
        </Svg>
      );
    case 'tuner':
      return (
        <Svg height={size} viewBox="0 0 24 24" width={size}>
          <Path d="M4 15a8 8 0 0 1 16 0" {...commonProps} />
          <Circle cx="12" cy="15" r="2" {...commonProps} />
          <Line x1="12" x2="16.5" y1="15" y2="8.5" {...commonProps} />
        </Svg>
      );
    case 'wave':
      return (
        <Svg height={size} viewBox="0 0 24 24" width={size}>
          <Line x1="5" x2="5" y1="12" y2="16" {...commonProps} />
          <Line x1="9" x2="9" y1="8" y2="18" {...commonProps} />
          <Line x1="13" x2="13" y1="5" y2="19" {...commonProps} />
          <Line x1="17" x2="17" y1="9" y2="17" {...commonProps} />
          <Line x1="21" x2="21" y1="12" y2="16" {...commonProps} />
        </Svg>
      );
    default:
      return (
        <Svg height={size} viewBox="0 0 24 24" width={size}>
          <Circle cx="12" cy="12" r="8" {...commonProps} />
        </Svg>
      );
  }
}
