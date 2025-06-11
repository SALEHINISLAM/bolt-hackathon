'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, AlertCircle, Loader2, Mail, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VerificationResult {
  success: boolean;
  message: string;
  subscriber?: {
    email: string;
    firstName?: string;
    verifiedAt: string;
  };
  error?: string;
}

export default function NewsletterVerifyPage() {
  const searchParams = useSearchParams();
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationResult({
          success: false,
          message: 'No verification token provided',
          error: 'Invalid verification link'
        });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/newsletter/verify?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setVerificationResult({
            success: true,
            message: data.message,
            subscriber: data.subscriber
          });
        } else {
          setVerificationResult({
            success: false,
            message: data.error || 'Verification failed',
            error: data.error
          });
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationResult({
          success: false,
          message: 'Failed to verify email. Please try again.',
          error: 'Network error'
        });
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp}>
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center">
                  {loading ? (
                    <div className="bg-blue-100 w-full h-full rounded-full flex items-center justify-center">
                      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    </div>
                  ) : verificationResult?.success ? (
                    <div className="bg-green-100 w-full h-full rounded-full flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                  ) : (
                    <div className="bg-red-100 w-full h-full rounded-full flex items-center justify-center">
                      <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                  )}
                </div>
                
                <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                  {loading ? 'Verifying Your Email...' : 
                   verificationResult?.success ? 'Welcome to Our Newsletter!' : 
                   'Verification Failed'}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="text-center space-y-6">
                {loading ? (
                  <div>
                    <p className="text-gray-600 text-lg">
                      Please wait while we verify your email address...
                    </p>
                  </div>
                ) : verificationResult?.success ? (
                  <div className="space-y-6">
                    <p className="text-gray-700 text-lg">
                      {verificationResult.message}
                    </p>
                    
                    {verificationResult.subscriber && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <div className="flex items-center justify-center mb-4">
                          <Mail className="w-6 h-6 text-green-600 mr-2" />
                          <span className="font-medium text-green-800">
                            {verificationResult.subscriber.email}
                          </span>
                        </div>
                        <p className="text-green-700">
                          {verificationResult.subscriber.firstName ? 
                            `Hi ${verificationResult.subscriber.firstName}! ` : 'Hi there! '}
                          You&apos;ll start receiving our weekly career insights and tips soon.
                        </p>
                      </div>
                    )}

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        What&apos;s Next?
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">📧 Weekly Newsletter</h4>
                          <p className="text-blue-700 text-sm">
                            Receive career tips and insights every Tuesday
                          </p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-lg">
                          <h4 className="font-medium text-amber-900 mb-2">🎯 Exclusive Content</h4>
                          <p className="text-amber-700 text-sm">
                            Access to coach spotlights and industry trends
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link href="/coaches">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Explore Our Coaches
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <Link href="/">
                        <Button variant="outline">
                          Back to Home
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <p className="text-gray-700 text-lg">
                      {verificationResult?.message}
                    </p>
                    
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-700 text-sm">
                        This could happen if:
                      </p>
                      <ul className="text-red-600 text-sm mt-2 list-disc list-inside space-y-1">
                        <li>The verification link has expired</li>
                        <li>The link has already been used</li>
                        <li>The link is invalid or corrupted</li>
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link href="/newsletter">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Try Subscribing Again
                        </Button>
                      </Link>
                      <Link href="/">
                        <Button variant="outline">
                          Back to Home
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}