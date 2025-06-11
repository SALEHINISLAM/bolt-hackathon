'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  Users, 
  Plus,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnalyticsChart from '@/components/AnalyticsChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface DashboardUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: string;
}

interface CorporateAccount {
  _id: string;
  companyName: string;
  contactEmail: string;
  contactName: string;
  phone?: string;
  credits: {
    total: number;
    used: number;
    remaining: number;
  };
  employees: string[];
  subscriptionPlan: string;
  isActive: boolean;
  settings: {
    allowSelfBooking: boolean;
    requireApproval: boolean;
    maxSessionsPerEmployee: number;
    allowedCoachCategories: string[];
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface Booking {
  _id: string;
  dateTime: Date | string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  employee: {
    name: string;
    email: string;
  };
  coach: {
    _id: string;
    name: string;
    image: string;
    expertise: string[];
  };
  notes?: string;
}

interface BookingsData {
  bookings: Booking[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBookings: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface AnalyticsData {
  month: string;
  sessions: number;
  credits: number;
}

interface CorporateDashboardClientProps {
  user: DashboardUser;
  initialAccountData: CorporateAccount;
  initialBookingsData: BookingsData;
  initialAnalyticsData: AnalyticsData[];
}

const CorporateDashboardClient: React.FC<CorporateDashboardClientProps> = ({
  user,
  initialAccountData,
  initialBookingsData,
  initialAnalyticsData,
}) => {
  const [accountData, setAccountData] = useState(initialAccountData);
  const [bookingsData, setBookingsData] = useState(initialBookingsData);
  const [analyticsData] = useState(initialAnalyticsData); // Removed setAnalyticsData since it's not used
  const [loading, setLoading] = useState(false);
  const [showAddCredits, setShowAddCredits] = useState(false);
  const [creditsToAdd, setCreditsToAdd] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

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
      const [accountResponse, bookingsResponse] = await Promise.all([
        fetch('/api/corporate/account'),
        fetch('/api/bookings/corporate?limit=10'),
      ]);

      if (accountResponse.ok) {
        const accountData = await accountResponse.json();
        setAccountData(accountData);
      }

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookingsData(bookingsData);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCredits = async () => {
    const credits = parseInt(creditsToAdd);
    
    if (!credits || credits <= 0) {
      toast.error('Please enter a valid number of credits');
      return;
    }

    if (credits > 1000) {
      toast.error('Maximum 1000 credits can be added at once');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/corporate/credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credits,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setAccountData(prev => ({
          ...prev,
          credits: data.newBalance
        }));
        setCreditsToAdd('');
        setShowAddCredits(false);
      } else {
        toast.error(data.error || 'Failed to add credits');
      }
    } catch (error) {
      console.error('Error adding credits:', error);
      toast.error('Failed to add credits');
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
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const quickStats = [
    {
      title: 'Total Credits',
      value: accountData.credits.total,
      icon: CreditCard,
      color: 'text-blue-800',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Credits Used',
      value: accountData.credits.used,
      icon: TrendingUp,
      color: 'text-amber-800',
      bgColor: 'bg-amber-100',
    },
    {
      title: 'Credits Remaining',
      value: accountData.credits.remaining,
      icon: DollarSign,
      color: 'text-green-800',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Active Employees',
      value: accountData.employees.length,
      icon: Users,
      color: 'text-purple-800',
      bgColor: 'bg-purple-100',
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
                Welcome to {accountData.companyName} Corporate Dashboard
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{accountData.credits.remaining}</div>
                <p className="text-blue-100 text-sm">Credits Remaining</p>
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
            {/* Left Column - Credits and Bookings */}
            <div className="lg:col-span-2 space-y-8">
              {/* Session Credits Card */}
              <motion.div {...fadeInUp}>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-between">
                      <div className="flex items-center">
                        <CreditCard className="w-6 h-6 mr-2 text-blue-800" />
                        Session Credits
                      </div>
                      <Button
                        onClick={() => setShowAddCredits(!showAddCredits)}
                        className="bg-blue-800 hover:bg-blue-900"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Credits
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Credit Overview */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-800">
                            {accountData.credits.total}
                          </div>
                          <div className="text-sm text-gray-600">Total Credits</div>
                        </div>
                        <div className="text-center p-4 bg-amber-50 rounded-lg">
                          <div className="text-2xl font-bold text-amber-600">
                            {accountData.credits.used}
                          </div>
                          <div className="text-sm text-gray-600">Used</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {accountData.credits.remaining}
                          </div>
                          <div className="text-sm text-gray-600">Remaining</div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Credit Usage</span>
                          <span>{Math.round((accountData.credits.used / accountData.credits.total) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-800 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(accountData.credits.used / accountData.credits.total) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Add Credits Form */}
                      {showAddCredits && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-gray-50 p-4 rounded-lg space-y-4"
                        >
                          <h4 className="font-semibold text-gray-900">Add Credits</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Number of Credits
                              </label>
                              <Input
                                type="number"
                                value={creditsToAdd}
                                onChange={(e) => setCreditsToAdd(e.target.value)}
                                placeholder="Enter credits"
                                min="1"
                                max="1000"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Method
                              </label>
                              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="credit_card">Credit Card</SelectItem>
                                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                  <SelectItem value="invoice">Invoice</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-end">
                              <Button
                                onClick={handleAddCredits}
                                disabled={loading || !creditsToAdd}
                                className="w-full bg-green-600 hover:bg-green-700"
                              >
                                {loading ? 'Processing...' : `Add Credits ($${parseInt(creditsToAdd || '0') * 10})`}
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">
                            Credits are $10 each. You can add up to 1000 credits at once.
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Bookings */}
              <motion.div {...fadeInUp}>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="w-6 h-6 mr-2 text-blue-800" />
                        Recent Employee Bookings
                      </div>
                      <Button
                        onClick={refreshData}
                        variant="ghost"
                        size="sm"
                        disabled={loading}
                        className="text-blue-800 hover:text-blue-900"
                      >
                        <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Refreshing...' : 'Refresh'}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bookingsData.bookings.length === 0 ? (
                      <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No bookings yet
                        </h3>
                        <p className="text-gray-600">
                          Employee bookings will appear here once they start scheduling sessions.
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
                                <img
                                  src={booking.coach.image}
                                  alt={booking.coach.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                  <h4 className="font-semibold text-gray-900">{booking.employee.name}</h4>
                                  <p className="text-sm text-gray-600">{booking.employee.email}</p>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
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

                              <div className="flex items-center space-x-3">
                                <div className="text-center">
                                  <p className="text-sm font-medium text-gray-900">{booking.coach.name}</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {booking.coach.expertise.slice(0, 2).map((skill) => (
                                      <Badge key={skill} variant="outline" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                <Badge className={`${getStatusColor(booking.status)} flex items-center space-x-1`}>
                                  {getStatusIcon(booking.status)}
                                  <span className="capitalize">{booking.status}</span>
                                </Badge>
                                
                                <div className="text-right">
                                  <div className="font-semibold text-gray-900">
                                    ${booking.totalAmount}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {booking.notes && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-sm text-gray-600">{booking.notes}</p>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Analytics and Settings */}
            <div className="space-y-8">
              {/* Analytics Chart */}
              <motion.div {...fadeInUp}>
                <AnalyticsChart
                  data={analyticsData}
                  title="Usage Analytics"
                  loading={loading}
                />
              </motion.div>

              {/* Company Info */}
              <motion.div {...fadeInUp}>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      <Building2 className="w-6 h-6 mr-2 text-blue-800" />
                      Company Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{accountData.companyName}</h4>
                      <p className="text-gray-600">{accountData.contactEmail}</p>
                      {accountData.phone && (
                        <p className="text-gray-600">{accountData.phone}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Subscription Plan</span>
                      <Badge className="bg-blue-100 text-blue-800 capitalize">
                        {accountData.subscriptionPlan}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Active Employees</span>
                      <span className="font-medium">{accountData.employees.length}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Account Status</span>
                      <Badge className={accountData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {accountData.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <Button variant="outline" className="w-full mt-4">
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Settings
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

export default CorporateDashboardClient;