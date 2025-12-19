import React, { useState, useEffect } from 'react';
import { User, UserRole, ContentItem, LessonSlot, QAItem, Notification, UserStatus, AppSettings, BookingStatus } from './types';
import { THEMES, FONTS } from './constants';
import { AuthPage } from './pages/Auth';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { StudentView } from './pages/StudentView';
import { NotificationList } from './components/UIComponents';
import { db } from './services/db';

const App: React.FC = () => {
  // --- STATE ---
  // Initialize state from DB
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [content, setContent] = useState<ContentItem[]>(db.getContent());
  const [schedule, setSchedule] = useState<LessonSlot[]>(db.getSchedule());
  const [qaItems, setQaItems] = useState<QAItem[]>(db.getQA());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentTheme, setCurrentTheme] = useState(db.getTheme());
  const [settings, setSettings] = useState<AppSettings>(db.getSettings());
  const [hideHint, setHideHint] = useState(db.getHideCredentialsHint());

  // --- REAL-TIME SYNC EFFECT ---
  useEffect(() => {
    const syncData = () => {
      setUsers(db.getUsers());
      setContent(db.getContent());
      setSchedule(db.getSchedule());
      setQaItems(db.getQA());
      setSettings(db.getSettings());
      setCurrentTheme(db.getTheme());
      setHideHint(db.getHideCredentialsHint());
      
      // Update current user if their details changed in DB
      if (currentUser) {
        const freshUsers = db.getUsers();
        const updatedUser = freshUsers.find(u => u.id === currentUser.id);
        
        if (updatedUser) {
           // Only update state if meaningful changes occurred to avoid loops
           if (JSON.stringify(updatedUser) !== JSON.stringify(currentUser)) {
               setCurrentUser(updatedUser);
           }
           
           if(updatedUser.status === UserStatus.BLOCKED && updatedUser.role === UserRole.STUDENT) {
             alert("Your session has been terminated by the administrator.");
             setCurrentUser(null);
           }
        } else {
           // User deleted from DB
           setCurrentUser(null);
        }
      }
    };

    // Subscribe to DB changes (BroadcastChannel + Storage)
    const unsubscribe = db.subscribe(syncData);
    
    // Also sync when tab becomes visible or focused (ensures freshness when returning)
    document.addEventListener('visibilitychange', syncData);
    window.addEventListener('focus', syncData);

    return () => { 
      unsubscribe();
      document.removeEventListener('visibilitychange', syncData);
      window.removeEventListener('focus', syncData);
    };
  }, [currentUser]);

  // Apply Theme & Font
  useEffect(() => {
    const theme = THEMES[currentTheme as keyof typeof THEMES];
    if (theme) {
      const root = document.documentElement;
      Object.entries(theme.primary).forEach(([key, value]) => {
        root.style.setProperty(`--color-primary-${key}`, value);
      });
      Object.entries(theme.secondary).forEach(([key, value]) => {
        root.style.setProperty(`--color-secondary-${key}`, value);
      });
    }
  }, [currentTheme]);

  useEffect(() => {
    const fontStack = FONTS[settings.font as keyof typeof FONTS] || FONTS.SANS;
    document.body.style.fontFamily = fontStack;
  }, [settings.font]);


  // --- NOTIFICATION HELPER ---
  const notifyStudent = (studentId: string, message: string) => {
    // If the student is the current user, local state update. 
    // In a real app, this would be a push notification.
    if (currentUser && currentUser.id === studentId) {
      const newNotif: Notification = {
        id: Date.now().toString(),
        userId: studentId,
        message,
        read: false,
        timestamp: Date.now()
      };
      setNotifications(prev => [...prev, newNotif]);
    }
  };

  const notifyAllStudents = (message: string) => {
    // Real notification logic would go here
    if (currentUser && currentUser.role === UserRole.STUDENT) {
      notifyStudent(currentUser.id, message);
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // --- ACTIONS (Proxied to DB) ---

  const handleLogin = (email: string, pass: string) => {
    // Refresh users from DB before check
    const currentUsers = db.getUsers();
    const user = currentUsers.find(u => u.email === email && u.password === pass);
    if (user) {
      if (user.role === UserRole.STUDENT) {
        if (user.status === UserStatus.PENDING) {
          alert("Your account is pending teacher approval.");
          return;
        }
        if (user.status === UserStatus.BLOCKED) {
          alert("Your account has been suspended.");
          return;
        }
      }
      
      // If teacher logs in, hide the hint for future
      if (user.role === UserRole.TEACHER) {
        db.setHideCredentialsHint(true);
      }

      setCurrentUser(user);
      if (user.role === UserRole.STUDENT) {
         setNotifications([]);
      }
    } else {
      alert("Invalid credentials.");
    }
  };

  const handleRegister = (name: string, email: string, pass: string, phone: string) => {
    const currentUsers = db.getUsers();
    const existingUser = currentUsers.find(u => u.email === email);
    
    if (existingUser) {
       if (existingUser.status === UserStatus.PENDING) {
         alert("Application already submitted. Please wait for approval.");
       } else if (existingUser.status === UserStatus.BLOCKED) {
         alert("This account has been blocked.");
       } else {
         alert("Email already exists. Please login.");
       }
       return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      role: UserRole.STUDENT,
      status: UserStatus.PENDING, 
      avatar: `https://ui-avatars.com/api/?name=${name}&background=random`,
      password: pass
    };
    db.setUsers([...currentUsers, newUser]);
    alert("Registration successful! Please wait for teacher approval.");
  };

  const handleForgotPassword = (email: string) => {
    const currentUsers = db.getUsers();
    const user = currentUsers.find(u => u.email === email);
    if (user) {
       alert(`A password reset link has been sent to ${email}. (Check console for temporary password)`);
       const tempPass = Math.random().toString(36).slice(-8);
       console.log(`[SIMULATION] Password reset for ${email}. New temporary password: ${tempPass}`);
       db.setUsers(currentUsers.map(u => u.id === user.id ? { ...u, password: tempPass } : u));
    } else {
       alert("Email not found.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setNotifications([]);
  };

  // Teacher Actions
  const updateUserStatus = (id: string, status: UserStatus) => {
    db.setUsers(users.map(u => u.id === id ? { ...u, status } : u));
  };

  const resetUserPassword = (id: string, newPass: string) => {
    db.setUsers(users.map(u => u.id === id ? { ...u, password: newPass } : u));
  };

  const addContent = (item: ContentItem) => {
    db.setContent([item, ...content]);
    notifyAllStudents(`New content added: ${item.title}`);
  };

  const deleteContent = (id: string) => {
    db.setContent(content.filter(c => c.id !== id));
  };

  const updateTeacherCredentials = (id: string, email: string, pass: string) => {
    db.setUsers(users.map(u => u.id === id ? { ...u, email, password: pass } : u));
    // Local state update handled by effect
  };

  const updateSettings = (newSettings: AppSettings) => {
    db.setSettings(newSettings);
  };

  // --- SCHEDULE MANAGEMENT ---

  const addScheduleSlot = (slot: LessonSlot) => {
    db.setSchedule([...schedule, slot]);
  }

  const deleteScheduleSlot = (id: string) => {
    db.setSchedule(schedule.filter(s => s.id !== id));
  }

  const updateScheduleSlot = (updatedSlot: LessonSlot) => {
    db.setSchedule(schedule.map(s => s.id === updatedSlot.id ? updatedSlot : s));
  };

  const updateBookingStatus = (slotId: string, studentId: string, status: BookingStatus) => {
    const currentSchedule = db.getSchedule();
    const updatedSchedule = currentSchedule.map(s => {
      if (s.id === slotId) {
        const updatedBookings = s.bookings.map(b => 
          b.studentId === studentId ? { ...b, status } : b
        );
        return { ...s, bookings: updatedBookings };
      }
      return s;
    });
    db.setSchedule(updatedSchedule);
    
    // Notify student
    const msg = status === BookingStatus.APPROVED 
      ? "Your lesson booking has been approved!" 
      : "Your lesson booking was declined.";
    notifyStudent(studentId, msg);
  };

  // Student Actions
  const bookSlot = (slotId: string) => {
    if (!currentUser) return;
    const currentSchedule = db.getSchedule(); // Get fresh
    const updatedSchedule = currentSchedule.map(s => {
      const existingBooking = s.bookings.find(b => b.studentId === currentUser.id);
      
      // Calculate occupied spots (Approved or Pending)
      const occupied = s.bookings.filter(b => b.status === BookingStatus.APPROVED || b.status === BookingStatus.PENDING).length;

      if (s.id === slotId && !existingBooking && occupied < s.maxStudents) {
        return { 
          ...s, 
          bookings: [...s.bookings, { studentId: currentUser.id, status: BookingStatus.PENDING, timestamp: Date.now() }] 
        };
      }
      return s;
    });
    db.setSchedule(updatedSchedule);
    notifyStudent(currentUser.id, "Booking requested! Waiting for approval.");
  };

  const cancelBooking = (slotId: string) => {
    if (!currentUser) return;
    const currentSchedule = db.getSchedule();
    const updatedSchedule = currentSchedule.map(s => {
      if (s.id === slotId) {
        return { ...s, bookings: s.bookings.filter(b => b.studentId !== currentUser.id) };
      }
      return s;
    });
    db.setSchedule(updatedSchedule);
  };

  // Q&A Actions
  const addQuestion = (q: QAItem) => {
    db.setQA([q, ...qaItems]);
  };

  const answerQuestion = (id: string, answer: string) => {
    db.setQA(qaItems.map(q => q.id === id ? { ...q, answer, isApproved: true } : q));
    const q = qaItems.find(x => x.id === id);
    if (q) notifyStudent(q.studentId, "Teacher answered your question!");
  };

  const toggleQAVisibility = (id: string, isPublic: boolean, isApproved: boolean) => {
    db.setQA(qaItems.map(q => q.id === id ? { ...q, isPublic, isApproved } : q));
  };

  const deleteQA = (id: string) => {
    db.setQA(qaItems.filter(q => q.id !== id));
  };

  const setTheme = (theme: string) => {
    db.setTheme(theme);
  }

  // --- DATA SANITIZATION & RENDER ---

  // Prepare data for student view to respect privacy
  const getSanitizedSchedule = () => {
    if (!currentUser || currentUser.role === UserRole.TEACHER) return schedule;
    
    return schedule.map(slot => {
      // Find my booking
      const myBooking = slot.bookings.find(b => b.studentId === currentUser.id);
      // Create a list of anonymous bookings for others to preserve "Occupied" count
      // We keep the count accurate but hide student IDs of others
      const otherBookings = slot.bookings
        .filter(b => b.studentId !== currentUser.id)
        .map(b => ({ ...b, studentId: 'anonymous' })); // Anonymize

      return {
        ...slot,
        bookings: myBooking ? [...otherBookings, myBooking] : otherBookings
      };
    });
  };

  const getSanitizedUsers = () => {
    if (!currentUser || currentUser.role === UserRole.TEACHER) return users;
    // Students should only see themselves and the teacher(s)
    // However, for Q&A we need names. The StudentView component handles Q&A display by name string stored in QAItem.
    // So strictly we can just return CurrentUser + Teachers.
    return users.filter(u => u.id === currentUser.id || u.role === UserRole.TEACHER);
  };


  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl overflow-hidden relative">
        <AuthPage 
          onLogin={handleLogin} 
          onRegister={handleRegister} 
          onForgotPassword={handleForgotPassword}
          logoUrl={settings.logoUrl}
          mainImageUrl={settings.mainImageUrl}
          showHint={!hideHint}
        />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white h-screen shadow-2xl overflow-hidden relative flex flex-col">
      <NotificationList notifications={notifications} onRead={dismissNotification} />
      
      {currentUser.role === UserRole.TEACHER ? (
        <TeacherDashboard 
          currentUser={currentUser}
          users={users} 
          content={content} 
          schedule={schedule}
          qaItems={qaItems}
          settings={settings}
          onUpdateUserStatus={updateUserStatus}
          onResetPassword={resetUserPassword}
          onAddContent={addContent}
          onDeleteContent={deleteContent}
          onUpdateCredentials={updateTeacherCredentials}
          onUpdateSettings={updateSettings}
          onLogout={handleLogout}
          onAnswerQA={answerQuestion}
          onToggleQA={toggleQAVisibility}
          onDeleteQA={deleteQA}
          currentTheme={currentTheme}
          onSetTheme={setTheme}
          onAddScheduleSlot={addScheduleSlot}
          onDeleteScheduleSlot={deleteScheduleSlot}
          onUpdateScheduleSlot={updateScheduleSlot}
          onUpdateBookingStatus={updateBookingStatus}
        />
      ) : (
        <StudentView 
          user={currentUser} 
          content={content} 
          schedule={getSanitizedSchedule()} 
          qaItems={qaItems}
          onBook={bookSlot}
          onCancel={cancelBooking}
          onAddQuestion={addQuestion}
          onLogout={handleLogout}
          logoUrl={settings.logoUrl}
          mainImageUrl={settings.mainImageUrl}
        />
      )}
    </div>
  );
};

export default App;