import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Property } from '@shared/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PropertyCard from './property-card';
import { Link } from 'wouter';
import { MapPin, Sparkles } from 'lucide-react';

interface TopPropertyRankingsProps {
  category?: string;
  location?: string;
  limit?: number;
  showViewAll?: boolean;
  title?: string;
  description?: string;
}

export default function TopPropertyRankings({
  category = 'premium',
  location,
  limit = 10,
  showViewAll = true,
  title = 'Top Properties',
  description = 'Exclusive premium properties based on location and popularity'
}: TopPropertyRankingsProps) {
  const [selectedTab, setSelectedTab] = useState<string>('10');
  
  // Query properties
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['/api/properties/top', { category, location, limit: parseInt(selectedTab) }],
    queryFn: async ({ queryKey }) => {
      const [_, params] = queryKey as [string, { category: string; location?: string; limit: number }];
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
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          <p className="text-gray-500 mt-2 max-w-2xl">{description}</p>
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
          {Array(parseInt(selectedTab) > 6 ? 6 : parseInt(selectedTab))
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
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to load top properties</h2>
        <p className="text-gray-600 mb-6">We encountered a problem fetching the top properties. Please try again later.</p>
        <Button onClick={() => window.location.reload()}>Refresh Page</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        <p className="text-gray-500 mt-2 max-w-2xl">{description}</p>
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
                        property={property} 
                        isAiRecommended={!!property.premium} 
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-gray-500">No properties found in this category</p>
                  </div>
                )}
              </div>
              
              {showViewAll && properties && properties.length > 6 && (
                <div className="text-center mt-8">
                  <Button asChild variant="outline">
                    <Link to={`/top-properties/${selectedTab}${location ? `?location=${encodeURIComponent(location)}` : ''}`}>
                      View all {selectedTab} properties
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}