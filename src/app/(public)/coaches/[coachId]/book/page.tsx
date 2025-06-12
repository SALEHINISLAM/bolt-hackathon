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

const BookingPage: NextPage<LoosePageProps> = async ({ params }) => {
  const typedParams = params ? await params : { coachId: '' };
  console.log('params:', typedParams); // Debug log

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