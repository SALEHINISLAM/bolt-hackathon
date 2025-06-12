import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BookingPageClient from '@/components/BookingPageClient';

// Data fetching function
async function getCoachData(coachId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/coaches/${coachId}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error('Error fetching coach data:', err);
    return null;
  }
}

// Metadata generation
export async function generateMetadata({
  params,
}: {
  params: { coachId: string };
}): Promise<Metadata> {
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
    description: `Book a personalized coaching session with ${coach.name}`,
    keywords: coach.expertise?.join(', ') ?? '',
  };
}

// Main page component
export default async function BookingPage({
  params,
}: {
  params: { coachId: string };
}) {
  const data = await getCoachData(params.coachId);

  if (!data) {
    notFound();
  }

  return <BookingPageClient data={data} coachId={params.coachId} />;
}

export const revalidate = 3600;