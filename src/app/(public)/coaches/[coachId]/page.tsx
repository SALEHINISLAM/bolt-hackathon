import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CoachProfileClient from '@/components/coachProfileClient';

interface CoachProfilePageProps {
  params: {
    coachId: string;
  };
}

async function getCoachData(coachId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/coaches/${coachId}`, {
      next: { revalidate: 86400 }, // Revalidate every 24 hours
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch coach data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching coach data:', error);
    // Return null to trigger 404 page
    return null;
  }
}

export async function generateMetadata({ params }: CoachProfilePageProps): Promise<Metadata> {
  const data = await getCoachData(params.coachId);
  
  if (!data) {
    return {
      title: 'Coach Not Found - Career Coaching Platform',
      description: 'The requested coach profile could not be found.',
    };
  }

  const { coach } = data;
  
  return {
    title: `${coach.name} - Expert Career Coach | Career Coaching Platform`,
    description: `Book a session with ${coach.name}, an expert career coach specializing in ${coach.expertise.join(', ')}. ${coach.bio.substring(0, 150)}...`,
    keywords: `${coach.name}, career coach, ${coach.expertise.join(', ')}, professional coaching, career development`,
    openGraph: {
      title: `${coach.name} - Expert Career Coach`,
      description: coach.bio,
      images: [
        {
          url: coach.image,
          width: 800,
          height: 600,
          alt: `${coach.name} - Career Coach`,
        },
      ],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${coach.name} - Expert Career Coach`,
      description: coach.bio,
      images: [coach.image],
    },
  };
}

export default async function CoachProfilePage({ params }: CoachProfilePageProps) {
  const data = await getCoachData(params.coachId);

  if (!data) {
    notFound();
  }

  return <CoachProfileClient data={data} coachId={params.coachId} />;
}

export const revalidate = 86400; // Revalidate every 24 hours