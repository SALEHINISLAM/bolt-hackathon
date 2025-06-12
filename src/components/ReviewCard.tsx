'use client';

import { motion } from 'framer-motion';
import { Star, CheckCircle, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface ReviewCardProps {
  review: {
    _id: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    sessionDate: string | Date;
    isVerified: boolean;
    createdAt: string | Date;
  };
  index?: number;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, index = 0 }) => {
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {review.userAvatar ? (
                    <Image
                      src={review.userAvatar}
                      alt={review.userName}
                      className="w-12 h-12 rounded-full object-cover"
                      width={48}
                      height={48}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center text-white font-semibold">
                      {review.userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {review.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                    {review.isVerified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Session: {formatDate(review.sessionDate)}</span>
                  </div>
                </div>
              </div>
              
              {/* Rating */}
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {review.rating}.0
                </span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <p className="text-gray-700 leading-relaxed">
                &ldquo;{review.comment}&rdquo;
              </p>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Reviewed on {formatDate(review.createdAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReviewCard;