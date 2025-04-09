import { useQuery } from "@tanstack/react-query";
import { Agent } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";
import { Loader2, MapPin, Star, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function FeaturedAgents() {
  const { data: agents, isLoading } = useQuery({
    queryKey: ["/api/agents/featured"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  const [, navigate] = useLocation();

  if (isLoading) {
    return (
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (!agents || agents.length === 0) {
    return null;
  }

  const getInitials = (name: string) => {
    if (!name) return "AA";
    const parts = name.split(" ");
    if (parts.length === 1) return name.substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Top Real Estate Agents</h2>
            <p className="text-gray-600 mt-2">
              Work with the best professionals in the industry
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/agents")}
          >
            View All Agents
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent: Agent) => {
            // Fetch the user data associated with the agent to get their name
            const userQuery = useQuery({
              queryKey: [`/api/users/${agent.userId}`],
              queryFn: getQueryFn({ on401: "returnNull" }),
            });
            
            const user = userQuery.data;
            const fullName = user ? user.name : "Agent Name";
            const avatar = user?.avatar;
            
            return (
              <div key={agent.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-16 w-16 mr-4">
                      <AvatarImage src={avatar} alt={fullName} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{fullName}</h3>
                      <div className="flex items-center text-yellow-500 mt-1">
                        {Array.from({ length: Math.round(agent.rating || 0) }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                        {Array.from({ length: 5 - Math.round(agent.rating || 0) }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-gray-300" />
                        ))}
                        <span className="text-gray-600 text-sm ml-1">
                          ({agent.reviewCount || 0} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <div className="flex items-center text-gray-700">
                      <Award className="h-5 w-5 text-primary mr-2" />
                      <span className="text-sm">{agent.licenseNumber}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <Clock className="h-5 w-5 text-primary mr-2" />
                      <span className="text-sm">{agent.yearsOfExperience} years experience</span>
                    </div>
                    
                    {agent.areas && agent.areas.length > 0 && (
                      <div className="flex items-start text-gray-700">
                        <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                        <div className="flex flex-wrap gap-1">
                          {agent.areas.slice(0, 3).map((area) => (
                            <Badge key={area} variant="outline" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                          {agent.areas.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{agent.areas.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {agent.specializations && agent.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {agent.specializations.slice(0, 3).map((spec) => (
                          <Badge key={spec} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                        {agent.specializations.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{agent.specializations.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => navigate(`/agents/${agent.id}`)}
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}