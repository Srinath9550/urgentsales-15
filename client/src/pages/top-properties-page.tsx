import { useState } from 'react';
import { useLocation } from 'wouter';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import TopPropertyRankings from '@/components/property/top-property-rankings';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { MapPin, Search } from 'lucide-react';

export default function TopPropertiesPage() {
  const [_, navigate] = useLocation();
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('premium');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/top-properties/10?category=${selectedCategory}&location=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const categories = [
    { id: 'premium', name: 'Premium', description: 'Our highest-rated exclusive properties with premium features and amenities' },
    { id: 'featured', name: 'Featured', description: 'Hand-picked featured properties recommended by our real estate experts' },
    { id: 'urgent', name: 'Urgent Sale', description: 'Properties available for immediate purchase with potential discounts' },
    { id: 'newest', name: 'Newly Listed', description: 'Fresh properties that just entered the market' }
  ];

  const popularCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 
    'Pune', 'Ahmedabad', 'Jaipur', 'Surat'
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">Top Ranked Properties</h1>
              <p className="text-lg text-gray-600 mb-8">
                Discover the most exclusive and high-value properties ranked by location, quality, and popularity
              </p>
              
              {/* Search Form */}
              <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
                <div className="relative flex-grow">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search by city (e.g., Mumbai, Delhi)"
                    className="pl-10 h-12"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <Button type="submit" className="h-12 px-6">
                  <Search className="h-5 w-5 mr-2" />
                  <span>Search</span>
                </Button>
              </form>
              
              {/* Popular Cities */}
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-3">Popular Cities:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {popularCities.map(city => (
                    <Button
                      key={city}
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/top-properties/10?category=${selectedCategory}&location=${encodeURIComponent(city)}`)}
                      className="mb-2"
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      {city}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Categories Tabs */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Tabs 
              defaultValue="premium" 
              className="w-full"
              onValueChange={(value) => setSelectedCategory(value)}
            >
              <div className="text-center mb-10">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {categories.map(category => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="py-3"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {categories.map(category => (
                <TabsContent key={category.id} value={category.id} className="pt-4">
                  <TopPropertyRankings 
                    category={category.id}
                    title={`Top ${category.name} Properties`}
                    description={category.description}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">List Your Property Today</h2>
              <p className="text-lg text-gray-600 mb-8">
                Join our premium property marketplace and get your listing ranked among the top properties
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <a href="/post-property-free">Post Property For Free</a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="/add-property">Premium Listing</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}