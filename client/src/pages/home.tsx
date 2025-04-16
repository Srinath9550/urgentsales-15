import React from "react";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { formatImageUrl, handleImageError, DEFAULT_PLACEHOLDER } from "@/lib/image-utils";

// Property Owner CTA Component
function PropertyOwnerCTA() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-4 rounded-lg shadow-lg">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-4">Become a Property Owner</h2>
        <p className="text-xl mb-6">List your property and reach thousands of potential buyers.</p>
        <Button asChild size="lg" variant="secondary">
          <Link href="/post-property-free">List Your Property</Link>
        </Button>
      </div>
    </section>
  );
}

// New Projects Banner Component
function NewProjectsBanner() {
  // Use images from the first few properties in the database
  const projectImages = [
    "properties/1744614622969-952470017.jpg",
    "properties/1744614645930-476073492.jpg",
    "properties/1744614645942-229037486.jpg",
    "properties/1744696075227-385132684.jpeg",
    "properties/1744698986428-974199278.jpg"
  ];
  
  return (
    <section className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-green-600 text-white py-2 px-4 text-center font-bold">
        New Launch
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <h3 className="text-2xl font-bold mb-4">New Projects</h3>
          <img 
            src={formatImageUrl(projectImages[0], true)} 
            alt="Projects" 
            className="w-full h-auto rounded-md"
            onError={(e) => handleImageError(e, undefined, true)}
          />
        </div>
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          {projectImages.slice(1).map((imgSrc, index) => (
            <div key={index} className="relative overflow-hidden rounded-md">
              <img 
                src={formatImageUrl(imgSrc, true)} 
                alt={`Project ${index + 1}`} 
                className="w-full h-40 object-cover transition-transform hover:scale-105"
                onError={(e) => handleImageError(e, undefined, true)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-gray-50 text-center">
        <Button asChild variant="outline">
          <Link href="/properties?category=new-launch">View All New Projects</Link>
        </Button>
      </div>
    </section>
  );
}

// Main Home Component
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4 space-y-12">
          <PropertyOwnerCTA />
          <NewProjectsBanner />
        </div>
      </main>
      <Footer />
    </div>
  );
}
