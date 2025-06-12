// File: app/(public)/coaches/[coachId]/book/page.tsx

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BookingPageClient from '@/components/BookingPageClient';

type Props = {
  params: {
    coachId: string;
  };
};

async function getCoachData(coachId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/coaches/${coachId}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch coach data');
    }

    return await response.json();
  } catch (err) {
    console.error('Error fetching coach data:', err);
    return null;
  }
}

// ✅ Correctly typed generateMetadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getCoachData(params.coachId);

  if (!data) {
    return {
      title: 'Coach Not Found - Career Coaching Platform',
      description: 'The requested coach profile could not be found.',
    };
  }

  const { coach } = data;

  return {
    title: `Book ${coach.name} - Career Coaching Session`,
    description: `Book a personalized career coaching session with ${coach.name}.`,
    keywords: coach.expertise?.join(', ') ?? '',
  };
}

// ✅ Correct default export with typed props
export default async function BookingPage({ params }: Props) {
  const data = await getCoachData(params.coachId);

  if (!data) {
    notFound();
  }

  return <BookingPageClient data={data} coachId={params.coachId} />;
}

// ✅ Optional revalidation time
export const revalidate = 3600;
