import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Property } from '@shared/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PropertyCard } from '@/components/property/property-card';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export default function TopPropertiesList() {
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  const category = searchParams.get('category') || 'premium';
  const location = searchParams.get('location') || '';
  const [selectedTab, setSelectedTab] = useState<string>('10');
  
  // Query properties
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['/api/properties/top', { category, location, limit: parseInt(selectedTab) }],
    queryFn: async ({ queryKey }) => {
      const [_, params] = queryKey as [string, { category: string; location: string; limit: number }];
      const searchParams = new URLSearchParams();
      
      if (params.category) searchParams.append('category', params.category);
      if (params.location) searchParams.append('location', params.location);
      if (params.limit) searchParams.append('limit', params.limit.toString());
      
      const response = await fetch(`/api/properties/top?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch top properties');
      }
      return response.json();
    }
  });

  const tabOptions = ['10', '20', '30', '50', '100'];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center mb-8">
                <Skeleton className="h-10 w-64 mb-4" />
                <Skeleton className="h-5 w-96" />
              </div>
              
              <div className="flex justify-center mb-8">
                <Tabs defaultValue="10" className="w-full max-w-3xl">
                  <TabsList className="grid grid-cols-5 w-full">
                    {tabOptions.map(tab => (
                      <TabsTrigger key={tab} value={tab}>Top {tab}</TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <CardContent className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-4" />
                        <div className="flex justify-between">
                          <Skeleton className="h-5 w-1/3" />
                          <Skeleton className="h-5 w-1/4" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12 bg-gray-50">
          <div className="container mx-auto px-4 text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to load top properties</h2>
            <p className="text-gray-600 mb-6">We encountered a problem fetching the top properties. Please try again later.</p>
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryDisplay = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold">
                Top {categoryDisplay} Properties
                {location && <span> in {location}</span>}
              </h1>
              <p className="text-gray-500 mt-2 max-w-2xl">
                {`Discover the highest-rated ${categoryDisplay.toLowerCase()} properties based on popularity, value, and quality ratings`}
              </p>
              {location && (
                <Badge variant="outline" className="mt-3 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{location}</span>
                </Badge>
              )}
            </div>
            
            {/* Top categories tabs */}
            <div className="flex justify-center mb-8">
              <Tabs 
                defaultValue={selectedTab} 
                className="w-full max-w-3xl"
                onValueChange={(value) => setSelectedTab(value)}
              >
                <TabsList className="grid grid-cols-5 w-full">
                  {tabOptions.map(tab => (
                    <TabsTrigger key={tab} value={tab}>Top {tab}</TabsTrigger>
                  ))}
                </TabsList>
                
                {tabOptions.map(tab => (
                  <TabsContent key={tab} value={tab}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {properties && properties.length > 0 ? (
                        properties.slice(0, parseInt(tab) > 6 ? 6 : parseInt(tab)).map((property: Property, index: number) => (
                          <div key={property.id} className="relative">
                            {index < 3 && (
                              <div className="absolute -top-2 -right-2 z-10">
                                <Badge className={`
                                  ${index === 0 ? 'bg-yellow-500' : ''}
                                  ${index === 1 ? 'bg-gray-400' : ''}
                                  ${index === 2 ? 'bg-amber-700' : ''}
                                  text-white flex items-center gap-1 px-3 py-1
                                `}>
                                  <Sparkles className="h-3 w-3" />
                                  <span>#{index + 1}</span>
                                </Badge>
                              </div>
                            )}
                            <PropertyCard 
                              prop={property} 
                              isAiRecommended={property.premium || false} 
                            />
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-12">
                          <p className="text-gray-500">No properties found in this category</p>
                        </div>
                      )}
                    </div>
                    
                    {properties && properties.length > 6 && (
                      <div className="text-center mt-8">
                        <Button asChild variant="outline">
                          <Link to={`/top-properties/${tab}?category=${category}${location ? `&location=${encodeURIComponent(location)}` : ''}`}>
                            <span>View all {tab} properties</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
            
            {/* Back to all categories */}
            <div className="text-center mt-12">
              <Button asChild variant="outline">
                <Link to="/top-properties">
                  View All Property Categories
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}