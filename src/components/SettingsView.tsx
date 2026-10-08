import React, { useState, useEffect } from "react";
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Sliders, 
  CheckCircle2, 
  Loader2,
  RefreshCw,
  Sparkles,
  Check
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { userService, UserProfile } from "../lib/userService";

export default function SettingsView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "privacy" | "appearance" | "ai" | "data">("profile");
  
  // Profile state
  const [displayName, setDisplayName] = useState(user?.displayName || "Visionary Student");
  const [email, setEmail] = useState(user?.email || "visionary@vyronix.ai");
  const [selectedAvatar, setSelectedAvatar] = useState(user?.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=vyronix`);
  const [learningStyle, setLearningStyle] = useState("Visual & Conceptual");
  const [studyGoal, setStudyGoal] = useState("35 Hours / Week");

  // Notifications state
  const [notifySchedule, setNotifySchedule] = useState(true);
  const [notifyBurnout, setNotifyBurnout] = useState(true);
  const [notifyStreak, setNotifyStreak] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  // Privacy state
  const [localCacheOnly, setLocalCacheOnly] = useState(false);
  const [anonymizeAnalytics, setAnonymizeAnalytics] = useState(true);

  // Appearance state
  const [accentTheme, setAccentTheme] = useState<"indigo" | "purple" | "cyan" | "emerald">("indigo");
  const [glassBlur, setGlassBlur] = useState<"standard" | "high" | "ultra">("high");

  // AI Behavior state
  const [aiPersona, setAiPersona] = useState<"strategist" | "concise" | "academic">("strategist");
  const [autonomousResolution, setAutonomousResolution] = useState(true);
  const [predictiveBurnout, setPredictiveBurnout] = useState(true);
  const [focusAtmosphere, setFocusAtmosphere] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const AVATARS = [
    `https://api.dicebear.com/7.x/bottts/svg?seed=vyronix`,
    `https://api.dicebear.com/7.x/bottts/svg?seed=quantum`,
    `https://api.dicebear.com/7.x/bottts/svg?seed=nova`,
    `https://api.dicebear.com/7.x/bottts/svg?seed=pulse`,
    `https://api.dicebear.com/7.x/bottts/svg?seed=cyber`,
    `https://api.dicebear.com/7.x/bottts/svg?seed=apex`,
  ];

  useEffect(() => {
    if (user?.uid) {
      userService.getProfile(user.uid).then(data => {
        if (data) {
          if (data.learningStyle) setLearningStyle(data.learningStyle);
          if (data.studyGoal) setStudyGoal(data.studyGoal);
          if (typeof data.autonomousResolution === 'boolean') setAutonomousResolution(data.autonomousResolution);
          if (typeof data.predictiveBurnout === 'boolean') setPredictiveBurnout(data.predictiveBurnout);
          if (typeof data.focusAtmosphere === 'boolean') setFocusAtmosphere(data.focusAtmosphere);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    if (user?.uid) {
      await userService.updateProfile(user.uid, {
        learningStyle,
        studyGoal,
        autonomousResolution,
        predictiveBurnout,
        focusAtmosphere
      });
    }
    // Save to local storage for instant persistence
    localStorage.setItem("vyronix_settings", JSON.stringify({
      displayName,
      email,
      selectedAvatar,
      learningStyle,
      studyGoal,
      notifySchedule,
      notifyBurnout,
      accentTheme,
      aiPersona,
      autonomousResolution
    }));

    setSaving(false);
    setMessage("Neural configuration synchronized.");
    setTimeout(() => setMessage(""), 3500);
  };

  const handleDiscard = () => {
    setDisplayName(user?.displayName || "Visionary Student");
    setLearningStyle("Visual & Conceptual");
    setStudyGoal("35 Hours / Week");
    setMessage("Changes reverted.");
    setTimeout(() => setMessage(""), 2500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tight">SYSTEM CONFIG</h2>
          <p className="text-white/40 text-sm">Fine-tune your personal Vyronix Neural Interface</p>
        </div>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-widest bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            {message}
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Tabs */}
        <aside className="space-y-1.5">
          <SettingsTab icon={User} label="Profile" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
          <SettingsTab icon={Bell} label="Notifications" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} />
          <SettingsTab icon={Shield} label="Privacy" active={activeTab === "privacy"} onClick={() => setActiveTab("privacy")} />
          <SettingsTab icon={Palette} label="Appearance" active={activeTab === "appearance"} onClick={() => setActiveTab("appearance")} />
          <SettingsTab icon={Sliders} label="AI Engine" active={activeTab === "ai"} onClick={() => setActiveTab("ai")} />
          <SettingsTab icon={Database} label="Data Sync" active={activeTab === "data"} onClick={() => setActiveTab("data")} />
        </aside>

        {/* Tab Content */}
        <main className="md:col-span-3 space-y-8">
          {activeTab === "profile" && (
            <section className="glass rounded-[2.5rem] p-8 border border-white/5 space-y-8">
              <h3 className="text-xl font-bold">User Identity & Persona</h3>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-secondary p-1 relative shadow-xl shadow-primary/20">
                  <img 
                    src={selectedAvatar} 
                    alt="avatar" 
                    className="w-full h-full rounded-[1.4rem] bg-background object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <h4 className="text-2xl font-display font-black">{displayName}</h4>
                  <p className="text-white/40 text-xs font-medium">{email}</p>
                  <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                    <span className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                      Growth Tier: Pro
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                      Verified Synced
                    </span>
                  </div>
                </div>
              </div>

              {/* Avatar Selector */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Select Cybernetic Avatar</label>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedAvatar(av)}
                      className={cn(
                        "w-12 h-12 rounded-xl p-0.5 border transition-all flex-shrink-0",
                        selectedAvatar === av ? "border-primary ring-2 ring-primary/40 bg-primary/20" : "border-white/10 hover:border-white/30 bg-white/5"
                      )}
                    >
                      <img src={av} alt="avatar option" className="w-full h-full rounded-lg" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Display Name</label>
                  <input 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Academic Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Learning Cognition Profile</label>
                  <select 
                    value={learningStyle}
                    onChange={(e) => setLearningStyle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                  >
                    <option value="Visual & Conceptual">Visual & Conceptual (Diagrams & Synthesis)</option>
                    <option value="Kinesthetic Active">Kinesthetic (Active Problem Sets)</option>
                    <option value="Auditory & Dialogue">Auditory & Dialogue (Lectures & Discussion)</option>
                    <option value="Rigorous Proofs">Rigorous Text & Mathematical Proofs</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Weekly Focus Goal</label>
                  <input 
                    type="text" 
                    value={studyGoal}
                    onChange={(e) => setStudyGoal(e.target.value)}
                    placeholder="e.g. 35 Hours"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium" 
                  />
                </div>
              </div>
            </section>
          )}

          {activeTab === "notifications" && (
            <section className="glass rounded-[2.5rem] p-8 border border-white/5 space-y-6">
              <h3 className="text-xl font-bold mb-4">Notification Protocols</h3>
              <div className="space-y-6">
                <ToggleItem 
                  title="Circadian Schedule Alerts" 
                  desc="Notify 10 minutes prior to scheduled deep-work blocks and cognitive prime windows." 
                  active={notifySchedule} 
                  onChange={setNotifySchedule}
                />
                <ToggleItem 
                  title="Neuro-Burnout Guard" 
                  desc="Alert when sustained study velocity exceeds 180 continuous minutes without recovery." 
                  active={notifyBurnout} 
                  onChange={setNotifyBurnout}
                />
                <ToggleItem 
                  title="Daily Momentum & Streak Milestones" 
                  desc="Daily briefing summarizing completed units and focus streak status." 
                  active={notifyStreak} 
                  onChange={setNotifyStreak}
                />
                <ToggleItem 
                  title="Immersive Sound Cues" 
                  desc="Futuristic audio chimes upon sprint initiation and milestone accomplishment." 
                  active={soundEffects} 
                  onChange={setSoundEffects}
                />
              </div>
            </section>
          )}

          {activeTab === "privacy" && (
            <section className="glass rounded-[2.5rem] p-8 border border-white/5 space-y-6">
              <h3 className="text-xl font-bold mb-4">Data Privacy & Sovereignty</h3>
              <div className="space-y-6">
                <ToggleItem 
                  title="Anonymize Performance Analytics" 
                  desc="Mask user identifiers before training personal task pacing suggestions." 
                  active={anonymizeAnalytics} 
                  onChange={setAnonymizeAnalytics}
                />
                <ToggleItem 
                  title="Client-Side Offline Caching" 
                  desc="Maintain local state backup in browser local storage for zero-latency instant launch." 
                  active={localCacheOnly} 
                  onChange={setLocalCacheOnly}
                />
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm">Purge Local Session Cache</h4>
                    <p className="text-xs text-white/40">Clear temporary offline tokens and refresh neural caches.</p>
                  </div>
                  <button 
                    onClick={() => {
                      localStorage.removeItem("vyronix_tasks_cache");
                      localStorage.removeItem("vyronix_sessions_cache");
                      setMessage("Local cache cleared.");
                      setTimeout(() => setMessage(""), 2500);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-white/70"
                  >
                    Clear Cache
                  </button>
                </div>
              </div>
            </section>
          )}

          {activeTab === "appearance" && (
            <section className="glass rounded-[2.5rem] p-8 border border-white/5 space-y-6">
              <h3 className="text-xl font-bold mb-4">Visual Atmosphere</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block mb-3">Accent Luminescence</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: "indigo", name: "Cyber Indigo", color: "bg-indigo-500" },
                      { id: "purple", name: "Electric Violet", color: "bg-purple-500" },
                      { id: "cyan", name: "Quantum Cyan", color: "bg-cyan-500" },
                      { id: "emerald", name: "Matrix Emerald", color: "bg-emerald-500" },
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setAccentTheme(t.id as any)}
                        className={cn(
                          "p-3 rounded-2xl border flex items-center gap-2.5 transition-all",
                          accentTheme === t.id ? "bg-white/10 border-white/40 ring-1 ring-white/20" : "bg-white/5 border-white/5 hover:border-white/20"
                        )}
                      >
                        <span className={cn("w-3.5 h-3.5 rounded-full", t.color)} />
                        <span className="text-xs font-bold">{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block mb-3">Glassmorphic Blur Intensity</label>
                  <div className="flex gap-3">
                    {(["standard", "high", "ultra"] as const).map(b => (
                      <button
                        key={b}
                        onClick={() => setGlassBlur(b)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all",
                          glassBlur === b ? "bg-primary text-white border-primary" : "bg-white/5 text-white/40 border-white/10"
                        )}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "ai" && (
            <section className="glass rounded-[2.5rem] p-8 border border-white/5 space-y-6">
              <h3 className="text-xl font-bold mb-4">Neural Engine Behavior</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block mb-3">AI Advisor Tone & Persona</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "strategist", title: "Visionary Strategist", desc: "Balanced, encouraging, world-class executive coaching" },
                      { id: "concise", title: "Hyper-Concise", desc: "Bullet-points only, maximum information density" },
                      { id: "academic", title: "Rigorous Scholar", desc: "Deep analytical depth, retention theory & first principles" },
                    ].map(p => (
                      <div 
                        key={p.id}
                        onClick={() => setAiPersona(p.id as any)}
                        className={cn(
                          "p-4 rounded-2xl border cursor-pointer transition-all",
                          aiPersona === p.id ? "bg-primary/10 border-primary" : "bg-white/5 border-white/5 hover:border-white/20"
                        )}
                      >
                        <div className="text-xs font-bold text-white mb-1">{p.title}</div>
                        <div className="text-[10px] text-white/40 leading-relaxed">{p.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <ToggleItem 
                  title="Autonomous Conflict Resolution" 
                  desc="Allow Vyronix to automatically suggest re-blocking when deadlines shift." 
                  active={autonomousResolution} 
                  onChange={setAutonomousResolution}
                />
                <ToggleItem 
                  title="Predictive Burnout Warning" 
                  desc="Proactively flag cognitive overload 15 minutes before hitting exhaustion." 
                  active={predictiveBurnout} 
                  onChange={setPredictiveBurnout}
                />
                <ToggleItem 
                  title="Focus Atmosphere Sync" 
                  desc="Calibrate ambient acoustics and timer aesthetics to flow states." 
                  active={focusAtmosphere}
                  onChange={setFocusAtmosphere}
                />
              </div>
            </section>
          )}

          {activeTab === "data" && (
            <section className="glass rounded-[2.5rem] p-8 border border-white/5 space-y-6">
              <h3 className="text-xl font-bold mb-4">Data Synchronization & Cloud State</h3>
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                    <div>
                      <div className="text-xs font-bold text-white">Firestore Cloud Sync Status</div>
                      <div className="text-[10px] text-white/40">Connected to Vyronix Realtime Cluster</div>
                    </div>
                  </div>
                  <button 
                    onClick={handleSave}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-white"
                  >
                    Sync Now
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-2 mb-1 text-primary">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Zero-Data Loss Architecture</span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    All study sessions, tasks, habits, and preferences are automatically backed up in both cloud Firestore and cached locally in browser memory.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Action Bar */}
          <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
            <button 
              onClick={handleDiscard}
              className="px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-white/40 hover:text-white transition-colors"
            >
              Discard Changes
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2 px-8 py-3.5 text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Synchronize Config
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

function SettingsTab({ icon: Icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all group text-left",
        active ? "bg-primary/15 text-primary border border-primary/20 shadow-sm" : "text-white/40 hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", active ? "text-primary" : "text-white/30")} />
      {label}
    </button>
  );
}

function ToggleItem({ title, desc, active, onChange }: any) {
  return (
    <div className="flex items-center justify-between group gap-4">
      <div className="space-y-1">
        <h4 className="font-bold text-sm text-white group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-xs text-white/40 max-w-md leading-relaxed">{desc}</p>
      </div>
      <button 
        onClick={() => onChange(!active)}
        className={cn(
          "w-12 h-6 rounded-full transition-all relative flex-shrink-0 cursor-pointer",
          active ? "bg-primary" : "bg-white/10"
        )}
      >
        <motion.div 
          animate={{ x: active ? 24 : 4 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
        />
      </button>
    </div>
  );
}
