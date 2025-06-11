'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Award, 
  BarChart3, 
  CheckCircle, 
  ArrowRight, 
  Play,
  Building2,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import TestimonialCard from '@/components/TestimonialCard';
import NewsletterForm from '@/components/NewsletterForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CorporatePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const contactFormRef = useRef<HTMLDivElement>(null);

  const scrollToContactForm = () => {
    contactFormRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
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
      title: 'Leadership Development',
      description: 'Transform your managers into inspiring leaders with personalized coaching programs that drive team performance and engagement.',
      features: ['Executive coaching', 'Management training', 'Leadership assessments', '360-degree feedback'],
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Users,
      title: 'Employee Retention',
      description: 'Reduce turnover by 40% with career development programs that help employees see their future within your organization.',
      features: ['Career pathing', 'Skill development', 'Internal mobility', 'Succession planning'],
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Award,
      title: 'DEI Coaching',
      description: 'Build inclusive leadership capabilities and create psychological safety for all team members to thrive.',
      features: ['Inclusive leadership', 'Bias training', 'Cultural competency', 'Allyship development'],
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: BarChart3,
      title: 'Custom Analytics',
      description: 'Track ROI with comprehensive analytics showing engagement, performance improvements, and business impact.',
      features: ['Progress tracking', 'ROI measurement', 'Performance metrics', 'Custom reporting'],
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    }
  ];

  const packages = [
    {
      name: 'Starter',
      description: 'Perfect for small teams getting started with coaching',
      price: '$1,000',
      sessions: '10 sessions',
      features: [
        '10 one-on-one coaching sessions',
        'Basic progress tracking',
        'Email support',
        'Standard coach matching',
        'Monthly progress reports'
      ],
      popular: false,
      cta: 'Get Started'
    },
    {
      name: 'Professional',
      description: 'Comprehensive coaching for growing organizations',
      price: '$2,500',
      sessions: '25 sessions',
      features: [
        '25 one-on-one coaching sessions',
        'Advanced analytics dashboard',
        'Priority support',
        'Expert coach matching',
        'Bi-weekly progress reports',
        'Team coaching sessions',
        'Leadership assessments'
      ],
      popular: true,
      cta: 'Most Popular'
    },
    {
      name: 'Enterprise',
      description: 'Scalable solutions for large organizations',
      price: 'Custom',
      sessions: 'Unlimited',
      features: [
        'Unlimited coaching sessions',
        'Custom analytics & reporting',
        'Dedicated account manager',
        'White-label platform',
        'API integrations',
        'Custom coach training',
        'Executive coaching programs',
        'Global coach network'
      ],
      popular: false,
      cta: 'Contact Sales'
    }
  ];

  const testimonials = [
    {
      id: '1',
      quote: "Our employee engagement scores increased by 35% after implementing CareerCoach's leadership development program. The personalized approach really made the difference.",
      author: 'Sarah Mitchell',
      role: 'Chief People Officer',
      company: 'TechFlow Solutions',
      companySize: '500+ employees',
      industry: 'Technology',
      rating: 5,
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      results: ['35% engagement increase', '40% retention improvement', '25% faster promotions']
    },
    {
      id: '2',
      quote: "The ROI was immediate. Within 6 months, we saw a 40% reduction in turnover and our managers were more confident in leading their teams through change.",
      author: 'Michael O\'Connor',
      role: 'VP of Human Resources',
      company: 'Global Finance Corp',
      companySize: '1000+ employees',
      industry: 'Financial Services',
      rating: 5,
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      results: ['40% turnover reduction', '$2M cost savings', '90% manager satisfaction']
    },
    {
      id: '3',
      quote: "CareerCoach helped us build a more inclusive culture. Our diversity metrics improved significantly, and employees feel more valued and heard.",
      author: 'Dr. Priya Patel',
      role: 'Director of Diversity & Inclusion',
      company: 'HealthTech Innovations',
      companySize: '200-500 employees',
      industry: 'Healthcare Technology',
      rating: 5,
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      results: ['50% increase in inclusion scores', '60% more diverse leadership', '30% better team collaboration']
    }
  ];

  const stats = [
    { value: '500+', label: 'Companies Served', icon: Building2 },
    { value: '50,000+', label: 'Employees Coached', icon: Users },
    { value: '40%', label: 'Average Retention Increase', icon: TrendingUp },
    { value: '4.9/5', label: 'Client Satisfaction', icon: Star }
  ];

  const regions = [
    { name: 'North America', countries: 'USA, Canada', flag: '🇺🇸' },
    { name: 'Europe', countries: 'Ireland, UK, Germany, France', flag: '🇪🇺' },
    { name: 'Asia Pacific', countries: 'Australia, Singapore, Japan', flag: '🌏' },
    { name: 'Global', countries: 'Remote coaching worldwide', flag: '🌍' }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
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
                  <Building2 className="w-4 h-4 mr-1" />
                  Corporate Solutions
                </Badge>
                <Badge variant="outline" className="border-white/30 text-white">
                  Trusted by 500+ Companies
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Empower Your Team with
                <span className="block text-amber-400">Expert Coaching</span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
                Transform your organization&apos;s talent development with personalized coaching programs 
                that drive engagement, retention, and performance across Ireland, Canada, Europe, USA, and Russia.
              </p>

              {/* Key Benefits */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-blue-100">40% Better Retention</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-blue-100">Custom Analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-blue-100">Global Coach Network</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-blue-100">Proven ROI</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={scrollToContactForm}
                  size="lg" 
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 text-lg"
                >
                  Request a Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </motion.div>

            {/* Right Column - Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:pl-8"
            >
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center"
                  >
                    <stat.icon className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-blue-200 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Global Reach Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Global Coaching Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Serving organizations across multiple regions with culturally-aware coaching solutions
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {regions.map((region) => (
              <motion.div
                key={region.name}
                variants={fadeInUp}
                className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{region.flag}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{region.name}</h3>
                <p className="text-gray-600 text-sm">{region.countries}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transform Your Organization
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive coaching solutions address your most critical talent development challenges
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {benefits.map((benefit) => (
              <motion.div
                key={benefit.title}
                variants={fadeInUp}
                className="group"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg group-hover:-translate-y-2">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 ${benefit.bgColor} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {benefit.description}
                    </p>
                    <div className="space-y-2">
                      {benefit.features.map((feature, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Flexible Coaching Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect package for your organization&apos;s size and needs
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {packages.map((pkg) => (
              <motion.div
                key={pkg.name}
                variants={fadeInUp}
                className="relative"
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-amber-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card className={`h-full ${pkg.popular ? 'border-2 border-amber-500 shadow-xl' : 'border border-gray-200 shadow-lg'} hover:shadow-xl transition-shadow`}>
                  <CardHeader className="text-center p-8">
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {pkg.name}
                    </CardTitle>
                    <p className="text-gray-600 mb-4">{pkg.description}</p>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">{pkg.price}</span>
                      {pkg.price !== 'Custom' && <span className="text-gray-600 ml-2">/ package</span>}
                    </div>
                    <div className="text-blue-800 font-semibold">{pkg.sessions}</div>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={scrollToContactForm}
                      className={`w-full ${pkg.popular ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold py-3`}
                    >
                      {pkg.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories from Our Clients
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how organizations like yours have transformed their teams with our coaching solutions
            </p>
          </motion.div>

          <div className="relative">
            {/* Testimonial Carousel */}
            <div className="overflow-hidden">
              <motion.div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                    <TestimonialCard testimonial={testimonial} index={index} />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center items-center space-x-4 mt-8">
              <Button
                onClick={prevTestimonial}
                variant="outline"
                size="sm"
                className="rounded-full w-10 h-10 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                onClick={nextTestimonial}
                variant="outline"
                size="sm"
                className="rounded-full w-10 h-10 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section ref={contactFormRef} className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Team?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get a customized coaching solution tailored to your organization&apos;s unique needs and goals.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-blue-800 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Updated on Corporate Coaching Trends
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Get monthly insights on talent development, leadership trends, and coaching best practices delivered to your inbox.
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterForm
                showNameFields={true}
                size="large"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}