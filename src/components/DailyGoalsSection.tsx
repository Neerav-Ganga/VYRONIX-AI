import React, { useState, useEffect } from "react";
import { 
  Target, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Sparkles, 
  Flame, 
  Check, 
  Tag, 
  AlertCircle,
  Filter,
  Layers,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { goalService, DailyGoal } from "../lib/goalService";
import { cn } from "../lib/utils";
import { format } from "date-fns";

interface DailyGoalsSectionProps {
  userId: string;
}

const ACADEMIC_CATEGORIES = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Biology",
  "Research",
  "Literature",
  "Exam Prep",
  "General"
];

const QUICK_SUGGESTIONS = [
  { title: "Review lecture notes & synthesis", category: "Exam Prep", priority: "medium" as const },
  { title: "Complete 1 deep-work problem set", category: "Mathematics", priority: "high" as const },
  { title: "90m code refactoring & debugging", category: "Computer Science", priority: "high" as const },
  { title: "Read 20 pages textbook & flashcards", category: "Research", priority: "low" as const },
];

export default function DailyGoalsSection({ userId }: DailyGoalsSectionProps) {
  const [goals, setGoals] = useState<DailyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  
  // New Goal Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Computer Science");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("high");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  useEffect(() => {
    if (userId) {
      loadGoals();
    }
  }, [userId]);

  const loadGoals = async () => {
    setLoading(true);
    const data = await goalService.getGoals(userId);
    setGoals(data);
    setLoading(false);
  };

  const handleAddGoal = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const added = await goalService.addGoal(userId, {
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
    });

    setGoals(prev => [added, ...prev]);
    setNewTitle("");
    setIsSubmitting(false);
  };

  const handleQuickAdd = async (item: typeof QUICK_SUGGESTIONS[0]) => {
    const added = await goalService.addGoal(userId, {
      title: item.title,
      category: item.category,
      priority: item.priority,
    });
    setGoals(prev => [added, ...prev]);
  };

  const handleToggle = async (goal: DailyGoal) => {
    // Optimistic toggle
    const nextCompleted = !goal.completed;
    setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, completed: nextCompleted } : g));
    
    await goalService.toggleGoal(userId, goal.id, goal.completed);
  };

  const handleDelete = async (goalId: string) => {
    // Optimistic delete
    setGoals(prev => prev.filter(g => g.id !== goalId));
    await goalService.deleteGoal(userId, goalId);
  };

  const completedCount = goals.filter(g => g.completed).length;
  const totalCount = goals.length;
  const percentCompleted = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredGoals = goals.filter(goal => {
    if (filter === "active") return !goal.completed;
    if (filter === "completed") return goal.completed;
    return true;
  });

  return (
    <section className="glass rounded-3xl p-6 md:p-8 border border-white/5 relative overflow-hidden group">
      {/* Glow highlight */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary ring-1 ring-primary/30">
              <Target className="w-4 h-4" />
            </div>
            <h2 className="text-lg md:text-xl font-display font-black tracking-tight text-white flex items-center gap-2">
              Daily Academic Objectives
            </h2>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary/80 bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
              {format(new Date(), "EEE, MMM d")}
            </span>
          </div>
          <p className="text-white/40 text-xs font-medium">
            Define and execute your primary high-yield academic targets for maximum cognitive velocity.
          </p>
        </div>

        {/* Progress & Stat pill */}
        <div className="flex items-center gap-3">
          <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-black text-white">
                {completedCount} of {totalCount} Done
              </div>
              <div className="text-[9px] font-black uppercase tracking-wider text-primary">
                {percentCompleted}% Objective Rate
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center font-display font-black text-xs text-primary">
              {percentCompleted}%
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-6 border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentCompleted}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary via-indigo-400 to-secondary rounded-full shadow-[0_0_12px_rgba(99,102,241,0.5)]"
        />
      </div>

      {/* Add Goal Input Area */}
      <form onSubmit={handleAddGoal} className="mb-6">
        <div className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 rounded-2xl p-2.5 md:p-3 transition-all flex flex-col md:flex-row md:items-center gap-3">
          {/* Text Input */}
          <div className="flex-1 flex items-center gap-2 px-2">
            <Plus className="w-4 h-4 text-primary flex-shrink-0" />
            <input 
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Add today's primary academic objective (e.g. Solve 5 DP problems, Read Ch. 4)..."
              className="bg-transparent text-xs text-white placeholder:text-white/30 focus:outline-none w-full"
            />
          </div>

          {/* Controls: Subject, Priority, Submit */}
          <div className="flex items-center justify-between md:justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
            {/* Category Select */}
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="bg-white/5 text-white/80 border border-white/10 rounded-xl px-2.5 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer"
            >
              {ACADEMIC_CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-surface text-white">
                  {cat}
                </option>
              ))}
            </select>

            {/* Priority Selector */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-0.5 rounded-xl">
              {(["low", "medium", "high"] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setNewPriority(p)}
                  className={cn(
                    "px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all",
                    newPriority === p
                      ? p === "high" 
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : p === "medium"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : "text-white/30 hover:text-white"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!newTitle.trim() || isSubmitting}
              className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-40 disabled:hover:bg-primary text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1 transition-all shadow-md shadow-primary/20 active:scale-95 flex-shrink-0"
            >
              <span>Add Goal</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </form>

      {/* Quick Add Inspiration Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/30 flex-shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-secondary" />
          Presets:
        </span>
        {QUICK_SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickAdd(s)}
            className="flex-shrink-0 text-[10px] text-white/60 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-primary/30 rounded-xl px-2.5 py-1 transition-all flex items-center gap-1.5"
          >
            <span>+ {s.title}</span>
            <span className="text-[8px] text-primary/60 uppercase font-bold">({s.category})</span>
          </button>
        ))}
      </div>

      {/* Filter Tabs & Counter */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
              filter === "all" ? "bg-primary text-white shadow-sm" : "text-white/40 hover:text-white"
            )}
          >
            All ({goals.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={cn(
              "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
              filter === "active" ? "bg-primary text-white shadow-sm" : "text-white/40 hover:text-white"
            )}
          >
            Pending ({goals.filter(g => !g.completed).length})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={cn(
              "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
              filter === "completed" ? "bg-primary text-white shadow-sm" : "text-white/40 hover:text-white"
            )}
          >
            Done ({completedCount})
          </button>
        </div>

        {completedCount > 0 && (
          <div className="text-[10px] text-emerald-400/80 font-bold flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>{completedCount} completed today</span>
          </div>
        )}
      </div>

      {/* Goals List */}
      <div className="space-y-2.5 min-h-[140px]">
        {loading ? (
          <div className="py-8 text-center text-white/30 text-xs animate-pulse">
            Synchronizing daily academic objectives...
          </div>
        ) : filteredGoals.length === 0 ? (
          <div className="py-10 text-center glass rounded-2xl border border-dashed border-white/10 p-6 flex flex-col items-center justify-center">
            <Target className="w-8 h-8 text-white/20 mb-2" />
            <p className="text-xs font-bold text-white/60 mb-1">
              {filter === "completed" 
                ? "No completed goals yet today."
                : filter === "active"
                ? "All active objectives conquered! Great work."
                : "No daily academic objectives set yet."}
            </p>
            <p className="text-[11px] text-white/30 max-w-sm">
              Add your high-priority study milestones above to maintain deep work clarity and alignment.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredGoals.map((goal) => (
              <motion.div
                key={goal.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "group p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3",
                  goal.completed 
                    ? "bg-white/[0.02] border-white/5 opacity-70"
                    : "bg-white/[0.04] hover:bg-white/[0.07] border-white/10 hover:border-primary/30"
                )}
              >
                {/* Left: Checkbox & Title */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => handleToggle(goal)}
                    className={cn(
                      "w-5 h-5 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 cursor-pointer",
                      goal.completed
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                        : "border-white/30 hover:border-primary hover:bg-primary/10 text-transparent"
                    )}
                    title={goal.completed ? "Mark objective pending" : "Mark objective completed"}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>

                  <div className="min-w-0 flex-1">
                    <span 
                      className={cn(
                        "text-xs font-bold tracking-tight block transition-all truncate",
                        goal.completed ? "line-through text-white/35" : "text-white/90 group-hover:text-white"
                      )}
                    >
                      {goal.title}
                    </span>
                  </div>
                </div>

                {/* Right: Category tag, Priority tag, Delete button */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Category Pill */}
                  {goal.category && (
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 text-white/60 border border-white/5">
                      {goal.category}
                    </span>
                  )}

                  {/* Priority Pill */}
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border",
                    goal.priority === "high"
                      ? "bg-rose-500/15 text-rose-300 border-rose-500/20"
                      : goal.priority === "medium"
                      ? "bg-amber-500/15 text-amber-300 border-amber-500/20"
                      : "bg-blue-500/15 text-blue-300 border-blue-500/20"
                  )}>
                    {goal.priority || "med"}
                  </span>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDelete(goal.id)}
                    className="p-1.5 rounded-lg text-white/20 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-40 group-hover:opacity-100"
                    title="Delete objective"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
