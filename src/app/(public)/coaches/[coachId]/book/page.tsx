import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BookingPageClient from '@/components/BookingPageClient';

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
  } catch (error) {
    console.error('Error fetching coach data:', error);
    return null;
  }
}

// ✅ Correct typing: do not reuse or import PageProps
export async function generateMetadata(
  props: { params: { coachId: string } }
): Promise<Metadata> {
  const coachId = props.params.coachId;
  const data = await getCoachData(coachId);

  if (!data) {
    return {
      title: 'Coach Not Found - Career Coaching Platform',
      description: 'The requested coach profile could not be found.',
    };
  }

  const { coach } = data;

  return {
    title: `Book ${coach.name} - Career Coaching Session`,
    description: `Book a personalized career coaching session with ${coach.name}. Expert guidance for your professional development.`,
    keywords: `book ${coach.name}, career coaching session, ${coach.expertise.join(', ')}, professional coaching`,
  };
}

// ✅ No custom type; just inline destructure and type
export default async function Page({
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

// ✅ Static revalidation
export const revalidate = 3600;
