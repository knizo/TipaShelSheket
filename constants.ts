import { User, UserRole, ContentItem, ContentType, LessonSlot, UserStatus, QAItem, BookingStatus } from './types';

export const FONTS = {
  SANS: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  SERIF: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  MONO: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  ROUNDED: '"Varela Round", "Nunito", sans-serif',
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
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
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
    name: 'Pink & Light Blue',
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
  }
};