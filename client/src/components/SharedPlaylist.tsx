// client/src/components/SharedPlaylist.tsx
import React from 'react';
import { Music2, ExternalLink, Play } from 'lucide-react';

export interface PlaylistSong {
  id: string;
  title: string;
  artist: string;
  link: string | null;
  addedBy: {
    userId: string;
    displayName: string;
    avatarColor: string;
  };
  createdAt: string;
}

interface SharedPlaylistProps {
  songs: PlaylistSong[];
  total: number;
}

export const SharedPlaylist: React.FC<SharedPlaylistProps> = ({ songs, total }) => {
  return (
    <div className="rounded-3xl bg-surface border border-border p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-base text-text-main flex items-center gap-2">
          <Music2 className="w-4 h-4 text-pink" />
          <span>Shared Room Playlist</span>
        </h3>
        <span className="text-xs text-text-muted font-mono">{total} songs</span>
      </div>

      {songs.length > 0 ? (
        <div className="space-y-2">
          {songs.map((song) => (
            <div
              key={song.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-surface-2 border border-border/50 hover:border-pink/40 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center text-pink group-hover:bg-pink group-hover:text-bg transition-colors flex-shrink-0">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-text-main truncate group-hover:text-pink transition-colors">
                    {song.title}
                  </div>
                  <div className="text-[11px] text-text-muted truncate">
                    {song.artist}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                <div className="flex items-center gap-1.5" title={`Added by ${song.addedBy?.displayName}`}>
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-bg"
                    style={{ backgroundColor: song.addedBy?.avatarColor || '#C6FF3D' }}
                  >
                    {song.addedBy?.displayName?.charAt(0) || 'U'}
                  </div>
                  <span className="text-[11px] text-text-muted hidden sm:inline">
                    {song.addedBy?.displayName}
                  </span>
                </div>

                {song.link && (
                  <a
                    href={song.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-surface hover:bg-surface-2 text-text-muted hover:text-text-main transition-colors"
                    title="Open streaming link in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-xs text-text-muted">
          No songs shared in this room yet. Post a check-in with your favorite tracks!
        </div>
      )}
    </div>
  );
};
