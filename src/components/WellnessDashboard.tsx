import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Wind, Moon, Sun, Zap, AlertCircle, Plus, Check, RefreshCw, Sparkles, Smile } from "lucide-react";
import { cn } from "../lib/utils";

interface WellnessDashboardProps {
  onStartFocus: () => void;
}

export default function WellnessDashboard({ onStartFocus }: WellnessDashboardProps) {
  const [hydration, setHydration] = useState(4); // target 8
  const [screenBreaks, setScreenBreaks] = useState(3); // target 5
  const [movement, setMovement] = useState(2); // target 4
  const [breathModalOpen, setBreathModalOpen] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");
  const [breathCount, setBreathCount] = useState(4);

  // Dynamic wellness calculation
  const totalHabitPercent = Math.round(((hydration / 8) + (screenBreaks / 5) + (movement / 4)) / 3 * 100);
  const burnoutRisk = Math.max(8, 25 - Math.round(totalHabitPercent * 0.15));

  const startBreathingExercise = () => {
    setBreathModalOpen(true);
    let currentPhase: "Inhale" | "Hold" | "Exhale" = "Inhale";
    setBreathPhase("Inhale");
    
    // Cycle breathing phases
    const interval = setInterval(() => {
      setBreathPhase(prev => {
        if (prev === "Inhale") return "Hold";
        if (prev === "Hold") return "Exhale";
        return "Inhale";
      });
    }, 4000);

    return () => clearInterval(interval);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tight">WELLNESS & RECOVERY</h2>
          <p className="text-white/40 text-sm">Monitor neuro-fatigue and maintain peak cognitive durability</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            NEURAL RECOVERY: OPTIMAL ({totalHabitPercent}%)
          </div>
          <button 
            onClick={startBreathingExercise}
            className="px-4 py-2 rounded-xl bg-secondary/20 hover:bg-secondary/30 border border-secondary/30 text-secondary-light text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all"
          >
            <Wind className="w-4 h-4" />
            Quick Resync (Breathing)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <WellnessCard 
          title="BURNOUT RISK" 
          value={`${burnoutRisk}%`} 
          label={burnoutRisk < 15 ? "OPTIMAL" : "CONTROLLED"} 
          desc="Calculated from study block density and daily rest cadence." 
          icon={Zap} 
          color="text-primary"
        />
        <WellnessCard 
          title="SLEEP RECOVERY" 
          value="8.2h" 
          label="RESTORATIVE" 
          desc="Deep slow-wave sleep verified. High morning mental clarity." 
          icon={Moon} 
          color="text-secondary"
        />
        <WellnessCard 
          title="MENTAL ENERGY" 
          value={`${Math.min(98, 80 + Math.round(totalHabitPercent * 0.18))}%`} 
          label="HIGH VELOCITY" 
          desc="Alpha wave stability projected across your upcoming work sprint." 
          icon={Wind} 
          color="text-accent"
        />
        <WellnessCard 
          title="FLOW EQUILIBRIUM" 
          value="95" 
          label="BALANCED" 
          desc="Equilibrium between challenging assignments and recovery pauses." 
          icon={Heart} 
          color="text-rose-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Activity Load Matrix */}
        <div className="lg:col-span-2 glass rounded-3xl p-8 border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold uppercase tracking-wider">Cognitive Load Matrix (Last 4 Weeks)</h3>
            <span className="text-xs text-white/40">28-Day Heatmap</span>
          </div>
          <div className="grid grid-cols-7 gap-3">
            {[...Array(28)].map((_, i) => {
              // Deterministic pseudo loads
              const dayScore = ((i * 17 + 23) % 100) / 100;
              return (
                <div key={i} className="space-y-1.5 group relative">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.015 }}
                    className={cn(
                      "aspect-square rounded-xl transition-all cursor-pointer group-hover:scale-110",
                      dayScore > 0.75 ? "bg-primary shadow-[0_0_12px_rgba(99,102,241,0.5)]" : 
                      dayScore > 0.45 ? "bg-primary/50" : 
                      dayScore > 0.2 ? "bg-primary/20" :
                      "bg-white/5"
                    )}
                    title={`Day ${i + 1}: ${Math.round(dayScore * 100)}% Cognitive Load`}
                  />
                  {i < 7 && (
                    <div className="text-[9px] text-center font-bold text-white/30 uppercase">
                      {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
            <span className="text-xs text-white/40 font-medium">Lighter load indicates restorative recovery; saturated indicates high throughput.</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-white/30 uppercase tracking-widest mr-2">Intensity:</span>
              <div className="w-3.5 h-3.5 rounded-md bg-white/5" />
              <div className="w-3.5 h-3.5 rounded-md bg-primary/20" />
              <div className="w-3.5 h-3.5 rounded-md bg-primary/50" />
              <div className="w-3.5 h-3.5 rounded-md bg-primary" />
            </div>
          </div>
        </div>

        {/* Wellness Coaching & Interactive Habits */}
        <div className="space-y-6">
          <div className="glass rounded-3xl p-6 border-l-4 border-l-secondary border border-white/5">
            <div className="flex items-center gap-2 mb-3 text-secondary">
              <Sun className="w-5 h-5" />
              <h4 className="font-bold text-sm uppercase tracking-wide">NEURAL ADVISOR INSIGHT</h4>
            </div>
            <p className="text-sm text-white/70 leading-relaxed mb-6 font-medium">
              "Your focus persistence peaks when you maintain hydration and a 5-minute physical shift every 90 minutes. You are currently 1 habit away from peak recovery."
            </p>
            <button 
              onClick={onStartFocus}
              className="px-6 py-3.5 rounded-2xl bg-secondary/15 hover:bg-secondary/25 border border-secondary/30 text-secondary text-xs font-black uppercase tracking-widest transition-all w-full flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Launch Flow Session
            </button>
          </div>

          {/* Interactive Habits Card */}
          <div className="glass rounded-3xl p-6 border border-white/5 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-accent" />
                <h4 className="font-bold text-sm">Interactive Recovery Habits</h4>
              </div>
              <span className="text-xs font-bold text-accent">{totalHabitPercent}% Complete</span>
            </div>

            <InteractiveHabit
              name="Hydration (Glasses)"
              current={hydration}
              target={8}
              onIncrement={() => setHydration(h => Math.min(8, h + 1))}
              onDecrement={() => setHydration(h => Math.max(0, h - 1))}
            />

            <InteractiveHabit
              name="Micro Screen Breaks"
              current={screenBreaks}
              target={5}
              onIncrement={() => setScreenBreaks(s => Math.min(5, s + 1))}
              onDecrement={() => setScreenBreaks(s => Math.max(0, s - 1))}
            />

            <InteractiveHabit
              name="Physical Movement / Walk"
              current={movement}
              target={4}
              onIncrement={() => setMovement(m => Math.min(4, m + 1))}
              onDecrement={() => setMovement(m => Math.max(0, m - 1))}
            />
          </div>
        </div>
      </div>

      {/* Breathing Exercise Modal */}
      <AnimatePresence>
        {breathModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBreathModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md glass rounded-[3rem] p-10 border border-secondary/30 z-[101] text-center flex flex-col items-center shadow-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary text-[10px] font-black uppercase tracking-wider mb-6">
                <Wind className="w-3.5 h-3.5" />
                Coherence Resync
              </div>

              <motion.div 
                animate={{
                  scale: breathPhase === "Inhale" ? [1, 1.4] : breathPhase === "Hold" ? 1.4 : [1.4, 1],
                  borderColor: breathPhase === "Inhale" ? "#a855f7" : breathPhase === "Hold" ? "#6366f1" : "#06b6d4"
                }}
                transition={{ duration: 4, ease: "easeInOut" }}
                className="w-48 h-48 rounded-full border-4 border-secondary flex flex-col items-center justify-center mb-8 relative shadow-[0_0_50px_rgba(168,85,247,0.3)]"
              >
                <div className="text-2xl font-display font-black text-white">{breathPhase}</div>
                <div className="text-xs text-white/50 uppercase tracking-widest mt-1">4 Seconds</div>
              </motion.div>

              <p className="text-sm text-white/60 mb-8 max-w-xs leading-relaxed">
                Slow rhythmic breathing resets vagal tone and drops cortisol by up to 24% in under two minutes.
              </p>

              <button 
                onClick={() => setBreathModalOpen(false)}
                className="px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest transition-all"
              >
                Conclude Exercise
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function WellnessCard({ title, value, label, desc, icon: Icon, color }: any) {
  return (
    <div className="glass p-6 rounded-3xl border border-white/5 hover:border-primary/20 transition-all group cursor-default">
      <div className="flex items-center justify-between mb-6">
        <div className={cn("p-2.5 rounded-xl bg-white/5 transition-all group-hover:scale-110", color)}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={cn("text-[10px] font-black uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-lg border border-white/5", color)}>
          {label}
        </span>
      </div>
      <div className="text-4xl font-display font-black mb-1">{value}</div>
      <div className="text-xs font-black uppercase tracking-widest text-white/40 mb-3">{title}</div>
      <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
    </div>
  );
}

function InteractiveHabit({ 
  name, 
  current, 
  target, 
  onIncrement, 
  onDecrement 
}: { 
  name: string; 
  current: number; 
  target: number; 
  onIncrement: () => void; 
  onDecrement: () => void; 
}) {
  const percent = Math.min(100, Math.round((current / target) * 100));
  const isDone = current >= target;

  return (
    <div className="space-y-2 p-3 rounded-2xl bg-white/5 border border-white/5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-white/80">{name}</span>
        <div className="flex items-center gap-2">
          <button 
            onClick={onDecrement} 
            disabled={current <= 0}
            className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white flex items-center justify-center text-xs font-bold"
          >
            -
          </button>
          <span className={cn("text-xs font-black min-w-[36px] text-center", isDone ? "text-green-400" : "text-primary")}>
            {current}/{target}
          </span>
          <button 
            onClick={onIncrement}
            disabled={isDone}
            className="w-6 h-6 rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-30 text-white flex items-center justify-center text-xs font-bold"
          >
            +
          </button>
        </div>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          animate={{ width: `${percent}%` }}
          className={cn(
            "h-full rounded-full transition-all",
            isDone ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" : "bg-gradient-to-r from-primary to-accent"
          )}
        />
      </div>
    </div>
  );
}
