'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SessionProvider } from 'next-auth/react';
import { 
  Calendar,  
  Star, 
  ArrowLeft, 
  CheckCircle,
  CreditCard,
  Video
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface Coach {
  _id: string;
  name: string;
  expertise: string[];
  hourlyRate: number;
  rating: number;
  bio: string;
  image: string;
  experience: number;
  certifications: string[];
  languages: string[];
}

interface BookingPageData {
  coach: Coach;
}

interface BookingPageClientProps {
  data: BookingPageData;
  coachId: string;
}

const BookingPageContent: React.FC<BookingPageClientProps> = ({ data, coachId }) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { coach } = data;

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      icon: Video,
      title: 'Video Call Session',
      description: 'High-quality video call via Google Meet or Zoom'
    },
    {
      icon: Calendar,
      title: 'Flexible Scheduling',
      description: 'Choose from available time slots that work for you'
    },
    {
      icon: CheckCircle,
      title: 'Instant Confirmation',
      description: 'Get immediate booking confirmation and meeting link'
    },
    {
      icon: CreditCard,
      title: 'Secure Payment',
      description: 'Safe and secure payment processing with Stripe'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <section className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link href="/coaches" className="hover:text-blue-600">Coaches</Link>
            <span>/</span>
            <Link href={`/coaches/${coachId}`} className="hover:text-blue-600">{coach.name}</Link>
            <span>/</span>
            <span className="text-gray-900">Book Session</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center"
          >
            <Link 
              href={`/coaches/${coachId}`}
              className="inline-flex items-center text-blue-200 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Book a Session with {coach.name}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Take the next step in your career journey with personalized coaching
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Coach Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Coach Summary */}
              <motion.div {...fadeInUp}>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-6">
                      <Image
                        src={coach.image}
                        alt={coach.name}
                        className="w-24 h-24 rounded-full object-cover"
                        width={96}
                        height={96}
                      />
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          {coach.name}
                        </h2>
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{coach.rating}</span>
                          </div>
                          <span className="text-gray-600">{coach.experience} years experience</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {coach.expertise.slice(0, 3).map((skill) => (
                            <Badge 
                              key={skill} 
                              variant="secondary" 
                              className="bg-blue-50 text-blue-700"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {coach.bio}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Session Features */}
              <motion.div {...fadeInUp}>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      What&apos;s Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <feature.icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {feature.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Session Options */}
              <motion.div {...fadeInUp}>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Session Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-semibold text-gray-900">30-Minute Session</h3>
                          <p className="text-gray-600 text-sm">Quick consultation and focused advice</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            ${(coach.hourlyRate * 0.5).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 border-2 border-blue-200 bg-blue-50 rounded-lg">
                        <div>
                          <h3 className="font-semibold text-gray-900">60-Minute Session</h3>
                          <p className="text-gray-600 text-sm">Comprehensive coaching session</p>
                          <Badge className="bg-blue-600 text-white mt-1">Most Popular</Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            ${coach.hourlyRate.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="space-y-8">
              <motion.div {...fadeInUp}>
                <Card className="border-0 shadow-lg sticky top-8">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900 text-center">
                      Book Your Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        Starting at ${(coach.hourlyRate * 0.5).toFixed(2)}
                      </div>
                      <p className="text-gray-600">30-minute session</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-gray-700">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <span>Flexible scheduling</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-700">
                        <Video className="w-5 h-5 text-blue-600" />
                        <span>Video call session</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        <span>Instant confirmation</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => setIsBookingModalOpen(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                      size="lg"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Book Now
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Secure payment • Instant confirmation • 24/7 support
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        coach={coach}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};

const BookingPageClient: React.FC<BookingPageClientProps> = (props) => {
  return (
    <SessionProvider>
      <BookingPageContent {...props} />
    </SessionProvider>
  );
};

export default BookingPageClient;