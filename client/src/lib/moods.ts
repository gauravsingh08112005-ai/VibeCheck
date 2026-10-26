// client/src/lib/moods.ts
// Single source of truth for UI mood metadata (DESIGN Section 2.2)

export interface MoodMeta {
  key: string;
  label: string;
  emoji: string;
  color: string;
}

export const MOODS: Record<string, MoodMeta> = {
  happy: { key: 'happy', label: 'Happy', emoji: '😊', color: '#FFB020' },
  hyped: { key: 'hyped', label: 'Hyped', emoji: '⚡', color: '#FF4D8D' },
  romantic: { key: 'romantic', label: 'Romantic', emoji: '💘', color: '#FB7185' },
  chill: { key: 'chill', label: 'Chill', emoji: '🌊', color: '#22D3EE' },
  focused: { key: 'focused', label: 'Focused', emoji: '🎯', color: '#8B5CF6' },
  nostalgic: { key: 'nostalgic', label: 'Nostalgic', emoji: '📼', color: '#E0A96D' },
  stressed: { key: 'stressed', label: 'Stressed', emoji: '😵‍💫', color: '#FF7A45' },
  sad: { key: 'sad', label: 'Sad', emoji: '🌧️', color: '#5B8DEF' },
};

export const MOOD_LIST = Object.values(MOODS);

export function getLabelColor(label: string | null): string {
  if (!label) return '#A1A1B5';
  switch (label) {
    case 'Low vibes':
      return '#5B8DEF';
    case 'Balanced vibes':
      return '#FFB020';
    case 'Good vibes':
      return '#C6FF3D';
    case 'Peak vibes':
      return '#FF4D8D';
    default:
      return '#C6FF3D';
  }
}
