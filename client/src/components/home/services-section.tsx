import React from "react";
import { Link } from "wouter";
import {
  Building,
  Home,
  Search,
  Key,
  Shield,
  HandHelping,
  DollarSign,
  Settings,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  imageSrc?: string;
  href: string;
  onClick?: () => void;
}

const ServiceCard = ({
  icon,
  title,
  description,
  imageSrc,
  href,
  onClick = () => window.scrollTo(0, 0),
}: ServiceCardProps) => {
  return (
    <Link href={href} onClick={onClick}>
      <Card className="transition-all duration-300 hover:shadow-lg overflow-hidden group cursor-pointer">
        <div className="relative">
          {imageSrc && (
            <div className="h-40 overflow-hidden">
              <img
                src={imageSrc}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          )}
          <div className="absolute top-2 left-2 bg-blue-500 text-white p-2 rounded-full shadow-lg">
            {icon}
          </div>
        </div>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default function ServicesSection() {
  const services = [
    {
      icon: <Building className="h-6 w-6" />,
      title: "Property Management",
      description:
        "Our professional real estate rental agency offers exceptional management services tailored specifically for landlords and property owners. From tenant screening to routine maintenance, we manage everything seamlessly so you can enjoy stress-free property ownership.",
      imageSrc:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      href: "/services/property-management",
      onClick: () => window.scrollTo(0, 0),
    },
    // {
    //   icon: <Search className="h-6 w-6" />,
    //   title: "Property Search",
    //   description:
    //     "Looking for a reliable real estate broker near me or nearby real estate office? Discover your perfect home or commercial space effortlessly using our advanced property search engine, powered by the expertise of our trusted real estate consultants.",
    //   imageSrc:
    //     "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    //   href: "/services/property-search",
    //   onClick: () => window.scrollTo(0, 0),
    // },
    // {
    //   icon: <Home className="h-6 w-6" />,
    //   title: "Commercial and Industrial Real Estate",
    //   description:
    //     "As an established industrial real estate agency, we connect businesses with ideal commercial and industrial properties. Whether you're looking for offices, warehouses, retail spaces, or factories, our expert team helps you secure prime locations to grow your real estate business effectively.",
    //   imageSrc:
    //     "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    //   href: "/services/commercial-industrial",
    //   onClick: () => window.scrollTo(0, 0),
    // },
    {
      icon: <Key className="h-6 w-6" />,
      title: "Real Estate Investment Advisory",
      description:
        "Leveraging our expertise as a real estate digital marketing agency, we ensure optimal visibility for your property listings. Using innovative marketing strategies, we attract qualified buyers and tenants quickly and efficiently.",
      imageSrc:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      href: "/services/investment-advisory",
      onClick: () => window.scrollTo(0, 0),
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Property Legal Solutions",
      description: "Expert legal advice for real estate transactions",
      imageSrc:
        "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      href: "/services/legal-solutions",
    },
    {
      icon: <HandHelping className="h-6 w-6" />,
      title: "Financial Management Services",
      description: "Professional guidance for property investment decisions",
      imageSrc:
        "https://images.unsplash.com/photo-1573164574230-db1d5e960238?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      href: "/services/financial-management",
    },
  ];

  const advancedServices = [
    // {
    //   icon: <Shield className="h-6 w-6" />,
    //   title: "Property Legal Solutions",
    //   description: "Expert legal advice for real estate transactions",
    //   imageSrc:
    //     "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    //   href: "/services/legal-solutions",
    // },
    // {
    //   icon: <HandHelping className="h-6 w-6" />,
    //   title: "Financial Management Services",
    //   description: "Professional guidance for property investment decisions",
    //   imageSrc:
    //     "https://images.unsplash.com/photo-1573164574230-db1d5e960238?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    //   href: "/services/financial-management",
    // },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Investment Services",
      description:
        "Comprehensive analysis and insights for property investments",
      imageSrc:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      href: "/services/investment-services",
    },
    // {
    //   icon: <Settings className="h-6 w-6" />,
    //   title: "Why Choose Us",
    //   description:
    //     "Discover what sets us apart from other real estate agencies",
    //   imageSrc:
    //     "https://cdn.corporatefinanceinstitute.com/assets/real-estate-investment-firms.jpeg",
    //   href: "/services/why-choose-us",
    // },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore top real estate services with one of India's leading
            agencies. From residential to commercial, our expert brokers have
            you covered.
          </p>
        </div>

        {/* Main services with images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="rounded-lg overflow-hidden shadow-lg mb-6">
              <img
                src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
                alt="Real Estate Services"
                className="w-full h-72 object-cover"
              />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              Why Choose Our Services?
            </h3>
            <p className="text-gray-700 mb-6">
              We're ranked among real estate top companies in India, known for
              our transparency, professionalism, and client-centric approach.
              Whether it's residential, commercial, or industrial, we simplify
              your property journey with unmatched dedication and local market
              knowledge. Choose our services—your trusted partner in real estate
              India.
            </p>
            <ul className="space-y-2">
              {services.slice(0, 4).map((service, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Link
                    href={service.href}
                    onClick={() => window.scrollTo(0, 0)}
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <div className="bg-blue-100 p-1 rounded-full">
                      {service.icon}
                    </div>
                    <span className="font-medium">{service.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link
                href="/services/why-choose-us"
                className="text-primary hover:underline font-medium"
                onClick={() => window.scrollTo(0, 0)}
              >
                Learn more about our approach →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                imageSrc={service.imageSrc}
                href={service.href}
              />
            ))}
          </div>
        </div>

      
      </div>
    </section>
  );
}
