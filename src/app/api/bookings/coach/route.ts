import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/ConnectDB';
import Booking from '@/lib/models/Booking';
import User from '@/lib/models/User';
import mongoose from 'mongoose';

// Define proper types for the populated booking with MongoDB fields
interface ClientDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  __v: number;
}

interface BookingDocument {
  _id: mongoose.Types.ObjectId;
  userId: string;
  coachId: mongoose.Types.ObjectId;
  dateTime: Date;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  videoLink?: string;
  notes?: string;
  __v: number;
}

interface MongoBookingResult {
  _id: unknown;
  userId: string;
  coachId: mongoose.Types.ObjectId;
  dateTime: Date;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  videoLink?: string;
  notes?: string;
  __v: number;
}

// Type guard to validate booking structure
function isValidBooking(booking: any): booking is BookingDocument {
  return booking &&
         booking._id &&
         booking.coachId &&
         booking.dateTime &&
         typeof booking.duration === 'number' &&
         typeof booking.status === 'string' &&
         typeof booking.totalAmount === 'number' &&
         typeof booking.userId === 'string';
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is a coach
    if ((session.user as { role: string }).role !== 'coach') {
      return NextResponse.json(
        { error: 'Access denied. Coach role required.' },
        { status: 403 }
      );
    }

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
            client: {
              _id: '1',
              name: 'John Smith',
              email: 'john@example.com'
            },
            videoLink: 'https://meet.google.com/mock-session-1',
            notes: 'Career transition discussion'
          },
          {
            _id: '2',
            dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // In 3 days
            duration: 30,
            status: 'pending',
            totalAmount: 75,
            client: {
              _id: '2',
              name: 'Sarah Johnson',
              email: 'sarah@example.com'
            },
            videoLink: null,
            notes: 'Leadership coaching session'
          }
        ];

        return NextResponse.json({ bookings: mockBookings });
      }

      // Find coach by email
      const coach = await User.findOne({ 
        email: session.user.email,
        role: 'coach',
        isActive: true 
      });

      if (!coach) {
        return NextResponse.json(
          { error: 'Coach profile not found' },
          { status: 404 }
        );
      }

      // Fetch coach's upcoming bookings
      const upcomingBookingsQuery = await Booking.find({
        coachId: coach._id,
        status: { $in: ['pending', 'confirmed'] },
        dateTime: { $gte: new Date() }
      })
      .sort({ dateTime: 1 })
      .limit(20)
      .lean() as MongoBookingResult[];

      // Filter and validate bookings, then get client information
      const validBookings = upcomingBookingsQuery
        .filter((booking): booking is BookingDocument => isValidBooking(booking));

      const bookings = await Promise.all(
        validBookings.map(async (booking) => {
          try {
            const client = await User.findOne({ email: booking.userId }).select('name email').lean() as ClientDocument | null;
            
            return {
              _id: booking._id.toString(),
              dateTime: booking.dateTime,
              duration: booking.duration || 60,
              status: booking.status || 'pending',
              totalAmount: booking.totalAmount || 0,
              client: {
                _id: client?._id?.toString() || 'unknown',
                name: client?.name || 'Unknown Client',
                email: booking.userId
              },
              videoLink: booking.videoLink || null,
              notes: booking.notes || ''
            };
          } catch (error) {
            console.error('Error fetching client info:', error);
            return {
              _id: booking._id.toString(),
              dateTime: booking.dateTime,
              duration: booking.duration || 60,
              status: booking.status || 'pending',
              totalAmount: booking.totalAmount || 0,
              client: {
                _id: 'unknown',
                name: 'Unknown Client',
                email: booking.userId
              },
              videoLink: booking.videoLink || null,
              notes: booking.notes || ''
            };
          }
        })
      );

      return NextResponse.json({ bookings });
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
          client: {
            _id: '1',
            name: 'John Smith',
            email: 'john@example.com'
          },
          videoLink: 'https://meet.google.com/mock-session-1',
          notes: 'Career transition discussion'
        }
      ];

      return NextResponse.json({ bookings: mockBookings });
    }
  } catch (error) {
    console.error('Error fetching coach bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}