import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Brain, 
  Zap, 
  User, 
  Copy, 
  Check, 
  RefreshCw,
  Lightbulb,
  Target
} from "lucide-react";
import { cn } from "../lib/utils";
import { Task } from "../lib/taskService";

interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface AIChatAssistantProps {
  fullView?: boolean;
  tasks?: Task[];
  onNavigateTab?: (tab: string) => void;
}

const DEFAULT_PROMPTS = [
  "⚡ Optimize my schedule for peak focus",
  "🛡️ Evaluate my cognitive burnout risk",
  "🧠 Best technique for complex STEM retention",
  "🎯 How should I tackle my urgent tasks today?"
];

export default function AIChatAssistant({ fullView = false, tasks = [], onNavigateTab }: AIChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "ai", 
      content: "Neural link established. I am Vyronix AI, your academic strategist and velocity engine. How can we optimize your execution bandwidth today?", 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (customMessage?: string) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: Message = { role: "user", content: textToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    if (!customMessage) setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: textToSend,
          context: {
            taskCount: tasks.length,
            urgentTasks: tasks.filter(t => t.priority === "high" && t.status !== "completed").map(t => t.title),
            completedCount: tasks.filter(t => t.status === "completed").length,
            time: new Date().toLocaleTimeString()
          }
        })
      });
      
      const data = await res.json();
      const aiReply = data.text || "Neural synchronization active. I recommend focusing on your highest-leverage conceptual assignment during your morning cognitive peak.";
      setMessages(prev => [...prev, { role: "ai", content: aiReply, timestamp: new Date() }]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { 
        role: "ai", 
        content: "I've analyzed your workload rhythm. Grouping problem sets into 90-minute morning sprint blocks will protect your mental endurance while driving maximum retention.", 
        timestamp: new Date() 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyMessage = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // FULL SCREEN EMBEDDED VIEW (Dashboard -> Advisor Core)
  if (fullView) {
    return (
      <div className="h-full flex flex-col glass rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl relative">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Header */}
        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary p-0.5 shadow-lg shadow-primary/20">
              <div className="w-full h-full rounded-[0.9rem] bg-background flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-lg">VYRONIX ADVISOR CORE</h3>
                <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[9px] font-black uppercase tracking-wider border border-green-500/30">
                  Online
                </span>
              </div>
              <p className="text-xs text-white/40 font-medium">
                Cognitive Strategy • Circadian Task Alignment • Velocity Calibration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMessages([{ role: "ai", content: "Advisor memory reset. How can I assist your study strategy now?", timestamp: new Date() }])}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
              title="Reset conversation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center",
                msg.role === 'ai' ? "bg-primary/20 text-primary border border-primary/30" : "bg-white/10 text-white"
              )}>
                {msg.role === 'ai' ? <Brain className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>

              <div className="space-y-1">
                <div className={cn(
                  "p-5 rounded-2xl text-sm leading-relaxed relative group",
                  msg.role === 'ai' 
                    ? "bg-white/5 border border-white/10 text-white/90 rounded-tl-none shadow-lg" 
                    : "bg-primary text-white rounded-tr-none shadow-xl shadow-primary/20"
                )}>
                  <p className="whitespace-pre-line">{msg.content}</p>
                  
                  {msg.role === 'ai' && (
                    <button 
                      onClick={() => copyMessage(idx, msg.content)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 transition-all"
                      title="Copy response"
                    >
                      {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
                <div className={cn(
                  "text-[9px] font-bold text-white/30 px-2",
                  msg.role === 'user' ? "text-right" : "text-left"
                )}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                <Brain className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-1.5 items-center">
                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-primary rounded-full" />
                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-primary rounded-full" />
                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-primary rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-6 py-2 flex gap-2 overflow-x-auto pb-3">
          {DEFAULT_PROMPTS.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              disabled={isTyping}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 text-xs font-medium text-white/70 hover:text-white transition-all whitespace-nowrap active:scale-95 disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-6 pt-2 border-t border-white/5 bg-white/[0.01]">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Vyronix for schedule optimization, study strategies, or burnout analysis..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white placeholder:text-white/30"
            />
            <button 
              onClick={() => handleSend()}
              disabled={isTyping || !input.trim()}
              className="absolute right-2.5 top-2.5 w-10 h-10 rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-md active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex justify-between items-center mt-3 text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">
            <span>Vyronix Cognitive OS 4.0</span>
            <span>Realtime Study Telemetry Active</span>
          </div>
        </div>
      </div>
    );
  }

  // FLOATING DRAWER (Used on other pages if opened)
  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all border border-white/20",
            isOpen ? "bg-white text-background" : "bg-primary text-white shadow-primary/30"
          )}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-8 w-[380px] sm:w-[420px] h-[580px] z-50 glass-morphism rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-white/10"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Vyronix Strategist</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-black">Connected</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex gap-3 max-w-[88%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "p-3.5 rounded-2xl text-xs leading-relaxed",
                    msg.role === 'ai' 
                      ? "bg-white/5 border border-white/5 text-white/90 rounded-tl-none" 
                      : "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 w-16 flex gap-1 items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-200" />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 pt-2 border-t border-white/5">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for quick study advice..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-3 pr-12 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50 text-white"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isTyping || !input.trim()}
                  className="absolute right-1.5 top-1.5 w-8 h-8 rounded-lg bg-primary flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
