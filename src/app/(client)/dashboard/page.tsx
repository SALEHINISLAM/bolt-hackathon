import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import DashboardClient from '@/components/DashboardClient';

export const metadata: Metadata = {
  title: 'Client Dashboard - Career Coaching Platform',
  description: 'Manage your coaching sessions, track progress, and discover new coaches.',
  keywords: 'client dashboard, coaching sessions, career progress, professional development',
};

export const revalidate = 43200; // Revalidate every 12 hours

async function getUserBookings(userEmail: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/bookings/user`, {
      headers: {
        'Cookie': `next-auth.session-token=${userEmail}`, // This is a simplified approach
      },
      next: { revalidate: 43200 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    // Return mock data as fallback
    return {
      bookings: [
        {
          _id: '1',
          dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
          duration: 60,
          status: 'confirmed',
          totalAmount: 150,
          coach: {
            _id: '1',
            name: 'Sarah Johnson',
            image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
          },
          videoLink: 'https://meet.google.com/mock-session-1'
        }
      ],
      totalCompleted: 3
    };
  }
}

async function getRecommendedCoaches() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/coaches/recommended`, {
      next: { revalidate: 43200 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recommended coaches');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching recommended coaches:', error);
    // Return mock data as fallback
    return [
      {
        _id: '1',
        name: 'Sarah Johnson',
        expertise: ['Technology', 'Leadership'],
        hourlyRate: 150,
        rating: 4.9,
        bio: 'Former Tech Director with 15+ years experience helping professionals advance their careers.',
        image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
        experience: 15
      },
      {
        _id: '2',
        name: 'Michael Chen',
        expertise: ['Finance', 'Strategy'],
        hourlyRate: 200,
        rating: 4.8,
        bio: 'Investment banker turned executive coach, specializing in finance and strategic planning.',
        image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
        experience: 12
      },
      {
        _id: '3',
        name: 'Emily Rodriguez',
        expertise: ['Marketing', 'Personal Branding'],
        hourlyRate: 120,
        rating: 4.7,
        bio: 'Marketing executive with expertise in personal branding and career transitions.',
        image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        experience: 10
      }
    ];
  }
}

export default async function ClientDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/dashboard');
  }

  // Fetch data server-side
  const [bookingsData, recommendedCoaches] = await Promise.all([
    getUserBookings(session.user.email!),
    getRecommendedCoaches(),
  ]);

  return (
    <DashboardClient
      user={session.user}
      initialBookingsData={bookingsData}
      initialRecommendedCoaches={recommendedCoaches}
    />
  );
}