import React from "react";
import { Shield, FileText, Scale, Gavel, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function LegalSolutionsPage() {
  return (
    <div className="bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
                Property Legal Solutions
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                Navigate the complex legal landscape of real estate with our
                expert legal services. We provide comprehensive legal support
                for all your property transactions and disputes.
              </p>
              <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild onClick={() => window.scrollTo(0, 0)}>
                  <Link href="/contact">
                    <Phone className="mr-2 h-4 w-4" />  Consult a Legal Expert
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/services/why-choose-us">View All Services</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                alt="Legal Solutions"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Our Legal Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="bg-indigo-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <FileText className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Document Review</h3>
              <p className="text-gray-600">
                Thorough review of all property-related documents to ensure
                legal compliance and protect your interests.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="bg-indigo-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Scale className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Legal Consultation</h3>
              <p className="text-gray-600">
                Expert legal advice on property transactions, disputes, and
                regulatory compliance from experienced real estate attorneys.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="bg-indigo-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Gavel className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Dispute Resolution</h3>
              <p className="text-gray-600">
                Effective resolution of property disputes through negotiation,
                mediation, or litigation to protect your property rights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Process */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Our Legal Process
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline */}
              <div className="absolute left-0 md:left-1/2 h-full w-1 bg-indigo-200 transform md:translate-x-0"></div>

              {/* Steps */}
              <div className="space-y-12">
                <div className="relative flex flex-col md:flex-row items-center md:items-start">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white md:absolute md:left-1/2 md:-ml-5 z-10">
                    1
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-16 md:w-1/2 md:pl-8">
                    <h3 className="text-xl font-semibold mb-2">
                      Initial Consultation
                    </h3>
                    <p className="text-gray-600">
                      We begin with a thorough consultation to understand your
                      legal needs and objectives.
                    </p>
                  </div>
                </div>

                <div className="relative flex flex-col md:flex-row items-center md:items-start">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white md:absolute md:left-1/2 md:-ml-5 z-10">
                    2
                  </div>
                  <div className="mt-4 md:mt-0 md:mr-16 md:w-1/2 md:text-right">
                    <h3 className="text-xl font-semibold mb-2">
                      Legal Assessment
                    </h3>
                    <p className="text-gray-600">
                      Our legal experts conduct a comprehensive assessment of
                      your case and develop a strategic approach.
                    </p>
                  </div>
                </div>

                <div className="relative flex flex-col md:flex-row items-center md:items-start">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white md:absolute md:left-1/2 md:-ml-5 z-10">
                    3
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-16 md:w-1/2 md:pl-8">
                    <h3 className="text-xl font-semibold mb-2">
                      Implementation
                    </h3>
                    <p className="text-gray-600">
                      We implement the legal strategy, handling all
                      documentation, negotiations, and proceedings on your
                      behalf.
                    </p>
                  </div>
                </div>

                <div className="relative flex flex-col md:flex-row items-center md:items-start">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white md:absolute md:left-1/2 md:-ml-5 z-10">
                    4
                  </div>
                  <div className="mt-4 md:mt-0 md:mr-16 md:w-1/2 md:text-right">
                    <h3 className="text-xl font-semibold mb-2">
                      Resolution & Follow-up
                    </h3>
                    <p className="text-gray-600">
                      We work toward a favorable resolution and provide ongoing
                      support to ensure your legal interests remain protected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Need legal assistance with your property?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Our team of experienced real estate attorneys is ready to help you
            navigate any legal challenges.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild onClick={() => window.scrollTo(0, 0)}>
                  <Link href="/contact">
                    <Phone className="mr-2 h-4 w-4" /> Schedule a Consultation
                  </Link>
                </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
