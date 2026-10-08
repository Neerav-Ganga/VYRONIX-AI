import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Calendar, 
  Target, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  Plus, 
  Bell, 
  Search,
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Zap, 
  Sparkles, 
  Brain, 
  Heart, 
  LogOut,
  X,
  ChevronRight,
  Shield,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from "../context/AuthContext";
import AIChatAssistant from "../components/AIChatAssistant";
import AnalyticsView from "../components/AnalyticsView";
import SmartCalendar from "../components/SmartCalendar";
import WellnessDashboard from "../components/WellnessDashboard";
import SettingsView from "../components/SettingsView";
import Logo from "../components/Logo";
import TaskModal from "../components/TaskModal";
import DailyGoalsSection from "../components/DailyGoalsSection";
import ProductivityInsightsSection from "../components/ProductivityInsightsSection";
import { taskService, Task } from "../lib/taskService";
import { format } from "date-fns";

const productivityData = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 85 },
  { name: 'Wed', score: 78 },
  { name: 'Thu', score: 92 },
  { name: 'Fri', score: 70 },
  { name: 'Sat', score: 40 },
  { name: 'Sun', score: 88 },
];

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  read: boolean;
  type: "alert" | "insight" | "milestone";
}

export default function Dashboard({ onFocusMode, onBack }: { onFocusMode: () => void, onBack: () => void }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: "1", title: "Optimal 90m deep-work window detected (09:00 - 10:30)", time: "10m ago", read: false, type: "insight" },
    { id: "2", title: "Distributed Systems assignment deadline in 4 hours", time: "1h ago", read: false, type: "alert" },
    { id: "3", title: "7-day focus consistency streak unlocked! (+15% velocity)", time: "Yesterday", read: true, type: "milestone" },
  ]);

  useEffect(() => {
    if (user?.uid) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;
    setLoadingTasks(true);
    const data = await taskService.getTasks(user.uid);
    setTasks(data);
    setLoadingTasks(false);
  };

  const handleToggleTask = async (task: Task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    await taskService.updateTaskStatus(user?.uid || "", task.id, nextStatus);
    loadTasks();
  };

  const handleLogout = async () => {
    await logout();
    onBack();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Filter tasks for sections and search
  const filteredTasks = searchQuery.trim() 
    ? tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.subject.toLowerCase().includes(searchQuery.toLowerCase()))
    : tasks;

  const urgentTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').slice(0, 4);
  const upcomingTasks = tasks.filter(t => t.status !== 'completed').slice(0, 4);
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="flex h-screen bg-background overflow-hidden relative selection:bg-primary/30">
      <TaskModal 
        userId={user?.uid || ""} 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        onTaskAdded={loadTasks}
      />

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 glass backdrop-blur-3xl z-10">
        <div className="mb-10 flex flex-col items-center gap-2 cursor-pointer" onClick={() => setActiveTab("overview")}>
           <Logo size={36} />
        </div>

        <nav className="flex-1 space-y-1.5">
          <NavItem icon={LayoutDashboard} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
          <NavItem icon={Calendar} label="Scheduler" active={activeTab === "scheduler"} onClick={() => setActiveTab("scheduler")} />
          <NavItem icon={Target} label="Focus Room" active={activeTab === "focus"} onClick={onFocusMode} />
          <NavItem icon={Heart} label="Wellness" active={activeTab === "wellness"} onClick={() => setActiveTab("wellness")} />
          <NavItem icon={BarChart3} label="Analytics" active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} />
          <NavItem icon={MessageSquare} label="AI Advisor" active={activeTab === "ai"} onClick={() => setActiveTab("ai")} />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-1.5">
          <NavItem icon={Settings} label="Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
          <NavItem icon={LogOut} label="Exit System" onClick={() => onBack()} />
          
          {/* Growth Tier Card */}
          <div 
            onClick={() => setIsTierModalOpen(true)}
            className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-secondary/15 border border-primary/20 cursor-pointer hover:border-primary/40 transition-all group"
          >
            <div className="flex items-center gap-3 mb-2.5">
               <div className="w-8 h-8 rounded-xl bg-surface flex items-center justify-center font-bold text-xs text-primary ring-1 ring-primary/20 group-hover:scale-105 transition-transform">
                  {user?.displayName?.charAt(0) || "V"}
               </div>
               <div className="overflow-hidden flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black text-primary uppercase tracking-widest">Growth Tier</p>
                    <span className="text-[8px] text-white/40 group-hover:text-white transition-colors">Details →</span>
                  </div>
                  <p className="text-xs font-bold truncate text-white/90">{user?.displayName?.split(' ')[0] || "Student"}</p>
               </div>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "88%" }}
                 className="h-full bg-gradient-to-r from-primary to-secondary" 
               />
            </div>
            <div className="flex justify-between items-center mt-2 text-[9px] text-white/40 font-semibold">
              <span>Tier 3 Velocity</span>
              <span>88% Level</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 relative z-0 flex flex-col">
        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <motion.div key={activeTab} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-display font-black tracking-tight flex items-center gap-3">
               {activeTab === "overview" && `Synched, ${user?.displayName?.split(' ')[0] || "Student"}`}
               {activeTab === "scheduler" && "Predictive Scheduling"}
               {activeTab === "analytics" && "Cognitive Intel"}
               {activeTab === "wellness" && "Burnout & Recovery Monitor"}
               {activeTab === "settings" && "System Configuration"}
               {activeTab === "ai" && "AI Advisor Core"}
            </h1>
            <p className="text-white/40 text-sm font-medium">
               {activeTab === "overview" && `Cognitive capacity estimated at 94% today • 0 upcoming conflicts.`}
               {activeTab === "scheduler" && "Synchronizing curriculum deadlines with circadian cognitive prime windows."}
               {activeTab === "analytics" && "Multi-week focus persistence and subject retention diagnostics."}
               {activeTab === "wellness" && "Neuro-fatigue monitoring and proactive pacing safeguards."}
               {activeTab === "settings" && "Tailor cognitive profile, notifications, and neural engine parameters."}
               {activeTab === "ai" && "Autonomous academic strategist online and connected to your active workload."}
            </p>
          </motion.div>
          
          <div className="flex items-center gap-3 relative">
            {/* Quick Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks, subjects..." 
                className="bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all w-52 md:w-64 text-white placeholder:text-white/30"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Notifications Button */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-white/70" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-background animate-pulse" />
                )}
              </button>

              {/* Notifications Popover */}
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-14 w-80 glass rounded-3xl p-5 border border-white/10 shadow-2xl z-50 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-primary" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">System Alerts</h4>
                      </div>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllNotificationsRead}
                          className="text-[10px] text-primary hover:underline font-bold uppercase"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="space-y-2.5 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div 
                          key={n.id}
                          className={cn(
                            "p-3 rounded-2xl border text-xs transition-all",
                            n.read ? "bg-white/[0.02] border-white/5 text-white/60" : "bg-primary/10 border-primary/20 text-white font-medium"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="leading-snug">{n.title}</span>
                            {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1" />}
                          </div>
                          <span className="text-[9px] text-white/30 uppercase mt-1 block">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Add Task */}
            <button 
              onClick={() => setIsTaskModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest hover:bg-primary-dark shadow-lg shadow-primary/25 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>
        </header>

        {/* Search Results Filter Banner if searching */}
        {searchQuery && (
          <div className="mb-6 p-4 rounded-2xl glass border border-primary/30 flex items-center justify-between">
            <div className="text-xs text-white/80">
              Showing search results for <strong className="text-primary">"{searchQuery}"</strong> ({filteredTasks.length} found)
            </div>
            <button onClick={() => setSearchQuery("")} className="text-xs text-primary font-bold hover:underline">
              Clear filter
            </button>
          </div>
        )}

        {/* View Tabs Container */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* 4 Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard title="Focus Quotient" value="94" sub="Top 4% Global Student" icon={Zap} trend="+12%" color="text-primary" />
                  <StatCard title="Active Neural Hours" value="26.5h" sub="Curriculum study sprint" icon={Clock} trend="+4.5h" color="text-secondary" />
                  <StatCard title="Completed Units" value={completedTasks.length.toString()} sub={`Out of ${tasks.length} total`} icon={CheckCircle2} trend="+4 units" color="text-accent" />
                  <StatCard title="Burnout Equilibrium" value="Minimal" sub="Recovery index 95%" icon={TrendingUp} trend="Stable" color="text-green-400" />
                </div>

                {/* Daily Academic Goals Section */}
                <DailyGoalsSection userId={user?.uid || ""} />

                {/* Productivity Insights: Focus Room Time vs Daily Goals Recharts Section */}
                <ProductivityInsightsSection 
                  userId={user?.uid || ""} 
                  onNavigateToFocus={onFocusMode} 
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Velocity Chart & Priorities */}
                  <div className="lg:col-span-2 space-y-8">
                     <section className="glass rounded-3xl p-8 border border-white/5">
                        <div className="flex items-center justify-between mb-8">
                          <h2 className="text-xl font-bold flex items-center gap-2">
                             <TrendingUp className="w-5 h-5 text-primary" />
                             Productivity Velocity Matrix
                          </h2>
                          <span className="text-xs text-white/40 uppercase font-black tracking-widest">7-Day Trajectory</span>
                        </div>
                        <div className="h-64">
                           <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={productivityData}>
                                <defs>
                                  <linearGradient id="dashboardScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <Tooltip 
                                  contentStyle={{ background: 'rgba(17, 24, 39, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                                  itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#dashboardScore)" />
                              </AreaChart>
                           </ResponsiveContainer>
                        </div>
                     </section>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Strategic Priorities */}
                        <div className="glass rounded-3xl p-6 border border-white/5 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-6">
                              <h3 className="font-bold flex items-center gap-2 text-sm">
                                <AlertCircle className="w-4 h-4 text-primary" />
                                Strategic Priorities
                              </h3>
                              <button 
                                onClick={() => setIsTaskModalOpen(true)}
                                className="text-[10px] text-primary font-bold uppercase hover:underline"
                              >
                                + New
                              </button>
                            </div>
                            <div className="space-y-3">
                              {urgentTasks.length > 0 ? urgentTasks.map(task => (
                                <PriorityItem 
                                  key={task.id} 
                                  title={task.title} 
                                  time={format(task.deadline.toDate(), "HH:mm")} 
                                  tag={task.subject}
                                  completed={task.status === 'completed'}
                                  onToggle={() => handleToggleTask(task)}
                                />
                              )) : (
                                <div className="py-8 text-center text-white/30 text-xs">
                                  All urgent priorities completed!
                                </div>
                              )}
                            </div>
                          </div>

                          <button 
                            onClick={() => setActiveTab("scheduler")}
                            className="mt-4 text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-white flex items-center gap-1.5 transition-colors pt-3 border-t border-white/5"
                          >
                            <span>Open Full Scheduler</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>

                        {/* AI Intelligence Card */}
                        <div className="glass rounded-3xl p-6 border border-secondary/20 relative overflow-hidden bg-gradient-to-br from-secondary/10 to-transparent flex flex-col justify-between">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
                           <div>
                             <div className="flex items-center gap-2 mb-4">
                              <Sparkles className="w-4 h-4 text-secondary" />
                              <h3 className="font-bold text-sm">Autonomous AI Guidance</h3>
                            </div>
                            <p className="text-xs text-white/60 mb-6 leading-relaxed">
                              "I've identified a 25% throughput increase when you study in 90-minute blocks. Your highest conceptual clarity peaks between 09:00 and 11:30 AM."
                            </p>
                           </div>
                           <button 
                             onClick={() => setActiveTab("ai")}
                             className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] hover:text-white transition-colors flex items-center gap-2 p-2 rounded-xl bg-secondary/10 hover:bg-secondary/20 w-fit"
                           >
                             Open Advisor Core
                             <Zap className="w-3 h-3 fill-current" />
                           </button>
                        </div>
                     </div>
                  </div>

                  {/* Right Column: Deadlines & Focus Room CTA */}
                  <div className="space-y-8">
                    <section className="glass rounded-3xl p-6 border border-white/5">
                       <div className="flex items-center justify-between mb-6">
                          <h2 className="text-sm font-bold uppercase tracking-wider">Upcoming Deadlines</h2>
                          <button 
                            onClick={() => setIsTaskModalOpen(true)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                            title="Add task"
                          >
                             <Plus className="w-3.5 h-3.5" />
                          </button>
                       </div>
                       <div className="space-y-4">
                          {upcomingTasks.length > 0 ? upcomingTasks.map((task, idx) => (
                             <DeadlineItem 
                               key={task.id} 
                               name={task.title} 
                               date={format(task.deadline.toDate(), "MMM dd")} 
                               type={task.subject} 
                               onClick={() => setActiveTab("scheduler")}
                               color={idx === 0 ? "bg-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]" : idx === 1 ? "bg-secondary" : idx === 2 ? "bg-accent" : "bg-amber-400"} 
                             />
                          )) : (
                            <div className="py-8 text-center text-white/30 text-xs">No pending deadlines.</div>
                          )}
                       </div>
                    </section>

                    {/* Focus Room Banner */}
                    <motion.section 
                       whileHover={{ scale: 1.02 }}
                       whileTap={{ scale: 0.98 }}
                       className="relative p-8 rounded-[2.5rem] bg-gradient-to-br from-primary via-primary-dark to-secondary cursor-pointer overflow-hidden group shadow-2xl shadow-primary/20" 
                       onClick={onFocusMode}
                    >
                       <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="relative z-10">
                          <h2 className="text-3xl font-display font-black mb-2 tracking-tighter uppercase">Focus Room</h2>
                          <p className="text-white/80 text-xs font-medium mb-6 leading-relaxed max-w-[200px]">
                            Enter an immersive distraction-free sanctuary with binaural acoustics and circadian countdowns.
                          </p>
                          <div className="inline-flex items-center gap-2.5 bg-white/20 px-5 py-2.5 rounded-2xl backdrop-blur-xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/20 group-hover:bg-white/30 transition-all">
                             Start Session
                             <Zap className="w-3 h-3 fill-white" />
                          </div>
                       </div>
                       <div className="absolute right-[-30px] bottom-[-30px] opacity-15 group-hover:rotate-12 transition-transform duration-700">
                          <Target className="w-48 h-48" />
                       </div>
                    </motion.section>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "scheduler" && (
              <SmartCalendar userId={user?.uid || ""} tasks={tasks} onRefresh={loadTasks} />
            )}
            
            {activeTab === "analytics" && (
              <AnalyticsView tasks={tasks} />
            )}
            
            {activeTab === "wellness" && (
              <WellnessDashboard onStartFocus={onFocusMode} />
            )}
            
            {activeTab === "settings" && (
              <SettingsView />
            )}
            
            {activeTab === "ai" && (
              <div className="h-[76vh]">
                <AIChatAssistant fullView={true} tasks={tasks} onNavigateTab={setActiveTab} />
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Floating AI Assistant Trigger only when NOT already on AI tab */}
      {activeTab !== "ai" && (
        <motion.button 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setActiveTab("ai")}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-2xl bg-primary shadow-2xl shadow-primary/40 flex items-center justify-center z-50 group border border-white/20"
          title="Open AI Advisor"
        >
          <MessageSquare className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-accent rounded-full border-2 border-background animate-pulse" />
        </motion.button>
      )}

      {/* Tier Details Modal */}
      <AnimatePresence>
        {isTierModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTierModalOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md glass rounded-[2.5rem] p-8 border border-primary/30 z-[101] shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    Tier 3 Active
                  </span>
                  <h3 className="text-2xl font-display font-black mt-2">Growth Tier: Pro</h3>
                </div>
                <button onClick={() => setIsTierModalOpen(false)} className="text-white/40 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mb-8">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-medium text-white/90">Autonomous Circadian Rescheduling</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-medium text-white/90">Unlimited AI Advisor Consultations</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-medium text-white/90">Binaural Acoustic Flow Mode Synthesizer</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-medium text-white/90">Multi-Week Neuro-Fatigue Diagnostics</span>
                </div>
              </div>

              <button 
                onClick={() => setIsTierModalOpen(false)}
                className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary-dark text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary/25"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <motion.button 
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest text-left",
        active 
          ? "bg-primary/15 text-primary border border-primary/20 shadow-sm" 
          : "text-white/40 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </motion.button>
  );
}

function StatCard({ title, value, sub, icon: Icon, trend, color }: any) {
  return (
    <div className="glass p-6 rounded-3xl border border-white/5 hover:border-primary/20 transition-all group overflow-hidden relative">
      <div className="flex justify-between items-start mb-6">
        <div className={cn("p-2.5 rounded-xl bg-white/5 transition-all group-hover:scale-110", color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-[10px] font-black text-white/40 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 tracking-widest">
          {trend}
        </div>
      </div>
      <div className="text-4xl font-display font-black tracking-tighter mb-1 text-white">{value}</div>
      <div className="text-xs font-black uppercase tracking-[0.2em] text-white/40">{title}</div>
      <div className="text-[10px] font-medium text-white/30 mt-2">{sub}</div>
    </div>
  );
}

function PriorityItem({ title, time, tag, completed, onToggle }: any) {
  return (
     <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group">
        <div className="flex items-center gap-3 min-w-0 flex-1">
           <button 
             onClick={onToggle}
             className={cn(
               "w-4 h-4 rounded-md border flex items-center justify-center transition-all flex-shrink-0",
               completed ? "bg-green-500 border-green-500 text-white" : "border-white/20 hover:border-primary"
             )}
             title={completed ? "Mark pending" : "Mark completed"}
           >
             {completed && <CheckCircle2 className="w-3.5 h-3.5" />}
           </button>
           <span className={cn(
             "text-xs font-bold truncate text-white/80 group-hover:text-white transition-colors",
             completed && "line-through text-white/30"
           )}>
             {title}
           </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
           <span className="text-[9px] text-primary/70 uppercase font-black tracking-wider bg-primary/10 px-1.5 py-0.5 rounded">
             {tag}
           </span>
           <span className="text-[10px] text-white/30 font-medium">{time}</span>
        </div>
     </div>
  );
}

function DeadlineItem({ name, date, type, color, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-3.5 group cursor-pointer p-2 rounded-2xl hover:bg-white/5 transition-all"
    >
       <div className={cn("w-1.5 h-10 rounded-full transition-all group-hover:w-2 flex-shrink-0", color)} />
       <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-0.5">
             <span className="text-xs font-black text-white/80 group-hover:text-primary transition-colors tracking-tight truncate">{name}</span>
             <span className="text-[10px] font-black text-white/30 uppercase flex-shrink-0 ml-2">{date}</span>
          </div>
          <span className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-black">{type}</span>
       </div>
    </div>
  );
}
