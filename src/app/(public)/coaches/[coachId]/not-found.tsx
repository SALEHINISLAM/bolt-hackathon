import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserX, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CoachNotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <UserX className="w-24 h-24 text-gray-400 mx-auto mb-6" />
                
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Coach Not Found
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Sorry, we couldn&apos;t find the coach profile you&apos;re looking for. 
                  The coach may have been removed or the link might be incorrect.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/coaches">
                    <Button 
                      size="lg" 
                      className="bg-blue-800 hover:bg-blue-900 text-white"
                    >
                      <Search className="w-5 h-5 mr-2" />
                      Browse All Coaches
                    </Button>
                  </Link>
                  
                  <Link href="/">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-gray-500">
                    Need help? <Link href="/contact" className="text-blue-800 hover:underline">Contact our support team</Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}