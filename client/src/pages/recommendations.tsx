import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Property } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import PropertyCard from "@/components/property/property-card";
import { 
  ArrowLeft, 
  Building2,
  Search, 
  HelpCircle, 
  Sparkles,
  RefreshCw,
  UserCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function RecommendationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("ai");

  // Get AI recommendations
  const { data: aiRecommendations = [], isLoading: aiLoading } = useQuery<Property[]>({
    queryKey: ['/api/recommendations/ai'],
    enabled: !!user,
  });

  // Get regular recommendations based on saved properties
  const { data: regularRecommendations = [], isLoading: regularLoading } = useQuery<Property[]>({
    queryKey: ['/api/recommendations'],
    enabled: !!user,
  });

  // Get saved properties
  const { data: savedProperties = [], isLoading: savedLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties/saved'],
    enabled: !!user,
  });

  // Handle the training of the model
  const handleTrainModel = async () => {
    try {
      await fetch('/api/recommendations/train', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Invalidate recommendations to fetch fresh data
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations/ai'] });
      
      toast({
        title: "Model Training Initiated",
        description: "Our AI is learning from your preferences to provide better recommendations.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Training Error",
        description: "There was an error training the recommendation model. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Track property view for recommendations
  const trackPropertyView = async (propertyId: number) => {
    try {
      await fetch('/api/recommendations/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          propertyId,
          interactionType: 'view'
        })
      });
    } catch (error) {
      console.error("Error tracking property view:", error);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Personalized Recommendations</h1>
            <p className="text-muted-foreground mt-1">
              Sign in to get personalized property recommendations
            </p>
          </div>
          <Link to="/auth">
            <Button className="flex items-center gap-2">
              <UserCheck size={16} />
              Sign In to Continue
            </Button>
          </Link>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI-Powered Recommendations
            </CardTitle>
            <CardDescription>
              Our machine learning algorithm learns from your interactions to recommend properties that match your preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Property Matching</h3>
                  <p className="text-sm text-muted-foreground">
                    Find properties that match your preferences based on your browsing history.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Smart Filtering</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI automatically filters properties based on your implicit preferences.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Recommendations</h1>
          <p className="text-muted-foreground mt-1">
            Properties tailored to your preferences and browsing history
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button onClick={handleTrainModel} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Recommendations
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Recommendations
          </TabsTrigger>
          <TabsTrigger value="standard" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Similar Properties
          </TabsTrigger>
        </TabsList>
        
        {/* AI Recommendations Tab */}
        <TabsContent value="ai">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {aiLoading ? (
              Array(4).fill(0).map((_, i) => (
                <Card key={i} className="h-[400px] flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </Card>
              ))
            ) : aiRecommendations.length > 0 ? (
              aiRecommendations.map((property) => (
                <Link 
                  key={property.id} 
                  to={`/property/${property.id}`}
                  onClick={() => trackPropertyView(property.id)}
                >
                  <PropertyCard 
                    property={property} 
                    isAiRecommended={true}
                  />
                </Link>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <HelpCircle className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No AI recommendations yet</h3>
                <p className="text-muted-foreground max-w-md">
                  Browse more properties or save properties you like to help our AI understand your preferences.
                </p>
                <Button className="mt-4" asChild>
                  <Link to="/properties">Browse Properties</Link>
                </Button>
              </div>
            )}
          </div>
          
          <div className="mt-8 bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">How AI Recommendations Work</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI learns from the properties you view, save, and inquire about. The more you interact with properties, 
                  the better our recommendations become. We analyze features like property type, location, price range, 
                  and amenities to find patterns in your preferences.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Standard Recommendations Tab */}
        <TabsContent value="standard">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {regularLoading ? (
              Array(4).fill(0).map((_, i) => (
                <Card key={i} className="h-[400px] flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </Card>
              ))
            ) : regularRecommendations.length > 0 ? (
              regularRecommendations.map((property) => (
                <Link 
                  key={property.id} 
                  to={`/property/${property.id}`}
                  onClick={() => trackPropertyView(property.id)}
                >
                  <PropertyCard property={property} />
                </Link>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <HelpCircle className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No recommendations available</h3>
                <p className="text-muted-foreground max-w-md">
                  Save properties you like to get personalized recommendations based on similar properties.
                </p>
                <Button className="mt-4" asChild>
                  <Link to="/properties">Browse Properties</Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Saved Properties Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Saved Properties</h2>
          <Badge variant="outline" className="px-2 py-1">
            {savedProperties.length} {savedProperties.length === 1 ? 'Property' : 'Properties'}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="h-[400px] flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              </Card>
            ))
          ) : savedProperties.length > 0 ? (
            savedProperties.map((property) => (
              <Link 
                key={property.id} 
                to={`/property/${property.id}`}
                onClick={() => trackPropertyView(property.id)}
              >
                <PropertyCard property={property} />
              </Link>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <HelpCircle className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No saved properties yet</h3>
              <p className="text-muted-foreground max-w-md">
                Save properties you're interested in to view them later and get better recommendations.
              </p>
              <Button className="mt-4" asChild>
                <Link to="/properties">Find Properties</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}