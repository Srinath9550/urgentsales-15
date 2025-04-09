import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/home/hero-section";
import FeaturedListings from "@/components/home/featured-listings";
import TopProperties from "@/components/home/top-properties";
import RecommendedProperties from "@/components/home/recommended-properties";
import HowItWorks from "@/components/home/how-it-works";
// import ListPropertyCTA from "@/components/home/list-property-cta";
import PropertyCategories from "@/components/home/property-categories";
import FeaturedAgents from "@/components/home/featured-agents";
import TopCompanies from "@/components/home/top-companies";
// import Testimonials from "@/components/home/testimonials";
import MobileApp from "@/components/home/mobile-app";
import CTASection from "@/components/home/cta-section";
import ServicesSection from "@/components/home/services-section";
import NewlyListedProperties from "@/components/home/newly-listed-properties";
import PropertyOwnerCTA from "@/components/home/property-owner-cta";
import NewProjectsBanner from "@/components/home/new-projects-banner";
import NewLaunchProjects from "@/components/home/New-Launch-Projects";
import FeatureProjectsGallery from "@/components/home/feature-projects-gallery";
import LimitedTimeDeals from "@/components/home/limited-time-deals";
import ToolsSection from "@/components/home/tools-section";
import CommercialProjects from "@/components/home/commercial-projects";
import UpcomingProjects from "@/components/home/upcoming-projects";
import LuxuryProjects from "@/components/home/luxury-projects";
import AffordableProjects from "@/components/home/affordable-projects";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <PropertyOwnerCTA />
        <TopProperties />
        <LimitedTimeDeals />
        <NewLaunchProjects />
        <FeatureProjectsGallery />
        <ToolsSection />
        <FeaturedListings />
        <CommercialProjects />
        <NewlyListedProperties />{" "}
        {/* Moved before ServicesSection as requested */}
        <LuxuryProjects />
        <ServicesSection />
        <RecommendedProperties />
        <AffordableProjects /> {/* Added Affordable Projects section here */}
        <PropertyCategories />
        <UpcomingProjects />
        <TopCompanies />
        <NewProjectsBanner />
        {/* <Testimonials /> */}
        <MobileApp />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
