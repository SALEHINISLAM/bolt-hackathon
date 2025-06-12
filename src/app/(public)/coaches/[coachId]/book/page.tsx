import { Metadata, NextPage } from 'next';
import { notFound } from 'next/navigation';
import BookingPageClient from '@/components/BookingPageClient';

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

interface BookingPageProps {
  params: { coachId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Match Next.js's exact expectation for both params and searchParams
interface LoosePageProps {
  params: Promise<{ coachId: string }> | undefined;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | undefined;
}

export async function generateMetadata(
  { params }: BookingPageProps
): Promise<Metadata> {
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

const BookingPage: NextPage<LoosePageProps> = async ({ params, searchParams }) => {
  // Resolve params if it's a Promise, handle undefined
  const typedParams = params ? await params : { coachId: '' };
  // Resolve searchParams if it's a Promise, handle undefined
  const typedSearchParams = searchParams ? await searchParams : {};

  console.log('params:', typedParams, 'searchParams:', typedSearchParams); // Debug log

  if (!typedParams.coachId) {
    notFound();
  }

  const data = await getCoachData(typedParams.coachId);

  if (!data) {
    notFound();
  }

  return <BookingPageClient data={data} coachId={typedParams.coachId} />;
};

export default BookingPage;

export const revalidate = 3600;