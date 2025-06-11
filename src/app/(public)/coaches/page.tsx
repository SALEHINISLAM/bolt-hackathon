import { Metadata } from 'next';
import CoachesClient from '@/components/CoachesClient';

export const metadata: Metadata = {
  title: 'Find Expert Career Coaches - Career Coaching Platform',
  description: 'Browse our curated list of expert career coaches. Filter by expertise, price, and rating to find the perfect coach for your career goals.',
  keywords: 'career coaches, professional coaching, career development, expert coaches, career guidance',
  openGraph: {
    title: 'Find Expert Career Coaches',
    description: 'Browse our curated list of expert career coaches',
    type: 'website',
  },
};

export const revalidate = 3600; // Revalidate every hour

interface SearchParams {
  page?: string;
  expertise?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  search?: string;
}

interface CoachesPageProps {
  searchParams: SearchParams;
}

export default function CoachesPage({ searchParams }: CoachesPageProps) {
  return <CoachesClient searchParams={searchParams} />;
}