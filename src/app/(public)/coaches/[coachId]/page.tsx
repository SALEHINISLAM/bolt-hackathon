'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Types
interface Coach {
  id: string;
  name: string;
  specialization: string;
  hourlyRate: number;
  image?: string;
  description?: string;
  experience?: string;
  skills?: string[];
  availability?: string[];
  rating?: number;
  reviewCount?: number;
}

interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
}

// Main component with Next.js 15 compatibility
export default function CoachProfilePage({ 
  params 
}: { 
  params: Promise<{ coachId: string }> 
}) {
  // State management
  const [coachId, setCoachId] = useState<string>('');
  const [coach, setCoach] = useState<Coach | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  
  //const router = useRouter();
  const searchParams = useSearchParams();

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

  // Check for booking success message
  useEffect(() => {
    if (searchParams.get('booking') === 'success') {
      setShowBookingSuccess(true);
      // Hide the success message after 5 seconds
      setTimeout(() => setShowBookingSuccess(false), 5000);
    }
  }, [searchParams]);

  // Fetch coach data and reviews
  useEffect(() => {
    const fetchCoachData = async () => {
      if (!coachId) return;

      try {
        setLoading(true);
        
        // Fetch coach data
        const coachResponse = await fetch(`/api/coaches/${coachId}`);
        if (!coachResponse.ok) {
          throw new Error('Coach not found');
        }
        const coachData = await coachResponse.json();
        setCoach(coachData);

        // Fetch reviews (optional)
        try {
          const reviewsResponse = await fetch(`/api/coaches/${coachId}/reviews`);
          if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json();
            setReviews(reviewsData.reviews || []);
          }
        } catch (reviewError) {
          console.log('Reviews not available:', reviewError);
          // Reviews are optional, so we don't treat this as an error
        }

      } catch (error) {
        console.error('Error fetching coach data:', error);
        setError('Failed to load coach information');
      } finally {
        setLoading(false);
      }
    };

    fetchCoachData();
  }, [coachId]);

  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading coach profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !coach) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Coach Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The requested coach profile could not be found.'}</p>
          <Link 
            href="/coaches"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block"
          >
            Browse All Coaches
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Message */}
      {showBookingSuccess && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 fixed top-0 left-0 right-0 z-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Booking request submitted successfully! You&apos;ll receive a confirmation email shortly.
              </p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setShowBookingSuccess(false)}
                className="text-green-400 hover:text-green-600"
              >
                <span className="sr-only">Dismiss</span>×
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`py-8 ${showBookingSuccess ? 'pt-20' : ''}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link 
              href="/coaches"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              ← Back to All Coaches
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Header */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                  <div className="flex-shrink-0 mb-4 md:mb-0">
                    <Image
                      src={coach.image || '/images/default-avatar.jpg'}
                      alt={coach.name}
                      className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
                      width={128}
                      height={128}
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{coach.name}</h1>
                    <p className="text-xl text-blue-600 mb-3">{coach.specialization}</p>
                    
                    {/* Rating */}
                    {coach.rating && (
                      <div className="flex items-center justify-center md:justify-start mb-3">
                        <div className="flex items-center">
                          {renderStars(coach.rating)}
                          <span className="ml-2 text-gray-600">
                            {coach.rating} ({coach.reviewCount || 0} reviews)
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Rate */}
                    <div className="text-2xl font-bold text-green-600 mb-4">
                      ${coach.hourlyRate}/hour
                    </div>

                    {/* Skills */}
                    {coach.skills && coach.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {coach.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">About {coach.name}</h2>
                <p className="text-gray-700 leading-relaxed">
                  {coach.description || 'This coach hasn\'t added a description yet.'}
                </p>
                
                {coach.experience && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Experience</h3>
                    <p className="text-gray-700">{coach.experience}</p>
                  </div>
                )}
              </div>

              {/* Availability */}
              {coach.availability && coach.availability.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Availability</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {coach.availability.map((slot, index) => (
                      <div key={index} className="flex items-center">
                        <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{slot}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              {reviews.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Client Reviews</h2>
                  <div className="space-y-4">
                    {reviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-900">{review.clientName}</span>
                            <div className="ml-2 flex">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ${coach.hourlyRate}
                  </div>
                  <p className="text-gray-600">per hour</p>
                </div>

                <Link
                  href={`/coaches/${coachId}/book`}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block"
                >
                  Book a Session
                </Link>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    Free consultation available
                  </p>
                </div>

                {/* Contact Options */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Options</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Video Call
                    </div>
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      In-Person (Select Areas)
                    </div>
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Phone Call
                    </div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Typically responds within 2 hours
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}