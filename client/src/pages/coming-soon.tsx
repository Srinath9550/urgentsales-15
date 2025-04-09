import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Clock, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-100 text-primary px-4 py-2 rounded-full mb-6">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>Coming Soon</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              We're Building Something <span className="text-primary">Extraordinary</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Our team is working on a new feature that will revolutionize your real estate experience. Stay tuned for the big reveal!
            </p>
            
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">This Page is Under Construction</h3>
              <p className="text-gray-600 mb-6">
                We're working hard to bring you an amazing new experience. Please check back soon!
              </p>
              <Link href="/" onClick={() => window.scrollTo(0, 0)}>
                <Button className="whitespace-nowrap">
                  Return to Homepage
                </Button>
              </Link>
              
              <div className="flex justify-center space-x-4 mt-8 pt-6 border-t border-gray-100">
                <a
                  href="https://www.facebook.com/profile.php?id=61574427475230"
                  className="text-gray-500 hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://x.com/Urgentsales"
                  className="text-gray-500 hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="https://www.instagram.com/urgentsales/?hl=en"
                  className="text-gray-500 hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-primary transition-colors"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
































