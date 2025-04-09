import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Clock, ArrowRight, Percent, Tag } from "lucide-react";

// Define the type for our urgent property
interface UrgentProperty {
  id: number;
  title: string;
  location: string;
  price: number;
  discountedPrice: number;
  propertyType: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number;
  imageUrl: string;
  expiresAt: Date;
}

// Sample urgent properties if API isn't ready yet
const sampleUrgentProperties: UrgentProperty[] = [
  {
    id: 1,
    title: "Luxury Apartment with Sea View",
    location: "Mumbai, Maharashtra",
    price: 12500000,
    discountedPrice: 9375000, // 25% off
    propertyType: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  },
  {
    id: 2,
    title: "Modern Villa in Gated Community",
    location: "Pune, Maharashtra",
    price: 28000000,
    discountedPrice: 21000000, // 25% off
    propertyType: "Villa",
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
  },
  {
    id: 3,
    title: "City Center Office Space",
    location: "Bangalore, Karnataka",
    price: 18500000,
    discountedPrice: 13875000, // 25% off
    propertyType: "Commercial",
    bedrooms: null,
    bathrooms: 2,
    area: 2500,
    imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  }
];

export default function UrgencySales() {
  const [timeLeft, setTimeLeft] = useState<{[key: number]: string}>({});
  
  // This would be the actual API call in production
  const { data: urgentProperties = sampleUrgentProperties } = useQuery<UrgentProperty[]>({
    queryKey: ['/api/properties/urgent'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Calculate time remaining for each property
  useEffect(() => {
    const calculateTimeLeft = () => {
      const newTimeLeft: {[key: number]: string} = {};
      
      if (urgentProperties) {
        urgentProperties.forEach((property: UrgentProperty) => {
          const difference = new Date(property.expiresAt).getTime() - new Date().getTime();
          
          if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            
            newTimeLeft[property.id] = `${days}d ${hours}h ${minutes}m`;
          } else {
            newTimeLeft[property.id] = "Expired";
          }
        });
      }
      
      setTimeLeft(newTimeLeft);
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [urgentProperties]);
  
  // Format price in Indian format (lakhs, crores)
  const formatIndianPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lac`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };
  
  return (
    <section className="py-12 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Clock className="h-4 w-4" />
            <span>Limited Time Offers</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Urgency Sales</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Exclusive properties with time-limited 25% discounts. Act fast - these opportunities won't last long!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {urgentProperties && urgentProperties.map((property: UrgentProperty) => (
            <Card key={property.id} className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
              <div className="relative overflow-hidden h-48">
                <img 
                  src={property.imageUrl} 
                  alt={property.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-3 right-3 bg-red-600 text-white">
                  <Percent className="h-3 w-3 mr-1" /> 25% OFF
                </Badge>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-red-300" />
                    <span className="text-sm font-medium">Ends in: {timeLeft[property.id]}</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg line-clamp-1">{property.title}</h3>
                  <Badge variant="outline" className="bg-gray-100">
                    {property.propertyType}
                  </Badge>
                </div>
                
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <Tag className="h-4 w-4 mr-1" />
                  {property.location}
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  {property.bedrooms !== null && (
                    <div className="text-sm">
                      <span className="font-semibold">{property.bedrooms}</span> Beds
                    </div>
                  )}
                  
                  {property.bathrooms && (
                    <div className="text-sm">
                      <span className="font-semibold">{property.bathrooms}</span> Baths
                    </div>
                  )}
                  
                  <div className="text-sm">
                    <span className="font-semibold">{property.area}</span> sq.ft
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <div className="line-through text-gray-400 text-sm">
                      {formatIndianPrice(property.price)}
                    </div>
                    <div className="text-red-600 font-bold text-lg">
                      {formatIndianPrice(property.discountedPrice)}
                    </div>
                  </div>
                  
                  <Link to={`/property-detail/${property.id}`}>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-8">
          <Link to="/properties?tag=urgent">
            <Button variant="outline" className="group">
              View All Urgent Sales
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}