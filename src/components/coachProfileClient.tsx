'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Star, 
  Award, 
  Globe, 
  Calendar, 
  MessageCircle, 
  Video,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReviewCard from '@/components/ReviewCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';

interface Coach {
  _id: string;
  name: string;
  expertise: string[];
  hourlyRate: number;
  rating: number;
  bio: string;
  image: string;
  experience: number;
  certifications: string[];
  languages: string[];
  videoIntro?: string;
}

interface Review {
  _id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  sessionDate: string | Date;
  isVerified: boolean;
  createdAt: string | Date;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface CoachProfileData {
  coach: Coach;
  reviews: Review[];
  reviewStats: ReviewStats;
}

interface CoachProfileClientProps {
  data: CoachProfileData;
  coachId: string;
}

const CoachProfileClient: React.FC<CoachProfileClientProps> = ({ data, coachId }) => {
  const { coach, reviews, reviewStats } = data;

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const getRatingPercentage = (rating: number) => {
    return reviewStats.totalReviews > 0 
      ? (reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution] / reviewStats.totalReviews) * 100
      : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center"
          >
            {/* Coach Image */}
            <div className="lg:col-span-1">
              <div className="relative">
                <Image
                  src={coach.image}
                  alt={coach.name}
                  className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl object-cover aspect-square"
                  width={500}
                  height={500}
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-800">{coach.rating}</span>
                </div>
              </div>
            </div>

            {/* Coach Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{coach.name}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {coach.expertise.map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="secondary" 
                      className="bg-white/20 text-white hover:bg-white/30 text-sm px-3 py-1"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
                <p className="text-xl text-blue-100 leading-relaxed mb-6">
                  {coach.bio}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">{coach.experience}+</div>
                  <div className="text-sm text-blue-200">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">{reviewStats.totalReviews}</div>
                  <div className="text-sm text-blue-200">Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">{reviewStats.averageRating}</div>
                  <div className="text-sm text-blue-200">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">${coach.hourlyRate}</div>
                  <div className="text-sm text-blue-200">Per Hour</div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Link href={`/coaches/${coachId}/book`}>
                  <Button 
                    size="lg" 
                    className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 text-lg"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Book a Session
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <motion.div {...fadeInUp}>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                      <MessageCircle className="w-6 h-6 mr-2 text-blue-800" />
                      About {coach.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {coach.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Video Introduction */}
              {coach.videoIntro && (
                <motion.div {...fadeInUp}>
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                        <Video className="w-6 h-6 mr-2 text-blue-800" />
                        Video Introduction
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <iframe
                          src={coach.videoIntro}
                          title={`${coach.name} - Video Introduction`}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Reviews Section */}
              <motion.div {...fadeInUp}>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                      <Star className="w-6 h-6 mr-2 text-blue-800" />
                      Client Reviews ({reviewStats.totalReviews})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {reviews.length > 0 ? (
                      <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="space-y-6"
                      >
                        {reviews.map((review, index) => (
                          <ReviewCard key={review._id} review={review} index={index} />
                        ))}
                      </motion.div>
                    ) : (
                      <div className="text-center py-8">
                        <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Booking Card */}
              <motion.div {...fadeInUp}>
                <Card className="border-0 shadow-lg sticky top-8">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        ${coach.hourlyRate}
                        <span className="text-lg font-normal text-gray-600">/hour</span>
                      </div>
                      <div className="flex items-center justify-center space-x-1 mb-4">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="font-semibold text-gray-900">{reviewStats.averageRating}</span>
                        <span className="text-gray-600">({reviewStats.totalReviews} reviews)</span>
                      </div>
                    </div>

                    <Link href={`/coaches/${coachId}/book`}>
                      <Button className="w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold py-3 mb-4">
                        <Calendar className="w-5 h-5 mr-2" />
                        Book Now
                      </Button>
                    </Link>

                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Free consultation available
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Credentials */}
              <motion.div {...fadeInUp}>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-blue-800" />
                      Credentials
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {coach.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Languages */}
              <motion.div {...fadeInUp}>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-blue-800" />
                      Languages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {coach.languages.map((language) => (
                        <Badge 
                          key={language} 
                          variant="secondary" 
                          className="bg-blue-50 text-blue-700"
                        >
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Rating Breakdown */}
              {reviewStats.totalReviews > 0 && (
                <motion.div {...fadeInUp}>
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        Rating Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1 w-12">
                              <span className="text-sm font-medium">{rating}</span>
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            </div>
                            <div className="flex-1">
                              <Progress 
                                value={getRatingPercentage(rating)} 
                                className="h-2"
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-8">
                              {reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CoachProfileClient;