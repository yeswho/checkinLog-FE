import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  useDisclosure,
  Spinner,
  Input,
  Tooltip,
  Badge
} from '@nextui-org/react';
import { ChevronLeftIcon, ChevronRightIcon } from './ChevronIcons';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { useCreateBooking } from '../../hooks/useBooking';
import axiosClient from '../../api/client';
import AddBooking from '../../components/Modals/AddBooking/AddBooking';
import { RoomAvailability, AddBookingProps } from '../../types/booking';

const CalendarBooking = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState<RoomAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomAvailability | null>(null);
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [multiSelectDates, setMultiSelectDates] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState<'sequential' | 'multi'>('sequential');
  const [isHolding, setIsHolding] = useState(false);
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const { isOpen: isBookingModalOpen, onOpen: onBookingModalOpen, onClose: onBookingModalClose } = useDisclosure();
  const createBooking = useCreateBooking();

  useEffect(() => {
    fetchAvailability();
  }, [currentDate]);

  // Add keyboard event listener for Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        clearSelections();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const response = await axiosClient.get<RoomAvailability[]>(`/bookings/room-availability/${year}/${month}`);
      setAvailability(response.data);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'next' 
      ? addMonths(currentDate, 1) 
      : subMonths(currentDate, 1)
    );
    // Clear selections when changing months
    clearSelections();
  };

  const clearSelections = () => {
    setSelectedDates({ start: null, end: null });
    setMultiSelectDates(new Set());
    setSelectedRoom(null);
    setSelectionMode('sequential');
  };

  const handleDateSelect = (roomId: number, day: number, event: React.MouseEvent) => {
    const room = availability.find(r => r.id === roomId);
    if (!room || !room.availability || !room.availability[day - 1] || !room.availability[day - 1].available) return;

    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) return; // Prevent selection of past dates

    const dateString = `${roomId}-${day}`;

    // Multi-select mode (Ctrl/Cmd + Click)
    if (event.ctrlKey || event.metaKey) {
      setSelectionMode('multi');
      setSelectedRoom(room);
      const newMultiSelect = new Set(multiSelectDates);
      
      if (newMultiSelect.has(dateString)) {
        newMultiSelect.delete(dateString);
      } else {
        newMultiSelect.add(dateString);
      }
      setMultiSelectDates(newMultiSelect);
      return;
    }

    // Sequential selection mode
    setSelectionMode('sequential');
    setMultiSelectDates(new Set());

    if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
      // Starting new selection
      setSelectedDates({ start: date, end: null });
      setSelectedRoom(room);
    } else if (selectedRoom?.id === roomId) {
      // Completing selection for the same room
      if (date > selectedDates.start) {
        setSelectedDates({ ...selectedDates, end: date });
        onBookingModalOpen();
      } else if (date < selectedDates.start) {
        setSelectedDates({ start: date, end: selectedDates.start });
        onBookingModalOpen();
      }
    } else {
      // If room changes during selection, start new selection with the new room
      setSelectedDates({ start: date, end: null });
      setSelectedRoom(room);
    }
  };

  const handleMouseDown = (roomId: number, day: number, event: React.MouseEvent) => {
    const timer = setTimeout(() => {
      setIsHolding(true);
      // Handle hold booking logic here
      handleQuickBook(roomId, day);
    }, 1000); // 1 second hold
    setHoldTimer(timer);
  };

  const handleMouseUp = () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
    setIsHolding(false);
  };

  const handleQuickBook = (roomId: number, day: number) => {
    const room = availability.find(r => r.id === roomId);
    if (!room) return;

    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    setSelectedRoom(room);
    setSelectedDates({ start: date, end: nextDay });
    onBookingModalOpen();
  };

  const handleMultiSelectBooking = () => {
    if (multiSelectDates.size === 0 || !selectedRoom) return;

    // Determine the earliest check-in and latest check-out from multiSelectDates
    const dates = Array.from(multiSelectDates)
      .map(dateString => {
        const [roomId, day] = dateString.split('-');
        return new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(day));
      })
      .sort((a, b) => a.getTime() - b.getTime());

    const earliestCheckIn = dates[0];
    const latestCheckOut = new Date(dates[dates.length - 1]);
    latestCheckOut.setDate(latestCheckOut.getDate() + 1); // Extend to include the last selected day

    setSelectedDates({ start: earliestCheckIn, end: latestCheckOut });
    onBookingModalOpen();
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getWeekdayName = (day: Date) => format(day, 'EEE');

  return (
    <>
      <div className="flex flex-col h-screen bg-slate-900">
          {/* Header */}
          <div className="bg-slate-800 text-slate-100 p-6 shadow-2xl border-b border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold text-slate-100">Booking Calendar</h1>
                <Badge color="primary" variant="flat" className="text-sm bg-indigo-600/20 text-indigo-300 border-indigo-600/30">
                  {availability.length} Rooms Available
                </Badge>
              </div>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between">
              <Button 
                variant="light" 
                className="text-slate-300 hover:bg-slate-700 hover:text-slate-100 border-slate-600"
                onPress={() => navigateMonth('prev')}
              >
                <ChevronLeftIcon className="w-5 h-5" />
                Previous
              </Button>
              <h2 className="text-2xl font-semibold text-slate-100">{format(currentDate, 'MMMM yyyy')}</h2>
              <Button 
                variant="light" 
                className="text-slate-300 hover:bg-slate-700 hover:text-slate-100 border-slate-600"
                onPress={() => navigateMonth('next')}
              >
                Next
                <ChevronRightIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Instructions Panel */}
          {/* <div className="bg-slate-800 border-b border-slate-700 p-4">
            <div className="max-w-6xl mx-auto">
              <h3 className="font-semibold text-slate-200 mb-2">📋 How to Use:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-emerald-500 rounded"></span>
                  <span><strong>Click once</strong> to start selection, <strong>click again</strong> to complete date range</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-cyan-500 rounded"></span>
                  <span><strong>Ctrl+Click</strong> to select multiple non-sequential dates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-purple-500 rounded"></span>
                  <span><strong>Hold (1s)</strong> for quick single-night booking</span>
                </div>
              </div>
            </div>
          </div> */}

          {/* Legend */}
          <div className="bg-slate-800 border-b border-slate-700 p-3">
            <div className="max-w-6xl mx-auto flex items-center justify-center space-x-6 text-sm text-slate-300">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-emerald-500/20 border border-emerald-500 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500/20 border border-red-500 rounded"></div>
                <span>Occupied</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-indigo-500 rounded"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-indigo-300/40 border-2 border-indigo-400 rounded"></div>
                <span>Today</span>
              </div>
            </div>
          </div>

          {/* Selection Status */}
          {(selectedRoom || multiSelectDates.size > 0) && (
            <div className="bg-slate-700/50 border-b border-slate-600 p-4 backdrop-blur-sm">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div>
                  {selectionMode === 'sequential' && selectedRoom && (
                    <span className="text-slate-200">
                      Selected: <strong className="text-slate-100">{selectedRoom.name}</strong>
                      {selectedDates.start && selectedDates.end ? (
                        <span className="text-indigo-300"> • {format(selectedDates.start, 'MMM d')} - {format(selectedDates.end, 'MMM d')}</span>
                      ) : selectedDates.start ? (
                        <span className="text-indigo-300"> • {format(selectedDates.start, 'MMM d')} (select end date)</span>
                      ) : null}
                    </span>
                  )}
                  {selectionMode === 'multi' && selectedRoom && (
                    <span className="text-slate-200">
                      Multi-select: <strong className="text-slate-100">{selectedRoom.name}</strong> <span className="text-indigo-300">• {multiSelectDates.size} dates selected</span>
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  {multiSelectDates.size > 0 && (
                    <Button size="sm" color="primary" className="bg-indigo-600 hover:bg-indigo-700" onPress={handleMultiSelectBooking}>
                      Book Selected Dates
                    </Button>
                  )}
                  <Button size="sm" variant="light" className="text-slate-300 hover:bg-slate-600" onPress={clearSelections}>
                    Clear Selection
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Calendar Content */}
          <div className="flex-1 overflow-auto bg-slate-900">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Spinner size="lg" color="primary" className="text-indigo-500" />
                  <p className="mt-4 text-slate-400">Loading room availability...</p>
                </div>
              </div>
            ) : (
              <div className="max-w-full mx-auto p-4 bg-slate-900">
                {/* Calendar Header */}
                <div className="sticky top-0 bg-slate-800 border-b border-slate-700 shadow-lg z-10">
                  <div className="flex">
                    <div className="w-80 px-6 py-4 bg-slate-800 font-semibold border-r border-slate-700 text-slate-200">
                      Room Details
                    </div>
                    {daysInMonth.map(day => (
                      <div key={day.toISOString()} className="flex-1 min-w-[40px] text-center py-4 border-r border-slate-700 bg-slate-800">
                        <div className="font-semibold text-slate-200">{format(day, 'd')}</div>
                        <div className="text-xs text-slate-400 mt-1">{getWeekdayName(day)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Room Rows */}
                <div className="bg-slate-900">
                  {availability.map((room: RoomAvailability, roomIndex) => (
                    <div key={room.id} className={`flex border-b border-slate-700 hover:bg-slate-800/50 transition-colors ${roomIndex % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-900'}`}>
                      <div className="w-80 px-6 py-4 border-r border-slate-700 bg-slate-800/50 sticky left-0 z-5">
                        <div className="font-semibold text-lg text-slate-100">{room.name}</div>
                        <div className="text-sm text-slate-300 mt-1">
                          <span className="inline-block bg-indigo-600/20 text-indigo-300 px-2 py-1 rounded text-xs mr-2 border border-indigo-600/30">
                            {room.roomType}
                          </span>
                          <span className="text-slate-400">Floor {room.floor}</span>
                        </div>
                        <div className="text-lg font-bold text-emerald-400 mt-2">रु. {room.rate}/night</div>
                        <div className="text-xs text-slate-400 mt-1">
                          Capacity: {room.capacity || 'N/A'} guests
                        </div>
                      </div>
                      
                      {daysInMonth.map(day => {
                        const dayNumber = day.getDate();
                        const dayAvailability = room.availability[dayNumber - 1];
                        const dateString = `${room.id}-${dayNumber}`;
                        
                        const isSelected = selectionMode === 'sequential' && selectedRoom?.id === room.id && 
                          selectedDates.start && 
                          selectedDates.end &&
                          day >= selectedDates.start && 
                          day <= selectedDates.end;
                        
                        const isSelecting = selectionMode === 'sequential' && selectedRoom?.id === room.id && 
                          selectedDates.start && 
                          !selectedDates.end && 
                          day.getTime() === selectedDates.start.getTime();
                        
                        const isMultiSelected = selectionMode === 'multi' && multiSelectDates.has(dateString);
                        
                        // Safely access dayAvailability.available
                        const isDayAvailable = dayAvailability?.available ?? false;

                        // Placeholder for a disabled room (e.g., for maintenance, not just booked)
                        // In a real application, this would come from the backend, e.g., dayAvailability?.status === 'disabled'
                        const isRoomPermanentlyUnavailable = dayAvailability?.isPermanentlyDisabled ?? false; 

                        return (
                          <Tooltip
                            key={day.toISOString()}
                            content={
                              <div className="p-2 bg-slate-800 border border-slate-600 rounded-lg">
                                <div className="font-semibold text-slate-100">{room.name}</div>
                                <div className="text-slate-300">{format(day, 'EEEE, MMMM d, yyyy')}</div>
                                <div className={`text-sm ${isDayAvailable ? 'text-emerald-400' : (dayAvailability?.isPermanentlyDisabled ?? false) ? 'text-slate-500' : 'text-red-400'}`}>
                                  {isDayAvailable ? 'Available' : 'Occupied'}
                                </div>
                                {isDayAvailable && !(dayAvailability?.isPermanentlyDisabled ?? false) && (
                                  <div className="text-xs mt-1 text-slate-400">
                                    Click to select • Ctrl+Click for multi-select • Hold for quick book
                                  </div>
                                )}
                              </div>
                            }
                            placement="top"
                          >
                            <div
                              className={`flex-1 min-w-[40px] h-16 flex items-center justify-center border-r border-slate-700 cursor-pointer relative transition-all duration-200 transform hover:scale-105
                                ${isToday(day) ? 'ring-2 ring-indigo-400 ring-inset' : ''}
                                ${(dayAvailability?.isPermanentlyDisabled ?? false)
                                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                  : isDayAvailable
                                    ? isSelected || isMultiSelected
                                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                                      : isSelecting
                                        ? 'bg-indigo-500/70 text-white shadow-md shadow-indigo-500/20' 
                                        : 'bg-emerald-600/10 hover:bg-emerald-600/20 text-slate-200 border-emerald-500/30 hover:border-emerald-500/50' 
                                    : 'bg-red-600/10 text-red-300 cursor-not-allowed border-red-500/30'}
                                ${day < new Date(new Date().setHours(0, 0, 0, 0)) && !(dayAvailability?.isPermanentlyDisabled ?? false) ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : ''}`}
                              onClick={(e) => isDayAvailable && handleDateSelect(room.id, dayNumber, e)}
                              onMouseDown={(e) => isDayAvailable && handleMouseDown(room.id, dayNumber, e)}
                              onMouseUp={handleMouseUp}
                              onMouseLeave={handleMouseUp}
                            >
                              <span className="font-semibold">{dayNumber}</span>
                              {isToday(day) && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full shadow-lg"></div>
                              )}
                              {(isSelected || isMultiSelected) && !(dayAvailability?.isPermanentlyDisabled ?? false) && (
                                <div className="absolute inset-0 bg-indigo-500/30 rounded-sm"></div>
                              )}
                            </div>
                          </Tooltip>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-800 border-t border-slate-700 p-4">
            <div className="max-w-6xl mx-auto text-center text-sm text-slate-400">
              <p>Need help? Contact front desk at +977-1-XXXXXXX | Last updated: {format(new Date(), 'MMM d, yyyy HH:mm')}</p>
            </div>
          </div>
        </div>
        
        {/* AddBooking Modal */}
        <AddBooking
          isOpen={isBookingModalOpen}
          onClose={onBookingModalClose}
          room={selectedRoom}
          checkIn={selectedDates.start ? format(selectedDates.start as Date, 'yyyy-MM-dd') : ''}
          checkOut={selectedDates.end ? format(selectedDates.end as Date, 'yyyy-MM-dd') : undefined}
          multiSelectDates={selectionMode === 'multi' ? Array.from(multiSelectDates) : undefined}
          onSubmitSuccess={() => {
            onBookingModalClose();
            clearSelections();
            fetchAvailability();
          }}
        />
    </>
  );
};

export default CalendarBooking;