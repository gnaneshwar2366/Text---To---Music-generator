import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import { SongTable } from './components/SongTable';
import { Song } from './types/Song';

// ⚠️ Update this whenever you restart Colab
const API_BASE_URL = 'https://c8f9-34-138-58-17.ngrok-free.app';

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ SAFE URL HANDLER (FIXES YOUR CRASH)
  const formatUrl = (path?: string) => {
    if (!path) return ""; // prevents crash

    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  // 🧹 Title cleaner for imperfect backend models
  const cleanTitle = (raw?: string) => {
    if (!raw) return "Untitled AI Track";
    // Drop anything after "Description:" and remove angle-bracket placeholders
    let t = raw.split('Description:')[0];
    t = t.replace(/<[^>]*>/g, '');
    t = t.trim();
    t = t.replace(/^song title inspired by\s*/i, '');
    t = t.replace(/^title\s*[:\-]?\s*/i, '');
    t = t.replace(/\s{2,}/g, ' ').trim();
    if (t.length > 80) t = t.slice(0, 80).trim();
    return t || "Untitled AI Track";
  };

  // 🧠 Local fallback title if backend returns placeholders like "Cool Title"
  const makeFallbackTitle = (fromPrompt: string) => {
    const stopwords = new Set(['create','make','me','an','a','the','with','and','of','for','to','track','song','music','bgm']);
    const words = (fromPrompt || '')
      .toLowerCase()
      .match(/[a-z]+/g) || [];
    const kept = words.filter(w => !stopwords.has(w)).slice(0, 3);
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    const base = kept.map(capitalize).join(' ');
    const suffixes = ['Anthem','Saga','Ascension','Legion','Overture','Rising','Echoes','Requiem','Odyssey','March'];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const title = `${base || 'Untitled'} ${suffix}`.trim();
    return title.length > 80 ? title.slice(0, 80).trim() : title;
  };

  // 🧹 Sanitize genres array (remove placeholders and trailing rules/description)
  const cleanGenres = (arr: unknown): string[] => {
    const raw = Array.isArray(arr) ? arr : [];
    const out = [] as string[];
    for (const g of raw) {
      if (typeof g !== 'string') continue;
      let x = g.split('Rules:')[0].split('Description:')[0];
      x = x.replace(/<[^>]*>/g, '').trim();
      if (!x) continue;
      if (/^genre\s*\d+$/i.test(x)) continue;
      out.push(x);
      if (out.length === 3) break;
    }
    return out;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          duration: 60,
        }),
      });

      // 🔥 SHOW REAL BACKEND ERROR
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error ${response.status}: ${text}`);
      }

      const data = await response.json();

      // 🧠 DEBUG LOG (VERY IMPORTANT)
      console.log("API RESPONSE:", data);

      // 🚨 HANDLE BACKEND ERROR RESPONSE
      if (data.error) {
        throw new Error(data.error);
      }

      // 🚨 VALIDATE REQUIRED FIELDS
      if (!data.audio_url || !data.image_url) {
        throw new Error("Backend did not return audio/image URLs");
      }

      const newSong: Song = {
        id: Date.now().toString(),
        title: (() => {
          const t = cleanTitle(data.title);
          if (/^(cool\s+title|title\s*here)$/i.test(t)) {
            return makeFallbackTitle(prompt);
          }
          return t || makeFallbackTitle(prompt);
        })(),
        genre: (data.primary_genre && cleanGenres([data.primary_genre])[0]) || "AI Multi-Agent",
        subGenres: cleanGenres(data.sub_genres),
        duration: 60,
        audioUrl: formatUrl(data.audio_url),
        imageUrl: formatUrl(data.image_url),
        prompt: prompt,
        timestamp: Date.now(),
      };

      setSongs((prev) => [newSong, ...prev]);
      setCurrentSong(newSong);
      setPrompt('');

    } catch (err) {
      console.error('❌ Generation error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to generate music'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isGenerating) {
      handleGenerate();
    }
  };

  return (
    <div className="flex h-screen bg-[#121212] text-white overflow-hidden relative">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 -right-24 w-[28rem] h-[28rem] rounded-full bg-purple-500/20 blur-3xl animate-float" />
        <div className="absolute -bottom-24 left-1/3 w-[30rem] h-[30rem] rounded-full bg-blue-500/10 blur-3xl animate-float-slower" />
      </div>

      <style>
        {`
          @keyframes shimmer {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
          @keyframes float {
            0% { transform: translateY(0px) translateX(0px) scale(1); }
            50% { transform: translateY(-16px) translateX(8px) scale(1.02); }
            100% { transform: translateY(0px) translateX(0px) scale(1); }
          }
          .animate-float { animation: float 10s ease-in-out infinite; }
          .animate-float-slow { animation: float 14s ease-in-out infinite; }
          .animate-float-slower { animation: float 18s ease-in-out infinite; }
          .btn-shimmer {
            background-size: 200% 200%;
            animation: shimmer 2.5s linear infinite;
          }
        `}
      </style>

      <Sidebar songCount={songs.length} />

      <div className="flex-1 flex flex-col overflow-hidden pb-24">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="text-center mb-12">
              <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-cyan-500 bg-clip-text text-transparent">
                Create the riff you imagine.
              </h1>

              <p className="text-gray-400 max-w-2xl mx-auto">
                Describe your vibe and let <span className="text-cyan-400 font-semibold">AUD V1.0</span> craft music.
              </p>

              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe the music you want..."
                    disabled={isGenerating}
                    className="w-full px-6 py-4 pr-40 bg-[#1e1e1e]/90 border border-gray-700 rounded-full"
                  />

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 rounded-full flex items-center gap-2 text-black font-semibold bg-gradient-to-r from-cyan-400 via-white to-cyan-500 btn-shimmer"
                  >
                    {isGenerating ? "Generating..." : "Generate"}
                  </button>
                </div>

                {error && (
                  <div className="mt-4 px-4 py-3 bg-red-900/20 border border-red-900 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}
              </div>
            </div>

            <SongTable
              songs={songs}
              currentSong={currentSong}
              onPlaySong={handlePlaySong}
            />
          </div>
        </main>

        <Player currentSong={currentSong} />
      </div>
    </div>
  );
}

export default App;