import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Sparkles, TrendingUp, ArrowRight, Eye } from "lucide-react";

export type SubscriptionLevel = "free" | "paid" | "premium";

interface SubscriptionSelectorProps {
  selectedLevel: SubscriptionLevel;
  onSelectLevel: (level: SubscriptionLevel) => void;
}

interface SubscriptionOption {
  id: SubscriptionLevel;
  title: string;
  price: number;
  description: string;
  features: string[];
  badge?: string;
  icon: React.ReactNode;
}

export default function SubscriptionSelector({
  selectedLevel,
  onSelectLevel
}: SubscriptionSelectorProps) {
  const subscriptionOptions: SubscriptionOption[] = [
    {
      id: "free",
      title: "Free Listing",
      price: 0,
      description: "Basic listing for your property",
      features: [
        "Standard listing visibility",
        "Up to 5 photos",
        "Basic property details",
        "90-day listing period"
      ],
      icon: <Eye className="h-5 w-5" />
    },
    {
      id: "paid",
      title: "Enhanced Listing",
      price: 300,
      description: "Better visibility for your property",
      badge: "Popular",
      features: [
        "Higher search rankings",
        "Up to 15 photos and 2 videos",
        "Featured in category pages",
        "Highlighted in search results",
        "120-day listing period"
      ],
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      id: "premium",
      title: "Premium Listing",
      price: 500,
      description: "Maximum exposure for faster sales",
      features: [
        "Top position in search results",
        "Priority in recommendations",
        "Up to 25 photos and 5 videos",
        "Premium badge on listing",
        "Featured on homepage",
        "Unlimited listing period (6 months)",
        "Social media promotion"
      ],
      icon: <Sparkles className="h-5 w-5" />
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Choose Listing Type</h3>
        <p className="text-sm text-gray-500">
          Select a subscription level to determine your property's visibility and priority
        </p>
      </div>
      
      <RadioGroup 
        value={selectedLevel} 
        onValueChange={(value) => async (value: string) => {
  const level = value as SubscriptionLevel;
  if (level === 'free') {
    onSelectLevel(level);
    return;
  }
  
  try {
    const result = await createSubscriptionCheckout(level);
    if (result.error) {
      console.error('Payment failed:', result.error);
    }
  } catch (error) {
    console.error('Payment error:', error);
  }
}}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {subscriptionOptions.map((option) => (
          <div key={option.id} className="relative">
            <RadioGroupItem
              value={option.id}
              id={`subscription-${option.id}`}
              className="sr-only"
            />
            <Label
              htmlFor={`subscription-${option.id}`}
              className="cursor-pointer"
            >
              <Card className={`h-full transition-all ${
                selectedLevel === option.id 
                  ? 'border-primary ring-2 ring-primary ring-offset-2' 
                  : 'hover:border-gray-300'
              }`}>
                <CardHeader>
                  {option.badge && (
                    <Badge className="w-fit mb-2 bg-amber-500">{option.badge}</Badge>
                  )}
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        <span className="text-primary mr-2">{option.icon}</span>
                        {option.title}
                      </CardTitle>
                      <CardDescription>{option.description}</CardDescription>
                    </div>
                    {selectedLevel === option.id && (
                      <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">₹{option.price}</span>
                    {option.price > 0 && <span className="text-gray-500 ml-1">one-time</span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={selectedLevel === option.id ? "default" : "outline"}
                    className="w-full"
                    onClick={() => onSelectLevel(option.id)}
                  >
                    {selectedLevel === option.id ? "Selected" : "Select"} 
                    {selectedLevel !== option.id && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </CardFooter>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}