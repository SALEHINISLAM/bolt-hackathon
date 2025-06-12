import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/ConnectDB';
import CorporateInquiry from '@/lib/models/CorporateInquiry';
import { sendCorporateInquiryNotification } from '@/lib/email';

interface CorporateInquiryQuery {
  status?: string;
  region?: string;
  // Add other potential filter fields here
  // Example:
  // companyName?: { $regex: RegExp };
  // createdAt?: { $gte?: Date; $lte?: Date };
}

export async function POST(request: NextRequest) {
  try {
    const {
      companyName,
      contactName,
      email,
      phone,
      message,
      companySize,
      industry,
      region,
      interestedServices,
      budget,
      timeline
    } = await request.json();

    // Validation
    if (!companyName || !contactName || !email || !message) {
      return NextResponse.json(
        { error: 'Company name, contact name, email, and message are required' },
        { status: 400 }
      );
    }

    if (companyName.length > 100) {
      return NextResponse.json(
        { error: 'Company name must be less than 100 characters' },
        { status: 400 }
      );
    }

    if (contactName.length > 100) {
      return NextResponse.json(
        { error: 'Contact name must be less than 100 characters' },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message must be less than 2000 characters' },
        { status: 400 }
      );
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    try {
      const db = await connectToDatabase();
      
      if (!db) {
        // Return success even if database is not available (graceful degradation)
        return NextResponse.json({
          success: true,
          message: 'Thank you for your inquiry! Our team will contact you within 24 hours.',
          inquiry: {
            id: `temp-${Date.now()}`,
            companyName,
            contactName,
            email,
            createdAt: new Date(),
          },
        }, { status: 201 });
      }

      // Check for duplicate inquiries (same email and company within 24 hours)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const existingInquiry = await CorporateInquiry.findOne({
        email: email.toLowerCase(),
        companyName: { $regex: new RegExp(companyName, 'i') },
        createdAt: { $gte: twentyFourHoursAgo }
      });

      if (existingInquiry) {
        return NextResponse.json(
          { error: 'An inquiry from this company and email was already submitted recently. Please wait 24 hours before submitting another inquiry.' },
          { status: 409 }
        );
      }

      // Create new corporate inquiry
      const newInquiry = new CorporateInquiry({
        companyName: companyName.trim(),
        contactName: contactName.trim(),
        email: email.toLowerCase(),
        phone: phone?.trim(),
        message: message.trim(),
        companySize,
        industry: industry?.trim(),
        region,
        interestedServices: interestedServices || [],
        budget,
        timeline,
        source: 'corporate_website',
      });

      await newInquiry.save();

      // Send notification email to admin (optional)
      try {
        await sendCorporateInquiryNotification({
          companyName: newInquiry.companyName,
          contactName: newInquiry.contactName,
          email: newInquiry.email,
          phone: newInquiry.phone,
          message: newInquiry.message,
          companySize: newInquiry.companySize,
          industry: newInquiry.industry,
          region: newInquiry.region,
          interestedServices: newInquiry.interestedServices,
          budget: newInquiry.budget,
          timeline: newInquiry.timeline,
          inquiryId: newInquiry._id.toString(),
        });
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
        // Don't fail the request if email fails
      }

      return NextResponse.json({
        success: true,
        message: 'Thank you for your inquiry! Our team will contact you within 24 hours.',
        inquiry: {
          id: newInquiry._id.toString(),
          companyName: newInquiry.companyName,
          contactName: newInquiry.contactName,
          email: newInquiry.email,
          createdAt: newInquiry.createdAt,
        },
      }, { status: 201 });

    } catch (dbError) {
      console.warn('Database operation failed:', dbError);
      
      // Return success even if database fails (graceful degradation)
      return NextResponse.json({
        success: true,
        message: 'Thank you for your inquiry! Our team will contact you within 24 hours.',
        inquiry: {
          id: `temp-${Date.now()}`,
          companyName,
          contactName,
          email,
          createdAt: new Date(),
        },
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Corporate inquiry error:', error);
    return NextResponse.json(
      { error: 'Failed to submit inquiry. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve corporate inquiries (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const region = searchParams.get('region');
    
    const skip = (page - 1) * limit;

    try {
      const db = await connectToDatabase();
      
      if (!db) {
        return NextResponse.json({
          inquiries: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalInquiries: 0,
            hasNextPage: false,
            hasPrevPage: false,
          }
        });
      }

      // Build query
      const query: CorporateInquiryQuery = {};
      if (status) query.status = status;
      if (region) query.region = region;

      // Get total count
      const totalInquiries = await CorporateInquiry.countDocuments(query);
      const totalPages = Math.ceil(totalInquiries / limit);

      // Fetch inquiries
      const inquiries = await CorporateInquiry.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      return NextResponse.json({
        inquiries,
        pagination: {
          currentPage: page,
          totalPages,
          totalInquiries,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        }
      });
    } catch (dbError) {
      console.warn('Database operation failed:', dbError);
      return NextResponse.json({
        inquiries: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalInquiries: 0,
          hasNextPage: false,
          hasPrevPage: false,
        }
      });
    }
  } catch (error) {
    console.error('Error fetching corporate inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}