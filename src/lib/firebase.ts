import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { User, StudentNote } from '../types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Specify database ID if provided in config
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Sign in user using Google Auth with Firebase
 */
export async function signInWithGoogle(): Promise<{ firebaseUser: FirebaseUser; userProfile: User }> {
  const result = await signInWithPopup(auth, googleProvider);
  const fbUser = result.user;
  const userProfile = await syncUserToFirestore(fbUser);
  return { firebaseUser: fbUser, userProfile };
}

/**
 * Sign out from Firebase Auth
 */
export async function signOutFromFirebase(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Synchronize Google/Firebase user to Firestore 'users' collection
 */
export async function syncUserToFirestore(fbUser: FirebaseUser): Promise<User> {
  const userRef = doc(db, 'users', fbUser.uid);
  const docSnap = await getDoc(userRef);

  const nowStr = new Date().toISOString().split('T')[0];

  if (docSnap.exists()) {
    const existingData = docSnap.data();
    const updatedUser: User = {
      id: fbUser.uid,
      email: fbUser.email || existingData.email || '',
      username: existingData.username || fbUser.email?.split('@')[0] || 'operator',
      fullName: fbUser.displayName || existingData.fullName || 'Security Analyst',
      role: existingData.role || 'student',
      xp: existingData.xp ?? 250,
      level: existingData.level ?? 2,
      dailyStreak: existingData.dailyStreak ?? 1,
      lastActiveDate: nowStr,
      freezeShields: existingData.freezeShields ?? 1,
      dailyXpEarned: existingData.dailyXpEarned ?? 0,
      dailyXpResetDate: existingData.dailyXpResetDate || nowStr,
      skillTier: existingData.skillTier || 'intermediate',
      createdAt: existingData.createdAt || new Date().toISOString()
    };

    await updateDoc(userRef, {
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      lastActiveDate: nowStr
    });

    return updatedUser;
  } else {
    // New user in Firestore
    const newUser: User = {
      id: fbUser.uid,
      email: fbUser.email || '',
      username: fbUser.email?.split('@')[0] || `cadet_${Math.floor(Math.random() * 1000)}`,
      fullName: fbUser.displayName || 'Cyber Operator',
      role: 'student',
      xp: 250,
      level: 2,
      dailyStreak: 1,
      lastActiveDate: nowStr,
      freezeShields: 1,
      dailyXpEarned: 0,
      dailyXpResetDate: nowStr,
      skillTier: 'intermediate',
      createdAt: new Date().toISOString()
    };

    await setDoc(userRef, newUser);
    return newUser;
  }
}

/**
 * Fetch Student Notes from Firestore for given user
 */
export async function fetchNotesFromFirestore(userId: string): Promise<StudentNote[]> {
  try {
    const q = query(collection(db, 'notes'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const notesList: StudentNote[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      notesList.push({
        id: docSnap.id,
        userId: data.userId,
        title: data.title,
        content: data.content,
        courseId: data.courseId,
        courseTitle: data.courseTitle,
        tags: data.tags || [],
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      });
    });
    return notesList.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (err) {
    console.warn('Firestore fetchNotes failed:', err);
    return [];
  }
}

/**
 * Create or Update Student Note in Firestore
 */
export async function saveNoteToFirestore(userId: string, noteData: { id?: string; title: string; content: string; courseId?: string; courseTitle?: string; tags?: string[] }): Promise<StudentNote> {
  const now = new Date().toISOString();
  if (noteData.id) {
    const noteRef = doc(db, 'notes', noteData.id);
    await updateDoc(noteRef, {
      title: noteData.title,
      content: noteData.content,
      tags: noteData.tags || [],
      updatedAt: now
    });
    return {
      id: noteData.id,
      userId,
      title: noteData.title,
      content: noteData.content,
      courseId: noteData.courseId,
      courseTitle: noteData.courseTitle,
      tags: noteData.tags || [],
      createdAt: now,
      updatedAt: now
    };
  } else {
    const docRef = await addDoc(collection(db, 'notes'), {
      userId,
      title: noteData.title,
      content: noteData.content,
      courseId: noteData.courseId || null,
      courseTitle: noteData.courseTitle || null,
      tags: noteData.tags || [],
      createdAt: now,
      updatedAt: now
    });

    return {
      id: docRef.id,
      userId,
      title: noteData.title,
      content: noteData.content,
      courseId: noteData.courseId,
      courseTitle: noteData.courseTitle,
      tags: noteData.tags || [],
      createdAt: now,
      updatedAt: now
    };
  }
}

/**
 * Delete Student Note from Firestore
 */
export async function deleteNoteFromFirestore(noteId: string): Promise<void> {
  await deleteDoc(doc(db, 'notes', noteId));
}

/**
 * Fetch Chat Sessions from Firestore for given user
 */
export async function fetchChatSessionsFromFirestore(userId: string): Promise<any[]> {
  try {
    const q = query(collection(db, 'chatSessions'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const sessions: any[] = [];
    querySnapshot.forEach((docSnap) => {
      sessions.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });
    return sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (err) {
    console.warn('Firestore fetchChatSessions failed:', err);
    return [];
  }
}

/**
 * Save Chat Session to Firestore
 */
export async function saveChatSessionToFirestore(userId: string, session: any): Promise<void> {
  try {
    const sessionRef = doc(db, 'chatSessions', session.id);
    await setDoc(sessionRef, {
      ...session,
      userId,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore saveChatSession failed:', err);
  }
}

/**
 * Delete Chat Session from Firestore
 */
export async function deleteChatSessionFromFirestore(sessionId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'chatSessions', sessionId));
  } catch (err) {
    console.warn('Firestore deleteChatSession failed:', err);
  }
}

export {
  signInWithPopup,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  onSnapshot
};
export type { FirebaseUser };
