// client/src/components/CheckInForm.tsx
import React, { useState } from 'react';
import { MOOD_LIST, MoodMeta } from '../lib/moods';
import { Plus, Trash2, Music, Link as LinkIcon, Send } from 'lucide-react';

interface SongFormState {
  title: string;
  artist: string;
  link: string;
}

interface CheckInFormProps {
  onSubmit: (data: {
    mood: string;
    energy: number;
    note: string;
    songs: { title: string; artist: string; link?: string }[];
  }) => Promise<void>;
  isSubmitting?: boolean;
}

export const CheckInForm: React.FC<CheckInFormProps> = ({ onSubmit, isSubmitting = false }) => {
  const [selectedMood, setSelectedMood] = useState<string>('chill');
  const [energy, setEnergy] = useState<number>(3);
  const [note, setNote] = useState<string>('');
  const [songs, setSongs] = useState<SongFormState[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const addSong = () => {
    if (songs.length < 3) {
      setSongs([...songs, { title: '', artist: '', link: '' }]);
    }
  };

  const removeSong = (index: number) => {
    setSongs(songs.filter((_, i) => i !== index));
  };

  const updateSong = (index: number, field: keyof SongFormState, value: string) => {
    const updated = [...songs];
    updated[index][field] = value;
    setSongs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate songs
    for (let i = 0; i < songs.length; i++) {
      const s = songs[i];
      if (!s.title.trim() || !s.artist.trim()) {
        setValidationError(`Song #${i + 1} requires both Title and Artist.`);
        return;
      }
      if (s.link && !s.link.startsWith('http://') && !s.link.startsWith('https://')) {
        setValidationError(`Song #${i + 1} link must start with http:// or https://`);
        return;
      }
    }

    try {
      await onSubmit({
        mood: selectedMood,
        energy,
        note: note.trim(),
        songs: songs.map((s) => ({
          title: s.title.trim(),
          artist: s.artist.trim(),
          link: s.link.trim() || undefined,
        })),
      });

      // Reset songs and note on success
      setNote('');
      setSongs([]);
    } catch (err: any) {
      setValidationError(err.message || 'Failed to submit check-in.');
    }
  };

  return (
    <div className="rounded-3xl bg-surface border border-border p-6 shadow-xl">
      <h3 className="font-heading font-bold text-lg text-text-main mb-4 flex items-center gap-2">
        <span>⚡</span> Post Your Daily Check-in
      </h3>

      {validationError && (
        <div className="mb-4 p-3 rounded-2xl bg-pink/10 border border-pink/30 text-xs text-pink">
          {validationError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Mood Selection (8 Chips) */}
        <div>
          <label className="block text-xs font-semibold text-text-muted mb-2">
            How are you feeling right now?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {MOOD_LIST.map((m: MoodMeta) => {
              const isSelected = selectedMood === m.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setSelectedMood(m.key)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-full border text-xs font-bold transition-all ${
                    isSelected
                      ? 'border-transparent shadow-md scale-[1.02]'
                      : 'border-border bg-surface-2 text-text-muted hover:border-text-muted hover:text-text-main'
                  }`}
                  style={{
                    backgroundColor: isSelected ? m.color : undefined,
                    color: isSelected ? '#0B0B10' : undefined,
                  }}
                >
                  <span className="text-base">{m.emoji}</span>
                  <span className="capitalize">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Energy Level (1-5 Dots) */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-text-muted">Energy Level</label>
            <span className="text-xs font-mono font-bold text-amber">{energy} of 5</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setEnergy(lvl)}
                className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${
                  energy >= lvl
                    ? 'bg-amber text-bg shadow-sm'
                    : 'bg-surface-2 text-text-muted border border-border hover:border-text-muted'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Short Note (≤ 80 chars) */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-text-muted">Short Note (Optional)</label>
            <span className={`text-xs font-mono ${note.length > 70 ? 'text-pink' : 'text-text-muted'}`}>
              {note.length}/80
            </span>
          </div>
          <input
            type="text"
            maxLength={80}
            placeholder="e.g. Rainy night, working on minor project code"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-xs text-text-main placeholder-text-muted/50 focus:outline-none focus:border-violet transition-colors"
          />
        </div>

        {/* Songs Section (0-3 songs) */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-violet" />
              <span>Attach Songs ({songs.length}/3)</span>
            </label>
            {songs.length < 3 && (
              <button
                type="button"
                onClick={addSong}
                className="flex items-center gap-1 text-xs text-lime hover:underline font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add song</span>
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {songs.map((song, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-surface-2 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-text-muted uppercase">
                    Song #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSong(idx)}
                    className="text-text-muted hover:text-pink transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Song title (e.g. Starboy)"
                    value={song.title}
                    onChange={(e) => updateSong(idx, 'title', e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-text-main placeholder-text-muted/50 focus:outline-none focus:border-violet"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Artist name (e.g. The Weeknd)"
                    value={song.artist}
                    onChange={(e) => updateSong(idx, 'artist', e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-text-main placeholder-text-muted/50 focus:outline-none focus:border-violet"
                  />
                </div>
                <div className="relative">
                  <LinkIcon className="absolute left-2.5 top-2 w-3 h-3 text-text-muted" />
                  <input
                    type="url"
                    placeholder="Streaming link (optional, e.g. Spotify / YouTube)"
                    value={song.link}
                    onChange={(e) => updateSong(idx, 'link', e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-text-main placeholder-text-muted/50 focus:outline-none focus:border-violet"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-full bg-lime text-bg font-extrabold text-sm hover:bg-[#d5ff5e] active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Posting Vibe…' : 'Post Check-in'}</span>
        </button>
      </form>
    </div>
  );
};
