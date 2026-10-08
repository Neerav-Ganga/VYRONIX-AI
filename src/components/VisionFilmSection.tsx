import React from "react";
import { motion } from "framer-motion";
import { PlayCircle, Zap, Shield, Brain, Sparkles, ArrowRight } from "lucide-react";
import PremiumVideoPlayer from "./PremiumVideoPlayer";

export default function VisionFilmSection({ onStart }: { onStart?: () => void }) {
  return (
    <section id="vision-film" className="py-24 px-6 md:px-24 max-w-7xl mx-auto scroll-mt-20">
      <div className="flex flex-col items-center mb-16 space-y-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em]"
        >
          Special Presentation
        </motion.div>
        <h2 className="text-4xl md:text-7xl font-display font-black tracking-tighter max-w-4xl leading-[1.1]">
          THE ARCHITECTURE OF <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">HUMAN POTENTIAL</span>
        </h2>
        <p className="text-white/40 text-lg max-w-2xl font-medium">
          A cinematic investigation into how Vyronix AI is redefining the boundaries of academic focus and personal growth.
        </p>
      </div>

      <div className="relative aspect-video glass rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.15)] group">
        <PremiumVideoPlayer videoUrl="https://www.youtube.com/watch?v=f7id-14Z0_M" />
        
        {/* Floating Context Labels */}
        <div className="absolute top-24 left-12 z-30 pointer-events-none hidden lg:block">
           <motion.div 
             initial={{ x: -20, opacity: 0 }}
             whileInView={{ x: 0, opacity: 1 }}
             transition={{ delay: 1 }}
             className="glass p-4 rounded-2xl border-l-4 border-l-primary"
           >
              <div className="text-[10px] font-black uppercase text-primary mb-1">01 Neural Sync</div>
              <div className="text-[10px] font-medium text-white/40">Optimizing core focus frequencies.</div>
           </motion.div>
        </div>

        <div className="absolute bottom-48 right-12 z-30 pointer-events-none hidden lg:block">
           <motion.div 
             initial={{ x: 20, opacity: 0 }}
             whileInView={{ x: 0, opacity: 1 }}
             transition={{ delay: 1.5 }}
             className="glass p-4 rounded-2xl border-r-4 border-r-secondary"
           >
              <div className="text-[10px] font-black uppercase text-secondary mb-1">02 Velocity Analytics</div>
              <div className="text-[10px] font-medium text-white/40">Real-time mastery prediction.</div>
           </motion.div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 glass rounded-3xl border border-white/5 space-y-4">
           <Zap className="w-6 h-6 text-primary" />
           <h4 className="font-bold text-xl uppercase tracking-tight">The Hook</h4>
           <p className="text-sm text-white/40 leading-relaxed">
             We address the cognitive friction of modern student life—the stress, the noise, and the fragmentation of legacy tools.
           </p>
        </div>
        <div className="p-8 glass rounded-3xl border border-white/5 space-y-4">
           <Brain className="w-6 h-6 text-secondary" />
           <h4 className="font-bold text-xl uppercase tracking-tight">The Reveal</h4>
           <p className="text-sm text-white/40 leading-relaxed">
             Experience the futuristic unveiling of Vyronix—a unified intelligence that thinks 10 steps ahead of your deadlines.
           </p>
        </div>
        <div className="p-8 glass rounded-3xl border border-white/5 space-y-4">
           <Sparkles className="w-6 h-6 text-accent" />
           <h4 className="font-bold text-xl uppercase tracking-tight">The Impact</h4>
           <p className="text-sm text-white/40 leading-relaxed">
             A total transformation from disorganization to peak academic performance, powered by strategic AI synchronization.
           </p>
        </div>
      </div>

      <div className="mt-20 flex flex-col items-center">
         <motion.button 
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           onClick={() => onStart?.()}
           className="btn-primary px-12 py-6 text-lg flex items-center gap-3 group"
         >
           Get Started with Vyronix
           <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
         </motion.button>
         <p className="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">The future is Operational</p>
      </div>
    </section>
  );
}
