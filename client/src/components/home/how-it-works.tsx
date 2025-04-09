import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Search, MessageSquare, Home } from 'lucide-react';

export default function HowItWorks() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl font-bold font-heading text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-600 text-lg">Buy or sell property without broker hassles. Direct connections save time and money.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-5">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Search Properties</h3>
            <p className="text-gray-600">Browse listings from verified owners. Filter by location, budget, and requirements.</p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-5">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Connect Directly</h3>
            <p className="text-gray-600">Chat with property owners without middlemen. Schedule visits at your convenience.</p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-5">
              <Home className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Close the Deal</h3>
            <p className="text-gray-600">Finalize your purchase with our guidance. Save up to 3% in broker commissions.</p>
          </div>
        </div>

        <div className="text-center mt-10">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/properties">
              <span>Get Started</span>
              <i className="ri-arrow-right-line ml-2"></i>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
