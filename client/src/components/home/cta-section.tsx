import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold font-heading mb-6">
          Ready to Find Your Perfect Property?
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Join thousands of satisfied customers who found their dream home
          without paying broker commissions.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/properties" onClick={() => window.scrollTo(0, 0)}>
              <span>Search Properties</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="bg-white hover:bg-gray-100 text-primary border-white"
          >
            <Link href="/add-property" onClick={() => window.scrollTo(0, 0)}>
              <span>List Your Property</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
