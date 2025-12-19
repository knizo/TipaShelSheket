import React, { useState } from 'react';
import { Button, Input, Card } from '../components/UIComponents';
import { Flower, ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  onLogin: (email: string, pass: string) => void;
  onRegister: (name: string, email: string, pass: string, phone: string) => void;
  onForgotPassword: (email: string) => void;
  logoUrl?: string;
  mainImageUrl?: string;
  showHint?: boolean;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister, onForgotPassword, logoUrl, mainImageUrl, showHint = true }) => {
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const validatePhone = (p: string) => {
    const digits = p.replace(/\D/g, '');
    const validChars = /^[\d+\-\s()]+$/.test(p);
    return validChars && digits.length >= 7;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (view === 'login') {
      onLogin(email, password);
    } else if (view === 'register') {
      if (!name) return alert("Name is required");
      if (!validatePhone(phone)) return alert("Invalid phone format. Please enter a valid phone number (at least 7 digits).");
      onRegister(name, email, password, phone);
      setView('login');
    } else {
      onForgotPassword(email);
      setView('login');
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor or Main Image */}
      {mainImageUrl ? (
        <>
          <div 
             className="absolute inset-0 bg-cover bg-center z-0" 
             style={{ backgroundImage: `url(${mainImageUrl})` }} 
          />
          <div className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm z-0" />
        </>
      ) : (
        <>
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary-200 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-secondary-300 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        </>
      )}

      <div className="mb-8 text-center z-10 relative">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto mb-4 text-primary-600 overflow-hidden">
           {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" /> : <Flower size={48} />}
        </div>
        <h1 className={`text-3xl font-bold tracking-tight ${mainImageUrl ? 'text-white drop-shadow-md' : 'text-primary-900'}`}>TipaShelSheket</h1>
        <p className={`mt-2 ${mainImageUrl ? 'text-white/90 drop-shadow' : 'text-primary-600'}`}>Find your inner peace</p>
      </div>

      <Card className="w-full max-w-sm backdrop-blur-sm bg-white/90 shadow-xl border-primary-100 z-10 relative">
        {view !== 'forgot' && (
          <div className="mb-6 flex justify-center border-b border-gray-100 pb-4">
            <button 
              className={`px-4 py-2 text-sm font-medium ${view === 'login' ? 'text-primary-700 border-b-2 border-primary-600' : 'text-gray-400'}`}
              onClick={() => setView('login')}
            >
              Login
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${view === 'register' ? 'text-primary-700 border-b-2 border-primary-600' : 'text-gray-400'}`}
              onClick={() => setView('register')}
            >
              Register
            </button>
          </div>
        )}

        {view === 'forgot' && (
           <button onClick={() => setView('login')} className="flex items-center text-sm text-gray-500 mb-4 hover:text-primary-600">
             <ArrowLeft size={16} className="mr-1" /> Back to Login
           </button>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {view === 'register' && (
            <>
              <Input 
                label="Full Name" 
                placeholder="Dana Cohen" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required
              />
              <Input 
                label="Phone" 
                placeholder="+972-50-1234567" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                required
              />
            </>
          )}
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
          {view !== 'forgot' && (
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          )}
          
          <Button type="submit" className="mt-4">
            {view === 'login' ? 'Sign In' : view === 'register' ? 'Create Account' : 'Reset Password'}
          </Button>
        </form>

        {view === 'login' && (
           <div className="mt-4 text-center">
             <button onClick={() => setView('forgot')} className="text-sm text-primary-600 hover:underline">
               Forgot password?
             </button>
             {showHint && (
               <p className="text-xs text-gray-400 mt-4">
                   Teacher: admin@yoga.com / admin
               </p>
             )}
           </div>
        )}
      </Card>
    </div>
  );
};