import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Maximize, Volume2, VolumeX, SkipForward, SkipBack, Zap, Sparkles } from "lucide-react";
import ReactPlayer from "react-player";

interface PremiumVideoPlayerProps {
  videoUrl: string;
  onClose?: () => void;
}

export default function PremiumVideoPlayer({ videoUrl }: PremiumVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);

  React.useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      setIsPlaying(false);
    };
  }, []);

  const PlayerComp = ReactPlayer as any;

  const handleTogglePlay = () => {
    if (!isMounted.current) return;
    setIsPlaying(!isPlaying);
    if (isMuted) setIsMuted(false); 
  };

  const handleToggleMute = () => {
    if (!isMounted.current) return;
    setIsMuted(!isMuted);
  };

  const handleReady = (player: any) => {
    if (isMounted.current) {
      setIsReady(true);
      const dur = player.getDuration();
      if (dur) setDuration(dur);
      
      // Auto-play after 1s if still mounted
      setTimeout(() => {
        if (isMounted.current) {
          setIsPlaying(true);
        }
      }, 1000);
    }
  };

  const handleProgress = (state: { played: number }) => {
    if (isMounted.current) {
      setPlayed(state.played);
      // Fallback to update duration if not caught in onReady
      if (duration === 0 && playerRef.current) {
        const dur = playerRef.current.getDuration();
        if (dur) setDuration(dur);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - box.left) / box.width;
    setPlayed(pos);
    playerRef.current?.seekTo(pos);
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-black flex flex-col group/player overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 z-0">
        <PlayerComp
          ref={playerRef}
          url={videoUrl}
          width="100%"
          height="100%"
          playing={isPlaying}
          muted={isMuted}
          volume={0.8}
          onReady={handleReady}
          onProgress={handleProgress}
          config={{
            youtube: {
              playerVars: { 
                modestbranding: 1,
                controls: 0,
                rel: 0,
                showinfo: 0,
                iv_load_policy: 3
              }
            } as any
          }}
        />
      </div>

      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-transparent to-black opacity-40 pointer-events-none" />
      
      <AnimatePresence>
        {(isHovered || !isPlaying) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col justify-between p-8 md:p-12"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">System Feed</div>
                  <div className="text-sm font-bold text-white">VYRONIX_VISION_FILM.MP4</div>
                </div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/5 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Neural Uplink Stable</span>
              </div>
            </div>

            {!isPlaying && (
               <motion.button 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 onClick={handleTogglePlay}
                 className="self-center w-24 h-24 rounded-full bg-primary/20 backdrop-blur-3xl border border-primary/30 flex items-center justify-center group/play transition-all hover:scale-110 hover:bg-primary/40 shadow-2xl shadow-primary/20"
               >
                 <Play className="w-10 h-10 text-white fill-white ml-1" />
               </motion.button>
            )}

            <div className="space-y-6">
              <div 
                className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden cursor-pointer group/progress transition-all hover:h-2"
                onClick={handleSeek}
              >
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_15px_rgba(99,102,241,0.8)]"
                  style={{ width: `${played * 100}%` }}
                />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/progress:opacity-100 transition-opacity" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-6">
                    <SkipBack 
                      className="w-5 h-5 text-white/40 hover:text-white cursor-pointer transition-colors" 
                      onClick={() => playerRef.current?.seekTo(played - 0.1)}
                    />
                    <button onClick={handleTogglePlay}>
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-white fill-white hover:scale-110 transition-transform" />
                      ) : (
                        <Play className="w-6 h-6 text-white fill-white hover:scale-110 transition-transform" />
                      )}
                    </button>
                    <SkipForward 
                      className="w-5 h-5 text-white/40 hover:text-white cursor-pointer transition-colors" 
                      onClick={() => playerRef.current?.seekTo(played + 0.1)}
                    />
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex items-center gap-4">
                    <button onClick={handleToggleMute}>
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 text-white/40 hover:text-white transition-colors" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white/40 hover:text-white transition-colors" />
                      )}
                    </button>
                    <span className="text-[10px] font-black text-white/40 tabular-nums">
                      {formatTime(played * duration)} / {formatTime(duration)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                    <Sparkles className="w-3 h-3 text-accent" />
                    <span className="text-[10px] font-black uppercase text-accent">Enhanced 4K</span>
                  </div>
                  <Maximize 
                    className="w-5 h-5 text-white/40 hover:text-white cursor-pointer transition-colors" 
                    onClick={handleFullscreen}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-15 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}
