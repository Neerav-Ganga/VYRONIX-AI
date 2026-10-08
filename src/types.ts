export interface Task {
  id: string;
  title: string;
  deadline: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  category: string;
  estimatedHours: number;
}

export interface UserHabit {
  name: string;
  streak: number;
  lastDone: string;
}

export interface AIAnalysis {
  burnoutRisk: number;
  suggestions: string[];
  motivationalQuote: string;
  optimizedFocusHours: string;
}
