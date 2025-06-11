import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import CorporateDashboardClient from '@/components/CorporateDashboardClient';

// Define extended session type
interface ExtendedSession {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: string;
  };
}

export const metadata: Metadata = {
  title: 'Corporate Dashboard - Career Coaching Platform',
  description: 'Manage your corporate coaching account, track employee sessions, and monitor usage analytics.',
  keywords: 'corporate dashboard, employee coaching, session management, analytics',
};

export const revalidate = 1800; // Revalidate every 30 minutes

async function getCorporateAccount() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/corporate/account`, {
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch corporate account');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching corporate account:', error);
    // Return mock data as fallback
    return {
      _id: 'mock-corporate-id',
      companyName: 'TechCorp Solutions',
      contactEmail: 'admin@techcorp.com',
      contactName: 'Admin User',
      phone: '+1 (555) 123-4567',
      credits: {
        total: 100,
        used: 35,
        remaining: 65
      },
      employees: [
        'john.doe@techcorp.com',
        'jane.smith@techcorp.com',
        'mike.johnson@techcorp.com',
        'sarah.wilson@techcorp.com'
      ],
      subscriptionPlan: 'premium',
      isActive: true,
      settings: {
        allowSelfBooking: true,
        requireApproval: false,
        maxSessionsPerEmployee: 10,
        allowedCoachCategories: ['Technology', 'Leadership', 'Career Transition']
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date()
    };
  }
}

async function getCorporateBookings() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/bookings/corporate?limit=10`, {
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch corporate bookings');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching corporate bookings:', error);
    // Return mock data as fallback
    return {
      bookings: [
        {
          _id: '1',
          dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
          duration: 60,
          status: 'confirmed',
          totalAmount: 150,
          employee: {
            name: 'John Doe',
            email: 'john.doe@techcorp.com'
          },
          coach: {
            _id: '1',
            name: 'Sarah Johnson',
            image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
            expertise: ['Technology', 'Leadership']
          },
          notes: 'Leadership development session'
        },
        {
          _id: '2',
          dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          duration: 30,
          status: 'pending',
          totalAmount: 100,
          employee: {
            name: 'Jane Smith',
            email: 'jane.smith@techcorp.com'
          },
          coach: {
            _id: '2',
            name: 'Michael Chen',
            image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
            expertise: ['Finance', 'Strategy']
          },
          notes: 'Career transition planning'
        }
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalBookings: 2,
        hasNextPage: false,
        hasPrevPage: false
      }
    };
  }
}

async function getAnalyticsData() {
  try {
    // In a real app, this would fetch from an analytics API
    // For now, return mock data
    return [
      { month: 'Jul', sessions: 8, credits: 12 },
      { month: 'Aug', sessions: 12, credits: 18 },
      { month: 'Sep', sessions: 15, credits: 22 },
      { month: 'Oct', sessions: 10, credits: 15 },
      { month: 'Nov', sessions: 18, credits: 25 },
      { month: 'Dec', sessions: 22, credits: 30 },
    ];
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return [];
  }
}

export default async function CorporateDashboardPage() {
  const session = await getServerSession(authOptions) as ExtendedSession | null;

  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/corporate/dashboard');
  }

  const user = session.user;

  // Check if user has admin role
  if (user.role !== 'admin') {
    redirect('/dashboard'); // Redirect to regular dashboard
  }

  // Fetch data server-side
  const [corporateAccount, bookingsData, analyticsData] = await Promise.all([
    getCorporateAccount(),
    getCorporateBookings(),
    getAnalyticsData(),
  ]);

  return (
    <CorporateDashboardClient
      user={user}
      initialAccountData={corporateAccount}
      initialBookingsData={bookingsData}
      initialAnalyticsData={analyticsData}
    />
  );
}