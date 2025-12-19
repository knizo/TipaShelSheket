import React, { useState } from 'react';
import { User, ContentItem, LessonSlot, ContentType, QAItem, UserStatus, AppSettings, BookingStatus } from '../types';
import { Card, Button, Input, Badge, Modal, FileUpload } from '../components/UIComponents';
import { Feed, ScheduleList } from '../components/BusinessComponents';
import { Plus, Users, Upload, LogOut, Check, X, Sparkles, Trash2, HelpCircle, Settings, Lock, Eye, EyeOff, RefreshCw, Calendar, Eye as ViewIcon, Image as ImageIcon, Phone, MessageSquare } from 'lucide-react';
import { generateContentDescription } from '../services/geminiService';
import { THEMES, FONTS } from '../constants';

interface TeacherDashboardProps {
  currentUser: User;
  users: User[];
  content: ContentItem[];
  schedule: LessonSlot[];
  qaItems: QAItem[];
  settings: AppSettings;
  onUpdateUserStatus: (id: string, status: UserStatus) => void;
  onResetPassword: (id: string, pass: string) => void;
  onAddContent: (item: ContentItem) => void;
  onDeleteContent: (id: string) => void;
  onUpdateCredentials: (id: string, email: string, pass: string) => void;
  onUpdateSettings: (settings: AppSettings) => void;
  onLogout: () => void;
  onAnswerQA: (id: string, answer: string) => void;
  onToggleQA: (id: string, isPublic: boolean, isApproved: boolean) => void;
  onDeleteQA: (id: string) => void;
  currentTheme: string;
  onSetTheme: (theme: string) => void;
  onAddScheduleSlot: (slot: LessonSlot) => void;
  onDeleteScheduleSlot: (id: string) => void;
  onUpdateScheduleSlot: (slot: LessonSlot) => void;
  onUpdateBookingStatus: (slotId: string, studentId: string, status: BookingStatus) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
  currentUser, users, content, schedule, qaItems, settings, onUpdateUserStatus, onResetPassword, onAddContent, onDeleteContent, onUpdateCredentials, onUpdateSettings, onLogout, onAnswerQA, onToggleQA, onDeleteQA, currentTheme, onSetTheme, onAddScheduleSlot, onDeleteScheduleSlot, onUpdateScheduleSlot, onUpdateBookingStatus
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'feed_view' | 'schedule_manage' | 'students' | 'qa' | 'settings'>('content');

  return (
    <div className="h-full flex flex-col bg-gray-50">
       <header className="bg-primary-800 p-6 shadow-md text-white sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
             {settings.logoUrl && <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 object-contain bg-white rounded-md p-0.5" />}
             <div>
                <h1 className="text-2xl font-bold">TipaShelSheket</h1>
                <p className="text-primary-200 text-sm">Teacher Dashboard</p>
             </div>
          </div>
          <button onClick={onLogout} className="text-primary-200 hover:text-white" title="Logout">
            <LogOut size={24} />
          </button>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
          <TabButton active={activeTab === 'content'} onClick={() => setActiveTab('content')} icon={<Upload size={18} />} label="Manage" />
          <TabButton active={activeTab === 'feed_view'} onClick={() => setActiveTab('feed_view')} icon={<ViewIcon size={18} />} label="Feed" />
          <TabButton active={activeTab === 'schedule_manage'} onClick={() => setActiveTab('schedule_manage')} icon={<Calendar size={18} />} label="Schedule" />
          <TabButton active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon={<Users size={18} />} label="Students" />
          <TabButton active={activeTab === 'qa'} onClick={() => setActiveTab('qa')} icon={<HelpCircle size={18} />} label="Q&A" />
          <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={18} />} label="Settings" />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-20 no-scrollbar">
        {activeTab === 'content' && <ContentManager content={content} onAddContent={onAddContent} onDelete={onDeleteContent} maxUploadSizeMB={settings.maxUploadSizeMB} />}
        {activeTab === 'feed_view' && <Feed content={content} />}
        {activeTab === 'schedule_manage' && <ScheduleManager schedule={schedule} onAddSlot={onAddScheduleSlot} onDeleteSlot={onDeleteScheduleSlot} onUpdateSlot={onUpdateScheduleSlot} onUpdateBookingStatus={onUpdateBookingStatus} users={users} />}
        {activeTab === 'students' && <StudentManager users={users} onUpdateStatus={onUpdateUserStatus} onResetPassword={onResetPassword} />}
        {activeTab === 'qa' && <QAManager qaItems={qaItems} onAnswer={onAnswerQA} onToggle={onToggleQA} onDelete={onDeleteQA} />}
        {activeTab === 'settings' && <SettingsManager user={currentUser} currentTheme={currentTheme} settings={settings} onSetTheme={onSetTheme} onUpdateCredentials={onUpdateCredentials} onUpdateSettings={onUpdateSettings} />}
      </main>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors shrink-0 ${
      active ? 'bg-white/20 text-white' : 'text-primary-300 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-2">{label}</span>
  </button>
);

// --- Sub-Components ---
// (Truncated sections for brevity as they are unchanged - keeping structure)
const ScheduleManager: React.FC<{ schedule: LessonSlot[], onAddSlot: (s: LessonSlot) => void, onDeleteSlot: (id: string) => void, onUpdateSlot: (s: LessonSlot) => void, onUpdateBookingStatus: (sid: string, uid: string, st: BookingStatus) => void, users: User[] }> = ({ schedule, onAddSlot, onDeleteSlot, onUpdateSlot, onUpdateBookingStatus, users }) => {
  // ... (Same as previous, just need to render it to keep file valid)
  const [isAdding, setIsAdding] = useState(false);
  const [editingSlot, setEditingSlot] = useState<LessonSlot | null>(null);
  const [managingSlot, setManagingSlot] = useState<LessonSlot | null>(null);
  const [day, setDay] = useState('Monday');
  const [time, setTime] = useState('18:00');
  const [duration, setDuration] = useState(60);
  const [maxStudents, setMaxStudents] = useState(10);
  const startEditing = (slot: LessonSlot) => { setEditingSlot(slot); setDay(slot.day); setTime(slot.time); setDuration(slot.durationMin); setMaxStudents(slot.maxStudents); };
  const handleAddSubmit = (e: React.FormEvent) => { e.preventDefault(); onAddSlot({ id: Date.now().toString(), day, time, durationMin: duration, maxStudents, bookings: [] }); setIsAdding(false); };
  const handleEditSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!editingSlot) return; onUpdateSlot({ ...editingSlot, day, time, durationMin: duration, maxStudents }); setEditingSlot(null); };
  const renderBookingRow = (booking: {studentId: string, status: BookingStatus}) => {
    const student = users.find(u => u.id === booking.studentId);
    if (!student) return null;
    return (
      <div key={booking.studentId} className="flex justify-between items-center py-2 border-b last:border-0">
        <div><p className="text-sm font-medium">{student.name}</p><p className="text-xs text-gray-500">{student.email}</p></div>
        <div className="flex items-center gap-2">
          {booking.status === BookingStatus.APPROVED ? <Badge color="green">Approved</Badge> : booking.status === BookingStatus.REJECTED ? <Badge color="red">Rejected</Badge> : <Badge color="yellow">Pending</Badge>}
          <div className="flex gap-1">
             <button onClick={() => managingSlot && onUpdateBookingStatus(managingSlot.id, student.id, BookingStatus.APPROVED)} className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200"><Check size={16} /></button>
             <button onClick={() => managingSlot && onUpdateBookingStatus(managingSlot.id, student.id, BookingStatus.REJECTED)} className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200"><X size={16} /></button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
       <Button onClick={() => { setIsAdding(true); setDay('Monday'); setTime('18:00'); }} className="mb-4"><Plus className="mr-2" /> Add Class Slot</Button>
      <Modal isOpen={isAdding} onClose={() => setIsAdding(false)} title="New Class Slot">
         <form onSubmit={handleAddSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Day</label><select className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" value={day} onChange={e => setDay(e.target.value)}>{['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (<option key={d} value={d}>{d}</option>))}</select></div>
            <Input label="Time" type="time" value={time} onChange={e => setTime(e.target.value)} required />
            <Input label="Duration (min)" type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value))} required />
            <Input label="Max Students" type="number" value={maxStudents} onChange={e => setMaxStudents(parseInt(e.target.value))} required />
            <Button type="submit">Create Slot</Button>
         </form>
      </Modal>
      <Modal isOpen={!!editingSlot} onClose={() => setEditingSlot(null)} title="Edit Class Slot">
         <form onSubmit={handleEditSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Day</label><select className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" value={day} onChange={e => setDay(e.target.value)}>{['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (<option key={d} value={d}>{d}</option>))}</select></div>
            <Input label="Time" type="time" value={time} onChange={e => setTime(e.target.value)} required />
            <Input label="Duration (min)" type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value))} required />
            <Input label="Max Students" type="number" value={maxStudents} onChange={e => setMaxStudents(parseInt(e.target.value))} required />
            <Button type="submit">Update Slot</Button>
         </form>
      </Modal>
      <Modal isOpen={!!managingSlot} onClose={() => setManagingSlot(null)} title="Manage Bookings">
         <div className="space-y-2 max-h-96 overflow-y-auto">{managingSlot?.bookings.length === 0 ? (<p className="text-gray-500 text-center py-4">No bookings yet.</p>) : (managingSlot?.bookings.map(booking => renderBookingRow(booking)))}</div>
      </Modal>
      <ScheduleList schedule={schedule} userId="" userRole="TEACHER" onDeleteSlot={onDeleteSlot} onEditSlot={startEditing} onManageBookings={(slot) => setManagingSlot(slot)} />
    </div>
  );
};

const ContentManager: React.FC<{ content: ContentItem[], onAddContent: (c: ContentItem) => void, onDelete: (id: string) => void, maxUploadSizeMB: number }> = ({ content, onAddContent, onDelete, maxUploadSizeMB }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ContentType>(ContentType.TEXT);
  const [newDesc, setNewDesc] = useState('');
  const [fileData, setFileData] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!newTitle) return;
    setIsGenerating(true);
    const desc = await generateContentDescription(newTitle, newType);
    setNewDesc(desc);
    setIsGenerating(false);
  };
  const handleFileSelect = (file: File) => {
    setFileName(file.name);
    if (file.type.startsWith('image/')) setNewType(ContentType.IMAGE);
    else if (file.type.startsWith('video/')) setNewType(ContentType.VIDEO);
    const reader = new FileReader();
    reader.onload = (e) => { if (e.target?.result) setFileData(e.target.result as string); };
    reader.readAsDataURL(file);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddContent({ id: Date.now().toString(), type: newType, title: newTitle, description: newDesc, url: fileData || (newType !== ContentType.TEXT ? `https://picsum.photos/seed/${Date.now()}/800/600` : undefined), timestamp: Date.now() });
    handleCloseModal();
  };
  const handleCloseModal = () => { setIsModalOpen(false); setNewTitle(''); setNewDesc(''); setFileData(undefined); setFileName(''); setNewType(ContentType.TEXT); }

  return (
    <div className="space-y-6">
      <Button onClick={() => setIsModalOpen(true)} className="mb-4"><Plus className="mr-2" /> Upload New Content</Button>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="New Post">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Evening Flow" required />
            <div className="mb-2"><label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Type</label><div className="flex gap-2">{[ContentType.TEXT, ContentType.IMAGE, ContentType.VIDEO].map(t => (<button key={t} type="button" onClick={() => { setNewType(t); setFileData(undefined); setFileName(''); }} className={`px-3 py-2 rounded-lg text-xs font-bold border ${newType === t ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200'}`}>{t}</button>))}</div></div>
            {newType !== ContentType.TEXT && (<div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Media File</label>{!fileData ? (<FileUpload onFileSelect={handleFileSelect} maxSizeMB={maxUploadSizeMB} accept={newType === ContentType.IMAGE ? "image/*" : "video/*"} />) : (<div className="relative rounded-lg overflow-hidden border border-gray-200">{newType === ContentType.IMAGE ? (<img src={fileData} alt="preview" className="w-full h-48 object-cover" />) : (<video src={fileData} className="w-full h-48 object-cover" />)}<button type="button" onClick={() => { setFileData(undefined); setFileName(''); }} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md"><X size={16} /></button><div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs p-1 px-2 truncate">{fileName}</div></div>)}</div>)}
            <div className="mb-4 relative"><label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Description</label><textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all h-24 resize-none" value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Content details..." /><button type="button" onClick={handleGenerate} disabled={!newTitle || isGenerating} className="absolute right-2 bottom-3 text-primary-600 hover:text-primary-800 disabled:opacity-30 p-1" title="Generate with AI"><Sparkles size={20} className={isGenerating ? "animate-pulse" : ""} /></button></div>
            <Button type="submit">Post</Button>
          </form>
      </Modal>
      <div className="space-y-3">{content.map(item => (<Card key={item.id} className="flex justify-between items-center p-3"><div className="flex items-center overflow-hidden"><div className="w-10 h-10 rounded bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xs shrink-0">{item.type[0]}</div><div className="ml-3 truncate"><p className="font-medium text-gray-800 truncate">{item.title}</p><p className="text-xs text-gray-500 truncate max-w-[200px]">{item.description}</p></div></div><button onClick={() => onDelete(item.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18} /></button></Card>))}</div>
    </div>
  );
};
const StudentManager: React.FC<{ users: User[], onUpdateStatus: (id: string, s: UserStatus) => void, onResetPassword: (id: string, p: string) => void }> = ({ users, onUpdateStatus, onResetPassword }) => {
   // ... (same as before)
  const students = users.filter(u => u.role === 'STUDENT');
  const handleReset = (id: string) => { const newPass = prompt("Enter new password for student:"); if (newPass) onResetPassword(id, newPass); };
  const getCleanPhone = (phone: string) => phone.replace(/\D/g, '');
  return (<div className="space-y-4">{students.map(s => (<Card key={s.id} className={`flex flex-col gap-3 border-l-4 ${s.status === UserStatus.APPROVED ? 'border-l-green-400' : s.status === UserStatus.PENDING ? 'border-l-yellow-400' : 'border-l-red-400'}`}><div className="flex justify-between items-center"><div className="flex items-center"><div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">{s.name[0]}</div><div className="ml-3"><p className="font-medium">{s.name}</p><p className="text-xs text-gray-500">{s.email}</p><p className="text-xs text-gray-400">{s.phone}</p></div></div><Badge color={s.status === UserStatus.APPROVED ? 'green' : s.status === UserStatus.PENDING ? 'yellow' : 'red'}>{s.status}</Badge></div><div className="flex justify-between items-center pt-2"><div className="flex gap-2">{s.phone && (<><a href={`https://wa.me/${getCleanPhone(s.phone)}`} target="_blank" rel="noreferrer" className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600" title="WhatsApp"><MessageSquare size={16} /></a><a href={`sms:${s.phone}`} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600" title="SMS"><Phone size={16} /></a></>)}</div><div className="flex gap-2">{s.status === UserStatus.PENDING && (<button onClick={() => onUpdateStatus(s.id, UserStatus.APPROVED)} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">Approve</button>)}{s.status !== UserStatus.BLOCKED ? (<button onClick={() => onUpdateStatus(s.id, UserStatus.BLOCKED)} className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold">Block</button>) : (<button onClick={() => onUpdateStatus(s.id, UserStatus.APPROVED)} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">Unblock</button>)}<button onClick={() => handleReset(s.id)} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold flex items-center"><RefreshCw size={12} className="mr-1"/> Reset</button></div></div></Card>))}</div>);
};
const QAManager: React.FC<{ qaItems: QAItem[], onAnswer: (id: string, a: string) => void, onToggle: (id: string, pub: boolean, app: boolean) => void, onDelete: (id: string) => void }> = ({ qaItems, onAnswer, onToggle, onDelete }) => {
    // ... (same as before)
  const [replyText, setReplyText] = useState<{[key:string]: string}>({});
  const handleReplyChange = (id: string, txt: string) => { setReplyText(prev => ({...prev, [id]: txt})); };
  const submitReply = (id: string) => { if (replyText[id]) { onAnswer(id, replyText[id]); setReplyText(prev => ({...prev, [id]: ''})); } };
  return (<div className="space-y-4">{qaItems.length === 0 && <p className="text-gray-400 text-center mt-10">No questions yet.</p>}{qaItems.map(q => (<Card key={q.id}><div className="flex justify-between items-start mb-2"><div><span className="text-xs font-bold text-gray-500 mr-2">{q.studentName}</span><Badge color="gray">{q.category}</Badge></div><div className="flex gap-2"><button onClick={() => onToggle(q.id, !q.isPublic, q.isApproved)} title="Toggle Public/Private">{q.isPublic ? <Eye size={16} className="text-primary-600"/> : <EyeOff size={16} className="text-gray-400"/>}</button>{q.isPublic && (<button onClick={() => onToggle(q.id, q.isPublic, !q.isApproved)} title={q.isApproved ? "Unpublish" : "Approve & Publish"}>{q.isApproved ? <Check size={16} className="text-green-600"/> : <X size={16} className="text-yellow-500"/>}</button>)}<button onClick={() => onDelete(q.id)} className="text-red-400"><Trash2 size={16}/></button></div></div><p className="font-medium text-gray-800 mb-2">{q.question}</p>{q.answer ? (<div className="bg-primary-50 p-2 rounded text-sm text-primary-800"><strong>Answer:</strong> {q.answer}</div>) : (<div className="flex gap-2 mt-2"><input className="flex-1 border rounded px-2 py-1 text-sm" placeholder="Write answer..." value={replyText[q.id] || ''} onChange={(e) => handleReplyChange(q.id, e.target.value)} /><Button className="w-auto py-1 px-3 text-xs" onClick={() => submitReply(q.id)}>Reply</Button></div>)}</Card>))}</div>);
};

const SettingsManager: React.FC<{ user: User, currentTheme: string, settings: AppSettings, onSetTheme: (t: string) => void, onUpdateCredentials: (id: string, e: string, p: string) => void, onUpdateSettings: (s: AppSettings) => void }> = ({ user, currentTheme, settings, onSetTheme, onUpdateCredentials, onUpdateSettings }) => {
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password || '');
  const [maxSize, setMaxSize] = useState(settings.maxUploadSizeMB);
  const [logoData, setLogoData] = useState<string | undefined>(settings.logoUrl);
  const [mainImageData, setMainImageData] = useState<string | undefined>(settings.mainImageUrl);
  const [font, setFont] = useState(settings.font || 'SANS');

  const handleUpdateCreds = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCredentials(user.id, email, password);
    alert("Credentials updated!");
  };

  const handleUpdateSettings = (e: React.FormEvent) => {
     e.preventDefault();
     onUpdateSettings({ ...settings, maxUploadSizeMB: maxSize, logoUrl: logoData, mainImageUrl: mainImageData, font });
     alert("Settings updated!");
  }

  const handleLogoSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => { if (e.target?.result) setLogoData(e.target.result as string); };
    reader.readAsDataURL(file);
  };

  const handleMainImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => { if (e.target?.result) setMainImageData(e.target.result as string); };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-bold text-gray-800 mb-4">App Theme</h3>
        <div className="grid grid-cols-2 gap-4">
           {Object.entries(THEMES).map(([key, theme]) => (
             <button 
                key={key}
                onClick={() => onSetTheme(key)}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${currentTheme === key ? 'border-primary-500 bg-primary-50' : 'border-transparent bg-gray-100'}`}
             >
                <div className="flex gap-2">
                   <div className="w-6 h-6 rounded-full" style={{ background: theme.primary[400] }}></div>
                   <div className="w-6 h-6 rounded-full" style={{ background: theme.secondary[300] }}></div>
                </div>
                <span className="text-sm font-medium text-gray-700">{theme.name}</span>
             </button>
           ))}
        </div>
      </Card>

      <Card>
         <h3 className="text-lg font-bold text-gray-800 mb-4">System Settings</h3>
         <form onSubmit={handleUpdateSettings}>
            <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">App Logo</label>
               <div className="flex items-center gap-4 mb-2">
                  {logoData && <img src={logoData} alt="Logo" className="w-16 h-16 object-contain border rounded-lg" />}
                  <FileUpload onFileSelect={handleLogoSelect} maxSizeMB={2} accept="image/*" />
               </div>
               {logoData && <button type="button" onClick={() => setLogoData(undefined)} className="text-red-500 text-xs underline mb-4">Remove Logo</button>}
            </div>

            <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Main Cover Image</label>
               <div className="flex items-center gap-4 mb-2">
                  {mainImageData && <img src={mainImageData} alt="Main" className="w-24 h-16 object-cover border rounded-lg" />}
                  <FileUpload onFileSelect={handleMainImageSelect} maxSizeMB={5} accept="image/*" />
               </div>
               {mainImageData && <button type="button" onClick={() => setMainImageData(undefined)} className="text-red-500 text-xs underline mb-4">Remove Image</button>}
            </div>
            
            <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">App Font</label>
               <select className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" value={font} onChange={e => setFont(e.target.value)}>
                  {Object.keys(FONTS).map(f => <option key={f} value={f}>{f}</option>)}
               </select>
            </div>

            <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Max Upload Size (MB)</label>
               <input 
                 type="number"
                 className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                 value={maxSize}
                 onChange={e => setMaxSize(parseInt(e.target.value) || 0)}
               />
            </div>
            <Button type="submit">Save Settings</Button>
         </form>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-gray-800 mb-4">My Credentials</h3>
        <form onSubmit={handleUpdateCreds}>
           <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} />
           <Input label="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" />
           <Button type="submit">Update</Button>
        </form>
      </Card>
    </div>
  );
};