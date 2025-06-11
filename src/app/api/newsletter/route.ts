import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/ConnectDB';
import NewsletterSubscriber from '@/lib/models/NewsletterSubscriber';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if email already exists
    const existingSubscriber = await NewsletterSubscriber.findOne({ email });
    
    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { error: 'Email is already subscribed to our newsletter' },
          { status: 409 }
        );
      } else {
        // Reactivate if previously unsubscribed
        existingSubscriber.isActive = true;
        existingSubscriber.subscribedAt = new Date();
        await existingSubscriber.save();
        
        return NextResponse.json({
          message: 'Successfully resubscribed to our newsletter!',
          email: existingSubscriber.email,
        });
      }
    }

    // Create new subscriber
    const newSubscriber = new NewsletterSubscriber({ email });
    await newSubscriber.save();

    return NextResponse.json({
      message: 'Successfully subscribed to our newsletter!',
      email: newSubscriber.email,
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'Email is already subscribed to our newsletter' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter. Please try again.' },
      { status: 500 }
    );
  }
}