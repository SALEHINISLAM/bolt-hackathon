import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import CoachDashboardClient from '@/components/CoachDashboardClient';

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
  title: 'Coach Dashboard - Career Coaching Platform',
  description: 'Manage your coaching sessions, track earnings, and update your profile.',
  keywords: 'coach dashboard, coaching sessions, earnings, profile management',
};

export const revalidate = 43200; // Revalidate every 12 hours

async function getCoachBookings() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/bookings/coach`, {
      next: { revalidate: 43200 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching coach bookings:', error);
    // Return mock data as fallback
    return {
      bookings: [
        {
          _id: '1',
          dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
          duration: 60,
          status: 'confirmed',
          totalAmount: 150,
          client: {
            _id: '1',
            name: 'John Smith',
            email: 'john@example.com'
          },
          videoLink: 'https://meet.google.com/mock-session-1',
          notes: 'Career transition discussion'
        }
      ]
    };
  }
}

async function getCoachProfile() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/coach/profile`, {
      next: { revalidate: 43200 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching coach profile:', error);
    // Return mock data as fallback
    return {
      _id: 'mock-coach-id',
      name: 'Coach Name',
      email: 'coach@example.com',
      bio: 'Experienced career coach with 10+ years helping professionals achieve their goals.',
      expertise: ['Leadership', 'Career Transition', 'Technology'],
      hourlyRate: 150,
      experience: 10,
      certifications: ['ICF Certified', 'Leadership Coach'],
      languages: ['English', 'Spanish'],
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8
    };
  }
}

async function getCoachEarnings() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/payments/coach`, {
      next: { revalidate: 43200 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch earnings');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching coach earnings:', error);
    // Return mock data as fallback
    const currentDate = new Date();
    return {
      totalEarnings: 2450.00,
      monthlyEarnings: [
        { month: 'Jan', earnings: 320 },
        { month: 'Feb', earnings: 480 },
        { month: 'Mar', earnings: 650 },
        { month: 'Apr', earnings: 420 },
        { month: 'May', earnings: 580 },
        { month: 'Jun', earnings: 750 },
      ],
      recentPayments: [
        {
          _id: '1',
          amount: 150,
          coachEarnings: 135,
          platformFee: 15,
          status: 'completed',
          processedAt: new Date(currentDate.getTime() - 24 * 60 * 60 * 1000),
          clientName: 'John Smith'
        }
      ]
    };
  }
}

export default async function CoachDashboardPage() {
  const session = await getServerSession(authOptions) as ExtendedSession | null;

  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/coach/dashboard');
  }

  const user = session.user;

  // Check if user is a coach
  if (user.role !== 'coach') {
    redirect('/dashboard'); // Redirect to client dashboard
  }

  // Fetch data server-side
  const [bookingsData, profileData, earningsData] = await Promise.all([
    getCoachBookings(),
    getCoachProfile(),
    getCoachEarnings(),
  ]);

  return (
    <CoachDashboardClient
      user={user}
      initialBookingsData={bookingsData}
      initialProfileData={profileData}
      initialEarningsData={earningsData}
    />
  );
}