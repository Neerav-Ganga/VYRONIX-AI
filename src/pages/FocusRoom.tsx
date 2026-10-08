import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RefreshCcw, 
  Maximize2,
  Minimize2,
  Brain,
  Sparkles,
  Waves,
  Wind,
  Coffee,
  CheckCircle2
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import { sessionService } from "../lib/sessionService";

export default function FocusRoom({ onExit }: { onExit: () => void }) {
  const { user } = useAuth();
  const [sessionDuration, setSessionDuration] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [ambientSound, setAmbientSound] = useState<"none" | "waves" | "wind" | "cafe">("waves");
  const [isMuted, setIsMuted] = useState(true);
  const [sessionCount, setSessionCount] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mode, setMode] = useState<"focus" | "rest">("focus");

  // Web Audio Context for synthesized soothing ambient sounds
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Audio synthesizer effect
  useEffect(() => {
    if (!isMuted && ambientSound !== "none" && isActive) {
      startAmbientAudio(ambientSound);
    } else {
      stopAmbientAudio();
    }
    return () => {
      stopAmbientAudio();
    };
  }, [isMuted, ambientSound, isActive]);

  const startAmbientAudio = (type: "waves" | "wind" | "cafe") => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      stopAmbientAudio();

      // Synthesize pink/brown noise
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter to shape into waves, wind, or cafe
      const filter = ctx.createBiquadFilter();
      if (type === "waves") {
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(350, ctx.currentTime);
        // Swell modulation
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.15, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(180, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
      } else if (type === "wind") {
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(450, ctx.currentTime);
        filter.Q.setValueAtTime(2.0, ctx.currentTime);
      } else {
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(600, ctx.currentTime);
      }

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(0);
      noiseNodeRef.current = whiteNoise;
      gainNodeRef.current = gain;
    } catch (e) {
      console.warn("Ambient audio error:", e);
    }
  };

  const stopAmbientAudio = () => {
    if (noiseNodeRef.current) {
      try {
        (noiseNodeRef.current as any).stop();
        noiseNodeRef.current.disconnect();
      } catch (_) {}
      noiseNodeRef.current = null;
    }
  };

  const handleSessionComplete = async () => {
    setSessionCount(s => s + 1);
    if (user?.uid) {
      const durationMins = Math.max(1, Math.floor(sessionDuration / 60));
      await sessionService.addSession(user.uid, mode, durationMins);
    }
    // Switch to rest or next focus
    if (mode === "focus") {
      setMode("rest");
      handleDurationChange(5);
    } else {
      setMode("focus");
      handleDurationChange(25);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = Math.max(0, Math.min(100, ((sessionDuration - timeLeft) / sessionDuration) * 100));
  const PRESETS = mode === "focus" ? [15, 25, 45, 60, 90] : [3, 5, 10, 15];

  const handleDurationChange = (minutes: number) => {
    const seconds = minutes * 60;
    setSessionDuration(seconds);
    setTimeLeft(seconds);
    setIsActive(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-hidden flex flex-col items-center justify-center select-none">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ scale: isActive ? [1, 1.15, 1] : 1, opacity: isActive ? [0.15, 0.25, 0.15] : 0.1 }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[85vw] bg-primary/20 rounded-full blur-[160px]" 
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-3xl" />
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 w-full p-8 flex items-center justify-between z-10">
        <button 
          onClick={() => {
            stopAmbientAudio();
            onExit();
          }}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group px-4 py-2 rounded-2xl glass hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold tracking-widest text-xs uppercase">Exit Flow</span>
        </button>

        {/* Mode Toggle */}
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 glass">
          <button
            onClick={() => {
              setMode("focus");
              handleDurationChange(25);
            }}
            className={cn(
              "px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
              mode === "focus" ? "bg-primary text-white shadow-md shadow-primary/30" : "text-white/40 hover:text-white"
            )}
          >
            Deep Focus
          </button>
          <button
            onClick={() => {
              setMode("rest");
              handleDurationChange(5);
            }}
            className={cn(
              "px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
              mode === "rest" ? "bg-secondary text-white shadow-md shadow-secondary/30" : "text-white/40 hover:text-white"
            )}
          >
            Rest Recovery
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full glass border border-white/5 flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", isActive ? "bg-primary animate-ping" : "bg-white/30")} />
            <span className="text-xs font-bold uppercase tracking-widest text-white/80">
              {isActive ? "Neural Link Active" : "Standby"}
            </span>
          </div>
          <button 
            onClick={toggleFullscreen}
            className="p-3 rounded-full glass hover:bg-white/10 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-white/60" /> : <Maximize2 className="w-4 h-4 text-white/60" />}
          </button>
        </div>
      </div>

      {/* Main Focus UI */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Duration Presets */}
        {!isActive && (
          <div className="flex justify-center gap-2 mb-8 animate-in fade-in duration-300">
            {PRESETS.map((m) => (
              <button
                key={m}
                onClick={() => handleDurationChange(m)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  sessionDuration === m * 60 
                    ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105" 
                    : "glass text-white/40 hover:text-white hover:bg-white/10"
                )}
              >
                {m}m
              </button>
            ))}
          </div>
        )}

        {/* Circular Display */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center"
        >
          {/* Animated concentric rings */}
          <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
          <motion.div 
            animate={{ rotate: isActive ? 360 : 0 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className={cn(
              "absolute inset-0 border-2 border-transparent rounded-full",
              mode === "focus" ? "border-t-primary border-r-primary/40" : "border-t-secondary border-r-secondary/40"
            )}
          />
          <div 
            className="absolute inset-2 rounded-full border border-white/5"
            style={{
              background: `conic-gradient(${mode === "focus" ? '#6366f1' : '#a855f7'} ${progress * 3.6}deg, transparent ${progress * 3.6}deg)`
            }}
          />
          <div className="absolute inset-3 rounded-full bg-background/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center" />

          {/* Time & Label */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <motion.div 
              key={timeLeft}
              initial={{ y: 6, opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-7xl md:text-8xl font-black font-display tracking-tighter text-white"
            >
              {formatTime(timeLeft)}
            </motion.div>
            <div className="text-xs font-bold text-white/40 uppercase tracking-[0.4em] mt-2">
              {isActive ? (mode === "focus" ? "Deep Execution" : "Vagal Restoration") : "Ready to Synchronize"}
            </div>
            {isActive && (
              <div className="mt-3 text-[10px] text-primary font-black uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                Sprint #{sessionCount}
              </div>
            )}
          </div>
        </motion.div>

        {/* Controls */}
        <div className="mt-12 flex items-center gap-6">
          <button 
            onClick={() => {
              setTimeLeft(sessionDuration);
              setIsActive(false);
            }}
            title="Reset timer"
            className="p-4 rounded-2xl glass hover:bg-white/10 text-white/50 hover:text-white transition-all active:scale-95"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => {
              const nextActive = !isActive;
              setIsActive(nextActive);
              if (nextActive && isMuted) {
                // Auto unmute soothing sound if user started
                setIsMuted(false);
              }
            }}
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl active:scale-95 cursor-pointer",
              mode === "focus" 
                ? "bg-white text-background hover:scale-105 shadow-white/20" 
                : "bg-secondary text-white hover:scale-105 shadow-secondary/40"
            )}
          >
            {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current translate-x-1" />}
          </button>

          <button 
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "Unmute Ambient Sound" : "Mute Sound"}
            className={cn(
              "p-4 rounded-2xl glass transition-all active:scale-95",
              !isMuted ? "text-primary border-primary/30 bg-primary/10" : "text-white/40 hover:text-white hover:bg-white/10"
            )}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Ambient Acoustics Selector */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
            Ambient Acoustics {isMuted && "(Muted)"}
          </span>
          <div className="flex items-center gap-3">
            <AmbienceButton 
              active={ambientSound === "waves"} 
              icon={Waves} 
              label="Ocean Swell"
              onClick={() => {
                setAmbientSound("waves");
                setIsMuted(false);
              }} 
            />
            <AmbienceButton 
              active={ambientSound === "wind"} 
              icon={Wind} 
              label="Binaural Wind"
              onClick={() => {
                setAmbientSound("wind");
                setIsMuted(false);
              }} 
            />
            <AmbienceButton 
              active={ambientSound === "cafe"} 
              icon={Coffee} 
              label="Coffee Sanctuary"
              onClick={() => {
                setAmbientSound("cafe");
                setIsMuted(false);
              }} 
            />
          </div>
        </div>

        {/* AI Coaching Tips */}
        <div className="mt-10 max-w-md text-center px-6">
          <div className="flex items-center justify-center gap-2 mb-2 text-primary">
            <Brain className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Cognitive Strategist</span>
          </div>
          <p className="text-xs text-white/60 font-medium leading-relaxed">
            {mode === "focus" 
              ? "Deep execution locks concepts into long-term memory. Maintain steady posture and let distractions float by." 
              : "Allow your prefrontal cortex to decompress. Hydrate and relax your shoulders."}
          </p>
        </div>
      </div>

      {/* Progress Footer */}
      <div className="absolute bottom-0 w-full p-8 flex items-center gap-6 z-10">
        <span className="text-xs font-bold text-white/30 whitespace-nowrap uppercase tracking-widest">Velocity Path</span>
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
          <motion.div 
            animate={{ width: `${progress}%` }}
            className={cn("h-full transition-all", mode === "focus" ? "bg-primary shadow-[0_0_12px_#6366f1]" : "bg-secondary shadow-[0_0_12px_#a855f7]")}
          />
        </div>
        <span className="text-xs font-bold text-white/40 whitespace-nowrap uppercase tracking-widest">
          {sessionCount} / 4 Sprints Today
        </span>
      </div>
    </div>
  );
}

function AmbienceButton({ icon: Icon, active, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all",
        active 
          ? "bg-primary text-white shadow-lg shadow-primary/30 border border-primary/50" 
          : "glass text-white/40 hover:text-white hover:bg-white/10"
      )}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}
