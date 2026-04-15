import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Song } from '../types/Song';
import { formatDuration } from '../utils/metadataGenerator';

interface PlayerProps {
  currentSong: Song | null;
}

export function Player({ currentSong }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const loadTokenRef = useRef(0);
  const lastSrcRef = useRef<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      const audio = audioRef.current;
      // Skip redundant src loads
      if (lastSrcRef.current === currentSong.audioUrl) {
        // Only update volume/mute state
        audio.volume = isMuted ? 0 : volume;
        return;
      }
      const token = ++loadTokenRef.current;
      setIsPlaying(false);
      setCurrentTime(0);
      audio.src = currentSong.audioUrl;
      lastSrcRef.current = currentSong.audioUrl;
      audio.volume = isMuted ? 0 : volume;
      // Ensure previous play promise won't conflict
      audio.pause();
      // Wait for metadata before playing to avoid AbortError
      const handleLoaded = async () => {
        if (token !== loadTokenRef.current) return;
        try {
          await audio.play();
          if (token === loadTokenRef.current) setIsPlaying(true);
        } catch (err: any) {
          if (err?.name !== 'AbortError') {
            // eslint-disable-next-line no-console
            console.warn('Audio play failed:', err);
          }
        }
      };
      audio.addEventListener('loadedmetadata', handleLoaded, { once: true });
      // If already ready, trigger immediately
      if (audio.readyState >= 1) {
        handleLoaded();
      }
    }
  }, [currentSong, volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          if ((err as any)?.name !== 'AbortError') {
            // eslint-disable-next-line no-console
            console.warn('Audio play failed:', err);
          }
        });
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
    if (vol > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md border-t border-gray-800 h-24">
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />

      <div className="h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-4 w-1/4">
          {currentSong ? (
            <>
              {currentSong.imageUrl ? (
                <img
                  src={currentSong.imageUrl}
                  alt={currentSong.title}
                  className="w-14 h-14 rounded-lg object-cover bg-gray-800 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
                />
              ) : (
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.25)]" />
              )}
              <div className="flex flex-col">
                <span className="text-white font-semibold text-sm">{currentSong.title}</span>
                <span className="text-gray-400 text-xs">
                  {currentSong.subGenres && currentSong.subGenres.length > 0
                    ? currentSong.subGenres.join(', ')
                    : currentSong.genre}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 font-semibold text-sm">No track selected</span>
                <span className="text-gray-600 text-xs">Select a song to play</span>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              disabled={!currentSong}
              className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-400 transition-transform disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.05]"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-black" fill="black" />
              ) : (
                <Play className="w-5 h-5 text-black" fill="black" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3 w-full">
            <span className="text-xs text-gray-400 w-12 text-right">
              {formatDuration(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              disabled={!currentSong}
              className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed slider"
              style={{
                background: currentSong
                  ? `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${(currentTime / duration) * 100}%, #374151 ${(currentTime / duration) * 100}%, #374151 100%)`
                  : '#374151',
              }}
            />
            <span className="text-xs text-gray-400 w-12">
              {formatDuration(duration)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-1/4 justify-end">
          <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${(isMuted ? 0 : volume) * 100}%, #374151 ${(isMuted ? 0 : volume) * 100}%, #374151 100%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
