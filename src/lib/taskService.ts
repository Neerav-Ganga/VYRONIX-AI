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

export interface Task {
  id: string;
  userId: string;
  title: string;
  subject: string;
  description?: string;
  deadline: Timestamp;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  createdAt: Timestamp;
}

const COLLECTION_NAME = "tasks";
const STORAGE_KEY = "vyronix_tasks_cache";

function getDefaultSeedTasks(userId: string): Task[] {
  const now = new Date();
  const makeDate = (hoursAhead: number) => {
    const d = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);
    return Timestamp.fromDate(d);
  };

  return [
    {
      id: "seed-1",
      userId,
      title: "Distributed Systems Architecture Review",
      subject: "Computer Science",
      description: "Review consensus algorithms (Raft, Paxos) and vector clocks before lab.",
      deadline: makeDate(4),
      status: "pending",
      priority: "high",
      createdAt: Timestamp.now(),
    },
    {
      id: "seed-2",
      userId,
      title: "Differential Equations Problem Set 5",
      subject: "Mathematics",
      description: "Complete Laplace transforms problems 14 through 28.",
      deadline: makeDate(18),
      status: "in-progress",
      priority: "high",
      createdAt: Timestamp.now(),
    },
    {
      id: "seed-3",
      userId,
      title: "Quantum Mechanics & Wave Packets",
      subject: "Physics",
      description: "Derive 1D time-dependent Schrödinger solutions for finite well.",
      deadline: makeDate(42),
      status: "pending",
      priority: "medium",
      createdAt: Timestamp.now(),
    },
    {
      id: "seed-4",
      userId,
      title: "Cognitive Psychology Synthesis Paper",
      subject: "Psychology",
      description: "Finalize abstract and discussion on working memory cognitive limits.",
      deadline: makeDate(72),
      status: "pending",
      priority: "medium",
      createdAt: Timestamp.now(),
    },
    {
      id: "seed-5",
      userId,
      title: "Algorithms: Graph Traversal & Dijkstra",
      subject: "Computer Science",
      description: "Implemented Fibonacci heap priority queue optimization.",
      deadline: makeDate(-12),
      status: "completed",
      priority: "low",
      createdAt: Timestamp.now(),
    }
  ];
}

export const taskService = {
  getTasks: async (userId: string): Promise<Task[]> => {
    try {
      const q = query(
        collection(db, "users", userId, COLLECTION_NAME),
        orderBy("deadline", "asc")
      );
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      
      if (docs.length > 0) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
        } catch (_) {}
        return docs;
      }

      // Check localStorage or seed default
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((t: any) => ({
              ...t,
              deadline: t.deadline?.seconds ? new Timestamp(t.deadline.seconds, t.deadline.nanoseconds) : Timestamp.now(),
              createdAt: t.createdAt?.seconds ? new Timestamp(t.createdAt.seconds, t.createdAt.nanoseconds) : Timestamp.now(),
            }));
          }
        } catch (_) {}
      }

      const seed = getDefaultSeedTasks(userId);
      // Attempt to save seed in background
      Promise.all(seed.map(t => {
        const taskRef = doc(db, "users", userId, COLLECTION_NAME, t.id);
        return setDoc(taskRef, t);
      })).catch(() => {});
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      } catch (_) {}
      return seed;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, `users/${userId}/${COLLECTION_NAME}`);
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          return parsed.map((t: any) => ({
            ...t,
            deadline: t.deadline?.seconds ? new Timestamp(t.deadline.seconds, t.deadline.nanoseconds) : Timestamp.now(),
            createdAt: t.createdAt?.seconds ? new Timestamp(t.createdAt.seconds, t.createdAt.nanoseconds) : Timestamp.now(),
          }));
        } catch (_) {}
      }
      return getDefaultSeedTasks(userId);
    }
  },

  addTask: async (userId: string, task: Omit<Task, 'id' | 'userId' | 'createdAt'>) => {
    try {
      const taskRef = doc(collection(db, "users", userId, COLLECTION_NAME));
      const newTask: Task = {
        ...task,
        id: taskRef.id,
        userId,
        createdAt: Timestamp.now(),
      };
      await setDoc(taskRef, {
        ...newTask,
        createdAt: serverTimestamp()
      });
      return newTask;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${userId}/${COLLECTION_NAME}`);
      const fallbackTask: Task = {
        ...task,
        id: "task-" + Date.now(),
        userId,
        createdAt: Timestamp.now(),
      };
      return fallbackTask;
    }
  },

  updateTaskStatus: async (userId: string, taskId: string, status: Task['status']) => {
    try {
      const taskRef = doc(db, "users", userId, COLLECTION_NAME, taskId);
      await updateDoc(taskRef, { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}/${COLLECTION_NAME}/${taskId}`);
    }
  },

  deleteTask: async (userId: string, taskId: string) => {
    try {
      const taskRef = doc(db, "users", userId, COLLECTION_NAME, taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${userId}/${COLLECTION_NAME}/${taskId}`);
    }
  }
};

