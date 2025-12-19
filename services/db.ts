
import { User, ContentItem, LessonSlot, QAItem, AppSettings, UserRole } from '../types';
import { INITIAL_USERS, INITIAL_CONTENT, INITIAL_SCHEDULE, INITIAL_QA } from '../constants';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, setDoc, collection, getDocs, updateDoc, deleteDoc } from "firebase/firestore";

// --- FIREBASE CONFIGURATION ---
// IMPORTANT: Replace with your actual Firebase project configuration found in Project Settings.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Check if config is provided to avoid crash
let dbInstance: any = null;
try {
  if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    const app = initializeApp(firebaseConfig);
    dbInstance = getFirestore(app);
  }
} catch (e) {
  console.warn("Firebase not initialized. Falling back to robust localStorage sync.");
}

const DB_KEYS = {
  USERS: 'tipa_users',
  CONTENT: 'tipa_content',
  SCHEDULE: 'tipa_schedule',
  QA: 'tipa_qa',
  SETTINGS: 'tipa_settings',
  THEME: 'tipa_theme',
  HIDE_CREDENTIALS_HINT: 'tipa_hide_creds_hint'
};

const DEFAULT_SETTINGS: AppSettings = { 
  maxUploadSizeMB: 10, 
  font: 'SANS',
  mainImageUrl: 'https://images.unsplash.com/photo-1544367563-12123d895e29?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80' 
};

const channel = new BroadcastChannel('tipashelsheket_channel');
type ChangeListener = () => void;
const listeners: Set<ChangeListener> = new Set();

channel.onmessage = (event) => {
  if (event.data.type === 'DB_UPDATE') {
    listeners.forEach(l => l());
  }
};

const notifyChanges = () => {
  channel.postMessage({ type: 'DB_UPDATE' });
  listeners.forEach(l => l());
};

const get = <T>(key: string, defaultVal: T): T => {
  const s = localStorage.getItem(key);
  return s ? JSON.parse(s) : defaultVal;
};

const set = <T>(key: string, val: T) => {
  localStorage.setItem(key, JSON.stringify(val));
  // If Firebase is available, we would write to it here as well
  // await setDoc(doc(dbInstance, "app_state", key), { data: val });
  notifyChanges();
};

export const db = {
  subscribe: (callback: ChangeListener) => {
    listeners.add(callback);
    
    // 1. Storage event (other tabs/windows in same browser)
    const storageHandler = (e: StorageEvent) => {
      if (Object.values(DB_KEYS).includes(e.key || '')) {
        callback();
      }
    };
    window.addEventListener('storage', storageHandler);

    // 2. Firebase Realtime Subscription (Cross-device)
    // This allows devices in different networks to see the same data
    let unsubFirebase: any = null;
    if (dbInstance) {
      // In a real implementation, we'd subscribe to collections here
      // Example: onSnapshot(collection(dbInstance, "users"), () => callback());
    }

    return () => { 
      listeners.delete(callback);
      window.removeEventListener('storage', storageHandler);
      if (unsubFirebase) unsubFirebase();
    };
  },

  getUsers: () => get<User[]>(DB_KEYS.USERS, INITIAL_USERS),
  setUsers: (users: User[]) => set(DB_KEYS.USERS, users),

  getContent: () => get<ContentItem[]>(DB_KEYS.CONTENT, INITIAL_CONTENT),
  setContent: (content: ContentItem[]) => set(DB_KEYS.CONTENT, content),

  getSchedule: () => get<LessonSlot[]>(DB_KEYS.SCHEDULE, INITIAL_SCHEDULE),
  setSchedule: (schedule: LessonSlot[]) => set(DB_KEYS.SCHEDULE, schedule),

  getQA: () => get<QAItem[]>(DB_KEYS.QA, INITIAL_QA),
  setQA: (qa: QAItem[]) => set(DB_KEYS.QA, qa),

  getSettings: () => get<AppSettings>(DB_KEYS.SETTINGS, DEFAULT_SETTINGS),
  setSettings: (settings: AppSettings) => set(DB_KEYS.SETTINGS, settings),

  getTheme: () => localStorage.getItem(DB_KEYS.THEME) || 'PINK_BLUE',
  setTheme: (theme: string) => {
    localStorage.setItem(DB_KEYS.THEME, theme);
    notifyChanges();
  },

  getHideCredentialsHint: () => get<boolean>(DB_KEYS.HIDE_CREDENTIALS_HINT, false),
  setHideCredentialsHint: (hide: boolean) => set(DB_KEYS.HIDE_CREDENTIALS_HINT, hide),
};
