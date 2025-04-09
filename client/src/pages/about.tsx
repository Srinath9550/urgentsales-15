import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Percent,
  ArrowRight,
  Users,
  Building,
  Home,
  BarChart,
  Award,
  CheckCircle,
} from "lucide-react";

// Add this utility function at the top of the file
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// Assumed PropertyOwnerCTA component
// const PropertyOwnerCTA = () => (
//   <section className="py-8 bg-gray-100">
//     <div className="container mx-auto px-4 text-center">
//       <h2 className="text-2xl font-semibold mb-4">Become a Property Owner</h2>
//       <p className="text-gray-600 mb-6">List your property with us today!</p>
//       <Link to="/post-property-free">
//         <Button
//           size="lg"
//           onClick={scrollToTop}
//           className="bg-primary text-white"
//         >
//           List Now
//         </Button>
//       </Link>
//     </div>
//   </section>
// );

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        {/* <section className="py-16 bg-gradient-to-b from-primary/5 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About Our Real Estate Platform
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                We're transforming how people buy, sell, and rent properties
                across India by leveraging technology to create a seamless and
                transparent experience.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/properties">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white"
                    onClick={scrollToTop}
                  >
                    Browse Properties
                  </Button>
                </Link>
                <Link to="/post-property-free">
                  <Button size="lg" variant="outline" onClick={scrollToTop}>
                    List Your Property
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section> */}
        {/* <PropertyOwnerCTA /> Added PropertyOwnerCTA */}
        {/* Our Mission */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  About Urgentsales.in
                </h2>
                <p className="text-gray-600 mb-4">
                  Established in 2025, UrgentSales.in is India's fastest-growing
                  and most trusted online real estate platform, dedicated to
                  simplifying property transactions across the nation. Our
                  vision is to create a seamless and transparent real estate
                  experience, connecting millions of buyers, sellers, and
                  brokers through an innovative, easy-to-use platform featuring
                  verified property listings spanning in Andrapradesh &
                  Telengana.
                </p>
                <p className="text-gray-600 mb-4">
                  At UrgentSales.in, we go far beyond simply providing property
                  listings. We offer comprehensive real estate services,
                  including personalized property recommendations, expert
                  advisory services, and professional property management
                  solutions. Powered by cutting-edge technology such as Virtual
                  Reality (VR) and Artificial Intelligence (AI), we ensure an
                  immersive, intelligent, and highly personalized property
                  search experience.
                </p>
                <p className="text-gray-600 mb-4">
                  Our unique brokerage-free approach is designed to empower you.
                  By providing real-time market insights, transparent pricing,
                  and thoroughly verified listings, we help you make informed
                  decisions with confidence and ease. It’s a STARTUP company and
                  UrgentSales.in has grown rapidly to become more than just a
                  property portal—we've created a dynamic real estate ecosystem
                  trusted by millions.
                </p>
                <p className="text-gray-600 mb-4">
                  We remain committed to excellence, transparency, and
                  innovation, continuously transforming how India buys, sells,
                  and rents properties.
                </p>
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Core Values</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>
                        <span className="font-medium">
                          Trust & Transparency:
                        </span>{" "}
                        Clear information, verified listings, and honest pricing
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>
                        <span className="font-medium">Innovation:</span>{" "}
                        Constant improvement through AI, data analytics, and
                        user feedback
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>
                        <span className="font-medium">Accessibility:</span>{" "}
                        Making property ownership achievable for more Indians
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Our office space"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        {/* Urgency Sales Information */}
        <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Clock className="h-4 w-4" />
                <span>Urgent Sales Program</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Our Urgency Sales Initiative
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our unique Urgency Sales program helps property owners who need
                quick results with exclusive 25% discounts for buyers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                  alt="Urgency Sale Property"
                  className="rounded-xl shadow-lg w-full h-auto"
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">
                  How Urgency Sales Works
                </h3>
                <p className="text-gray-600 mb-6">
                  For property owners who need to sell quickly due to
                  relocations, financial needs, or other priorities, our Urgency
                  Sales program offers a fast-track solution with enhanced
                  visibility and support.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="bg-white p-4 rounded-lg shadow-sm flex items-start">
                    <Badge className="bg-blue-500 text-white mr-3 mt-1 rounded-full p-1 flex items-center justify-center">
                      <ArrowRight className="h-3 w-3" /> 25%
                    </Badge>
                    <div>
                      <h4 className="font-medium">Discounted Price</h4>
                      <p className="text-gray-500 text-sm">
                        Properties are listed at 25% below market value to
                        attract immediate interest
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm flex items-start">
                    <Badge className="bg-blue-500 text-white mr-3 mt-1 rounded-full p-1 flex items-center justify-center">
                      <Clock className="h-3 w-3" strokeWidth={2.5} />
                    </Badge>
                    <div>
                      <h4 className="font-medium">Time-Limited</h4>
                      <p className="text-gray-500 text-sm">
                        Listings run for just 7 days, creating a sense of
                        urgency for serious buyers
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm flex items-start">
                    <Badge className="bg-blue-500 text-white mr-3 mt-1 rounded-full p-1 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3" />
                    </Badge>
                    <div>
                      <h4 className="font-medium">Verified Properties</h4>
                      <p className="text-gray-500 text-sm">
                        All properties undergo rigorous verification for
                        assurance and peace of mind
                      </p>
                    </div>
                  </div>
                </div>

                <Link to="/">
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white group"
                    onClick={() => window.scrollTo(500, 500)}
                  >
                    View Urgent Sales
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Find Your Perfect Property?
              </h2>
              <p className="text-lg opacity-90 mb-8">
                Join thousands of satisfied users who've found their dream
                homes, lucrative investments, or perfect rental properties
                through our platform.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/properties">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-primary hover:bg-gray-100"
                    onClick={scrollToTop}
                  >
                    Search Properties
                  </Button>
                </Link>
                <Link to="/post-property-free">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-gray-100"
                    onClick={scrollToTop}
                  >
                    List Your Property
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
