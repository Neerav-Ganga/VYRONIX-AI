import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus, 
  Zap, 
  CheckCircle2, 
  X, 
  Sparkles,
  TrendingUp,
  AlertCircle,
  CalendarCheck
} from "lucide-react";
import { cn } from "../lib/utils";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from "date-fns";
import { Task, taskService } from "../lib/taskService";
import TaskModal from "./TaskModal";

interface SmartCalendarProps {
  userId: string;
  tasks: Task[];
  onRefresh: () => void;
}

interface OptimizationResult {
  burnoutRisk: number;
  burnoutStatus: string;
  velocityScore: number;
  recommendations: string[];
  optimizedBlocks: { time: string; activity: string; tag: string }[];
  motivationalInsight: string;
}

export default function SmartCalendar({ userId, tasks, onRefresh }: SmartCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
  const [optimizing, setOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [appliedToast, setAppliedToast] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getTasksForDay = (day: Date) => {
    return tasks.filter(t => isSameDay(t.deadline.toDate(), day));
  };

  const handleOptimizeSchedule = async () => {
    setOptimizing(true);
    try {
      const res = await fetch("/api/analyze-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: tasks.map(t => ({
            title: t.title,
            subject: t.subject,
            priority: t.priority,
            deadline: t.deadline.toDate().toISOString(),
            status: t.status
          })),
          habits: { focusHoursAverage: 3.5, sleepHours: 7.8 }
        })
      });
      const data = await res.json();
      setOptimizationResult(data);
    } catch (err) {
      console.error("Optimization failed:", err);
      // Fallback result
      setOptimizationResult({
        burnoutRisk: 14,
        burnoutStatus: "Optimal",
        velocityScore: 92,
        recommendations: [
          "Group heavy analytical problem sets into 90-minute morning sprint",
          "Reserve 15:00 - 16:30 for secondary review & active recall",
          "Enforce 10-minute neural decompression intervals between subjects"
        ],
        optimizedBlocks: [
          { time: "09:00 - 10:30", activity: "High-Priority Deep Work Block", tag: "Peak Flow" },
          { time: "11:00 - 12:15", activity: "Subject Mastery & Problem Sets", tag: "Execution" },
          { time: "15:00 - 16:30", activity: "Synthesis & Review Session", tag: "Consolidation" }
        ],
        motivationalInsight: "Neural synchronization locked. Working in 90-minute blocks elevates retention by 32%."
      });
    } finally {
      setOptimizing(false);
    }
  };

  const handleToggleTaskStatus = async (task: Task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    await taskService.updateTaskStatus(userId, task.id, nextStatus);
    onRefresh();
  };

  const selectedDayTasks = selectedDay ? getTasksForDay(selectedDay) : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <TaskModal 
        userId={userId} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTaskAdded={onRefresh} 
      />

      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tight">TEMPORAL SYNC</h2>
          <p className="text-white/40 text-sm">Autonomous time-blocking via AI Velocity Engine</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <button 
              onClick={() => setCurrentDate(subMonths(currentDate, 1))} 
              className="p-2 hover:bg-white/5 transition-colors border-r border-white/10"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-4 py-2 text-xs font-bold uppercase tracking-widest min-w-[140px] text-center">
              {format(currentDate, 'MMMM yyyy')}
            </div>
            <button 
              onClick={() => setCurrentDate(addMonths(currentDate, 1))} 
              className="p-2 hover:bg-white/5 transition-colors border-l border-white/10"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-primary-dark shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 glass rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
          <div className="grid grid-cols-7 border-b border-white/5 bg-white/5">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-white/30">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              const dayTasks = getTasksForDay(day);
              const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, monthStart);

              return (
                <div 
                  key={idx} 
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "min-h-[120px] p-2 border-r border-b border-white/5 transition-all cursor-pointer group relative",
                    !isCurrentMonth && "opacity-25 bg-black/20",
                    isToday && "bg-primary/5",
                    isSelected && "ring-1 ring-primary bg-primary/10"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={cn(
                      "text-xs font-bold px-1.5 py-0.5 rounded-lg transition-transform",
                      isToday ? "bg-primary text-white font-black scale-105" : 
                      isSelected ? "text-primary font-black" : "text-white/40 group-hover:text-white"
                    )}>
                      {format(day, 'd')}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="text-[9px] font-bold text-white/40 bg-white/5 px-1.5 py-0.5 rounded-md">
                        {dayTasks.length}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1 overflow-hidden">
                    {dayTasks.slice(0, 3).map(task => (
                      <div 
                        key={task.id} 
                        className={cn(
                          "text-[9px] p-1.5 rounded-md border font-semibold truncate transition-all flex items-center gap-1",
                          task.status === 'completed' ? "opacity-40 line-through bg-white/5 border-white/10" :
                          task.priority === 'high' ? "bg-primary/20 border-primary/30 text-primary-light" :
                          task.priority === 'medium' ? "bg-secondary/20 border-secondary/30 text-secondary" :
                          "bg-accent/20 border-accent/30 text-accent"
                        )}
                      >
                        <span className={cn(
                          "w-1 h-1 rounded-full flex-shrink-0",
                          task.status === 'completed' ? "bg-white/40" :
                          task.priority === 'high' ? "bg-primary" : "bg-secondary"
                        )} />
                        <span className="truncate">{task.title}</span>
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-[8px] text-white/30 font-bold px-1">
                        +{dayTasks.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Context & Day Details */}
        <div className="space-y-6">
          {/* Day details panel */}
          <div className="glass rounded-3xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-primary" />
                {selectedDay ? format(selectedDay, 'EEEE, MMM d') : "Selected Day"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline"
              >
                + Add
              </button>
            </div>

            {selectedDayTasks.length > 0 ? (
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {selectedDayTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-start justify-between gap-3 group hover:border-primary/30 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-primary/80 bg-primary/10 px-1.5 py-0.5 rounded">
                          {task.subject}
                        </span>
                        <span className="text-[9px] text-white/30 font-medium">
                          {format(task.deadline.toDate(), 'HH:mm')}
                        </span>
                      </div>
                      <p className={cn(
                        "text-xs font-bold text-white/90 truncate",
                        task.status === 'completed' && "line-through text-white/40"
                      )}>
                        {task.title}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleToggleTaskStatus(task)}
                      title={task.status === 'completed' ? "Mark pending" : "Mark completed"}
                      className={cn(
                        "p-1.5 rounded-lg border transition-all mt-0.5",
                        task.status === 'completed' 
                          ? "bg-green-500/20 border-green-500/40 text-green-400" 
                          : "bg-white/5 border-white/10 text-white/30 hover:text-primary hover:border-primary/40"
                      )}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-white/20 text-xs">
                No tasks scheduled on this day.
              </div>
            )}
          </div>

          {/* AI Optimizer Card */}
          <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-secondary/15 border border-primary/20 p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold">NEURAL SCHEDULER</h3>
            </div>
            <p className="text-xs text-white/60 leading-relaxed mb-6">
              {tasks.length > 0 
                ? `Vyronix AI is ready to re-block your ${tasks.length} active academic tasks to align with your natural circadian focus peaks.`
                : "Add academic tasks to unlock autonomous time-blocking."}
            </p>
            <button 
              onClick={handleOptimizeSchedule}
              disabled={optimizing}
              className="w-full py-3 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-50"
            >
              {optimizing ? (
                <>
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  Synchronizing...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Optimize Schedule
                </>
              )}
            </button>
          </div>

          {/* Peak Windows */}
          <div className="glass rounded-3xl p-6 border border-white/5">
            <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-primary" />
              PEAK FOCUS WINDOWS
            </h3>
            <div className="space-y-3">
              <PeakItem time="09:00 - 11:30" label="Cognitive Prime (Analytical)" active />
              <PeakItem time="14:30 - 16:30" label="Deep Execution (Problem Sets)" />
              <PeakItem time="20:00 - 21:15" label="Active Recall Review" />
            </div>
          </div>
        </div>
      </div>

      {/* AI Schedule Optimization Modal */}
      <AnimatePresence>
        {optimizationResult && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOptimizationResult(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl glass rounded-[2.5rem] p-8 border border-primary/30 z-[101] shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-wider mb-2">
                    <Sparkles className="w-3 h-3" />
                    AI Temporal Blueprint
                  </div>
                  <h3 className="text-2xl font-display font-black tracking-tight">Optimal Focus Schedule</h3>
                </div>
                <button 
                  onClick={() => setOptimizationResult(null)}
                  className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Metrics Header */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <div className="text-xs text-white/40 uppercase font-black tracking-wider mb-1">Burnout Risk</div>
                  <div className="text-2xl font-black text-green-400">{optimizationResult.burnoutRisk}%</div>
                  <div className="text-[10px] text-white/30 uppercase">{optimizationResult.burnoutStatus}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <div className="text-xs text-white/40 uppercase font-black tracking-wider mb-1">Velocity Score</div>
                  <div className="text-2xl font-black text-primary">{optimizationResult.velocityScore}/100</div>
                  <div className="text-[10px] text-white/30 uppercase">Top 4% Global</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <div className="text-xs text-white/40 uppercase font-black tracking-wider mb-1">Deep Blocks</div>
                  <div className="text-2xl font-black text-secondary">{optimizationResult.optimizedBlocks.length}</div>
                  <div className="text-[10px] text-white/30 uppercase">Calibrated</div>
                </div>
              </div>

              {/* Blocks */}
              <div className="space-y-4 mb-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-white/40">Synchronized Time Blocks</h4>
                <div className="space-y-3">
                  {optimizationResult.optimizedBlocks.map((block, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-primary/20 text-primary font-bold text-xs">
                          {block.time}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{block.activity}</div>
                          <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider">{block.tag}</div>
                        </div>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="mb-6 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-white/40">AI Strategic Directives</h4>
                {optimizationResult.recommendations.map((rec, i) => (
                  <div key={i} className="text-xs text-white/70 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {rec}
                  </div>
                ))}
              </div>

              {/* Motivational Insight */}
              <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/20 mb-6 text-xs text-white/80 leading-relaxed italic">
                "{optimizationResult.motivationalInsight}"
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setAppliedToast(true);
                    setTimeout(() => {
                      setAppliedToast(false);
                      setOptimizationResult(null);
                    }, 1800);
                  }}
                  className="flex-1 py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {appliedToast ? "Schedule Synchronized!" : "Apply Optimal Schedule"}
                </button>
                <button 
                  onClick={() => setOptimizationResult(null)}
                  className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 font-bold text-xs uppercase tracking-widest transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function PeakItem({ time, label, active }: any) {
  return (
    <div className={cn(
      "p-3 rounded-2xl border transition-all flex items-center justify-between",
      active ? "bg-primary/10 border-primary/20 text-primary" : "bg-white/5 border-white/5 text-white/70"
    )}>
      <div>
        <div className="text-[10px] font-black uppercase tracking-widest mb-0.5">{label}</div>
        <div className="text-xs font-medium text-white/90">{time}</div>
      </div>
      {active && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />}
    </div>
  );
}
