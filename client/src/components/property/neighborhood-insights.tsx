import { useState, useEffect } from 'react';
import { MapPin, Home, School, Hospital, Utensils, ShoppingBag, BusFront, Train, Users, TrendingUp, Calendar, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

interface NeighborhoodInsightProps {
  neighborhood: string;
  city?: string;
  className?: string;
}

interface InsightData {
  neighborhood: string;
  city: string;
  data: {
    safetyScore: number;
    walkabilityScore: number;
    publicTransportScore: number;
    amenitiesScore: number;
    schoolsScore: number;
    parks: {
      count: number;
      list: string[];
    };
    hospitals: {
      count: number;
      list: string[];
    };
    schools: {
      count: number;
      list: string[];
    };
    restaurants: {
      count: number;
      topRated: string[];
    };
    shopping: {
      count: number;
      major: string[];
    };
    transitOptions: {
      busRoutes: string[];
      metroStations: string[];
      trainStations: string[];
    };
    demographics: {
      population: number;
      medianAge: number;
      medianIncome: number;
    };
    realEstateMetrics: {
      medianHomePrice: number;
      pricePerSqFt: number;
      avgRent: number;
      inventoryCount: number;
      daysOnMarket: number;
      yearOverYearAppreciation: number;
    };
  };
  description: string;
}

export default function NeighborhoodInsights({ neighborhood, city, className }: NeighborhoodInsightProps) {
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    if (!neighborhood) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/neighborhood/insights?neighborhood=${encodeURIComponent(neighborhood)}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`No insights available for ${neighborhood}`);
        }
        throw new Error('Failed to fetch neighborhood insights');
      }
      
      const data = await response.json();
      if (data.success && data.data) {
        setInsights(data.data);
      } else {
        throw new Error(data.message || 'No insights available');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'An unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-fetch if neighborhood is provided
    if (neighborhood) {
      fetchInsights();
    }
  }, [neighborhood]);

  if (!neighborhood) {
    return null;
  }

  return (
    <div className={className}>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {insights ? insights.neighborhood : neighborhood} Insights
              </CardTitle>
              <CardDescription>
                {insights ? insights.city : city || 'Loading area information...'}
              </CardDescription>
            </div>
            {!insights && !loading && (
              <Button 
                onClick={fetchInsights}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Get Neighborhood Insights'}
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}
          
          {error && !loading && (
            <div className="text-center py-8">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={fetchInsights}>Try Again</Button>
            </div>
          )}
          
          {insights && !loading && (
            <Tabs defaultValue="overview">
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="transit">Transit</TabsTrigger>
                <TabsTrigger value="demographics">Demographics</TabsTrigger>
                <TabsTrigger value="realestate">Real Estate</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">{insights.description}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Safety</span>
                          <span className="text-sm font-medium">{insights.data.safetyScore}/10</span>
                        </div>
                        <Progress value={insights.data.safetyScore * 10} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Walkability</span>
                          <span className="text-sm font-medium">{insights.data.walkabilityScore}/10</span>
                        </div>
                        <Progress value={insights.data.walkabilityScore * 10} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Public Transport</span>
                          <span className="text-sm font-medium">{insights.data.publicTransportScore}/10</span>
                        </div>
                        <Progress value={insights.data.publicTransportScore * 10} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Amenities</span>
                          <span className="text-sm font-medium">{insights.data.amenitiesScore}/10</span>
                        </div>
                        <Progress value={insights.data.amenitiesScore * 10} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Schools</span>
                          <span className="text-sm font-medium">{insights.data.schoolsScore}/10</span>
                        </div>
                        <Progress value={insights.data.schoolsScore * 10} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2 p-4 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Home className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">Real Estate</span>
                      </div>
                      <span className="text-2xl font-bold">₹{(insights.data.realEstateMetrics.pricePerSqFt).toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">Price per sq.ft.</span>
                    </div>
                    
                    <div className="flex flex-col gap-2 p-4 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <School className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">Schools</span>
                      </div>
                      <span className="text-2xl font-bold">{insights.data.schools.count}</span>
                      <span className="text-xs text-muted-foreground">Schools in the area</span>
                    </div>
                    
                    <div className="flex flex-col gap-2 p-4 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Utensils className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">Food</span>
                      </div>
                      <span className="text-2xl font-bold">{insights.data.restaurants.count}+</span>
                      <span className="text-xs text-muted-foreground">Restaurants nearby</span>
                    </div>
                    
                    <div className="flex flex-col gap-2 p-4 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <BusFront className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">Transit</span>
                      </div>
                      <span className="text-2xl font-bold">{insights.data.transitOptions.busRoutes.length}</span>
                      <span className="text-xs text-muted-foreground">Bus routes available</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="amenities" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                    <School className="h-5 w-5 text-primary" />
                    Schools ({insights.data.schools.count})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {insights.data.schools.list.map((school, index) => (
                      <Badge key={index} variant="outline" className="justify-start py-1.5 px-3">
                        {school}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                    <Hospital className="h-5 w-5 text-primary" />
                    Hospitals ({insights.data.hospitals.count})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {insights.data.hospitals.list.map((hospital, index) => (
                      <Badge key={index} variant="outline" className="justify-start py-1.5 px-3">
                        {hospital}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                    <Utensils className="h-5 w-5 text-primary" />
                    Top Restaurants
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {insights.data.restaurants.topRated.map((restaurant, index) => (
                      <Badge key={index} variant="outline" className="justify-start py-1.5 px-3">
                        {restaurant}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    Shopping Areas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {insights.data.shopping.major.map((place, index) => (
                      <Badge key={index} variant="outline" className="justify-start py-1.5 px-3">
                        {place}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="transit" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                    <BusFront className="h-5 w-5 text-primary" />
                    Bus Routes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {insights.data.transitOptions.busRoutes.map((route, index) => (
                      <Badge key={index} variant="secondary" className="py-1 px-3">
                        {route}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {insights.data.transitOptions.metroStations.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                        <Train className="h-5 w-5 text-primary" />
                        Metro Stations
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {insights.data.transitOptions.metroStations.map((station, index) => (
                          <Badge key={index} variant="secondary" className="py-1 px-3">
                            {station}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                {insights.data.transitOptions.trainStations.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                        <Train className="h-5 w-5 text-primary" />
                        Train Stations
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {insights.data.transitOptions.trainStations.map((station, index) => (
                          <Badge key={index} variant="secondary" className="py-1 px-3">
                            {station}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="demographics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2 p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Population</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {insights.data.demographics.population.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">Residents</span>
                  </div>
                  
                  <div className="flex flex-col gap-2 p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Median Age</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {insights.data.demographics.medianAge}
                    </span>
                    <span className="text-xs text-muted-foreground">Years</span>
                  </div>
                  
                  <div className="flex flex-col gap-2 p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Median Income</span>
                    </div>
                    <span className="text-2xl font-bold">
                      ₹{Math.round(insights.data.demographics.medianIncome / 100000).toLocaleString()} Lakh
                    </span>
                    <span className="text-xs text-muted-foreground">Annual household</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="realestate" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Median Home Price</span>
                    </div>
                    <span className="text-2xl font-bold">
                      ₹{Math.round(insights.data.realEstateMetrics.medianHomePrice / 100000).toLocaleString()} Lakh
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-2 p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Price per Sq.Ft.</span>
                    </div>
                    <span className="text-2xl font-bold">
                      ₹{insights.data.realEstateMetrics.pricePerSqFt.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-2 p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Average Rent</span>
                    </div>
                    <span className="text-2xl font-bold">
                      ₹{insights.data.realEstateMetrics.avgRent.toLocaleString()}/mo
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-2 p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Year-Over-Year Growth</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {insights.data.realEstateMetrics.yearOverYearAppreciation}%
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Inventory</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {insights.data.realEstateMetrics.inventoryCount} Properties
                    </span>
                    <span className="text-xs text-muted-foreground">Currently available</span>
                  </div>
                  
                  <div className="flex flex-col gap-2 p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Days on Market</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {insights.data.realEstateMetrics.daysOnMarket} Days
                    </span>
                    <span className="text-xs text-muted-foreground">Average time to sell</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        
        {insights && (
          <CardFooter className="text-xs text-muted-foreground">
            <p>Data last updated: {new Date().toLocaleDateString()}</p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}