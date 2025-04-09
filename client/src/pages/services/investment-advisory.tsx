import React from "react";
import {
  TrendingUp,
  BarChart,
  PieChart,
  LineChart,
  DollarSign,
  Phone,
  Building,
  Briefcase,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function InvestmentAdvisoryPage() {
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

  // Example prices for demonstration
  const sampleInvestment = 5000000;
  const projectedReturn = 7500000;

  return (
    <div className="bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-50 to-blue-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
                Real Estate Investment Advisory
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                Make informed investment decisions with our expert advisory
                services. Our team of experienced professionals will guide you
                through the entire investment process to maximize your returns.
              </p>
              <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild onClick={() => window.scrollTo(0, 0)}>
                  <Link href="/contact">
                    <Phone className="mr-2 h-4 w-4" /> Contact an Advisor
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild onClick={() => window.scrollTo(0, 0)}>
                  <Link href="/services/why-choose-us">View All Services</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
                alt="Investment Advisory"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Example section with prices */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Investment Potential</h2>
            <p className="text-gray-600 mt-2">
              See how your investments can grow with our expert guidance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Sample Investment</h3>
              <p className="text-4xl font-bold text-primary">
                {formatIndianPrice(sampleInvestment)}
              </p>
              <p className="text-gray-600 mt-2">Initial investment amount</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Projected Returns</h3>
              <p className="text-4xl font-bold text-green-600">
                {formatIndianPrice(projectedReturn)}
              </p>
              <p className="text-gray-600 mt-2">
                Estimated return after 5 years
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the content */}
      {/* Services Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Our Investment Advisory Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="bg-purple-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <TrendingUp className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Market Analysis</h3>
              <p className="text-gray-600">
                Comprehensive analysis of real estate market trends, property
                valuations, and investment opportunities to inform your
                decision-making.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="bg-purple-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <BarChart className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Portfolio Management
              </h3>
              <p className="text-gray-600">
                Strategic management of your real estate investment portfolio to
                optimize returns, minimize risks, and achieve your financial
                goals.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="bg-purple-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <PieChart className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Investment Strategy
              </h3>
              <p className="text-gray-600">
                Tailored investment strategies based on your financial
                objectives, risk tolerance, and market conditions to maximize
                your returns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Process */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Our Investment Process
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline */}
              <div className="absolute left-0 md:left-1/2 h-full w-1 bg-purple-200 transform md:translate-x-0"></div>

              {/* Steps */}
              <div className="space-y-12">
                <div className="relative flex flex-col md:flex-row items-center md:items-start">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white md:absolute md:left-1/2 md:-ml-5 z-10">
                    1
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-16 md:w-1/2 md:pl-8">
                    <h3 className="text-xl font-semibold mb-2">
                      Initial Consultation
                    </h3>
                    <p className="text-gray-600">
                      We begin by understanding your financial goals, investment
                      timeline, and risk tolerance to create a personalized
                      investment plan.
                    </p>
                  </div>
                </div>

                <div className="relative flex flex-col md:flex-row items-center md:items-start">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white md:absolute md:left-1/2 md:-ml-5 z-10">
                    2
                  </div>
                  <div className="mt-4 md:mt-0 md:mr-16 md:w-1/2 md:text-right">
                    <h3 className="text-xl font-semibold mb-2">
                      Market Research
                    </h3>
                    <p className="text-gray-600">
                      Our team conducts thorough market research to identify
                      promising investment opportunities aligned with your
                      objectives.
                    </p>
                  </div>
                </div>

                <div className="relative flex flex-col md:flex-row items-center md:items-start">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white md:absolute md:left-1/2 md:-ml-5 z-10">
                    3
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-16 md:w-1/2 md:pl-8">
                    <h3 className="text-xl font-semibold mb-2">
                      Strategy Development
                    </h3>
                    <p className="text-gray-600">
                      We develop a comprehensive investment strategy tailored to
                      your needs, including property selection, financing
                      options, and risk management.
                    </p>
                  </div>
                </div>

                <div className="relative flex flex-col md:flex-row items-center md:items-start">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white md:absolute md:left-1/2 md:-ml-5 z-10">
                    4
                  </div>
                  <div className="mt-4 md:mt-0 md:mr-16 md:w-1/2 md:text-right">
                    <h3 className="text-xl font-semibold mb-2">
                      Implementation
                    </h3>
                    <p className="text-gray-600">
                      We assist you in executing the investment strategy, from
                      property acquisition to portfolio management and
                      optimization.
                    </p>
                  </div>
                </div>

                <div className="relative flex flex-col md:flex-row items-center md:items-start">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white md:absolute md:left-1/2 md:-ml-5 z-10">
                    5
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-16 md:w-1/2 md:pl-8">
                    <h3 className="text-xl font-semibold mb-2">
                      Monitoring & Optimization
                    </h3>
                    <p className="text-gray-600">
                      We continuously monitor your investment performance and
                      make strategic adjustments to optimize returns and adapt
                      to changing market conditions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Investment Opportunities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <Building className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold">
                  Residential Properties
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Invest in apartments, villas, and houses in high-growth areas
                with strong rental demand and appreciation potential.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Steady rental income</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Long-term appreciation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Tax benefits</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <Briefcase className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold">Commercial Properties</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Diversify your portfolio with office spaces, retail units, and
                industrial properties offering higher yields.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Higher rental yields</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Longer lease terms</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Corporate tenants</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold">Land & Development</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Invest in land parcels with development potential in emerging
                locations for significant long-term returns.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>High appreciation potential</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Development opportunities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Lower initial investment</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <LineChart className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold">REITs & Funds</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Access real estate investments through REITs and funds for
                diversification with lower capital requirements.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Instant diversification</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Professional management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Higher liquidity</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

     

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to grow your real estate portfolio?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Schedule a consultation with our investment advisors to discuss your
            financial goals and discover how we can help you build wealth
            through real estate.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild onClick={() => window.scrollTo(0, 0)}>
                  <Link href="/contact">
                  <DollarSign className="mr-2 h-4 w-4" /> Schedule a Consultation
                  </Link>
                </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/services/legal-solutions">Explore Other Services</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
