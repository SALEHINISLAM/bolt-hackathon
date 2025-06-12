"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface TestimonialCardProps {
  testimonial: {
    id: string;
    quote: string;
    author: string;
    role: string;
    company: string;
    companySize: string;
    industry: string;
    rating: number;
    image?: string;
    results?: string[];
  };
  index?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md group">
        <CardContent className="p-6 h-full flex flex-col">
          {/* Quote Icon */}
          <div className="flex items-start justify-between mb-4">
            <Quote className="w-8 h-8 text-blue-800 opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="flex items-center space-x-1">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-500 fill-current"
                />
              ))}
            </div>
          </div>

          {/* Quote */}
          <blockquote className="text-gray-700 leading-relaxed mb-6 flex-1 italic">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>

          {/* Results */}
          {testimonial.results && testimonial.results.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Key Results:
              </h4>
              <div className="flex flex-wrap gap-2">
                {testimonial.results.map((result, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-xs bg-green-50 text-green-700 border-green-200"
                  >
                    {result}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Author Info */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center space-x-3">
              {testimonial.image ? (
                <Image
                  src={testimonial.image}
                  alt={testimonial.author}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.author.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {testimonial.author}
                </p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
                <p className="text-sm text-blue-800 font-medium">
                  {testimonial.company}
                </p>
              </div>
            </div>

            {/* Company Details */}
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                {testimonial.companySize}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {testimonial.industry}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestimonialCard;
