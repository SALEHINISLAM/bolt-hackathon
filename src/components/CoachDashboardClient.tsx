'use client';

import { useState} from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Video,
  CheckCircle,
  AlertCircle,
  Settings
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AvailabilityCalendar from '@/components/AvailabilityCalender';
import ProfileForm from '@/components/ProfileForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Image from 'next/image';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
  client: {
    _id: string;
    name: string;
    email: string;
  };
  videoLink?: string | null;
  notes?: string;
}

interface CoachProfile {
  _id: string;
  name: string;
  email: string;
  bio: string;
  expertise: string[];
  hourlyRate: number;
  experience: number;
  certifications: string[];
  languages: string[];
  image: string;
  rating: number;
}

interface EarningsData {
  totalEarnings: number;
  monthlyEarnings: Array<{ month: string; earnings: number }>;
  recentPayments: Array<{
    _id: string;
    amount: number;
    coachEarnings: number;
    platformFee: number;
    status: string;
    processedAt: Date | string;
    clientName: string;
  }>;
}

interface CoachDashboardClientProps {
  user: DashboardUser;
  initialBookingsData: { bookings: Booking[] };
  initialProfileData: CoachProfile;
  initialEarningsData: EarningsData;
}

// Define proper types for Chart.js context
interface ChartTooltipContext {
  parsed: {
    y: number;
  };
}

const CoachDashboardClient: React.FC<CoachDashboardClientProps> = ({
  user,
  initialBookingsData,
  initialProfileData,
  initialEarningsData,
}) => {
  const [bookingsData, setBookingsData] = useState(initialBookingsData);
  const [profileData, setProfileData] = useState(initialProfileData);
  const [earningsData, setEarningsData] = useState(initialEarningsData);
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
      const [bookingsResponse, profileResponse, earningsResponse] = await Promise.all([
        fetch('/api/bookings/coach'),
        fetch('/api/coach/profile'),
        fetch('/api/payments/coach'),
      ]);

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookingsData(bookingsData);
      }

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfileData(profileData);
      }

      if (earningsResponse.ok) {
        const earningsData = await earningsResponse.json();
        setEarningsData(earningsData);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (updatedProfile: Partial<CoachProfile>) => {
    setLoading(true);
    try {
      const response = await fetch('/api/coach/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });

      if (response.ok) {
        const result = await response.json();
        setProfileData(result.profile);
        toast.success('Profile updated successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
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

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
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

  const quickStats = [
    {
      title: 'Total Earnings',
      value: `$${earningsData.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-800',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Upcoming Sessions',
      value: bookingsData.bookings.length,
      icon: Calendar,
      color: 'text-blue-800',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Hourly Rate',
      value: `$${profileData.hourlyRate}`,
      icon: TrendingUp,
      color: 'text-amber-800',
      bgColor: 'bg-amber-100',
    },
  ];

  // Chart data for earnings
  const chartData = {
    labels: earningsData.monthlyEarnings.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Earnings',
        data: earningsData.monthlyEarnings.map(item => item.earnings),
        borderColor: '#1E3A8A',
        backgroundColor: 'rgba(30, 58, 138, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#1E3A8A',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function(context: ChartTooltipContext) {
            return `Earnings: $${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#F3F4F6',
        },
        ticks: {
          color: '#6B7280',
          callback: function(value: string | number) {
            return '$' + value;
          }
        }
      },
      x: {
        grid: {
          color: '#F3F4F6',
        },
        ticks: {
          color: '#6B7280',
        }
      }
    },
  };

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
                Manage your coaching practice and grow your impact
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Image
                src={profileData.image}
                alt={profileData.name}
                className="w-16 h-16 rounded-full object-cover border-4 border-white/20"
                width={64}
                height={64}
              />
              <div className="text-right">
                <div className="flex items-center space-x-1 mb-1">
                  <span className="text-yellow-400">★</span>
                  <span className="font-semibold">{profileData.rating}</span>
                </div>
                <p className="text-blue-100 text-sm">{profileData.experience} years experience</p>
              </div>
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
            {quickStats.map((stat) => ( // Removed unused index parameter
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
            {/* Left Column - Sessions and Earnings */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Sessions */}
              <motion.div {...fadeInUp}>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="w-6 h-6 mr-2 text-blue-800" />
                        Upcoming Sessions
                      </div>
                      <Button
                        onClick={refreshData}
                        variant="ghost"
                        size="sm"
                        disabled={loading}
                        className="text-blue-800 hover:text-blue-900"
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        {loading ? 'Refreshing...' : 'Refresh'}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bookingsData.bookings.length === 0 ? (
                      <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No upcoming sessions
                        </h3>
                        <p className="text-gray-600">
                          Your schedule is clear. Time to attract new clients!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookingsData.bookings.map((booking, index) => (
                          <motion.div
                            key={booking._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center text-white font-semibold">
                                  {booking.client.name.charAt(0)}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{booking.client.name}</h4>
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
                                  {booking.notes && (
                                    <p className="text-sm text-gray-600 mt-1">{booking.notes}</p>
                                  )}
                                </div>
                              </div>

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
                                    Start Call
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
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Earnings Overview */}
              <motion.div {...fadeInUp}>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      <TrendingUp className="w-6 h-6 mr-2 text-blue-800" />
                      Earnings Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Chart */}
                      <div className="h-64">
                        <Line data={chartData} options={chartOptions} />
                      </div>

                      {/* Recent Payments */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Recent Payments</h3>
                        <div className="space-y-2">
                          {earningsData.recentPayments.slice(0, 3).map((payment) => (
                            <div
                              key={payment._id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                  <DollarSign className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{payment.clientName}</p>
                                  <p className="text-sm text-gray-600">
                                    {new Date(payment.processedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  ${payment.coachEarnings}
                                </p>
                                <p className="text-xs text-gray-600">
                                  (${payment.amount} - ${payment.platformFee} fee)
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Profile and Availability */}
            <div className="space-y-8">
              {/* Profile Form */}
              <motion.div {...fadeInUp}>
                <ProfileForm
                  profile={profileData}
                  onSave={handleProfileUpdate}
                  loading={loading}
                />
              </motion.div>

              {/* Availability Calendar */}
              <motion.div {...fadeInUp}>
                <AvailabilityCalendar
                  initialSlots={[]}
                  onSave={(slots) => {
                    console.log('Availability slots updated:', slots);
                    toast.success('Availability updated successfully');
                  }}
                  loading={loading}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CoachDashboardClient;