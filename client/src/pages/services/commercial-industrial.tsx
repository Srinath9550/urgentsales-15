import React from "react";
import {
  Building,
  Warehouse,
  Store,
  Factory,
  CheckCircle,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function CommercialIndustrialPage() {
  return (
    <div className="bg-white">
      <Navbar />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-50 to-blue-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
                Commercial & Industrial Real Estate
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                We connect businesses with ideal commercial and industrial
                properties. From offices to warehouses, our expert team helps
                you secure prime locations to grow your business effectively.
              </p>
              <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild onClick={() => window.scrollTo(0, 0)}>
                  <Link href="/contact">
                    <Phone className="mr-2 h-4 w-4" /> Contact Us
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild onClick={() => window.scrollTo(0, 0)}>
                  <Link href="/services/why-choose-us">View All Services</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                alt="Commercial Real Estate"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Commercial & Industrial Property Types
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Building className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Office Spaces</h3>
              <p className="text-gray-600">
                From small startups to large corporations, we offer a variety of
                office spaces to suit your business needs and budget.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Store className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Retail Spaces</h3>
              <p className="text-gray-600">
                Prime retail locations with high foot traffic to maximize your
                business visibility and customer reach.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Warehouse className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Warehouses</h3>
              <p className="text-gray-600">
                Spacious and strategically located warehouses for efficient
                storage, distribution, and logistics operations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Factory className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Industrial Facilities
              </h3>
              <p className="text-gray-600">
                Purpose-built industrial spaces for manufacturing, production,
                and heavy industrial operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Find your ideal commercial space
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Let our commercial real estate experts help you find the perfect
            location for your business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" variant="secondary" onClick={() => window.scrollTo(0, 0)} asChild>
                <Link href="/contact">
                Browse Properties
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild onClick={() => window.scrollTo(0, 0)}>
                  <Link href="/contact">
                    <Phone className="mr-2 h-4 w-4" /> Schedule Consultation
                  </Link>
                </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
