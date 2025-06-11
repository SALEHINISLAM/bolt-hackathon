import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/ConnectDB';
import Coach from '@/lib/models/Coach';

export async function GET(request: NextRequest) {
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
          experience: 15,
        },
        {
          _id: '2',
          name: 'Michael Chen',
          expertise: ['Finance', 'Strategy'],
          hourlyRate: 200,
          rating: 4.8,
          bio: 'Investment banker turned executive coach, specializing in finance and strategic planning.',
          image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
          experience: 12,
        },
      ];

      return NextResponse.json({
        coaches: mockCoaches,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCoaches: mockCoaches.length,
          hasNextPage: false,
          hasPrevPage: false,
        }
      });
    }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Filter parameters
    const expertise = searchParams.get('expertise');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');
    const search = searchParams.get('search');

    // Build query object
    const query: any = {};

    if (expertise && expertise !== 'all') {
      query.expertise = { $in: [new RegExp(expertise, 'i')] };
    }

    if (minPrice || maxPrice) {
      query.hourlyRate = {};
      if (minPrice) query.hourlyRate.$gte = parseInt(minPrice);
      if (maxPrice) query.hourlyRate.$lte = parseInt(maxPrice);
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { expertise: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Get total count for pagination
    const totalCoaches = await Coach.countDocuments(query);
    const totalPages = Math.ceil(totalCoaches / limit);

    // Fetch coaches with pagination
    const coaches = await Coach.find(query)
      .select('name expertise hourlyRate rating image bio experience')
      .sort({ rating: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      coaches,
      pagination: {
        currentPage: page,
        totalPages,
        totalCoaches,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    });
  } catch (error) {
    console.error('Error fetching coaches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coaches' },
      { status: 500 }
    );
  }
}