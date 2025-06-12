'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Types
interface Coach {
  id: string;
  name: string;
  specialization: string;
  hourlyRate: number;
  image?: string;
  description?: string;
}

interface BookingFormData {
  date: string;
  time: string;
  duration: number;
  notes: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}

// This is the main component that needs to be fixed for Next.js 15
export default function BookingPage({ 
  params 
}: { 
  params: Promise<{ coachId: string }> 
}) {
  // State management
  const [coachId, setCoachId] = useState<string>('');
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<BookingFormData>({
    date: '',
    time: '',
    duration: 60,
    notes: '',
    clientName: '',
    clientEmail: '',
    clientPhone: ''
  });

  // Extract coachId from params (Next.js 15 fix)
  useEffect(() => {
    const getCoachId = async () => {
      try {
        const resolvedParams = await params;
        setCoachId(resolvedParams.coachId);
      } catch (error) {
        console.error('Error resolving params:', error);
        setError('Invalid coach ID');
        setLoading(false);
      }
    };

    getCoachId();
  }, [params]);

  // Fetch coach data
  useEffect(() => {
    const fetchCoach = async () => {
      if (!coachId) return;

      try {
        setLoading(true);
        // Replace this with your actual API call
        const response = await fetch(`/api/coaches/${coachId}`);
        
        if (!response.ok) {
          throw new Error('Coach not found');
        }
        
        const coachData = await response.json();
        setCoach(coachData);
      } catch (error) {
        console.error('Error fetching coach:', error);
        setError('Failed to load coach information');
      } finally {
        setLoading(false);
      }
    };

    fetchCoach();
  }, [coachId]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Validate form data
      if (!formData.clientName || !formData.clientEmail || !formData.date || !formData.time) {
        throw new Error('Please fill in all required fields');
      }

      // Submit booking (replace with your actual API call)
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coachId,
          ...formData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      setSuccess(true);
      
      // Redirect to success page or coach profile after 2 seconds
      setTimeout(() => {
        router.push(`/coaches/${coachId}?booking=success`);
      }, 2000);

    } catch (error) {
      console.error('Booking error:', error);
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading coach information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !coach) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-4">
            Your session with {coach?.name} has been booked successfully.
          </p>
          <p className="text-sm text-gray-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Main booking form
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            ← Back to Coach Profile
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Book a Session</h1>
          <p className="text-gray-600 mt-2">Schedule your coaching session with {coach?.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coach Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              {coach?.image && (
                <Image 
                  src={coach.image} 
                  alt={coach.name}
                  width={80}
                  height={80}
                  className="rounded-full mx-auto mb-4 object-cover"
                />
              )}
              <h3 className="text-xl font-semibold text-center mb-2">{coach?.name}</h3>
              <p className="text-gray-600 text-center mb-4">{coach?.specialization}</p>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Hourly Rate:</span>
                  <span className="font-semibold text-green-600">${coach?.hourlyRate}/hr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Session Duration:</span>
                  <span className="font-semibold">{formData.duration} min</span>
                </div>
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between items-center font-bold">
                    <span>Total:</span>
                    <span className="text-lg text-green-600">
                      ${((coach?.hourlyRate || 0) * (formData.duration / 60)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="clientName"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="clientEmail"
                        name="clientEmail"
                        value={formData.clientEmail}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="clientPhone"
                      name="clientPhone"
                      value={formData.clientPhone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Session Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Session Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Time *
                      </label>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                      Session Duration
                    </label>
                    <select
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={30}>30 minutes</option>
                      <option value={60}>60 minutes</option>
                      <option value={90}>90 minutes</option>
                      <option value={120}>120 minutes</option>
                    </select>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Any specific topics you'd like to discuss or goals for this session..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {submitting ? 'Processing...' : 'Book Session'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}