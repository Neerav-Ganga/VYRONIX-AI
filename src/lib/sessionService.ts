import { 
  db, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  query, 
  orderBy, 
  handleFirestoreError,
  OperationType,
  serverTimestamp,
  Timestamp 
} from "./firebase";
import { subDays } from "date-fns";

export interface Session {
  id: string;
  userId: string;
  type: 'focus' | 'rest';
  durationMinutes: number;
  completedAt: Timestamp;
}

const COLLECTION_NAME = "sessions";
const STORAGE_KEY = "vyronix_sessions_cache";

function getDefaultSeedSessions(userId: string): Session[] {
  const durations = [45, 90, 60, 110, 75, 50, 95];
  return durations.map((mins, i) => {
    const d = subDays(new Date(), 6 - i);
    d.setHours(14, 30, 0, 0);
    return {
      id: `session-seed-${i}`,
      userId,
      type: 'focus',
      durationMinutes: mins,
      completedAt: Timestamp.fromDate(d)
    };
  });
}

export const sessionService = {
  getSessions: async (userId: string): Promise<Session[]> => {
    try {
      const q = query(
        collection(db, "users", userId, COLLECTION_NAME),
        orderBy("completedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session));
      
      if (docs.length > 0) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
        } catch (_) {}
        return docs;
      }

      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((s: any) => ({
              ...s,
              completedAt: s.completedAt?.seconds ? new Timestamp(s.completedAt.seconds, s.completedAt.nanoseconds) : Timestamp.now(),
            }));
          }
        } catch (_) {}
      }

      const seed = getDefaultSeedSessions(userId);
      return seed;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, `users/${userId}/${COLLECTION_NAME}`);
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          return parsed.map((s: any) => ({
            ...s,
            completedAt: s.completedAt?.seconds ? new Timestamp(s.completedAt.seconds, s.completedAt.nanoseconds) : Timestamp.now(),
          }));
        } catch (_) {}
      }
      return getDefaultSeedSessions(userId);
    }
  },

  addSession: async (userId: string, type: Session['type'], durationMinutes: number) => {
    try {
      const sessionRef = doc(collection(db, "users", userId, COLLECTION_NAME));
      const newSession: Session = {
        id: sessionRef.id,
        userId,
        type,
        durationMinutes,
        completedAt: Timestamp.now()
      };
      await setDoc(sessionRef, {
        ...newSession,
        completedAt: serverTimestamp()
      });
      // Update cache
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        const list = cached ? JSON.parse(cached) : [];
        list.unshift(newSession);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (_) {}
      return newSession;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${userId}/${COLLECTION_NAME}`);
    }
  }
};

