import React, { useState, useRef, useEffect } from 'react';
import { User, ContentItem, LessonSlot, QAItem } from '../types';
import { Card, Button, Badge } from '../components/UIComponents';
import { Feed, ScheduleList } from '../components/BusinessComponents';
import { Calendar, MessageCircle, Image as ImageIcon, Send, Bot, HelpCircle, Lock, Globe, LogOut } from 'lucide-react';
import { chatWithYogaBot } from '../services/geminiService';

interface StudentViewProps {
  user: User;
  content: ContentItem[];
  schedule: LessonSlot[];
  qaItems: QAItem[];
  onBook: (slotId: string) => void;
  onCancel: (slotId: string) => void;
  onAddQuestion: (q: QAItem) => void;
  onLogout: () => void;
  logoUrl?: string;
  mainImageUrl?: string;
}

export const StudentView: React.FC<StudentViewProps> = ({ user, content, schedule, qaItems, onBook, onCancel, onAddQuestion, onLogout, logoUrl, mainImageUrl }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'schedule' | 'qa' | 'chat'>('feed');

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm z-10 sticky top-0 relative overflow-hidden">
        {mainImageUrl && (
          <div className="absolute inset-0 z-0">
             <img src={mainImageUrl} alt="Cover" className="w-full h-full object-cover opacity-20" />
             <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/95"></div>
          </div>
        )}
        <div className="p-4 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
             {logoUrl && <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain" />}
             <h1 className="text-xl font-bold text-primary-800">TipaShelSheket</h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-primary-200 overflow-hidden border-2 border-white shadow-sm">
                <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt="Profile" className="w-full h-full object-cover" />
             </div>
             <button onClick={onLogout} className="text-gray-500 hover:text-red-500">
                <LogOut size={20} />
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24 no-scrollbar">
        {activeTab === 'feed' && <Feed content={content} />}
        {activeTab === 'schedule' && (
          <ScheduleList 
            schedule={schedule} 
            userId={user.id} 
            userRole="STUDENT"
            onBook={onBook} 
            onCancel={onCancel} 
          />
        )}
        {activeTab === 'qa' && <QASection user={user} qaItems={qaItems} onAddQuestion={onAddQuestion} />}
        {activeTab === 'chat' && <AIChat user={user} />}
      </main>

      <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-2 grid grid-cols-4 gap-2 z-20">
        <NavButton active={activeTab === 'feed'} onClick={() => setActiveTab('feed')} icon={<ImageIcon size={20} />} label="Feed" />
        <NavButton active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} icon={<Calendar size={20} />} label="Book" />
        <NavButton active={activeTab === 'qa'} onClick={() => setActiveTab('qa')} icon={<HelpCircle size={20} />} label="Q&A" />
        <NavButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageCircle size={20} />} label="Bot" />
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
      active ? 'text-primary-700 bg-primary-50' : 'text-gray-400 hover:text-gray-600'
    }`}
  >
    {icon}
    <span className="text-[10px] mt-1 font-medium">{label}</span>
  </button>
);

const QASection: React.FC<{ user: User, qaItems: QAItem[], onAddQuestion: (q: QAItem) => void }> = ({ user, qaItems, onAddQuestion }) => {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<'General' | 'Pose' | 'Lesson'>('General');
  const [isPublic, setIsPublic] = useState(true);
  const [view, setView] = useState<'wall' | 'ask'>('wall');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    const newQ: QAItem = {
      id: Date.now().toString(),
      studentId: user.id,
      studentName: user.name,
      question,
      isPublic,
      isApproved: false,
      category,
      timestamp: Date.now()
    };
    onAddQuestion(newQ);
    setQuestion('');
    setView('wall');
    alert(isPublic ? "Question submitted! Waiting for teacher approval." : "Question sent to teacher privately.");
  };

  const publicItems = qaItems.filter(q => q.isPublic && q.isApproved).sort((a,b) => b.timestamp - a.timestamp);
  const myItems = qaItems.filter(q => q.studentId === user.id).sort((a,b) => b.timestamp - a.timestamp);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
         <h2 className="text-2xl font-light text-primary-900">Q&A</h2>
         <button onClick={() => setView(view === 'wall' ? 'ask' : 'wall')} className="text-primary-600 font-medium text-sm">
           {view === 'wall' ? '+ Ask Question' : 'View Wall'}
         </button>
      </div>

      {view === 'ask' && (
        <Card>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Topic</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
              >
                <option>General</option>
                <option>Pose</option>
                <option>Lesson</option>
              </select>
            </div>
            <div className="mb-4">
               <textarea 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:outline-none h-32 resize-none"
                  placeholder="Ask something..."
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  required
               />
            </div>
            <div className="flex items-center mb-4 gap-4">
              <label className="flex items-center text-sm text-gray-600">
                <input type="radio" checked={isPublic} onChange={() => setIsPublic(true)} className="mr-2" />
                <Globe size={16} className="mr-1" /> Public Wall
              </label>
              <label className="flex items-center text-sm text-gray-600">
                <input type="radio" checked={!isPublic} onChange={() => setIsPublic(false)} className="mr-2" />
                <Lock size={16} className="mr-1" /> Private
              </label>
            </div>
            <Button type="submit">Submit Question</Button>
          </form>
        </Card>
      )}

      {view === 'wall' && (
        <div className="space-y-4">
          <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
            <Badge color="green">Public Wall</Badge>
          </div>
          
          {/* My Private Pending/Answered */}
          {myItems.filter(q => !q.isPublic || !q.isApproved).length > 0 && (
             <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">My Pending / Private</h3>
                {myItems.filter(q => !q.isPublic || !q.isApproved).map(q => (
                  <Card key={q.id} className="mb-2 bg-gray-50">
                    <div className="flex justify-between">
                       <span className="text-xs font-bold text-gray-500">{q.category}</span>
                       <span className="text-xs text-gray-400">{!q.isPublic ? 'Private' : 'Pending Approval'}</span>
                    </div>
                    <p className="font-medium text-gray-800 mt-1">{q.question}</p>
                    {q.answer ? (
                      <div className="mt-3 bg-white p-2 rounded border border-gray-100">
                        <p className="text-sm text-primary-700 font-medium">Teacher: {q.answer}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic mt-2">Waiting for answer...</p>
                    )}
                  </Card>
                ))}
             </div>
          )}

          {/* Public Wall */}
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Community Questions</h3>
          {publicItems.length === 0 ? <p className="text-gray-400 text-center">No questions yet.</p> : publicItems.map(q => (
            <Card key={q.id}>
               <div className="flex justify-between items-center mb-2">
                 <div className="flex items-center">
                   <div className="w-6 h-6 rounded-full bg-secondary-200 flex items-center justify-center text-[10px] font-bold mr-2">
                     {q.studentName[0]}
                   </div>
                   <span className="text-xs text-gray-500">{q.studentName}</span>
                 </div>
                 <Badge color="gray">{q.category}</Badge>
               </div>
               <p className="font-medium text-gray-800">{q.question}</p>
               {q.answer && (
                 <div className="mt-3 pl-3 border-l-2 border-primary-300">
                    <p className="text-xs text-primary-600 font-bold mb-1">Teacher Answered:</p>
                    <p className="text-sm text-gray-700">{q.answer}</p>
                 </div>
               )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const AIChat: React.FC<{ user: User }> = ({ user }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: `Namaste ${user.name}. I am your yoga guide. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role, parts: m.text }));
    const response = await chatWithYogaBot(history, userMsg);
    
    setMessages(prev => [...prev, { role: 'model', text: response || "I'm meditating... try again." }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <h2 className="text-2xl font-light text-primary-900 mb-4">Yoga Assistant</h2>
      <div className="flex-1 overflow-y-auto space-y-4 p-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              m.role === 'user' 
                ? 'bg-primary-600 text-white rounded-br-none' 
                : 'bg-white border border-gray-100 text-gray-700 rounded-bl-none shadow-sm'
            }`}>
              {m.role === 'model' && <Bot size={16} className="mb-1 text-primary-500" />}
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
               <div className="flex space-x-1">
                 <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce delay-75"></div>
                 <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce delay-150"></div>
               </div>
             </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="mt-2 flex gap-2">
        <input 
          type="text" 
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-primary-500"
          placeholder="Ask about a pose..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="bg-primary-600 text-white p-2 rounded-xl hover:bg-primary-700 disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};