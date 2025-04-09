import { Link } from "wouter";
import { Calculator, Shield, Gift, TrendingUp, FileText } from "lucide-react";

export default function ToolsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-primary after:to-transparent">
            Tools
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* EMI Calculator Box */}
          <div className="border border-gray-200 rounded-lg p-5 hover:shadow-lg hover:border-primary transition-all duration-300 h-full flex flex-col bg-gradient-to-br from-white to-gray-50">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3 hover:text-primary transition-colors">
                EMI Calculator
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-4 flex-grow">
              Know how much you'll have to pay every month on your loan.
            </p>
            <Link
              to="/tools/emi-calculator"
              onClick={() => window.scrollTo(0, 0)}
              className="group"
            >
              <span className="text-primary text-sm font-medium flex items-center hover:text-primary-dark transition-colors">
                View now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>
          </div>

          {/* Property Validation Box */}
          <div className="border border-gray-200 rounded-lg p-5 hover:shadow-lg hover:border-primary transition-all duration-300 h-full flex flex-col bg-gradient-to-br from-white to-gray-50">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3 hover:text-primary transition-colors">
                Property Validation
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-4 flex-grow">
              Verify property details and ensure legitimacy.
            </p>
            <Link
              to="/tools/property-validation"
              onClick={() => window.scrollTo(0, 0)}
              className="group"
            >
              <span className="text-primary text-sm font-medium flex items-center hover:text-primary-dark transition-colors">
                View now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>
          </div>

          {/* Click & Earn Box */}
          <div className="border border-gray-200 rounded-lg p-5 hover:shadow-lg hover:border-primary transition-all duration-300 h-full flex flex-col bg-gradient-to-br from-white to-gray-50">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3 hover:text-primary transition-colors">
                Click & Earn
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-4 flex-grow">
              Earn rewards by engaging with our platform.
            </p>
            <Link
              to="/tools/click-and-earn"
              onClick={() => window.scrollTo(0, 0)}
              className="group"
            >
              <span className="text-primary text-sm font-medium flex items-center hover:text-primary-dark transition-colors">
                View now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
