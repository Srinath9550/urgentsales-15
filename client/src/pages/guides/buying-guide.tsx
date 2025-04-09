import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {
  Wallet,
  Home,
  MapPin,
  Search,
  ClipboardCheck,
  FileText,
  Handshake,
  Truck,
  Calculator,
  ChevronRight,
} from "lucide-react";

// Define the guide sections with their content and images
const guideSections = [
  {
    id: "financial-readiness",
    title: "Assess Your Readiness and Financial Stability",
    icon: <Wallet className="h-6 w-6" />,
    image: "/images/guides/financial-readiness.jpg",
    imageAlt: "Financial readiness assessment",
    imageFallback:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    content: (
      <>
        <h3 className="text-2xl font-semibold mb-4">
          Evaluate Financial Health
        </h3>
        <p className="mb-4">
          Before embarking on the home-buying journey, ensure you have a stable
          income and sufficient savings for a down payment. Assess your ability
          to manage monthly mortgage payments and other associated costs.
        </p>
        <h3 className="text-2xl font-semibold mb-4">Rent vs. Buy Analysis</h3>
        <p>
          Consider whether purchasing a home aligns with your long-term goals
          compared to renting. This involves analyzing factors such as financial
          readiness, lifestyle preferences, and market conditions.
        </p>
      </>
    ),
  },
  {
    id: "budget",
    title: "Define Your Budget",
    icon: <Calculator className="h-6 w-6" />,
    image: "/images/guides/budget.jpg",
    imageAlt: "Budget planning",
    imageFallback:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    content: (
      <>
        <h3 className="text-2xl font-semibold mb-4">Set a Realistic Budget</h3>
        <p className="mb-4">
          Determine a budget that reflects your financial capacity. This
          includes accounting for the property's price, registration fees,
          taxes, and potential renovation costs.
        </p>
        <h3 className="text-2xl font-semibold mb-4">
          Explore Financing Options
        </h3>
        <p>
          Research various home loan products, interest rates, and eligibility
          criteria. Understanding these aspects will aid in securing a loan that
          suits your financial situation.
        </p>
      </>
    ),
  },
  {
    id: "location",
    title: "Choose the Right Location",
    icon: <MapPin className="h-6 w-6" />,
    image: "/images/guides/location.jpg",
    imageAlt: "Location selection",
    imageFallback:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    content: (
      <>
        <h3 className="text-2xl font-semibold mb-4">Evaluate Localities</h3>
        <p>
          Select a location that meets your lifestyle needs and offers essential
          amenities such as schools, hospitals, and public transportation.
          Consider factors like safety, connectivity, and future development
          plans.
        </p>
      </>
    ),
  },
  {
    id: "shortlist",
    title: "Shortlist Properties",
    icon: <Search className="h-6 w-6" />,
    image: "/images/guides/shortlist.jpg",
    imageAlt: "Property shortlisting",
    imageFallback:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    content: (
      <>
        <h3 className="text-2xl font-semibold mb-4">
          Identify Suitable Properties
        </h3>
        <p className="mb-4">
          Utilize online platforms like UrgentSales to browse listings that
          match your criteria. Pay attention to aspects such as property type,
          size, and price.
        </p>
        <h3 className="text-2xl font-semibold mb-4">Conduct Market Research</h3>
        <p>
          Analyze current market trends, property appreciation rates, and
          demand-supply dynamics in your chosen area to make an informed
          decision.
        </p>
      </>
    ),
  },
  {
    id: "site-visits",
    title: "Conduct Site Visits",
    icon: <Home className="h-6 w-6" />,
    image: "/images/guides/site-visits.jpg",
    imageAlt: "Property site visits",
    imageFallback:
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    content: (
      <>
        <h3 className="text-2xl font-semibold mb-4">Inspect Properties</h3>
        <p>
          Schedule visits to shortlisted properties to assess their condition,
          construction quality, and surrounding environment. This firsthand
          evaluation is crucial in identifying potential issues.
        </p>
      </>
    ),
  },
  {
    id: "legal-documentation",
    title: "Verify Legal Documentation",
    icon: <ClipboardCheck className="h-6 w-6" />,
    image: "/images/guides/legal-documentation.jpg",
    imageAlt: "Legal documentation verification",
    imageFallback:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    content: (
      <>
        <h3 className="text-2xl font-semibold mb-4">Due Diligence</h3>
        <p className="mb-4">
          Ensure the property has clear titles and is free from legal disputes.
          Verify documents such as the title deed, encumbrance certificate, and
          necessary approvals from local authorities.
        </p>
        <h3 className="text-2xl font-semibold mb-4">Regulatory Compliance</h3>
        <p>
          Confirm that the property complies with local zoning laws and building
          regulations to avoid future complications.
        </p>
      </>
    ),
  },
  {
    id: "finalize-deal",
    title: "Finalize the Deal",
    icon: <Handshake className="h-6 w-6" />,
    image: "/images/guides/finalize-deal.jpg",
    imageAlt: "Deal finalization",
    imageFallback:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    content: (
      <>
        <h3 className="text-2xl font-semibold mb-4">Negotiate Terms</h3>
        <p className="mb-4">
          Engage in negotiations with the seller to agree on a fair price and
          favorable terms. Be prepared to discuss aspects like payment schedules
          and inclusion of fixtures or furnishings.
        </p>
        <h3 className="text-2xl font-semibold mb-4">Secure Financing</h3>
        <p>
          Once terms are agreed upon, proceed with finalizing your home loan
          application and ensure all financial arrangements are in place.
        </p>
      </>
    ),
  },
  {
    id: "legal-formalities",
    title: "Complete Legal Formalities",
    icon: <FileText className="h-6 w-6" />,
    image: "/images/guides/legal-formalities.jpg",
    imageAlt: "Legal formalities completion",
    imageFallback:
      "https://images.unsplash.com/photo-1607863680198-23d4b2565df0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    content: (
      <>
        <h3 className="text-2xl font-semibold mb-4">Draft Agreements</h3>
        <p className="mb-4">
          Prepare a sale agreement outlining the terms and conditions agreed
          upon by both parties.
        </p>
        <h3 className="text-2xl font-semibold mb-4">Registration</h3>
        <p>
          Register the property with the appropriate government authority to
          legally transfer ownership. This process involves paying stamp duty
          and registration fees.
        </p>
      </>
    ),
  },
  {
    id: "plan-move",
    title: "Plan Your Move",
    icon: <Truck className="h-6 w-6" />,
    image: "/images/guides/plan-move.jpg",
    imageAlt: "Moving planning",
    imageFallback:
      "https://images.unsplash.com/photo-1600518464441-9306b5986a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    content: (
      <>
        <h3 className="text-2xl font-semibold mb-4">Prepare for Relocation</h3>
        <p className="mb-4">
          Organize the logistics of moving, including hiring movers, setting up
          utilities, and notifying relevant parties of your change of address.
        </p>
        <h3 className="text-2xl font-semibold mb-4">Settle In</h3>
        <p>
          Once moved, take the time to familiarize yourself with the new
          environment and establish routines that suit your new home.
        </p>
      </>
    ),
  },
];

export default function BuyingGuidePage() {
  const [activeSection, setActiveSection] = useState(guideSections[0].id);
  const [isMobile, setIsMobile] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Handle card click with animation lock to prevent multiple clicks during animation
  const handleCardClick = (sectionId: string) => {
    if (isAnimating || activeSection === sectionId) return;

    setIsAnimating(true);
    setActiveSection(sectionId);

    // Reset animation lock after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  // Find the active section
  const currentSection =
    guideSections.find((section) => section.id === activeSection) ||
    guideSections[0];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section with enhanced animation */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12 md:py-20"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900"
              >
                Property Buying Guide
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-lg text-gray-700 mb-6"
              >
                Purchasing a home is a significant milestone that requires
                careful planning and informed decision-making. Our comprehensive
                guide will assist you through this complex process.
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* Guide Content Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Vertical Image Navigation - Left Side */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="md:w-1/3 lg:w-1/4"
              >
                <div className="sticky top-24 space-y-4">
                  <h2 className="text-2xl font-bold mb-6">Guide Chapters</h2>

                  <div className="flex flex-col space-y-4">
                    {guideSections.map((section, index) => (
                      <motion.div
                        key={section.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.4 }}
                        whileHover={{
                          scale: 1.03,
                          boxShadow:
                            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                        }}
                        className={`relative cursor-pointer transition-all duration-300 rounded-lg overflow-hidden ${
                          activeSection === section.id
                            ? "ring-2 ring-primary ring-offset-2"
                            : "hover:shadow-lg"
                        }`}
                        onClick={() => handleCardClick(section.id)}
                      >
                        <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
                          <img
                            src={section.imageFallback}
                            alt={section.imageAlt}
                            className={`w-full h-full object-cover transition-transform duration-700 ${
                              activeSection === section.id
                                ? "scale-110"
                                : "hover:scale-110"
                            }`}
                          />
                          <div
                            className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3 transition-all duration-300 ${
                              activeSection === section.id
                                ? "bg-primary/30"
                                : "hover:bg-black/40"
                            }`}
                          >
                            <div className="text-white w-full">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {section.icon}
                                  <span className="font-semibold">
                                    Chapter {index + 1}
                                  </span>
                                </div>
                                {activeSection === section.id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <ChevronRight className="h-5 w-5 text-white" />
                                  </motion.div>
                                )}
                              </div>
                              <h3 className="text-sm font-medium line-clamp-2 mt-1">
                                {section.title}
                              </h3>
                            </div>
                          </div>

                          {/* Active indicator with animation */}
                          {activeSection === section.id && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "100%" }}
                              transition={{ duration: 0.3 }}
                              className="absolute top-0 right-0 bottom-0 w-1 bg-primary md:hidden"
                            />
                          )}
                          {activeSection === section.id && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "100%" }}
                              transition={{ duration: 0.3 }}
                              className="absolute top-0 bottom-0 right-0 w-1 bg-primary hidden md:block"
                            />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Content Display - Right Side with enhanced animations */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="md:w-2/3 lg:w-3/4"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSection.id}
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -40, scale: 0.95 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      duration: 0.5,
                    }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    {/* Large display image for current section with parallax effect */}
                    <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
                      <motion.img
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5 }}
                        src={currentSection.imageFallback}
                        alt={currentSection.imageAlt}
                        className="w-full h-full object-cover"
                      />
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end"
                      >
                        <div className="p-6 text-white w-full">
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="flex items-center gap-2 mb-2"
                          >
                            {currentSection.icon}
                            <span className="text-lg font-semibold">
                              Chapter{" "}
                              {guideSections.findIndex(
                                (s) => s.id === currentSection.id,
                              ) + 1}
                            </span>
                          </motion.div>
                          <motion.h2
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="text-2xl md:text-3xl font-bold"
                          >
                            {currentSection.title}
                          </motion.h2>
                        </div>
                      </motion.div>
                    </div>

                    {/* Content with staggered animation */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="p-6 md:p-8 lg:p-10"
                    >
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="prose max-w-none"
                      >
                        {currentSection.content}
                      </motion.div>

                      {/* Navigation buttons with hover effects */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="mt-10 flex justify-between"
                      >
                        {guideSections.findIndex(
                          (s) => s.id === currentSection.id,
                        ) > 0 && (
                          <motion.button
                            whileHover={{ x: -5, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              if (isAnimating) return;
                              const currentIndex = guideSections.findIndex(
                                (s) => s.id === currentSection.id,
                              );
                              if (currentIndex > 0) {
                                setIsAnimating(true);
                                setActiveSection(
                                  guideSections[currentIndex - 1].id,
                                );
                                setTimeout(() => setIsAnimating(false), 600);
                              }
                            }}
                            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors px-4 py-2 rounded-lg hover:bg-primary/5"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Previous Chapter
                          </motion.button>
                        )}

                        {guideSections.findIndex(
                          (s) => s.id === currentSection.id,
                        ) <
                          guideSections.length - 1 && (
                          <motion.button
                            whileHover={{ x: 5, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              if (isAnimating) return;
                              const currentIndex = guideSections.findIndex(
                                (s) => s.id === currentSection.id,
                              );
                              if (currentIndex < guideSections.length - 1) {
                                setIsAnimating(true);
                                setActiveSection(
                                  guideSections[currentIndex + 1].id,
                                );
                                setTimeout(() => setIsAnimating(false), 600);
                              }
                            }}
                            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors ml-auto px-4 py-2 rounded-lg hover:bg-primary/5"
                          >
                            Next Chapter
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </motion.button>
                        )}
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Call to Action with animation */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="bg-primary/5 py-12"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="text-2xl md:text-3xl font-bold mb-4"
              >
                Ready to Find Your Dream Home?
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.5 }}
                className="text-lg text-gray-700 mb-6"
              >
                Now that you understand the home buying process, start your
                journey with UrgentSales.
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/properties"
                  className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Browse Properties
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/contact"
                  className="bg-white border border-primary text-primary hover:bg-primary/5 font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Contact an Agent
                </motion.a>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
