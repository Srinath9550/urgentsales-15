import React from "react";
import {
  Award,
  Users,
  Clock,
  Shield,
  ThumbsUp,
  Phone,
  Star,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function WhyChooseUsPage() {
  return (
    <div className="bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
                Why Choose Our Services?
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                We're ranked among top real estate companies in India, known for
                our transparency, professionalism, and client-centric approach.
                Discover what sets us apart from the competition.
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
                src="https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Real Estate Team"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Our Key Advantages
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
              <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Industry Excellence
              </h3>
              <p className="text-gray-600">
                With over 15 years of experience in the Indian real estate
                market, we've established ourselves as industry leaders with a
                proven track record of success.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
              <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Team</h3>
              <p className="text-gray-600">
                Our team consists of certified real estate professionals with
                deep local market knowledge and expertise in all aspects of
                property transactions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
              <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Timely Service</h3>
              <p className="text-gray-600">
                We value your time and ensure prompt responses, efficient
                processes, and timely completion of all property transactions
                and services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Client-Centric Approach */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img
                src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Client Meeting"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold mb-6">
                Our Client-Centric Approach
              </h2>
              <p className="text-gray-700 mb-6">
                At Urgent Real Estate, we put our clients at the center of
                everything we do. Our approach is built on:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Personalized Service
                    </h3>
                    <p className="text-gray-600">
                      We tailor our services to meet your unique needs and
                      preferences.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Transparent Communication
                    </h3>
                    <p className="text-gray-600">
                      We maintain clear, honest, and open communication
                      throughout the process.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Long-term Relationships
                    </h3>
                    <p className="text-gray-600">
                      We focus on building lasting relationships, not just
                      completing transactions.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>    

      {/* Our Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Our Core Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
              <div className="bg-purple-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Integrity</h3>
              <p className="text-gray-600">
                We conduct our business with the highest ethical standards and
                transparency.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
              <div className="bg-purple-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in every aspect of our service
                delivery.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
              <div className="bg-purple-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously innovate to provide cutting-edge real estate
                solutions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
              <div className="bg-purple-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Client Focus</h3>
              <p className="text-gray-600">
                We put our clients' needs and satisfaction at the center of
                everything we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Experience the Difference?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Contact us today to discover how our expert team can help you
            achieve your real estate goals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild onClick={() => window.scrollTo(0, 0)}>
                  <Link href="/contact">
                    <Phone className="mr-2 h-4 w-4" /> Contact Us Now
                  </Link>
                </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/services/legal-solutions">Explore Our Services</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
