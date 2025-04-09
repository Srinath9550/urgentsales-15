import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyTypeCount {
  type: string;
  count: number;
  image: string;
}

export default function PropertyCategories() {
  // Fetch property counts from the API
  const { data: propertyCounts, isLoading, error } = useQuery({
    queryKey: ['/api/properties/counts-by-type'],
    queryFn: async () => {
      const response = await fetch('/api/properties/counts-by-type');
      if (!response.ok) {
        throw new Error('Failed to fetch property counts');
      }
      return response.json();
    }
  });

  // Default images for each property type
  const typeImages = {
    apartment: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
    house: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
    villa: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
    plot: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80",
    commercial: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
  };

  // Combine API data with images
  const propertyCategories = propertyCounts ? 
    propertyCounts.map((item: { type: string; count: number }) => ({
      ...item,
      image: typeImages[item.type as keyof typeof typeImages] || typeImages.house
    })) : [];

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-2">
              Browse by Property Type
            </h2>
            <p className="text-gray-600">
              Find the perfect property that fits your needs
            </p>
          </div>
        </div>

        {isLoading ? (
          // Loading state
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-gray-50 rounded-xl overflow-hidden shadow-sm">
                <Skeleton className="h-32 w-full" />
                <div className="p-4 text-center">
                  <Skeleton className="h-5 w-24 mx-auto mb-2" />
                  <Skeleton className="h-4 w-16 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="text-center text-red-500 py-8">
            Failed to load property categories. Please try again later.
          </div>
        ) : (
          // Data loaded successfully
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {propertyCategories.map((category) => (
              <Link
                key={category.type}
                href={`/properties?propertyType=${category.type}`}
                className="group"
                onClick={() => window.scrollTo(0, 0)}
              >
                <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="relative pb-[75%]">
                    <img
                      src={category.image}
                      alt={
                        category.type.charAt(0).toUpperCase() +
                        category.type.slice(1)
                      }
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors capitalize">
                      {category.type === "plot" ? "Plots" : `${category.type}s`}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {category.count} Properties
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
