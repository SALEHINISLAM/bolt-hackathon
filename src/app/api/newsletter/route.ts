import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/ConnectDB';
import NewsletterSubscriber from '@/lib/models/NewsletterSubscriber';
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName } = await request.json();

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

    try {
      // Connect to database
      const db = await connectToDatabase();
      
      if (!db) {
        return NextResponse.json(
          { error: 'Database connection failed. Please try again later.' },
          { status: 500 }
        );
      }

      // Check if email already exists
      const existingSubscriber = await NewsletterSubscriber.findOne({ 
        email: email.toLowerCase() 
      });

      if (existingSubscriber) {
        if (existingSubscriber.isVerified) {
          return NextResponse.json(
            { error: 'This email is already subscribed to our newsletter' },
            { status: 409 }
          );
        } else {
          // Resend verification email for unverified subscriber
          const verificationToken = crypto.randomBytes(32).toString('hex');
          existingSubscriber.verificationToken = verificationToken;
          existingSubscriber.firstName = firstName?.trim() || existingSubscriber.firstName;
          existingSubscriber.lastName = lastName?.trim() || existingSubscriber.lastName;
          await existingSubscriber.save();

          // Send verification email
          const emailResult = await sendVerificationEmail(
            email.toLowerCase(),
            firstName?.trim() || 'there',
            verificationToken
          );

          if (!emailResult.success) {
            return NextResponse.json(
              { error: 'Failed to send verification email. Please try again.' },
              { status: 500 }
            );
          }

          return NextResponse.json({
            message: 'Verification email sent! Please check your inbox and click the confirmation link.',
            email: email.toLowerCase(),
            resent: true,
          }, { status: 200 });
        }
      }

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');

      // Create new subscriber (unverified)
      const newSubscriber = new NewsletterSubscriber({ 
        email: email.toLowerCase(),
        firstName: firstName?.trim() || '',
        lastName: lastName?.trim() || '',
        verificationToken,
        isVerified: false,
        isActive: false, // Will be activated after verification
      });

      await newSubscriber.save();

      // Send verification email
      const emailResult = await sendVerificationEmail(
        email.toLowerCase(),
        firstName?.trim() || 'there',
        verificationToken
      );

      if (!emailResult.success) {
        // Delete the subscriber if email failed to send
        await NewsletterSubscriber.deleteOne({ _id: newSubscriber._id });
        return NextResponse.json(
          { error: 'Failed to send verification email. Please try again.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Verification email sent! Please check your inbox and click the confirmation link.',
        email: email.toLowerCase(),
      }, { status: 201 });

    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      return NextResponse.json(
        { error: 'Failed to process subscription. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve newsletter statistics
export async function GET() {
  try {
    const db = await connectToDatabase();
    
    if (!db) {
      return NextResponse.json({
        totalSubscribers: 0,
        verifiedSubscribers: 0,
        message: 'Database unavailable'
      });
    }

    const totalSubscribers = await NewsletterSubscriber.countDocuments({});
    const verifiedSubscribers = await NewsletterSubscriber.countDocuments({ 
      isVerified: true,
      isActive: true 
    });

    return NextResponse.json({
      totalSubscribers,
      verifiedSubscribers,
    });
  } catch (error) {
    console.error('Error fetching newsletter stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsletter statistics' },
      { status: 500 }
    );
  }
}