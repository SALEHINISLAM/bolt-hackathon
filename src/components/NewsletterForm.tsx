'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    setStatus('loading');
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error: unknown) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Network error. Please check your connection and try again.');
    }
  };

  const resetStatus = () => {
    setStatus('idle');
    setMessage('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== 'idle') resetStatus();
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={status === 'loading'}
            />
          </div>
          <Button
            type="submit"
            disabled={status === 'loading'}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
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

        {/* Status Messages */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: status !== 'idle' ? 1 : 0, 
            height: status !== 'idle' ? 'auto' : 0 
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {status === 'success' && (
            <div className="flex items-center text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{message}</span>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{message}</span>
            </div>
          )}
        </motion.div>
      </form>

      <p className="text-xs text-gray-500 mt-3 text-center">
        By subscribing, you agree to receive our newsletter and promotional emails. 
        You can unsubscribe at any time.
      </p>
    </div>
  );
};

export default NewsletterForm;