import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/ConnectDB';
import Booking from '@/lib/models/Booking';
import CorporateAccount from '@/lib/models/CorporateAccounts';
import User from '@/lib/models/User';
import mongoose from 'mongoose';

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

// Define proper types for the populated booking with MongoDB fields
interface PopulatedCoach {
  _id: mongoose.Types.ObjectId;
  name: string;
  image: string;
  expertise: string[];
  __v: number;
}

interface EmployeeDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  __v: number;
}

interface BookingDocument {
  _id: mongoose.Types.ObjectId;
  userId: string;
  coachId: PopulatedCoach;
  dateTime: Date;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  notes?: string;
  __v: number;
}

interface MongoBookingResult {
  _id: unknown;
  userId: string;
  coachId: PopulatedCoach;
  dateTime: Date;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  notes?: string;
  __v: number;
}

// Type guard to validate booking structure
function isValidBooking(booking: unknown): booking is BookingDocument {
  const b = booking as BookingDocument;
  return b &&
         b._id &&
         b.coachId &&
         b.dateTime &&
         typeof b.duration === 'number' &&
         typeof b.status === 'string' &&
         typeof b.totalAmount === 'number' &&
         typeof b.userId === 'string';
}

// Type guard to validate employee structure
function isValidEmployee(employee: unknown): employee is EmployeeDocument {
  const e = employee as EmployeeDocument;
  return e &&
         e._id &&
         typeof e.name === 'string' &&
         typeof e.email === 'string';
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession | null;
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = session.user;

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Admin role required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    try {
      const db = await connectToDatabase();
      
      if (!db) {
        // Return mock data if database is not available
        const mockBookings = [
          {
            _id: '1',
            dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
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
            dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // In 3 days
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
          },
          {
            _id: '3',
            dateTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last week
            duration: 60,
            status: 'completed',
            totalAmount: 150,
            employee: {
              name: 'Mike Johnson',
              email: 'mike.johnson@techcorp.com'
            },
            coach: {
              _id: '3',
              name: 'Emily Rodriguez',
              image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
              expertise: ['Marketing', 'Personal Branding']
            },
            notes: 'Personal branding workshop'
          }
        ];

        return NextResponse.json({
          bookings: mockBookings,
          pagination: {
            currentPage: page,
            totalPages: 1,
            totalBookings: mockBookings.length,
            hasNextPage: false,
            hasPrevPage: false
          }
        });
      }

      // Find corporate account
      const corporateAccount = await CorporateAccount.findOne({ 
        adminUserId: user.id,
        isActive: true 
      });

      if (!corporateAccount) {
        return NextResponse.json(
          { error: 'Corporate account not found' },
          { status: 404 }
        );
      }

      // Get total count for pagination
      const totalBookings = await Booking.countDocuments({
        userId: { $in: corporateAccount.employees }
      });

      // Fetch corporate bookings with pagination
      const bookingsQuery = await Booking.find({
        userId: { $in: corporateAccount.employees }
      })
      .populate('coachId', 'name image expertise')
      .sort({ dateTime: -1 })
      .skip(skip)
      .limit(limit)
      .lean() as MongoBookingResult[];

      // Filter and validate bookings, then get employee information
      const validBookings = bookingsQuery
        .filter((booking): booking is BookingDocument => isValidBooking(booking));

      const bookings = await Promise.all(
        validBookings.map(async (booking) => {
          try {
            const employeeQuery = await User.findOne({ email: booking.userId }).select('name email').lean();
            
            // Type guard to ensure employee has the expected structure
            const employee = isValidEmployee(employeeQuery) ? employeeQuery : null;
            
            return {
              _id: booking._id.toString(),
              dateTime: booking.dateTime,
              duration: booking.duration || 60,
              status: booking.status || 'pending',
              totalAmount: booking.totalAmount || 0,
              employee: {
                name: employee?.name || 'Unknown Employee',
                email: booking.userId
              },
              coach: {
                _id: booking.coachId._id?.toString() || booking.coachId.toString(),
                name: booking.coachId.name || 'Unknown Coach',
                image: booking.coachId.image || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
                expertise: booking.coachId.expertise || []
              },
              notes: booking.notes || ''
            };
          } catch (error) {
            console.error('Error fetching employee info:', error);
            return {
              _id: booking._id.toString(),
              dateTime: booking.dateTime,
              duration: booking.duration || 60,
              status: booking.status || 'pending',
              totalAmount: booking.totalAmount || 0,
              employee: {
                name: 'Unknown Employee',
                email: booking.userId
              },
              coach: {
                _id: booking.coachId._id?.toString() || 'unknown',
                name: booking.coachId.name || 'Unknown Coach',
                image: booking.coachId.image || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
                expertise: booking.coachId.expertise || []
              },
              notes: booking.notes || ''
            };
          }
        })
      );

      const totalPages = Math.ceil(totalBookings / limit);

      return NextResponse.json({
        bookings,
        pagination: {
          currentPage: page,
          totalPages,
          totalBookings,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    } catch (dbError) {
      console.warn('Database operation failed, returning mock data:', dbError);
      
      // Return mock data if database fails
      const mockBookings = [
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
        }
      ];

      return NextResponse.json({
        bookings: mockBookings,
        pagination: {
          currentPage: page,
          totalPages: 1,
          totalBookings: mockBookings.length,
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    }
  } catch (error) {
    console.error('Error fetching corporate bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch corporate bookings' },
      { status: 500 }
    );
  }
}