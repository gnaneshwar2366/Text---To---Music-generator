import { Music, ListMusic, Folder, Clock } from 'lucide-react';

interface SidebarProps {
  songCount: number;
}

export function Sidebar({ songCount }: SidebarProps) {
  return (
    <div className="w-64 bg-black h-screen flex flex-col border-r border-gray-800">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center transition-transform duration-300 hover:rotate-6">
            <Music className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            AUD V1.0
          </span>
        </div>

        <nav className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Library
            </h3>
            <ul className="space-y-2">
              <li>
                <button className="flex items-center gap-3 text-white hover:text-cyan-500 transition-colors w-full text-left px-3 py-2 rounded-lg hover:bg-gray-900">
                  <Music className="w-5 h-5" />
                  <span>Songs</span>
                  <span className="ml-auto text-xs text-gray-500">{songCount}</span>
                </button>
              </li>
              <li>
                <button className="flex items-center gap-3 text-gray-400 hover:text-cyan-500 transition-colors w-full text-left px-3 py-2 rounded-lg hover:bg-gray-900">
                  <ListMusic className="w-5 h-5" />
                  <span>Playlists</span>
                </button>
              </li>
              <li>
                <button className="flex items-center gap-3 text-gray-400 hover:text-cyan-500 transition-colors w-full text-left px-3 py-2 rounded-lg hover:bg-gray-900">
                  <Folder className="w-5 h-5" />
                  <span>Spaces</span>
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Sessions
            </h3>
            <ul className="space-y-2">
              <li>
                <button className="flex items-center gap-3 text-cyan-500 hover:text-cyan-400 transition-colors w-full text-left px-3 py-2 rounded-lg bg-gray-900">
                  <Clock className="w-5 h-5" />
                  <span>Current Session</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-800">
        <div className="text-xs text-gray-500">
          <p>Powered by AI</p>
          <p className="text-gray-600 mt-1">v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
