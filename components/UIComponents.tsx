import React, { useState, useRef, useEffect } from 'react';
import { Loader2, X, Bell, UploadCloud, Play, Pause, Square, SkipBack, SkipForward } from 'lucide-react';
import { Notification } from '../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', isLoading, className = '', ...props 
}) => {
  const baseStyles = "w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 active:scale-95 flex justify-center items-center";
  const variants = {
    primary: "bg-primary-600 text-white shadow-lg shadow-primary-200 hover:bg-primary-700",
    secondary: "bg-secondary-500 text-white hover:bg-secondary-600",
    outline: "border-2 border-primary-600 text-primary-700 hover:bg-primary-50",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">{label}</label>
    <input 
      className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all ${className}`}
      {...props} 
    />
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 ${className}`}>
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: 'green' | 'yellow' | 'red' | 'gray' }> = ({ children, color = 'green' }) => {
  const colors = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
};

export const NotificationList: React.FC<{ notifications: Notification[]; onRead: (id: string) => void }> = ({ notifications, onRead }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-80 space-y-2 pointer-events-none">
      {notifications.map(n => (
        <div key={n.id} className="bg-white p-3 rounded-lg shadow-lg border-l-4 border-secondary-500 pointer-events-auto flex justify-between animate-in fade-in slide-in-from-right-4">
          <div className="flex items-start">
             <Bell size={16} className="text-secondary-500 mt-1 mr-2 shrink-0" />
             <p className="text-sm text-gray-700">{n.message}</p>
          </div>
          <button onClick={() => onRead(n.id)} className="text-gray-400 hover:text-gray-600 ml-2">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title?: string }> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  maxSizeMB: number;
  accept: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, maxSizeMB, accept }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const validateAndPassFile = (file: File) => {
    setError(null);
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds limit of ${maxSizeMB}MB.`);
      return;
    }
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPassFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndPassFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
        isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        ref={fileInputRef}
        type="file" 
        className="hidden" 
        accept={accept} 
        onChange={handleChange} 
      />
      <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <UploadCloud size={32} />
      </div>
      <p className="font-medium text-gray-700">Click or drag file to upload</p>
      <p className="text-xs text-gray-500 mt-1">Max size: {maxSizeMB}MB</p>
      {error && <p className="text-sm text-red-500 mt-2 font-medium">{error}</p>}
    </div>
  );
};

export const CustomVideoPlayer: React.FC<{ src: string }> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = time;
      setProgress(parseFloat(e.target.value));
    }
  };

  const skip = (seconds: number) => {
    if(videoRef.current) {
        videoRef.current.currentTime += seconds;
    }
  }

  return (
    <div className="relative rounded-xl overflow-hidden bg-black group">
      <video 
        ref={videoRef}
        src={src}
        className="w-full h-auto max-h-[70vh] object-contain mx-auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        playsInline
      />
      
      {/* Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
        {/* Timeline */}
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={progress} 
          onChange={handleSeek}
          className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:rounded-full"
        />
        
        <div className="flex justify-center items-center gap-4 text-white">
          <button onClick={() => skip(-10)} className="hover:text-primary-400"><SkipBack size={20}/></button>
          
          <button onClick={togglePlay} className="p-2 bg-white/20 rounded-full hover:bg-white/30 backdrop-blur-sm">
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          
          <button onClick={handleStop} className="hover:text-primary-400">
             <Square size={20} fill="currentColor" />
          </button>
          
           <button onClick={() => skip(10)} className="hover:text-primary-400"><SkipForward size={20}/></button>
        </div>
      </div>

      {/* Center Play Button (Visible when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Play size={32} className="text-white ml-1" fill="currentColor" />
          </div>
        </div>
      )}
    </div>
  );
};