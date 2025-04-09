import { useQuery } from "@tanstack/react-query";
import { Company } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";
import { Loader2, MapPin, Building2, Globe, CalendarDays, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function TopCompanies() {
  const { data: companies, isLoading } = useQuery({
    queryKey: ["/api/companies/featured"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  const [, navigate] = useLocation();

  if (isLoading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (!companies || companies.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Top Real Estate Companies</h2>
            <p className="text-gray-600 mt-2">
              Partner with established and trusted real estate agencies
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/companies")}
          >
            View All Companies
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {companies.map((company: Company) => (
            <div 
              key={company.id} 
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-36 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-center p-4">
                {company.logo ? (
                  <img 
                    src={company.logo} 
                    alt={company.name} 
                    className="max-h-28 max-w-full object-contain"
                  />
                ) : (
                  <Building2 className="h-16 w-16 text-gray-400" />
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold">{company.name}</h3>
                  {company.verified && (
                    <Badge variant="secondary" className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{company.description}</p>
                
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <div className="flex items-center text-gray-700">
                    <MapPin className="h-5 w-5 text-primary mr-2" />
                    <span className="text-sm">{company.address}, {company.city}</span>
                  </div>
                  
                  {company.website && (
                    <div className="flex items-center text-gray-700">
                      <Globe className="h-5 w-5 text-primary mr-2" />
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {company.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  
                  {company.establishedYear && (
                    <div className="flex items-center text-gray-700">
                      <CalendarDays className="h-5 w-5 text-primary mr-2" />
                      <span className="text-sm">Est. {company.establishedYear}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <Button 
                    className="flex-1" 
                    variant="outline"
                    onClick={() => navigate(`/companies/${company.id}`)}
                  >
                    View Profile
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={() => navigate(`/companies/${company.id}/properties`)}
                  >
                    View Properties
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}