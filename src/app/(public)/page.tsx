'use client';

import { useState, useEffect } from 'react';
import { motion } from "motion/react";
import { Search, Star, Users, Video, MessageCircle, ArrowRight, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CoachCard from '@/components/CoachCard';
import NewsletterForm from '@/components/NewsletterForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface Coach {
  _id: string;
  name: string;
  expertise: string[];
  hourlyRate: number;
  rating: number;
  image: string;
  bio: string;
  experience: number;
}

const HomePage = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');

  useEffect(() => {
    fetchFeaturedCoaches();
  }, []);

  const fetchFeaturedCoaches = async () => {
    try {
      const response = await fetch('/api/coaches/featured');
      if (response.ok) {
        const data = await response.json();
        setCoaches(data);
      }
    } catch (error) {
      console.error('Error fetching coaches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (selectedExpertise) params.append('expertise', selectedExpertise);
    if (selectedPrice) params.append('price', selectedPrice);
    
    const queryString = params.toString();
    window.location.href = `/coaches${queryString ? `?${queryString}` : ''}`;
  };

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

  const testimonials = [
    {
      quote: "Working with my coach transformed my career. I went from feeling stuck to landing my dream job in just 3 months!",
      author: "Sarah M.",
      role: "Software Engineer",
      rating: 5
    },
    {
      quote: "The personalized approach and industry expertise helped me navigate a difficult career transition successfully.",
      author: "Michael R.",
      role: "Marketing Director",
      rating: 5
    },
    {
      quote: "Excellent coaching service. My coach helped me develop leadership skills that got me promoted to senior management.",
      author: "Jennifer L.",
      role: "Operations Manager",
      rating: 5
    }
  ];

  const howItWorksSteps = [
    {
      step: 1,
      title: "Search & Discover",
      description: "Browse our curated list of expert coaches and find the perfect match for your career goals.",
      icon: Search
    },
    {
      step: 2,
      title: "Book Your Session",
      description: "Schedule a convenient time that works for you and your chosen coach.",
      icon: Users
    },
    {
      step: 3,
      title: "Connect & Grow",
      description: "Meet via Zoom or Google Meet and start your journey to career success.",
      icon: Video
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Your Career, Your Coach,
              <span className="block text-amber-400">Your Success</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Connect with expert career coaches who understand your industry and help you achieve your professional goals.
            </p>
            
            {/* Search Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                  <div className="col-span-2 h-full">
                    <Input
                      type="text"
                      placeholder="What career area do you need help with?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-12 text-gray-900 border-0 bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                  <div className="col-span-1">
                    <Select value={selectedExpertise} onValueChange={setSelectedExpertise}>
                      <SelectTrigger className="h-full text-gray-900 border-0 bg-white/50 backdrop-blur-sm">
                        <SelectValue  placeholder="Expertise" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="leadership">Leadership</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                      <SelectTrigger className="h-12 text-gray-900 border-0 bg-white/50 backdrop-blur-sm">
                        <SelectValue placeholder="Price Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-100">$0 - $100</SelectItem>
                        <SelectItem value="100-200">$100 - $200</SelectItem>
                        <SelectItem value="200+">$200+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="col-span-2 h-12 px-8 bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search Coaches
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Coaches Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Featured Coaches
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Industry experts ready to guide you to your next career milestone
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-96"></div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {coaches.map((coach, index) => (
                <CoachCard key={coach._id} coach={coach} index={index} />
              ))}
            </motion.div>
          )}

          <motion.div
            {...fadeInUp}
            className="text-center mt-12"
          >
            <Button size="lg" variant="outline" className="border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white">
              View All Coaches
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started with career coaching is simple and straightforward
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {howItWorksSteps.map((step) => (
              <motion.div
                key={step.step}
                variants={fadeInUp}
                className="text-center"
              >
                <Card className="p-8 h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <step.icon className="w-8 h-8 text-blue-800" />
                    </div>
                    <div className="w-8 h-8 bg-blue-800 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our coaching has transformed careers and lives
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 italic leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="py-20 bg-gradient-to-r from-blue-800 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            {...fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-4">
              Stay Ahead in Your Career
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Get weekly career tips, industry insights, and exclusive coaching resources delivered to your inbox.
            </p>
            <NewsletterForm />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;