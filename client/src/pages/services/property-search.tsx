import React from "react";
import { Search, MapPin, Filter, Home, CheckCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function PropertySearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-50 to-blue-50 py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
                  Find Your Perfect Property
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                  Our advanced property search tools and expert real estate
                  consultants help you discover the ideal home or commercial space
                  that meets all your requirements.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" onClick={() => window.scrollTo(0, 0)} asChild>
                    <Link href="/properties">
                      <Search className="mr-2 h-4 w-4" /> Start Searching
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild onClick={() => window.scrollTo(0, 0)}>
                    <Link href="/services/why-choose-us">View All Services</Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                  alt="Property Search"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Search Features */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Advanced Search Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="bg-green-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <MapPin className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Location-Based Search
                </h3>
                <p className="text-gray-600">
                  Find properties in specific neighborhoods, near schools,
                  workplaces, or other points of interest with our precise
                  location filters.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="bg-green-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Filter className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Customizable Filters
                </h3>
                <p className="text-gray-600">
                  Narrow down your search with filters for price range, property
                  type, size, amenities, and more to find exactly what you're
                  looking for.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="bg-green-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Home className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Virtual Tours</h3>
                <p className="text-gray-600">
                  Explore properties from the comfort of your home with our
                  virtual tours, 360° views, and detailed photo galleries.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-green-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Start your property search today
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Let our expert team help you find the perfect property that meets
              all your requirements.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" onClick={() => window.scrollTo(0, 0)} asChild>
                <Link href="/properties">
                  Search Properties
                </Link>
              </Button>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
