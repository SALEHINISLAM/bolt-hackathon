'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import { Calendar, Clock, Plus, X, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import 'react-datepicker/dist/react-datepicker.css';

interface AvailabilitySlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
}

interface AvailabilityCalendarProps {
  initialSlots?: AvailabilitySlot[];
  onSave?: (slots: AvailabilitySlot[]) => void;
  loading?: boolean;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  initialSlots = [],
  onSave,
  loading = false
}) => {
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>(initialSlots);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [isEditing, setIsEditing] = useState(false);

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  const addAvailabilitySlot = () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    if (startTime >= endTime) {
      toast.error('End time must be after start time');
      return;
    }

    const newSlot: AvailabilitySlot = {
      id: Date.now().toString(),
      date: selectedDate,
      startTime,
      endTime
    };

    setAvailabilitySlots(prev => [...prev, newSlot]);
    setSelectedDate(null);
    setStartTime('09:00');
    setEndTime('17:00');
    toast.success('Availability slot added');
  };

  const removeAvailabilitySlot = (id: string) => {
    setAvailabilitySlots(prev => prev.filter(slot => slot.id !== id));
    toast.success('Availability slot removed');
  };

  const handleSave = () => {
    if (onSave) {
      onSave(availabilitySlots);
    }
    setIsEditing(false);
    toast.success('Availability updated successfully');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getUpcomingSlots = () => {
    const now = new Date();
    return availabilitySlots
      .filter(slot => slot.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-blue-800" />
            Availability Management
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
            size="sm"
            className={isEditing ? "" : "bg-blue-800 hover:bg-blue-900"}
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1" />
                Edit
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {/* Add New Slot */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-gray-900">Add Availability Slot</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={setSelectedDate}
                    minDate={new Date()}
                    maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)} // 90 days from now
                    dateFormat="MMM d, yyyy"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholderText="Select date"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                onClick={addAvailabilitySlot}
                className="bg-green-600 hover:bg-green-700"
                disabled={!selectedDate}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Slot
              </Button>
            </div>

            {/* Current Slots */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Current Availability</h3>
              {availabilitySlots.length === 0 ? (
                <p className="text-gray-600 text-center py-4">
                  No availability slots set. Add some to let clients book sessions.
                </p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availabilitySlots
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{formatDate(slot.date)}</span>
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                        <Button
                          onClick={() => removeAvailabilitySlot(slot.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-800 hover:bg-blue-900"
                disabled={loading}
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Upcoming Availability</h3>
            {getUpcomingSlots().length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  No upcoming availability slots set.
                </p>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-800 hover:bg-blue-900"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Availability
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {getUpcomingSlots().map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-blue-800" />
                      <span className="font-medium">{formatDate(slot.date)}</span>
                      <Badge variant="outline" className="text-blue-800 border-blue-800">
                        {slot.startTime} - {slot.endTime}
                      </Badge>
                    </div>
                  </div>
                ))}
                {availabilitySlots.length > 5 && (
                  <p className="text-sm text-gray-600 text-center pt-2">
                    And {availabilitySlots.length - 5} more slots...
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailabilityCalendar;