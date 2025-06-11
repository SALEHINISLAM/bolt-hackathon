import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/ConnectDB';
import Coach from '@/lib/models/Coach';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch 6 coaches with highest ratings
    const featuredCoaches = await Coach.find({})
      .sort({ rating: -1, createdAt: -1 })
      .limit(6)
      .select('name expertise hourlyRate rating image bio experience')
      .lean();

    // If no coaches exist, create some sample data
    if (featuredCoaches.length === 0) {
      const sampleCoaches = [
        {
          name: 'Sarah Johnson',
          expertise: ['Technology', 'Leadership'],
          hourlyRate: 150,
          rating: 4.9,
          bio: 'Former Tech Director with 15+ years experience helping professionals advance their careers.',
          image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
          experience: 15,
          certifications: ['ICF Certified', 'PMP'],
          languages: ['English', 'Spanish'],
        },
        {
          name: 'Michael Chen',
          expertise: ['Finance', 'Strategy'],
          hourlyRate: 200,
          rating: 4.8,
          bio: 'Investment banker turned executive coach, specializing in finance and strategic planning.',
          image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
          experience: 12,
          certifications: ['CFA', 'Executive Coach'],
          languages: ['English', 'Mandarin'],
        },
        {
          name: 'Emily Rodriguez',
          expertise: ['Marketing', 'Personal Branding'],
          hourlyRate: 120,
          rating: 4.7,
          bio: 'Marketing executive with expertise in personal branding and career transitions.',
          image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
          experience: 10,
          certifications: ['Digital Marketing', 'Brand Strategy'],
          languages: ['English', 'Portuguese'],
        },
        {
          name: 'David Kim',
          expertise: ['Engineering', 'Product Management'],
          hourlyRate: 180,
          rating: 4.6,
          bio: 'Senior engineering manager helping technical professionals transition to leadership roles.',
          image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
          experience: 8,
          certifications: ['Agile Certified', 'Product Management'],
          languages: ['English', 'Korean'],
        },
        {
          name: 'Lisa Thompson',
          expertise: ['Healthcare', 'Career Transition'],
          hourlyRate: 140,
          rating: 4.8,
          bio: 'Healthcare executive specializing in career transitions and leadership development.',
          image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
          experience: 18,
          certifications: ['Healthcare Management', 'Life Coach'],
          languages: ['English'],
        },
        {
          name: 'James Wilson',
          expertise: ['Sales', 'Negotiation'],
          hourlyRate: 160,
          rating: 4.5,
          bio: 'Sales director with proven track record in building high-performing sales teams.',
          image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400',
          experience: 14,
          certifications: ['Sales Management', 'Negotiation Expert'],
          languages: ['English', 'French'],
        }
      ];

      // Insert sample coaches
      await Coach.insertMany(sampleCoaches);
      
      // Fetch the newly created coaches
      const newCoaches = await Coach.find({})
        .sort({ rating: -1 })
        .limit(6)
        .select('name expertise hourlyRate rating image bio experience')
        .lean();
      
      return NextResponse.json(newCoaches);
    }

    return NextResponse.json(featuredCoaches);
  } catch (error) {
    console.error('Error fetching featured coaches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured coaches' },
      { status: 500 }
    );
  }
}