'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Send, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  Users,
  MapPin,
  DollarSign,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface InquiryResponse {
  success: boolean;
  message: string;
  inquiry: {
    id: string;
    companyName: string;
    contactName: string;
    email: string;
    createdAt: Date;
  };
}

interface ErrorResponse {
  error: string;
}

interface ContactFormProps {
  onSuccess?: (data: InquiryResponse) => void;
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSuccess, className = '' }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    message: '',
    companySize: '',
    industry: '',
    region: '',
    interestedServices: [] as string[],
    budget: '',
    timeline: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const companySizes = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '501-1000', label: '501-1000 employees' },
    { value: '1000+', label: '1000+ employees' },
  ];

  const regions = [
    { value: 'North America', label: 'North America (USA, Canada)' },
    { value: 'Europe', label: 'Europe (Ireland, UK, EU)' },
    { value: 'Asia Pacific', label: 'Asia Pacific' },
    { value: 'Latin America', label: 'Latin America' },
    { value: 'Middle East & Africa', label: 'Middle East & Africa' },
    { value: 'Other', label: 'Other' },
  ];

  const services = [
    'Leadership Development',
    'Employee Retention',
    'DEI Coaching',
    'Career Transition Support',
    'Executive Coaching',
    'Team Building',
    'Performance Coaching',
    'Custom Programs'
  ];

  const budgets = [
    { value: 'Under $5,000', label: 'Under $5,000' },
    { value: '$5,000 - $15,000', label: '$5,000 - $15,000' },
    { value: '$15,000 - $50,000', label: '$15,000 - $50,000' },
    { value: '$50,000 - $100,000', label: '$50,000 - $100,000' },
    { value: 'Over $100,000', label: 'Over $100,000' },
  ];

  const timelines = [
    { value: 'Immediate', label: 'Immediate (within 2 weeks)' },
    { value: 'Within 1 month', label: 'Within 1 month' },
    { value: 'Within 3 months', label: 'Within 3 months' },
    { value: 'Within 6 months', label: 'Within 6 months' },
    { value: 'Future planning', label: 'Future planning (6+ months)' },
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    } else if (formData.companyName.length > 100) {
      newErrors.companyName = 'Company name must be less than 100 characters';
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact name is required';
    } else if (formData.contactName.length > 100) {
      newErrors.contactName = 'Contact name must be less than 100 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length > 2000) {
      newErrors.message = 'Message must be less than 2000 characters';
    }

    if (formData.phone && formData.phone.length > 20) {
      newErrors.phone = 'Phone number must be less than 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/corporate/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        const successData = data as InquiryResponse;
        setIsSuccess(true);
        toast.success(successData.message);
        
        if (onSuccess) {
          onSuccess(successData);
        }

        // Reset form after success
        setTimeout(() => {
          setFormData({
            companyName: '',
            contactName: '',
            email: '',
            phone: '',
            message: '',
            companySize: '',
            industry: '',
            region: '',
            interestedServices: [],
            budget: '',
            timeline: '',
          });
          setIsSuccess(false);
        }, 5000);
      } else {
        const errorData = data as ErrorResponse;
        setErrors({ general: errorData.error });
        toast.error(errorData.error);
      }
    } catch (error) {
      console.error('Network error:', error);
      const errorMessage = 'Network error. Please check your connection and try again.';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      interestedServices: prev.interestedServices.includes(service)
        ? prev.interestedServices.filter(s => s !== service)
        : [...prev.interestedServices, service]
    }));
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`text-center ${className}`}
      >
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Thank You for Your Interest!
            </h3>
            <p className="text-gray-600 mb-6">
              We&apos;ve received your inquiry and our corporate solutions team will contact you within 24 hours to discuss how we can help transform your organization&apos;s talent development.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Our team will review your requirements</li>
                <li>• We&apos;ll schedule a discovery call within 24 hours</li>
                <li>• You&apos;ll receive a customized proposal within 3-5 business days</li>
              </ul>
            </div>
            <p className="text-sm text-gray-500">
              Need immediate assistance? Call us at <strong>+1 (555) 123-4567</strong>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 text-center">
            Request a Demo
          </CardTitle>
          <p className="text-gray-600 text-center">
            Tell us about your organization and we&apos;ll create a customized coaching solution for your team.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2"
              >
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm">{errors.general}</span>
              </motion.div>
            )}

            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-blue-800" />
                Company Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className={`pl-10 ${errors.companyName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Your company name"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.companyName && (
                    <p className="text-red-600 text-sm mt-1">{errors.companyName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                    <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        {companySizes.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <Input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    placeholder="e.g., Technology, Healthcare, Finance"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                    <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select your region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region.value} value={region.value}>
                            {region.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-800" />
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange('contactName', e.target.value)}
                      className={`pl-10 ${errors.contactName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Your full name"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.contactName && (
                    <p className="text-red-600 text-sm mt-1">{errors.contactName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`pl-10 ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="your.email@company.com"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`pl-10 ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="+1 (555) 123-4567"
                    disabled={isLoading}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Services of Interest */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Services of Interest
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {services.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    className={`p-3 text-sm rounded-lg border-2 transition-all duration-200 ${
                      formData.interestedServices.includes(service)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                    disabled={isLoading}
                  >
                    {service}
                  </button>
                ))}
              </div>
              {formData.interestedServices.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.interestedServices.map((service) => (
                    <Badge key={service} className="bg-blue-100 text-blue-800">
                      {service}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Project Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Project Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                    <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgets.map((budget) => (
                          <SelectItem key={budget.value} value={budget.value}>
                            {budget.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                    <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        {timelines.map((timeline) => (
                          <SelectItem key={timeline.value} value={timeline.value}>
                            {timeline.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="w-4 h-4 inline mr-1" />
                Tell us about your needs *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={4}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.message ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="Describe your coaching needs, goals, and any specific challenges you&apos;d like to address..."
                disabled={isLoading}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.message && (
                  <p className="text-red-600 text-sm">{errors.message}</p>
                )}
                <p className="text-gray-500 text-sm ml-auto">
                  {formData.message.length}/2000 characters
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Request Demo
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By submitting this form, you agree to be contacted by our team regarding your corporate coaching needs. 
              We respect your privacy and will never share your information.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactForm;