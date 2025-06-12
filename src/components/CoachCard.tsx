'use client';

import { motion } from 'framer-motion';
import { Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface CoachCardProps {
  coach: {
    _id: string;
    name: string;
    expertise: string[];
    hourlyRate: number;
    rating: number;
    image: string;
    bio: string;
    experience: number;
  };
  index?: number;
}

const CoachCard: React.FC<CoachCardProps> = ({ coach, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            <Image
              src={coach.image}
              alt={coach.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              width={1920}
              height={1080}
            />
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-800">{coach.rating}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-6">
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{coach.name}</h3>
              <p className="text-sm text-gray-600 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {coach.experience} years experience
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {coach.expertise.slice(0, 2).map((skill) => (
                <Badge 
                  key={skill} 
                  variant="secondary" 
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  {skill}
                </Badge>
              ))}
              {coach.expertise.length > 2 && (
                <Badge variant="outline" className="text-gray-600">
                  +{coach.expertise.length - 2} more
                </Badge>
              )}
            </div>

            <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
              {coach.bio}
            </p>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                ${coach.hourlyRate}
                <span className="text-sm font-normal text-gray-600">/hour</span>
              </span>
            </div>
            <Button 
              className="w-full bg-blue-800 hover:bg-blue-900 text-white font-medium py-2"
              size="lg"
            >
              View Profile
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CoachCard;