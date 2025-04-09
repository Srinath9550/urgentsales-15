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
  Shield,
  Key,
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

  // Current page identifier
  const currentPage = "investment-advisory";

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
                    <Phone className="mr-2 h-4 w-4" /> Contact an Advisor
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
<section className="py-8 md:py-16 bg-gray-50">
  <div className="container mx-auto px-4">
    <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center">
      Our Investment Process
    </h2>

    <div className="max-w-4xl mx-auto">
      {/* Mobile Timeline */}
      <div className="md:hidden space-y-8">
        {[
          {
            step: 1,
            title: "Initial Consultation",
            description: "We begin by understanding your financial goals, investment timeline, and risk tolerance to create a personalized investment plan."
          },
          {
            step: 2,
            title: "Market Research",
            description: "Our team conducts thorough market research to identify promising investment opportunities aligned with your objectives."
          },
          {
            step: 3,
            title: "Strategy Development",
            description: "We develop a comprehensive investment strategy tailored to your needs, including property selection, financing options, and risk management."
          },
          {
            step: 4,
            title: "Implementation",
            description: "We assist you in executing the investment strategy, from property acquisition to portfolio management and optimization."
          },
          {
            step: 5,
            title: "Monitoring & Optimization",
            description: "We continuously monitor your investment performance and make strategic adjustments to optimize returns and adapt to changing market conditions."
          }
        ].map((item, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white text-sm mr-4">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
            </div>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Desktop Timeline */}
      <div className="hidden md:block relative">
        <div className="absolute left-1/2 h-full w-1 bg-purple-200 transform -translate-x-1/2"></div>
        <div className="space-y-12">
          {/* Step 1 */}
          <div className="relative flex items-center justify-between">
            <div className="w-5/12 text-right pr-8">
              <h3 className="text-xl font-semibold mb-2">Initial Consultation</h3>
              <p className="text-gray-600">
                We begin by understanding your financial goals, investment timeline, and risk tolerance to create a personalized investment plan.
              </p>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white z-10">1</div>
            <div className="w-5/12"></div>
          </div>

          {/* Step 2 */}
          <div className="relative flex items-center justify-between">
            <div className="w-5/12"></div>
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white z-10">2</div>
            <div className="w-5/12 pl-8">
              <h3 className="text-xl font-semibold mb-2">Market Research</h3>
              <p className="text-gray-600">
                Our team conducts thorough market research to identify promising investment opportunities aligned with your objectives.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex items-center justify-between">
            <div className="w-5/12 text-right pr-8">
              <h3 className="text-xl font-semibold mb-2">Strategy Development</h3>
              <p className="text-gray-600">
                We develop a comprehensive investment strategy tailored to your needs, including property selection, financing options, and risk management.
              </p>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white z-10">3</div>
            <div className="w-5/12"></div>
          </div>

          {/* Step 4 */}
          <div className="relative flex items-center justify-between">
            <div className="w-5/12"></div>
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white z-10">4</div>
            <div className="w-5/12 pl-8">
              <h3 className="text-xl font-semibold mb-2">Implementation</h3>
              <p className="text-gray-600">
                We assist you in executing the investment strategy, from property acquisition to portfolio management and optimization.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="relative flex items-center justify-between">
            <div className="w-5/12 text-right pr-8">
              <h3 className="text-xl font-semibold mb-2">Monitoring & Optimization</h3>
              <p className="text-gray-600">
                We continuously monitor your investment performance and make strategic adjustments to optimize returns and adapt to changing market conditions.
              </p>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white z-10">5</div>
            <div className="w-5/12"></div>
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
