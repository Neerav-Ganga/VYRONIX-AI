import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Tag, AlertCircle, Clock, Zap, BookOpen } from "lucide-react";
import { cn } from "../lib/utils";
import { taskService, Task } from "../lib/taskService";
import { Timestamp } from "firebase/firestore";

interface TaskModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: () => void;
}

const SUBJECT_PRESETS = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Cognitive Science",
  "Economics",
  "Biology"
];

export default function TaskModal({ userId, isOpen, onClose, onTaskAdded }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Computer Science");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Task['priority']>("high");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !deadline) {
      // Default to tomorrow 18:00
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(18, 0, 0, 0);
      const iso = tomorrow.toISOString().slice(0, 16);
      setDeadline(iso);
    }
  }, [isOpen]);

  const setQuickDeadline = (hoursFromNow: number) => {
    const d = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000);
    // Format to YYYY-MM-DDTHH:MM
    const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setDeadline(localIso);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim() || !deadline) return;

    setLoading(true);
    try {
      const deadlineDate = new Date(deadline);
      await taskService.addTask(userId, {
        title: title.trim(),
        subject: subject.trim(),
        description: description.trim(),
        priority,
        deadline: Timestamp.fromDate(deadlineDate),
        status: 'pending'
      });
      onTaskAdded();
      onClose();
      // Reset form
      setTitle("");
      setDescription("");
      setPriority("high");
    } catch (error) {
      console.error("Failed to add task", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass rounded-[2.5rem] p-8 border border-white/10 z-[101] overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <Zap className="w-4 h-4 fill-primary" />
                </div>
                <h2 className="text-2xl font-display font-black tracking-tight">SYNCHRONIZE TASK</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Task Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus & Raft Architecture..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-white placeholder:text-white/30"
                  required
                />
              </div>

              {/* Subject Presets */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Subject Discipline</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {SUBJECT_PRESETS.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSubject(sub)}
                      className={cn(
                        "px-3 py-1 rounded-xl text-xs font-semibold transition-all",
                        subject === sub 
                          ? "bg-primary text-white shadow-md shadow-primary/30" 
                          : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                      )}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Or enter custom discipline..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Cognitive Priority</label>
                  <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none text-white font-bold"
                  >
                    <option value="high" className="bg-gray-900">High (Peak Focus Block)</option>
                    <option value="medium" className="bg-gray-900">Medium (Standard Execution)</option>
                    <option value="low" className="bg-gray-900">Low (Light Review)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Deadline Date & Time</label>
                  <div className="relative">
                    <input 
                      type="datetime-local" 
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 text-white font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Quick Deadline Chips */}
              <div className="flex gap-2 items-center">
                <span className="text-[9px] font-black uppercase tracking-wider text-white/30">Presets:</span>
                <button type="button" onClick={() => setQuickDeadline(4)} className="text-[10px] px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70">
                  +4 Hours
                </button>
                <button type="button" onClick={() => setQuickDeadline(24)} className="text-[10px] px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70">
                  Tomorrow
                </button>
                <button type="button" onClick={() => setQuickDeadline(72)} className="text-[10px] px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70">
                  In 3 Days
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Context Notes (Optional)</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key concepts, problem set numbers, or reference material..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs h-20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none text-white placeholder:text-white/30"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-primary p-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-primary/25 disabled:opacity-50"
              >
                {loading ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 fill-white" />
                )}
                Synchronize Into Schedule
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
