'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, TrendingUp, Users, ArrowRight, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingTable from '@/components/BookingTable';
import ProgressTracker from '@/components/ProgressTracker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface DashboardUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: string;
}

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

interface Coach {
  _id: string;
  name: string;
  expertise: string[];
  hourlyRate: number;
  rating: number;
  image: string;
  bio: string;
  experience: number;
}

interface BookingsData {
  bookings: Booking[];
  totalCompleted: number;
}

interface DashboardClientProps {
  user: DashboardUser;
  initialBookingsData: BookingsData;
  initialRecommendedCoaches: Coach[];
}

const DashboardClient: React.FC<DashboardClientProps> = ({
  user,
  initialBookingsData,
  initialRecommendedCoaches,
}) => {
  const [bookingsData, setBookingsData] = useState(initialBookingsData);
  const [recommendedCoaches, setRecommendedCoaches] = useState(initialRecommendedCoaches);
  const [loading, setLoading] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const [bookingsResponse, coachesResponse] = await Promise.all([
        fetch('/api/bookings/user'),
        fetch('/api/coaches/recommended'),
      ]);

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookingsData(bookingsData);
      }

      if (coachesResponse.ok) {
        const coachesData = await coachesResponse.json();
        setRecommendedCoaches(coachesData);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const quickStats = [
    {
      title: 'Total Sessions',
      value: bookingsData.totalCompleted,
      icon: Calendar,
      color: 'text-blue-800',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Upcoming Bookings',
      value: bookingsData.bookings.length,
      icon: TrendingUp,
      color: 'text-green-800',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Coaches Worked With',
      value: new Set(bookingsData.bookings.map(b => b.coach._id)).size,
      icon: Users,
      color: 'text-amber-800',
      bgColor: 'bg-amber-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="flex flex-col md:flex-row items-center justify-between"
          >
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {getGreeting()}, {user.name}!
              </h1>
              <p className="text-xl text-blue-100">
                Ready to continue your career journey?
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white/20"
                />
              ) : (
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              )}
              <Link href="/coaches">
                <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Find New Coach
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 -mt-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                variants={fadeInUp}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Bookings and Progress */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Bookings */}
              <motion.div {...fadeInUp}>
                <BookingTable bookings={bookingsData.bookings} loading={loading} />
              </motion.div>

              {/* Progress Tracker */}
              <motion.div {...fadeInUp}>
                <ProgressTracker 
                  completedSessions={bookingsData.totalCompleted} 
                  goalSessions={10}
                  loading={loading}
                />
              </motion.div>
            </div>

            {/* Right Column - Recommended Coaches */}
            <div className="space-y-8">
              <motion.div {...fadeInUp}>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="w-6 h-6 mr-2 text-blue-800" />
                        Recommended Coaches
                      </div>
                      <Link href="/coaches">
                        <Button variant="ghost" size="sm" className="text-blue-800 hover:text-blue-900">
                          View All
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-24 bg-gray-200 rounded-lg"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recommendedCoaches.map((coach, index) => (
                          <motion.div
                            key={coach._id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <Link href={`/coaches/${coach._id}`}>
                              <div className="flex items-center space-x-3">
                                <img
                                  src={coach.image}
                                  alt={coach.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 truncate">
                                    {coach.name}
                                  </h4>
                                  <p className="text-sm text-gray-600 truncate">
                                    {coach.expertise.slice(0, 2).join(', ')}
                                  </p>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-sm font-medium text-blue-800">
                                      ${coach.hourlyRate}/hr
                                    </span>
                                    <div className="flex items-center space-x-1">
                                      <span className="text-sm text-yellow-600">★</span>
                                      <span className="text-sm text-gray-600">{coach.rating}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div {...fadeInUp}>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/coaches">
                      <Button className="w-full bg-blue-800 hover:bg-blue-900 justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Browse All Coaches
                      </Button>
                    </Link>
                    <Link href="/coaches?expertise=technology">
                      <Button variant="outline" className="w-full justify-start">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Find Tech Coaches
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={refreshData}
                      disabled={loading}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      {loading ? 'Refreshing...' : 'Refresh Data'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DashboardClient;