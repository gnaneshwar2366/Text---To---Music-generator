import { Play } from 'lucide-react';
import { Song } from '../types/Song';
import { formatDuration } from '../utils/metadataGenerator';

interface SongTableProps {
  songs: Song[];
  currentSong: Song | null;
  onPlaySong: (song: Song) => void;
}

export function SongTable({ songs, currentSong, onPlaySong }: SongTableProps) {
  if (songs.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-12 text-center">
        <p className="text-gray-400 text-lg">No songs generated yet</p>
        <p className="text-gray-500 text-sm mt-2">Create your first track using the prompt above</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              #
            </th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Title / Genres
            </th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Duration
            </th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => {
            const isActive = currentSong?.id === song.id;
            return (
              <tr
                key={song.id}
                className={`border-b border-gray-800 transition-colors ${
                  isActive
                    ? 'bg-gray-800'
                    : 'hover:bg-gray-800/50 cursor-pointer'
                }`}
                onClick={() => onPlaySong(song)}
              >
                <td className="px-6 py-4 text-gray-400 text-sm">
                  {index + 1}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {song.imageUrl ? (
                      <img
                        src={song.imageUrl}
                        alt={song.title}
                        className="w-12 h-12 rounded-md object-cover bg-gray-800 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0" />
                    )}
                  <div className="flex flex-col">
                    <span className={`font-semibold ${isActive ? 'text-cyan-500' : 'text-white'}`}>
                      {song.title}
                    </span>
                      <span className="text-gray-400 text-sm mt-1">
                        {song.subGenres && song.subGenres.length > 0
                          ? song.subGenres.join(', ')
                          : song.genre}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">
                  {formatDuration(song.duration)}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlaySong(song);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-cyan-500 text-black'
                        : 'bg-gray-800 text-white hover:bg-cyan-500 hover:text-black'
                    }`}
                  >
                    <Play className="w-4 h-4" fill="currentColor" />
                    <span className="text-sm font-medium">Play</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
