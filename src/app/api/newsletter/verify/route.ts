import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/ConnectDB';
import NewsletterSubscriber from '@/lib/models/NewsletterSubscriber';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    try {
      const db = await connectToDatabase();
      
      if (!db) {
        return NextResponse.json(
          { error: 'Database connection failed' },
          { status: 500 }
        );
      }

      // Find subscriber with the verification token
      const subscriber = await NewsletterSubscriber.findOne({ 
        verificationToken: token,
        isVerified: false 
      });

      if (!subscriber) {
        return NextResponse.json(
          { error: 'Invalid or expired verification token' },
          { status: 404 }
        );
      }

      // Update subscriber as verified
      subscriber.isVerified = true;
      subscriber.isActive = true;
      subscriber.verifiedAt = new Date();
      subscriber.subscribedAt = new Date();
      subscriber.verificationToken = undefined; // Remove the token
      
      await subscriber.save();

      return NextResponse.json({
        success: true,
        message: 'Email verified successfully! Welcome to our newsletter.',
        subscriber: {
          email: subscriber.email,
          firstName: subscriber.firstName,
          verifiedAt: subscriber.verifiedAt,
        }
      });

    } catch (dbError) {
      console.error('Database verification error:', dbError);
      return NextResponse.json(
        { error: 'Failed to verify email. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}