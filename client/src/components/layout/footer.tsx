import { Link } from "wouter";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth"; // Import useAuth hook
import { toast } from "@/hooks/use-toast";

export default function Footer() {
  const { user } = useAuth(); // Correctly use the useAuth hook here

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Company Info */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img
                src="https://sigmawire.net/i/04/MELyzO.png"
                alt="UrgentSales.in"
                className="h-10 md:h-12 w-auto"
                onError={(e) => {
                  console.error("Logo failed to load:", e);
                  e.currentTarget.src = "https://sigmawire.net/i/04/MELyzO.png";
                }}
              />
            </Link>
            <p className="mb-1 text-justify leading-none tracking-normal">
              <a href="https://urgentsales.in/" className="hover:text-white">UrgentSales.in</a>
              {" "}is India's first AI-powered real estate platform dedicated to urgent
              property sales. We connect sellers who need to sell quickly at the 
              best possible price with serious buyers looking for maximum discounts.
              Our AI-driven matchmaking and smart pricing tools make property 
              transactions faster, easier, and more profitable for both parties.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://www.facebook.com/profile.php?id=61574427475230"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://x.com/Urgentsales"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.instagram.com/urgentsales/?hl=en"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/properties?type=residential"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Search Properties
                </Link>
              </li>
              <li>
                <Link
                  to={user ? "/post-property-free?type=residential" : "/auth"}
                  onClick={() => {
                    window.scrollTo(0, 0);
                    if (!user) {
                      toast({
                        title: "Login Required",
                        description: "You need to login before posting a property.",
                        variant: "default",
                      });
                    }
                  }}
                  className="hover:text-white transition-colors"
                >
                  Post Property FREE
                </Link>
              </li>
              <li>
                <Link
                  href="/?tag=urgent?type=residential"
                  onClick={() => window.scrollTo(1000, 1000)}
                  className="hover:text-white transition-colors"
                >
                  Urgency Sales
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/click-and-earn"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Click & Earn
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/emi-calculator"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  EMI Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/property-validation"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Property Insights
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/partner-with-us"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Partner With Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Property Types */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Property Types
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/properties?propertyType=apartment"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Apartments
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?propertyType=house&propertyType=villa"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Houses & Villas
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?propertyType=plot&propertyType=Land"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Plots & Land
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?propertyType=commercial"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Commercial Spaces
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?propertyType=farmhouse"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Farmhouses
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?propertyType=Residential Properties"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Residential Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?propertyType=Verified Properties"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Verified Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?propertyType=Verified Properties"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Newly Launched Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mt-1 mr-3 flex-shrink-0" />
                <span>
                  Address: #301, Madhavaram Towers, Kukatpally Y Junction,
                  Moosapet, Hyderabad-500018
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 flex-shrink-0" />
                <a
                  href="tel:+91-9032561155"
                  className="hover:text-white transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "tel:+91-9032561155";
                  }}
                >
                  <span>Phone: +91-9032561155</span>
                </a>
              </li>
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-3 flex-shrink-0"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <a
                  href="https://wa.me/+919032381155"
                  className="hover:text-white transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "https://wa.me/+919032381155";
                  }}
                >
                  <span>WhatsApp: +91 9032381155</span>
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 flex-shrink-0" />
                <span>support@UrgentSales.in</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link
                href="/channel-partner"
                onClick={() => window.scrollTo(0, 0)}
                className="hover:text-white transition-colors"
              >
                Channel Partner
              </Link>
            </div>
          </div>
        </div>

        {/* Legal & Policy Links */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <h4 className="text-white text-sm font-medium mb-2">Legal</h4>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <Link
                  to="/terms-conditions"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  T & C
                </Link>
                <Link
                  to="/privacy-policy"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/disclaimer"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Disclaimer
                </Link>
                <Link
                  to="/user-advisory"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  User Advisory
                </Link>
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-white text-sm font-medium mb-2">Support</h4>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <Link
                  href="/feedback"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Feedback
                </Link>
                <Link
                  href="/report-problem"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Report a Problem
                </Link>
                <Link
                  href="/contact"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright section */}
        <div className="border-t border-gray-700 mt-6 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 md:mt-0 text-sm justify-center md:justify-start">
              <Link
                to="/about"
                onClick={() => window.scrollTo(0, 0)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                About Us
              </Link>

              <Link
                to={user ? "/post-property-free" : "/auth"}
                onClick={() => {
                  window.scrollTo(0, 0);
                  if (!user) {
                    toast({
                      title: "Login Required",
                      description: "You need to login before posting a property.",
                      variant: "default",
                    });
                  }
                }}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Post Property
              </Link>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-end">
              <p className="text-center md:text-right">
                &copy; {new Date().getFullYear()} Powered by
                <a
                  href="https://omnexaai.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-1 hover:text-white transition-colors"
                >
                  Omnexa AI Labs
                </a>
                All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add padding at the bottom to prevent content from being hidden behind mobile nav */}
      <div className="h-16 md:h-0 block md:hidden"></div>
    </footer>
  );
}
