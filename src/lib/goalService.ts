import { 
  db, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  handleFirestoreError,
  OperationType,
  serverTimestamp,
  Timestamp 
} from "./firebase";

export interface DailyGoal {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  category?: string;
  priority?: "low" | "medium" | "high";
  targetDate?: string;
  createdAt?: Timestamp | any;
  updatedAt?: Timestamp | any;
}

const COLLECTION_NAME = "goals";
const STORAGE_PREFIX = "vyronix_daily_goals_";

function getStorageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId || "guest"}`;
}

function getDefaultSeedGoals(userId: string): DailyGoal[] {
  const todayStr = new Date().toISOString().split("T")[0];
  return [
    {
      id: "seed-goal-1",
      userId,
      title: "Review Linear Algebra eigenvalues & matrix diagonalization notes",
      completed: true,
      category: "Mathematics",
      priority: "high",
      targetDate: todayStr,
      createdAt: Timestamp.now(),
    },
    {
      id: "seed-goal-2",
      userId,
      title: "Implement Raft consensus heartbeat in Distributed Systems lab",
      completed: false,
      category: "Computer Science",
      priority: "high",
      targetDate: todayStr,
      createdAt: Timestamp.now(),
    },
    {
      id: "seed-goal-3",
      userId,
      title: "Read 25 pages of Cognitive Neuroscience chapter 5 on working memory",
      completed: false,
      category: "Neuroscience",
      priority: "medium",
      targetDate: todayStr,
      createdAt: Timestamp.now(),
    },
    {
      id: "seed-goal-4",
      userId,
      title: "Draft research hypothesis & methodology section for senior thesis",
      completed: false,
      category: "Research",
      priority: "medium",
      targetDate: todayStr,
      createdAt: Timestamp.now(),
    }
  ];
}

export const goalService = {
  getGoals: async (userId: string): Promise<DailyGoal[]> => {
    const key = getStorageKey(userId);
    try {
      const q = query(
        collection(db, "users", userId, COLLECTION_NAME),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      } as DailyGoal));

      if (docs.length > 0) {
        try {
          localStorage.setItem(key, JSON.stringify(docs));
        } catch (_) {}
        return docs;
      }

      // Check cache first
      const cached = localStorage.getItem(key);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (_) {}
      }

      // Seed defaults
      const seed = getDefaultSeedGoals(userId);
      Promise.all(seed.map(g => {
        const goalRef = doc(db, "users", userId, COLLECTION_NAME, g.id);
        return setDoc(goalRef, {
          userId: g.userId,
          title: g.title,
          completed: g.completed,
          category: g.category || "General",
          priority: g.priority || "medium",
          targetDate: g.targetDate || new Date().toISOString().split("T")[0],
          createdAt: serverTimestamp(),
        });
      })).catch(() => {});

      try {
        localStorage.setItem(key, JSON.stringify(seed));
      } catch (_) {}
      return seed;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, `users/${userId}/${COLLECTION_NAME}`);
      const cached = localStorage.getItem(key);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) return parsed;
        } catch (_) {}
      }
      return getDefaultSeedGoals(userId);
    }
  },

  addGoal: async (
    userId: string, 
    data: { title: string; category?: string; priority?: "low" | "medium" | "high" }
  ): Promise<DailyGoal> => {
    const key = getStorageKey(userId);
    const todayStr = new Date().toISOString().split("T")[0];
    const goalRef = doc(collection(db, "users", userId, COLLECTION_NAME));
    const newGoal: DailyGoal = {
      id: goalRef.id,
      userId,
      title: data.title.trim(),
      completed: false,
      category: data.category?.trim() || "General",
      priority: data.priority || "medium",
      targetDate: todayStr,
      createdAt: Timestamp.now(),
    };

    // Optimistically update localStorage
    try {
      const cached = localStorage.getItem(key);
      const list = cached ? JSON.parse(cached) : [];
      localStorage.setItem(key, JSON.stringify([newGoal, ...list]));
    } catch (_) {}

    try {
      await setDoc(goalRef, {
        userId,
        title: newGoal.title,
        completed: false,
        category: newGoal.category,
        priority: newGoal.priority,
        targetDate: todayStr,
        createdAt: serverTimestamp(),
      });
      return newGoal;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${userId}/${COLLECTION_NAME}`);
      return newGoal;
    }
  },

  toggleGoal: async (userId: string, goalId: string, currentCompleted: boolean): Promise<boolean> => {
    const nextCompleted = !currentCompleted;
    const key = getStorageKey(userId);

    // Optimistically update localStorage
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const list = JSON.parse(cached) as DailyGoal[];
        const updated = list.map(g => g.id === goalId ? { ...g, completed: nextCompleted } : g);
        localStorage.setItem(key, JSON.stringify(updated));
      }
    } catch (_) {}

    try {
      const goalRef = doc(db, "users", userId, COLLECTION_NAME, goalId);
      await updateDoc(goalRef, { 
        completed: nextCompleted,
        updatedAt: serverTimestamp()
      });
      return nextCompleted;
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}/${COLLECTION_NAME}/${goalId}`);
      return nextCompleted;
    }
  },

  deleteGoal: async (userId: string, goalId: string): Promise<void> => {
    const key = getStorageKey(userId);

    // Optimistically update localStorage
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const list = JSON.parse(cached) as DailyGoal[];
        const filtered = list.filter(g => g.id !== goalId);
        localStorage.setItem(key, JSON.stringify(filtered));
      }
    } catch (_) {}

    try {
      const goalRef = doc(db, "users", userId, COLLECTION_NAME, goalId);
      await deleteDoc(goalRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${userId}/${COLLECTION_NAME}/${goalId}`);
    }
  }
};
