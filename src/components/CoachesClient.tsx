'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronLeft, ChevronRight, Loader2, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CoachCard from '@/components/CoachCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCoaches: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface CoachesResponse {
  coaches: Coach[];
  pagination: PaginationInfo;
}

interface SearchParams {
  page?: string;
  expertise?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  search?: string;
}

interface CoachesClientProps {
  searchParams: SearchParams;
}

const CoachesClient: React.FC<CoachesClientProps> = ({ searchParams }) => {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCoaches: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.search || '');
  const [selectedExpertise, setSelectedExpertise] = useState(searchParams.expertise || 'all');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.minPrice || '',
    max: searchParams.maxPrice || '',
  });
  const [minRating, setMinRating] = useState(searchParams.minRating || 'none');

  const expertiseOptions = [
    { value: 'all', label: 'All Expertise' },
    { value: 'technology', label: 'Technology' },
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'leadership', label: 'Leadership' },
    { value: 'sales', label: 'Sales' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'product management', label: 'Product Management' },
  ];

  const ratingOptions = [
    { value: 'none', label: 'Any Rating' },
    { value: '4.5', label: '4.5+ Stars' },
    { value: '4.0', label: '4.0+ Stars' },
    { value: '3.5', label: '3.5+ Stars' },
    { value: '3.0', label: '3.0+ Stars' },
  ];

  useEffect(() => {
    const fetchCoaches = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        
        if (searchParams.page) params.append('page', searchParams.page);
        if (searchParams.search) params.append('search', searchParams.search);
        if (searchParams.expertise && searchParams.expertise !== 'all') {
          params.append('expertise', searchParams.expertise);
        }
        if (searchParams.minPrice) params.append('minPrice', searchParams.minPrice);
        if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice);
        if (searchParams.minRating && searchParams.minRating !== 'none') params.append('minRating', searchParams.minRating);

        const response = await fetch(`/api/coaches?${params.toString()}`);
        if (response.ok) {
          const data: CoachesResponse = await response.json();
          setCoaches(data.coaches);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error('Error fetching coaches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, [searchParams]);

  const updateFilters = () => {
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (selectedExpertise && selectedExpertise !== 'all') {
      params.append('expertise', selectedExpertise);
    }
    if (priceRange.min) params.append('minPrice', priceRange.min);
    if (priceRange.max) params.append('maxPrice', priceRange.max);
    if (minRating && minRating !== 'none') params.append('minRating', minRating);
    
    // Reset to page 1 when filters change
    params.append('page', '1');
    
    const queryString = params.toString();
    router.push(`/coaches${queryString ? `?${queryString}` : ''}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(urlSearchParams.toString());
    params.set('page', page.toString());
    router.push(`/coaches?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedExpertise('all');
    setPriceRange({ min: '', max: '' });
    setMinRating('none');
    router.push('/coaches');
  };

  const hasActiveFilters = searchQuery || selectedExpertise !== 'all' || priceRange.min || priceRange.max || (minRating && minRating !== 'none');

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Career Coach
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Browse our curated list of expert career coaches and find the perfect match for your professional goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search coaches by name, expertise, or bio..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                    onKeyPress={(e) => e.key === 'Enter' && updateFilters()}
                  />
                </div>
              </div>
              <Button 
                onClick={updateFilters}
                className="h-12 px-8 bg-blue-800 hover:bg-blue-900"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expertise
                </label>
                <Select value={selectedExpertise} onValueChange={setSelectedExpertise}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {expertiseOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price ($)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="h-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price ($)
                </label>
                <Input
                  type="number"
                  placeholder="500"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="h-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <Select value={minRating} onValueChange={setMinRating}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ratingOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end space-x-2">
                <Button 
                  onClick={updateFilters}
                  className="flex-1 h-10 bg-blue-800 hover:bg-blue-900"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Apply
                </Button>
                {hasActiveFilters && (
                  <Button 
                    onClick={clearFilters}
                    variant="outline"
                    className="h-10 px-4"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Search: {searchQuery}
                  </Badge>
                )}
                {selectedExpertise !== 'all' && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {expertiseOptions.find(opt => opt.value === selectedExpertise)?.label}
                  </Badge>
                )}
                {priceRange.min && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Min: ${priceRange.min}
                  </Badge>
                )}
                {priceRange.max && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Max: ${priceRange.max}
                  </Badge>
                )}
                {minRating && minRating !== 'none' && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {ratingOptions.find(opt => opt.value === minRating)?.label}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {loading ? 'Loading...' : `${pagination.totalCoaches} Coaches Found`}
              </h2>
              {!loading && pagination.totalCoaches > 0 && (
                <p className="text-gray-600 mt-1">
                  Showing {((pagination.currentPage - 1) * 10) + 1} - {Math.min(pagination.currentPage * 10, pagination.totalCoaches)} of {pagination.totalCoaches} results
                </p>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-800" />
              <span className="ml-2 text-gray-600">Loading coaches...</span>
            </div>
          )}

          {/* Empty State */}
          {!loading && coaches.length === 0 && (
            <Card className="p-12 text-center">
              <CardContent className="p-0">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No coaches found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms to find more coaches.
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Coaches Grid */}
          {!loading && coaches.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            >
              {coaches.map((coach, index) => (
                <CoachCard key={coach._id} coach={coach} index={index} />
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {!loading && coaches.length > 0 && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4">
              <Button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                variant="outline"
                className="flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <div className="flex items-center space-x-2">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, pagination.currentPage - 2) + i;
                  if (pageNum > pagination.totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      variant={pageNum === pagination.currentPage ? "default" : "outline"}
                      className={`w-10 h-10 p-0 ${
                        pageNum === pagination.currentPage 
                          ? "bg-blue-800 hover:bg-blue-900" 
                          : ""
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                variant="outline"
                className="flex items-center"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CoachesClient;