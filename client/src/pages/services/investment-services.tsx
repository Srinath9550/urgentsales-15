import React from "react";
import { Key, TrendingUp, BarChart, PieChart, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

// Changed function name from InvestmentAdvisoryPage to InvestmentServicesPage
export default function InvestmentServicesPage() {
  // Helper function for formatting prices in Indian Rupee format
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
    <div className="bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-50 to-blue-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
                Investment Services
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                Make informed investment decisions with our expert advisory
                services. Our team of experienced professionals will guide you
                through the entire investment process to maximize your returns.
              </p>
              <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild onClick={() => window.scrollTo(0, 0)}>
                  <Link href="/contact">
                    <Phone className="mr-2 h-4 w-4" />Contact an Advisor
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/services/why-choose-us">View All Services</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
                alt="Investment Services"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Our Investment Advisory Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="bg-purple-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Key className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Investment Strategy
              </h3>
              <p className="text-gray-600">
                Develop a personalized investment strategy based on your
                financial goals, risk tolerance, and timeline to ensure optimal
                returns.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="bg-purple-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <TrendingUp className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Market Analysis</h3>
              <p className="text-gray-600">
                Comprehensive market analysis to identify high-potential
                investment opportunities and emerging real estate trends.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="bg-purple-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <BarChart className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">ROI Forecasting</h3>
              <p className="text-gray-600">
                Detailed return on investment forecasting to help you understand
                potential gains and make data-driven decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Why Choose Our Investment Advisory
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Expert Advisors</h3>
              <p className="text-gray-600 mb-4">
                Our team consists of certified financial advisors and real
                estate experts with decades of combined experience in the
                market.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Certified financial planners</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Real estate market specialists</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Investment portfolio managers</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                Data-Driven Approach
              </h3>
              <p className="text-gray-600 mb-4">
                We leverage advanced analytics and market data to provide you
                with accurate insights and recommendations.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Comprehensive market analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Predictive modeling</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Historical performance tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to grow your real estate portfolio?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Schedule a consultation with our investment advisors today and take
            the first step toward building a profitable real estate investment
            portfolio.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" onClick={() => window.scrollTo(0, 0)}>
              <Link href="/contact">
                Schedule Consultation
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
