import React from 'react';
import { ContentItem, LessonSlot, ContentType, BookingStatus } from '../types';
import { Card, Button, CustomVideoPlayer, Badge } from './UIComponents';
import { Clock, FileText, Users, Edit, List } from 'lucide-react';

export const Feed: React.FC<{ content: ContentItem[] }> = ({ content }) => {
  const sortedContent = [...content].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-light text-primary-900 mb-4">Studio Feed</h2>
      {sortedContent.length === 0 ? (
        <div className="text-center text-gray-400 py-10">No content yet. Breathe.</div>
      ) : (
        sortedContent.map(item => (
          <Card key={item.id} className="overflow-hidden border-0 shadow-md">
            {item.url && (
              <div className="bg-gray-100 -mx-4 -mt-4 mb-4 relative">
                {item.type === ContentType.VIDEO ? (
                  <CustomVideoPlayer src={item.url} />
                ) : (
                  <img src={item.url} alt={item.title} className="w-full h-auto object-cover max-h-96" />
                )}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-bold text-primary-800 uppercase shadow-sm">
                  {item.type}
                </div>
              </div>
            )}
            {!item.url && (
               <div className="flex items-center text-primary-600 mb-2">
                 <FileText size={20} className="mr-2" />
                 <span className="text-xs uppercase font-bold tracking-wider">Thought</span>
               </div>
            )}
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h3>
            <p className="text-gray-600 leading-relaxed text-sm">{item.description}</p>
            <div className="mt-3 text-xs text-gray-400 text-right">
              {new Date(item.timestamp).toLocaleDateString()}
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

interface ScheduleListProps {
  schedule: LessonSlot[];
  userId: string;
  userRole: 'TEACHER' | 'STUDENT';
  onBook?: (id: string) => void;
  onCancel?: (id: string) => void;
  onDeleteSlot?: (id: string) => void;
  onEditSlot?: (slot: LessonSlot) => void;
  onManageBookings?: (slot: LessonSlot) => void;
}

export const ScheduleList: React.FC<ScheduleListProps> = ({ schedule, userId, userRole, onBook, onCancel, onDeleteSlot, onEditSlot, onManageBookings }) => {
  // Check if current user has a booking
  const getBooking = (slot: LessonSlot) => slot.bookings.find(b => b.studentId === userId);
  
  // Logic for how many spots are taken (Approved + Pending usually count against cap until rejected)
  const getOccupiedCount = (slot: LessonSlot) => slot.bookings.filter(b => b.status !== BookingStatus.REJECTED).length;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-light text-primary-900 mb-4">{userRole === 'TEACHER' ? 'Upcoming Classes' : 'Book a Class'}</h2>
      <div className="grid gap-3">
        {schedule.length === 0 && <p className="text-gray-400">No classes scheduled.</p>}
        {schedule.map(slot => {
          const userBooking = userRole === 'STUDENT' ? getBooking(slot) : undefined;
          const isBooked = !!userBooking;
          const occupied = getOccupiedCount(slot);
          const full = occupied >= slot.maxStudents;
          
          const statusColor = userBooking?.status === BookingStatus.APPROVED ? 'green' : 
                              userBooking?.status === BookingStatus.REJECTED ? 'red' : 'yellow';

          return (
            <Card key={slot.id} className={`flex flex-col border-l-4 ${isBooked ? 'border-l-primary-500 bg-primary-50' : 'border-l-secondary-400'}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{slot.day}</h3>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <Clock size={14} className="mr-1" />
                    {slot.time} ({slot.durationMin} min)
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className={`text-xs font-bold px-2 py-1 rounded-md ${
                    full && !isBooked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {occupied} / {slot.maxStudents} Spots
                  </div>
                  {isBooked && (
                     <Badge color={statusColor}>
                        {userBooking?.status}
                     </Badge>
                  )}
                </div>
              </div>
              
              <div className="mt-2 flex justify-end gap-2">
                {userRole === 'STUDENT' && onBook && onCancel && (
                   <>
                    {isBooked ? (
                      <Button variant="outline" className="py-2 text-sm h-10 border-red-200 text-red-500 hover:bg-red-50" onClick={() => onCancel(slot.id)}>
                        Cancel Booking
                      </Button>
                    ) : (
                      <Button 
                        className="py-2 text-sm h-10" 
                        disabled={full} 
                        onClick={() => onBook(slot.id)}
                        variant={full ? 'secondary' : 'primary'}
                      >
                        {full ? 'Class Full' : 'Book Now'}
                      </Button>
                    )}
                   </>
                )}
                {userRole === 'TEACHER' && (
                  <div className="flex gap-2 w-full">
                     <Button variant="outline" className="py-1 px-2 text-xs h-8 flex-1" onClick={() => onManageBookings && onManageBookings(slot)}>
                        <Users size={14} className="mr-1"/> Students ({slot.bookings.length})
                     </Button>
                     <Button variant="outline" className="py-1 px-2 text-xs h-8 flex-1" onClick={() => onEditSlot && onEditSlot(slot)}>
                        <Edit size={14} className="mr-1"/> Edit
                     </Button>
                     {onDeleteSlot && (
                      <Button variant="danger" className="py-1 px-2 text-xs h-8 w-auto" onClick={() => onDeleteSlot(slot.id)}>
                        X
                      </Button>
                     )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};