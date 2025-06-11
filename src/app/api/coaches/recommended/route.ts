import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/ConnectDB';
import Coach from '@/lib/models/Coach';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      const db = await connectToDatabase();
      
      if (!db) {
        // Return mock data if database is not available
        const mockCoaches = [
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

        return NextResponse.json(mockCoaches);
      }

      // Fetch top 3 coaches by rating
      const recommendedCoaches = await Coach.find({})
        .sort({ rating: -1, createdAt: -1 })
        .limit(3)
        .select('name expertise hourlyRate rating image bio experience')
        .lean();

      return NextResponse.json(recommendedCoaches);
    } catch (dbError) {
      console.warn('Database operation failed, returning mock data:', dbError);
      
      // Return mock data if database fails
      const mockCoaches = [
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

      return NextResponse.json(mockCoaches);
    }
  } catch (error) {
    console.error('Error fetching recommended coaches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommended coaches' },
      { status: 500 }
    );
  }
}