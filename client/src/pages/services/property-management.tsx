import React from "react";
import { Building, CheckCircle, Phone, Shield, Key, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function PropertyManagementPage() {
  // Current page identifier
  const currentPage = "property-management";

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
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
                Property Management Services
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                Professional property management solutions for landlords and
                property owners. We handle everything so you can enjoy the
                benefits of property ownership without the stress.
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
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
                alt="Property Management"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Our Property Management Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Building className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Tenant Screening</h3>
              <p className="text-gray-600">
                We thoroughly vet potential tenants with comprehensive
                background checks, credit history reviews, and reference
                verification to ensure you get reliable, responsible tenants.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Building className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Rent Collection</h3>
              <p className="text-gray-600">
                Our streamlined rent collection process ensures on-time payments
                and proper handling of late fees, providing you with consistent
                cash flow from your investment.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Building className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Property Maintenance
              </h3>
              <p className="text-gray-600">
                We handle all maintenance requests promptly with our network of
                trusted contractors, ensuring your property remains in excellent
                condition year-round.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to simplify your property management?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Let our team of professionals handle the day-to-day management of
            your property, so you can focus on what matters most to you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" asChild onClick={() => window.scrollTo(0, 0)}>
              <Link href="/contact">Get Started Today</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white hover:bg-white hover:text-blue-600"
              asChild
              onClick={() => window.scrollTo(0, 0)}
            >
              <Link href="/guides/buying-guide">Learn More</Link>
            </Button>
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
