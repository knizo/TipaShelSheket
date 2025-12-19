export enum UserRole {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export enum UserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  BLOCKED = 'BLOCKED'
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string; // New field
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  password?: string;
}

export enum ContentType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  url?: string;
  timestamp: number;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Booking {
  studentId: string;
  status: BookingStatus;
  timestamp: number;
}

export interface LessonSlot {
  id: string;
  day: string; 
  time: string; 
  durationMin: number;
  maxStudents: number;
  bookings: Booking[]; // Changed from bookedStudentIds
}

export interface QAItem {
  id: string;
  studentId: string;
  studentName: string;
  question: string;
  answer?: string;
  isPublic: boolean;
  isApproved: boolean;
  category: 'General' | 'Pose' | 'Lesson';
  timestamp: number;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  timestamp: number;
}

export interface Theme {
  name: string;
  colors: {
    primary: Record<number, string>;
    secondary: Record<number, string>;
  }
}

export interface AppSettings {
  maxUploadSizeMB: number;
  logoUrl?: string;
  mainImageUrl?: string; // New field
  font: string; // New field
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  content: ContentItem[];
  schedule: LessonSlot[];
  qaItems: QAItem[];
  notifications: Notification[];
  settings: AppSettings;
}

export type NavigationTab = 'feed' | 'schedule' | 'chat' | 'qa' | 'admin_content' | 'admin_students' | 'admin_qa' | 'admin_settings';