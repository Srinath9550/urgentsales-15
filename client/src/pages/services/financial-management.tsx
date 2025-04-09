import React from "react";
import {
  HandHelping,
  Calculator,
  LineChart,
  DollarSign,
  Phone,
  Building,
  Shield,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function FinancialManagementPage() {
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

  // Current page identifier
  const currentPage = "financial-management";

  // Service links data
  const serviceLinks = [
    {
      id: "why-choose-us",
      title: "Why Choose Us",
      icon: <Shield className="h-5 w-5" />,
      color: "bg-blue-100",
      textColor: "text-blue-600",
      href: "/services/why-choose-us",
    },
    {
      id: "property-management",
      title: "Property Management",
      icon: <Building className="h-5 w-5" />,
      color: "bg-green-100",
      textColor: "text-green-600",
      href: "/services/property-management",
    },
    {
      id: "investment-advisory",
      title: "Investment Advisory",
      icon: <Key className="h-5 w-5" />,
      color: "bg-purple-100",
      textColor: "text-purple-600",
      href: "/services/investment-advisory",
    },
    {
      id: "legal-solutions",
      title: "Legal Solutions",
      icon: <Shield className="h-5 w-5" />,
      color: "bg-indigo-100",
      textColor: "text-indigo-600",
      href: "/services/legal-solutions",
    },
    {
      id: "financial-management",
      title: "Financial Management",
      icon: <DollarSign className="h-5 w-5" />,
      color: "bg-teal-100",
      textColor: "text-teal-600",
      href: "/services/financial-management",
    },
  ];

  // Filter out the current page from service links
  const relatedServices = serviceLinks.filter(service => service.id !== currentPage);

  return (
    <div className="bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-teal-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
                Financial Management Services
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                Optimize your real estate investments with our comprehensive
                financial management services. From budgeting to financial
                planning, we help you maximize returns and minimize risks.
              </p>
              <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild onClick={() => window.scrollTo(0, 0)}>
                  <Link href="/contact">
                    <Phone className="mr-2 h-4 w-4" /> Speak to a Financial Advisor
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/services/why-choose-us">View All Services</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1573164574230-db1d5e960238?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                alt="Financial Management"
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
            <h2 className="text-3xl font-bold">Our Financial Services</h2>
            <p className="text-gray-600 mt-2">
              Comprehensive solutions for your real estate financial needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <Calculator className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Budget Planning</h3>
              <p className="text-gray-600 mb-4">
                Starting from {formatIndianPrice(25000)}
              </p>
              <p>
                Comprehensive budget planning for your property investments and
                management.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <LineChart className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Investment Analysis
              </h3>
              <p className="text-gray-600 mb-4">
                Starting from {formatIndianPrice(50000)}
              </p>
              <p>
                Detailed analysis of investment opportunities and potential
                returns.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <DollarSign className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tax Planning</h3>
              <p className="text-gray-600 mb-4">
                Starting from {formatIndianPrice(35000)}
              </p>
              <p>
                Strategic tax planning to maximize your real estate investment
                benefits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tools & Resources Section */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Related Tools & Resources</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedServices.map((service) => (
              <Link 
                key={service.id} 
                href={service.href}
                onClick={() => window.scrollTo(0, 0)}
                className="flex items-center p-4 rounded-lg bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className={`${service.color} p-3 rounded-full mr-4`}>
                  <div className={service.textColor}>{service.icon}</div>
                </div>
                <span className="font-medium text-gray-800">{service.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
