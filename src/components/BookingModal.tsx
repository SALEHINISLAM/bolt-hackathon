'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import DatePicker from 'react-datepicker';
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  X, 
  Loader2, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import "react-datepicker/dist/react-datepicker.css";

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || '');

interface Coach {
  _id: string;
  name: string;
  hourlyRate: number;
  image: string;
}

interface BookingModalProps {
  coach: Coach;
  isOpen: boolean;
  onClose: () => void;
}

interface BookingFormProps {
  coach: Coach;
  onClose: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ coach, onClose }) => {
  const { data: session } = useSession();
  const stripe = useStripe();
  const elements = useElements();
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string>('60');
  const [isLoading, setIsLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [bookedSlots, setBookedSlots] = useState<any[]>([]);

  useEffect(() => {
    fetchBookedSlots();
  }, [coach._id]);

  const fetchBookedSlots = async () => {
    try {
      const response = await fetch(`/api/bookings?coachId=${coach._id}`);
      if (response.ok) {
        const data = await response.json();
        setBookedSlots(data.bookedSlots);
      }
    } catch (error) {
      console.error('Error fetching booked slots:', error);
    }
  };

  const calculateTotal = () => {
    const duration = parseInt(selectedDuration);
    return (coach.hourlyRate * (duration / 60)).toFixed(2);
  };

  const isTimeSlotAvailable = (date: Date) => {
    return !bookedSlots.some(slot => {
      const slotDate = new Date(slot.dateTime);
      return Math.abs(slotDate.getTime() - date.getTime()) < 60 * 60 * 1000; // 1 hour buffer
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements || !selectedDate || !session) {
      return;
    }

    setIsLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create payment method
      const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (paymentError) {
        throw new Error(paymentError.message);
      }

      // Create booking
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coachId: coach._id,
          dateTime: selectedDate.toISOString(),
          duration: parseInt(selectedDuration),
          paymentMethodId: paymentMethod.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Booking failed');
      }

      setBookingDetails(data.booking);
      setBookingSuccess(true);
      toast.success('Booking confirmed successfully!');
    } catch (error:  any) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Booking failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (bookingSuccess && bookingDetails) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h3>
          <p className="text-gray-600">
            Your session with {coach.name} has been successfully booked.
          </p>
        </div>

        <Card className="text-left">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Date & Time:</span>
              <span className="font-medium">
                {new Date(bookingDetails.dateTime).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{bookingDetails.duration} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Paid:</span>
              <span className="font-medium">${bookingDetails.totalAmount}</span>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2">Video Call Link:</p>
              <a 
                href={bookingDetails.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {bookingDetails.videoLink}
              </a>
            </div>
          </CardContent>
        </Card>

        <Button onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Coach Info */}
      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
        <img
          src={coach.image}
          alt={coach.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-900">{coach.name}</h3>
          <p className="text-gray-600">${coach.hourlyRate}/hour</p>
        </div>
      </div>

      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4 inline mr-2" />
          Select Date & Time
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={setSelectedDate}
          showTimeSelect
          timeIntervals={30}
          minDate={new Date()}
          maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // 30 days from now
          filterTime={(time) => {
            const hour = time.getHours();
            return hour >= 9 && hour <= 17; // Business hours only
          }}
          dateFormat="MMMM d, yyyy h:mm aa"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholderText="Choose date and time"
          required
        />
      </div>

      {/* Duration Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Clock className="w-4 h-4 inline mr-2" />
          Session Duration
        </label>
        <Select value={selectedDuration} onValueChange={setSelectedDuration}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 minutes - ${(coach.hourlyRate * 0.5).toFixed(2)}</SelectItem>
            <SelectItem value="60">60 minutes - ${coach.hourlyRate.toFixed(2)}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <CreditCard className="w-4 h-4 inline mr-2" />
          Payment Information
        </label>
        <div className="p-4 border border-gray-300 rounded-lg">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Total */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-blue-600">${calculateTotal()}</span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!selectedDate || isLoading || !stripe}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          `Book Session - $${calculateTotal()}`
        )}
      </Button>
    </form>
  );
};

const BookingModal: React.FC<BookingModalProps> = ({ coach, isOpen, onClose }) => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null;
  }

  if (!session) {
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={onClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
            >
              <div className="text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Sign In Required
                </h3>
                <p className="text-gray-600">
                  Please sign in to book a session with {coach.name}.
                </p>
                <div className="flex space-x-3">
                  <Button onClick={onClose} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/api/auth/signin'}
                    className="flex-1"
                  >
                    Sign In
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Book a Session
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <Elements stripe={stripePromise}>
                <BookingForm coach={coach} onClose={onClose} />
              </Elements>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;