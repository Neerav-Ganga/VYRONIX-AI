import { 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  handleFirestoreError,
  OperationType 
} from "./firebase";

export interface UserProfile {
  uid: string;
  learningStyle: string;
  studyGoal: string;
  autonomousResolution: boolean;
  predictiveBurnout: boolean;
  focusAtmosphere: boolean;
  updatedAt: any;
}

const COLLECTION_NAME = "users";

export const userService = {
  getProfile: async (uid: string): Promise<UserProfile | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${COLLECTION_NAME}/${uid}`);
      return null;
    }
  },

  updateProfile: async (uid: string, profile: Partial<UserProfile>) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, uid);
      await setDoc(docRef, { ...profile, uid, updatedAt: new Date() }, { merge: true });
    } catch (error) {
       handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${uid}`);
    }
  }
};
