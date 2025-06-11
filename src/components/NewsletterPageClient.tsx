'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  TrendingUp, 
  Users, 
  Star, 
  CheckCircle, 
  Calendar,
  BookOpen,
  Award,
  Lightbulb,
  Target,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsletterForm from '@/components/NewsletterForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

interface NewsletterStats {
  totalSubscribers: number;
  activeSubscribers: number;
}

const NewsletterPageClient = () => {
  const [stats, setStats] = useState<NewsletterStats>({ totalSubscribers: 0, activeSubscribers: 0 });
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/newsletter');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching newsletter stats:', error);
      // Use mock data as fallback
      setStats({ totalSubscribers: 2847, activeSubscribers: 2654 });
    }
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

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Weekly Career Tips',
      description: 'Actionable strategies to accelerate your career growth and professional development.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Users,
      title: 'Coach Spotlights',
      description: 'Exclusive interviews and insights from our top-rated career coaches.',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Lightbulb,
      title: 'Industry Insights',
      description: 'Latest trends, opportunities, and changes across different industries.',
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    },
    {
      icon: Target,
      title: 'Goal Setting Guides',
      description: 'Frameworks and templates to set and achieve your career objectives.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: BookOpen,
      title: 'Learning Resources',
      description: 'Curated courses, books, and tools to enhance your professional skills.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      icon: Award,
      title: 'Success Stories',
      description: 'Real career transformation stories from our community members.',
      color: 'text-rose-600',
      bgColor: 'bg-rose-100'
    }
  ];

  const testimonials = [
    {
      quote: "The weekly newsletter has been a game-changer for my career. The tips are practical and the coach spotlights provide incredible insights.",
      author: "Sarah Chen",
      role: "Product Manager at Tech Corp",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
      rating: 5
    },
    {
      quote: "I look forward to every newsletter. The industry insights help me stay ahead of trends and make informed career decisions.",
      author: "Michael Rodriguez",
      role: "Marketing Director",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100",
      rating: 5
    },
    {
      quote: "The goal-setting guides and success stories keep me motivated. This newsletter is like having a career coach in my inbox.",
      author: "Emily Johnson",
      role: "Software Engineer",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
      rating: 5
    }
  ];

  const recentTopics = [
    {
      title: "5 Strategies to Negotiate Your Next Salary Increase",
      date: "Dec 15, 2024",
      category: "Career Tips"
    },
    {
      title: "Coach Spotlight: How Sarah Built a 7-Figure Coaching Business",
      date: "Dec 8, 2024",
      category: "Coach Spotlight"
    },
    {
      title: "2025 Tech Industry Trends: What Professionals Need to Know",
      date: "Dec 1, 2024",
      category: "Industry Insights"
    },
    {
      title: "The Art of Personal Branding in the Digital Age",
      date: "Nov 24, 2024",
      category: "Professional Development"
    }
  ];

  const handleSubscriptionSuccess = () => {
    setIsSubscribed(true);
    // Update stats optimistically
    setStats(prev => ({
      totalSubscribers: prev.totalSubscribers + 1,
      activeSubscribers: prev.activeSubscribers + 1
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-white/20 rounded-full"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center space-x-2 mb-6">
                <Badge className="bg-amber-500 text-white px-3 py-1">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Free Newsletter
                </Badge>
                <Badge variant="outline" className="border-white/30 text-white">
                  {stats.activeSubscribers.toLocaleString()}+ Subscribers
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Join Our Free
                <span className="block text-amber-400">Career Growth</span>
                Newsletter
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
                Get weekly career tips, industry insights, and exclusive coaching resources 
                delivered straight to your inbox. Join thousands of professionals advancing their careers.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">50K+</div>
                  <div className="text-sm text-blue-200">Weekly Readers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">4.9★</div>
                  <div className="text-sm text-blue-200">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">100%</div>
                  <div className="text-sm text-blue-200">Free Forever</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Newsletter Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:pl-8"
            >
              <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Start Your Career Journey
                  </CardTitle>
                  <p className="text-gray-600 mt-2">
                    Subscribe now and get instant access to our career growth toolkit
                  </p>
                </CardHeader>
                <CardContent>
                  <NewsletterForm
                    showNameFields={true}
                    size="large"
                    onSuccess={handleSubscriptionSuccess}
                  />
                  
                  {/* Trust Indicators */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>No spam</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Unsubscribe anytime</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Weekly delivery</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What You&apos;ll Get Every Week
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our newsletter is packed with valuable content to help you advance your career and achieve your professional goals.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {benefits.map((benefit) => (
              <motion.div
                key={benefit.title}
                variants={fadeInUp}
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md group-hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${benefit.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Recent Topics Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Recent Newsletter Topics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get a taste of the valuable content our subscribers receive every week.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {recentTopics.map((topic, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group"
              >
                <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md group-hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" className="text-blue-800 border-blue-800">
                        {topic.category}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {topic.date}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-800 transition-colors">
                      {topic.title}
                    </h3>
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
              What Our Subscribers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of professionals who are already benefiting from our weekly insights.
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
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md group-hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-gray-700 mb-6 italic leading-relaxed">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <div className="flex items-center">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.author}</p>
                        <p className="text-gray-600 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-800 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            {...fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join our community of ambitious professionals and start receiving weekly insights that will transform your career trajectory.
            </p>
            
            {!isSubscribed ? (
              <div className="max-w-md mx-auto">
                <NewsletterForm
                  size="large"
                  onSuccess={handleSubscriptionSuccess}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-2">
                  Welcome to the Community!
                </h3>
                <p className="text-blue-100 mb-6">
                  Thank you for subscribing. Your first newsletter will arrive soon.
                </p>
                <Link href="/coaches">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3">
                    Explore Our Coaches
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NewsletterPageClient;