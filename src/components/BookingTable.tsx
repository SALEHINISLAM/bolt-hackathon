'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Video, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Booking {
  _id: string;
  dateTime: Date | string;
  duration: number;
  status: 'pending' | 'confirmed';
  totalAmount: number;
  coach: {
    _id: string;
    name: string;
    image: string;
  };
  videoLink?: string | null;
}

interface BookingTableProps {
  bookings: Booking[];
  loading?: boolean;
}

const BookingTable: React.FC<BookingTableProps> = ({ bookings, loading = false }) => {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-blue-800" />
            Upcoming Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-blue-800" />
            Upcoming Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No upcoming bookings
            </h3>
            <p className="text-gray-600 mb-6">
              Book a session with one of our expert coaches to get started.
            </p>
            <Button className="bg-blue-800 hover:bg-blue-900">
              Browse Coaches
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-blue-800" />
          Upcoming Bookings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
                {/* Left side - Date, Time, Coach */}
                <div className="flex items-center space-x-4">
                  <Image
                    src={booking.coach.image}
                    alt={booking.coach.name}
                    className="w-12 h-12 rounded-full object-cover"
                    width={48}
                    height={48}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{booking.coach.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(booking.dateTime)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(booking.dateTime)}</span>
                      </div>
                      <span>{booking.duration} min</span>
                    </div>
                  </div>
                </div>

                {/* Right side - Status and Actions */}
                <div className="flex items-center space-x-3">
                  <Badge className={`${getStatusColor(booking.status)} flex items-center space-x-1`}>
                    {getStatusIcon(booking.status)}
                    <span className="capitalize">{booking.status}</span>
                  </Badge>
                  
                  {booking.videoLink && booking.status === 'confirmed' && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => window.open(booking.videoLink!, '_blank')}
                    >
                      <Video className="w-4 h-4 mr-1" />
                      Join Call
                    </Button>
                  )}
                  
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      ${booking.totalAmount}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingTable;