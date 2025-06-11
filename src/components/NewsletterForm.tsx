'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle, AlertCircle, Loader2, User } from 'lucide-react';
import { toast } from 'sonner';

interface NewsletterFormProps {
  showNameFields?: boolean;
  size?: 'default' | 'large';
  className?: string;
  onSuccess?: (email: string) => void;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ 
  showNameFields = false,
  size = 'default',
  className = '',
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (showNameFields) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
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
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: showNameFields ? formData.firstName : undefined,
          lastName: showNameFields ? formData.lastName : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast.success(data.message || 'Verification email sent! Please check your inbox.');
        
        if (onSuccess) {
          onSuccess(formData.email);
        }

        // Reset form after success
        setTimeout(() => {
          setFormData({ email: '', firstName: '', lastName: '' });
          setIsSuccess(false);
        }, 5000);
      } else {
        setErrors({ general: data.error });
        toast.error(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      const errorMessage = 'Network error. Please check your connection and try again.';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`text-center ${className}`}
      >
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Check Your Email!
        </h3>
        <p className="text-gray-600 mb-4">
          We&apos;ve sent a verification link to <strong>{formData.email}</strong>. 
          Please click the link to confirm your subscription.
        </p>
        <p className="text-sm text-gray-500">
          Don&apos;t see the email? Check your spam folder or try again.
        </p>
      </motion.div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
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

        {/* Name Fields (if enabled) */}
        {showNameFields && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`pl-10 ${size === 'large' ? 'h-12' : 'h-10'} ${
                    errors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.firstName && (
                <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`pl-10 ${size === 'large' ? 'h-12' : 'h-10'} ${
                    errors.lastName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.lastName && (
                <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
        )}

        {/* Email and Submit */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                className={`pl-10 ${size === 'large' ? 'h-12' : 'h-10'} ${
                  errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            className={`bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              size === 'large' ? 'h-12 px-8' : 'h-10 px-6'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Subscribing...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Subscribe
              </>
            )}
          </Button>
        </div>
      </form>

      <p className="text-xs text-gray-500 mt-3 text-center">
        By subscribing, you agree to receive our newsletter. You&apos;ll receive a verification email first.
        You can unsubscribe at any time. We respect your privacy.
      </p>
    </div>
  );
};

export default NewsletterForm;