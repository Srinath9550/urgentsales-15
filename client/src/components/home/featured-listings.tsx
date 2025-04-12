import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import PropertyCard from "@/components/property/property-card";
import { Property } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedListings() {
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured"],
  });

  return (
    <section className="py-20 md:py-18 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h5 className="text-3xl font-bold font-heading text-gray-900 mb-2">
              Homes you’ll love
            </h5>
            <p className="text-gray-600">
              New listings just in—modern, comfortable, and waiting for you.
              Start your home search now!
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/properties"
              onClick={() => window.scrollTo(0, 0)}
              className="text-primary hover:text-primary/90 font-medium flex items-center"
            >
              View all properties
              <i className="ri-arrow-right-line ml-1"></i>
            </Link>
          </div>
        </div>

        {/* Property Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array(3)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100"
                >
                  <div className="relative pb-[60%]">
                    <Skeleton className="absolute inset-0 h-full w-full" />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-4 w-32 mb-3" />
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              ))
          ) : properties && properties.length > 0 ? (
            properties.map((prop) => (
              <PropertyCard key={prop.id} prop={prop} />
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">
              No featured properties available at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
