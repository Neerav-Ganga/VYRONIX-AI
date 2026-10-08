import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  Github, 
  Twitter, 
  Brain, 
  Target, 
  BarChart3, 
  X, 
  CheckCircle2, 
  Shield, 
  FileText, 
  HelpCircle,
  Send,
  Zap
} from "lucide-react";
import { cn } from "../lib/utils";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

export default function LandingPage({ onStart }: { onStart: () => void }) {
  const { login, user } = useAuth();
  const [modalType, setModalType] = useState<"privacy" | "terms" | "support" | "social" | null>(null);
  const [supportMessage, setSupportMessage] = useState("");
  const [supportSent, setSupportSent] = useState(false);

  const handleStart = () => {
    onStart();
  };

  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setSupportSent(true);
    setTimeout(() => {
      setSupportSent(false);
      setSupportMessage("");
      setModalType(null);
    }, 2000);
  };

  return (
    <div className="relative overflow-hidden selection:bg-primary/30">
      {/* Background Animated Gradients */}
      <div className="absolute top-0 -left-4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] -z-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 -right-4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[140px] -z-10 pointer-events-none" />
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 py-4 px-6 md:px-24 flex items-center justify-between">
        <Logo size={40} />
        <div className="flex items-center gap-6 md:gap-8 text-sm font-medium text-white/60">
          <a href="#vision" className="hidden sm:inline hover:text-white transition-colors">Vision</a>
          <a href="#intelligence" className="hidden sm:inline hover:text-white transition-colors">Intelligence</a>
          <a href="#growth" className="hidden sm:inline hover:text-white transition-colors">Growth</a>
          <button 
            onClick={handleStart}
            className="btn-primary py-2 px-5 text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/25 active:scale-95 transition-all"
          >
            Launch System
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 md:px-24 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8"
        >
          <Sparkles className="w-3 h-3" />
          The Evolution of Student Productivity
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-9xl font-display font-black tracking-tighter leading-[0.88] mb-10 text-white"
        >
          UNLEASH YOUR <br />
          <span className="glow-text">
            ACADEMIC VELOCITY
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-2xl text-lg md:text-xl text-white/50 font-medium leading-relaxed mb-12"
        >
          Vyronix is the world's most intelligent academic operating system. 
          Synchronizing your schedule, predicting burnout, and optimizing focus 
          with high-performance AI integration.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={handleStart}
            className="btn-primary px-10 py-5 text-sm font-black uppercase tracking-widest flex items-center gap-3 group w-full sm:w-auto relative overflow-hidden active:scale-95 transition-all shadow-2xl shadow-primary/30"
          >
            <span className="relative z-10">Launch Vyronix</span>
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform relative z-10" />
          </button>
        </motion.div>

        {/* Dashboard Preview Plate */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.9 }}
          onClick={handleStart}
          className="mt-28 w-full max-w-5xl relative group cursor-pointer"
        >
          <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 opacity-40 group-hover:opacity-75 transition-opacity duration-1000" />
          <div className="glass rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl transition-transform group-hover:scale-[1.01] duration-500">
            <div className="h-9 bg-white/5 border-b border-white/5 flex items-center justify-between px-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">Vyronix OS 4.0 Preview</span>
              <div className="w-12" />
            </div>
            <div className="p-8 md:p-12 bg-background/90 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-left space-y-4 max-w-md">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                      <Zap className="w-3 h-3 fill-primary" />
                      Live Neural Core
                    </div>
                    <h3 className="text-2xl md:text-3xl font-display font-black text-white">Autonomous Student Intelligence</h3>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Real-time cognitive prime tracking, scheduled 90-minute sprint synchronizations, and predictive burnout equilibrium.
                    </p>
                    <div className="pt-2">
                      <span className="text-xs font-bold text-primary group-hover:underline flex items-center gap-1.5">
                        Click anywhere to enter environment →
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                     {[...Array(24)].map((_, i) => (
                       <motion.div 
                         key={i}
                         animate={{ height: [15, 60, 20, 80, 15] }}
                         transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.06 }}
                         className="w-1.5 bg-gradient-to-t from-primary/30 to-primary rounded-full"
                       />
                     ))}
                  </div>
                </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="py-32 px-6 md:px-24 max-w-7xl mx-auto scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Section 01 // Vision</div>
            <h2 className="text-4xl md:text-6xl font-display font-black leading-tight text-white">THE END OF <br />UNSTABLE GROWTH.</h2>
            <p className="text-white/50 text-lg leading-relaxed max-w-lg font-medium">
              We believe the traditional education model is built on friction. Deadlines, burnout, and fragmented tools create a cognitive ceiling. Vyronix shatters that ceiling by creating a seamless synchronization between your ambition and your execution.
            </p>
            <div className="flex gap-8">
              <div className="space-y-3">
                <div className="w-12 h-1 bg-primary rounded-full" />
                <div className="text-xs font-black uppercase tracking-widest text-white">Autonomous</div>
                <div className="text-[11px] text-white/40">Zero micro-management</div>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-1 bg-secondary rounded-full" />
                <div className="text-xs font-black uppercase tracking-widest text-white">Predictive</div>
                <div className="text-[11px] text-white/40">Circadian pacing alignment</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square glass rounded-[3rem] p-12 flex items-center justify-center relative overflow-hidden border border-white/5 shadow-2xl">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl pointer-events-none" />
               <Logo size={280} className="relative z-10 opacity-30" />
               <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-8 border-[1px] border-dashed border-white/10 rounded-full"
               />
               <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-16 border-[1px] border-dashed border-primary/20 rounded-full"
               />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid // Intelligence */}
      <section id="intelligence" className="py-32 px-6 md:px-24 bg-white/[0.01] scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
             <div className="text-accent text-[10px] font-black uppercase tracking-[0.4em]">Section 02 // Intelligence</div>
             <h2 className="text-4xl md:text-6xl font-display font-black text-white">SYSTEM CAPABILITIES</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={handleStart}
                className="glass rounded-3xl p-8 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group"
              >
                <div className={cn("w-14 h-14 rounded-2xl mb-8 flex items-center justify-center transition-all bg-white/5 group-hover:scale-110", feature.color)}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-white/40 font-medium leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section // Growth */}
      <section id="growth" className="py-40 border-y border-white/5 relative scroll-mt-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-24 text-center mb-24">
           <div className="text-secondary text-[10px] font-black uppercase tracking-[0.4em] mb-4">Section 03 // Growth</div>
           <h2 className="text-4xl md:text-7xl font-display font-black tracking-tighter text-white">GLOBAL SYNC STATUS</h2>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-24 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <Stat value="88%" label="Cognitive Retention" />
          <Stat value="14h+" label="Weekly Time Reclaimed" />
          <Stat value="4.9/5" label="Neural Velocity Score" />
          <Stat value="100%" label="Uptime & Security" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 md:px-24 border-t border-white/5 glass">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Logo size={32} />
            <p className="text-white/40 text-xs font-medium max-w-xs text-center md:text-left">
              Revolutionizing academic life through advanced AI synchronization and emotional intelligence.
            </p>
          </div>
          <div className="flex items-center gap-10 text-white/50 text-xs font-bold uppercase tracking-widest">
            <button onClick={() => setModalType("privacy")} className="hover:text-primary transition-colors">Privacy</button>
            <button onClick={() => setModalType("terms")} className="hover:text-primary transition-colors">Terms</button>
            <button onClick={() => setModalType("support")} className="hover:text-primary transition-colors">Support</button>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setModalType("social")} 
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
              title="Twitter Community"
            >
              <Twitter className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setModalType("social")} 
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
              title="GitHub Open Standards"
            >
              <Github className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-center mt-16 text-[10px] text-white/20 uppercase tracking-[0.3em] font-black">
          VYRONIX AI SYSTEM CORE © 2026 UNIVERSE
        </div>
      </footer>

      {/* Interactive Footer Modals */}
      <AnimatePresence>
        {modalType && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalType(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass rounded-[2.5rem] p-8 border border-white/10 z-[101] shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                  {modalType === "privacy" && <Shield className="w-5 h-5 text-primary" />}
                  {modalType === "terms" && <FileText className="w-5 h-5 text-secondary" />}
                  {modalType === "support" && <HelpCircle className="w-5 h-5 text-accent" />}
                  {modalType === "social" && <Sparkles className="w-5 h-5 text-primary" />}
                  <h3 className="text-xl font-display font-black uppercase tracking-tight text-white">
                    {modalType === "privacy" && "Privacy Architecture"}
                    {modalType === "terms" && "Terms of Service"}
                    {modalType === "support" && "System Support"}
                    {modalType === "social" && "Developer Network"}
                  </h3>
                </div>
                <button onClick={() => setModalType(null)} className="text-white/40 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modalType === "privacy" && (
                <div className="space-y-4 text-xs text-white/70 leading-relaxed">
                  <p>
                    Vyronix operates on a zero-telemetry, encrypted data foundation. Your academic notes, deadlines, and study session history are strictly private to your device and your personal cloud storage.
                  </p>
                  <p>
                    We never sell student metrics or share your workload trends with advertisers. AI consultations are processed ephemerally and never used for unauthorized public model training.
                  </p>
                  <button onClick={() => setModalType(null)} className="w-full btn-primary py-3 text-xs uppercase font-black tracking-wider mt-4">
                    Acknowledged
                  </button>
                </div>
              )}

              {modalType === "terms" && (
                <div className="space-y-4 text-xs text-white/70 leading-relaxed">
                  <p>
                    Welcome to the Vyronix Student Operating System. By accessing the platform, you agree to utilize our autonomous scheduling engine for constructive personal academic empowerment.
                  </p>
                  <p>
                    Autonomous rescheduling features calculate cognitive fatigue probabilistically based on behavioural flow models and should be adjusted to your personal preferences.
                  </p>
                  <button onClick={() => setModalType(null)} className="w-full btn-primary py-3 text-xs uppercase font-black tracking-wider mt-4">
                    Accept Terms
                  </button>
                </div>
              )}

              {modalType === "support" && (
                <form onSubmit={handleSendSupport} className="space-y-4">
                  <p className="text-xs text-white/60">
                    Need assistance or have an academic workflow optimization request? Send a direct dispatch to the Vyronix Core Engineering team:
                  </p>
                  <textarea 
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Describe your question or feedback..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs h-28 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-white/30 resize-none"
                    required
                  />
                  <button 
                    type="submit"
                    className="w-full btn-primary py-3 text-xs uppercase font-black tracking-wider flex items-center justify-center gap-2"
                  >
                    {supportSent ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        Message Dispatched!
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Support Dispatch
                      </>
                    )}
                  </button>
                </form>
              )}

              {modalType === "social" && (
                <div className="space-y-4 text-xs text-white/70">
                  <p>
                    Vyronix is crafted with love for ambitious students, researchers, and creators worldwide. Follow our updates and join the global student velocity collective.
                  </p>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <span className="text-[10px] text-primary uppercase font-bold tracking-widest block mb-1">Official Repository & Community</span>
                    <span className="font-bold text-white">github.com/vyronix-ai • @vyronix_ai</span>
                  </div>
                  <button onClick={() => setModalType(null)} className="w-full btn-primary py-3 text-xs uppercase font-black tracking-wider mt-2">
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ value, label }: { value: string, label: string }) {
  return (
    <div className="space-y-2">
      <div className="text-5xl md:text-6xl font-display font-black text-white tracking-tighter">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-black">{label}</div>
    </div>
  );
}

const features = [
  {
    title: "AI Smart Scheduler",
    desc: "Autonomous rescheduling that detects burnout risk and optimizes your cognitive load based on real-time focus metrics.",
    icon: Brain,
    color: "text-primary shadow-[0_0_20px_rgba(99,102,241,0.2)]"
  },
  {
    title: "Adaptive Focus Mode",
    desc: "Immersive environments that learn your flow state patterns and minimize distractions using behavioral psychology.",
    icon: Target,
    color: "text-secondary shadow-[0_0_20px_rgba(168,85,247,0.2)]"
  },
  {
    title: "Performance Intel",
    desc: "Advanced neural analytics that visualize your growth, subject mastery, and future academic velocity.",
    icon: BarChart3,
    color: "text-accent shadow-[0_0_20px_rgba(6,182,212,0.2)]"
  }
];
