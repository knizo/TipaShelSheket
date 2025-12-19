import { User, UserRole, ContentItem, ContentType, LessonSlot, UserStatus, QAItem, BookingStatus } from './types';

export const FONTS = {
  SANS: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  SERIF: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  MONO: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  ROUNDED: '"Varela Round", "M PLUS Rounded 1c", "Nunito", sans-serif', // Fallback to sans if not loaded, mostly relies on system
};

export const INITIAL_USERS: User[] = [
  {
    id: 'teacher-1',
    email: 'admin@yoga.com',
    name: 'Neta (Teacher)',
    phone: '+972-50-0000000',
    role: UserRole.TEACHER,
    status: UserStatus.APPROVED,
    avatar: 'https://picsum.photos/id/64/200/200',
    password: 'admin'
  },
  {
    id: 'student-1',
    email: 'student@test.com',
    name: 'Dana Cohen',
    phone: '+972-52-1111111',
    role: UserRole.STUDENT,
    status: UserStatus.APPROVED,
    avatar: 'https://picsum.photos/id/65/200/200',
    password: 'password'
  }
];

export const INITIAL_CONTENT: ContentItem[] = [
  {
    id: 'c1',
    type: ContentType.IMAGE,
    title: 'Morning Sun Salutation',
    description: 'Start your day with energy and grace.',
    url: 'https://picsum.photos/id/88/800/600',
    timestamp: Date.now() - 1000000
  },
  {
    id: 'c2',
    type: ContentType.TEXT,
    title: 'Mindfulness Tip #1',
    description: 'Breathe deeply into your belly. Let the exhale be longer than the inhale.',
    timestamp: Date.now() - 500000
  }
];

export const INITIAL_SCHEDULE: LessonSlot[] = [
  { 
    id: 's1', 
    day: 'Monday', 
    time: '18:00', 
    durationMin: 60, 
    maxStudents: 10, 
    bookings: [
      { studentId: 'student-1', status: BookingStatus.APPROVED, timestamp: Date.now() }
    ] 
  },
  { 
    id: 's2', 
    day: 'Wednesday', 
    time: '08:00', 
    durationMin: 60, 
    maxStudents: 10, 
    bookings: [] 
  },
];

export const INITIAL_QA: QAItem[] = [];

export const THEMES = {
  PINK_BLUE: {
    name: 'Pink & Blue',
    primary: {
      50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4', 400: '#f472b6',
      500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d', 900: '#831843'
    },
    secondary: {
      50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8',
      500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e'
    }
  },
  SAGE_SAND: {
    name: 'Sage & Sand',
    primary: {
      50: '#f4f7f5', 100: '#e3ebe5', 200: '#c5d9c9', 300: '#9dbfba', 400: '#75a09c',
      500: '#568480', 600: '#436865', 700: '#385553', 800: '#304644', 900: '#2a3b3a'
    },
    secondary: {
      50: '#fdfbf7', 100: '#fbf7ef', 200: '#f5ead6', 300: '#eddbb6', 400: '#e2c58f',
      500: '#d9ad68', 600: '#cc944e', 700: '#aa763f', 800: '#8c5f38', 900: '#734e32'
    }
  },
  LAVENDER_TEAL: {
    name: 'Lavender & Teal',
    primary: {
      50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa',
      500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95'
    },
    secondary: {
      50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf',
      500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a'
    }
  },
  EARTH_SKY: {
    name: 'Earth & Sky',
    primary: {
      50: '#f6f5f4', 100: '#e3e0dc', 200: '#c5beb6', 300: '#a3988d', 400: '#847467',
      500: '#6a5a4e', 600: '#55473e', 700: '#423730', 800: '#322a25', 900: '#231e1a'
    },
    secondary: {
      50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8',
      500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e'
    }
  },
  ROYAL_GOLD: {
    name: 'Royal & Gold',
    primary: {
      50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa',
      500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a'
    },
    secondary: {
      50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15',
      500: '#eab308', 600: '#ca8a04', 700: '#a16207', 800: '#854d0e', 900: '#713f12'
    }
  },
  FOREST_STONE: {
    name: 'Forest & Stone',
    primary: {
      50: '#f2fcf5', 100: '#e0f9e6', 200: '#c1f3ce', 300: '#91e8aa', 400: '#59d682',
      500: '#32bb61', 600: '#239a4d', 700: '#1f7a40', 800: '#1e6136', 900: '#19502e'
    },
    secondary: {
      50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8',
      500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a'
    }
  },
  FIRE_ICE: {
    name: 'Fire & Ice',
    primary: {
      50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185',
      500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 800: '#9f1239', 900: '#881337'
    },
    secondary: {
      50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa',
      500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a'
    }
  }
};