import React from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { AlertTriangle, CheckCircle, HelpCircle, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function UserAdvisory() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              User Advisory
            </h1>
            <p className="text-gray-600 mb-10 text-center">
              Important information and guidelines for using our real estate
              platform
            </p>

            <div className="grid gap-8">
              {/* General Advisory */}
              <Card>
                <CardHeader className="bg-blue-50">
                  <div className="flex items-center gap-3">
                    <Info className="h-6 w-6 text-blue-600" />
                    <CardTitle>General Advisory</CardTitle>
                  </div>
                  <CardDescription>
                    Basic information for all users of our platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="mb-4">
                    UrgentSales provides a platform for property listings and
                    information. While we strive to ensure accuracy, we
                    recommend that users verify all information independently
                    before making any decisions.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>
                      All property details are provided by sellers/owners and
                      may require verification
                    </li>
                    <li>
                      Images shown are representative and may differ from actual
                      properties
                    </li>
                    <li>Prices are subject to change without prior notice</li>
                    <li>
                      We recommend conducting thorough due diligence before any
                      transaction
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Buyer Advisory */}
              <Card>
                <CardHeader className="bg-green-50">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <CardTitle>Buyer Advisory</CardTitle>
                  </div>
                  <CardDescription>
                    Important information for property buyers
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Property Verification</AccordionTrigger>
                      <AccordionContent>
                        Always verify property documents including title deeds,
                        encumbrance certificates, and approved plans. Consider
                        hiring a legal expert to review all documentation before
                        proceeding with any purchase.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        Financial Considerations
                      </AccordionTrigger>
                      <AccordionContent>
                        Understand all costs involved including registration
                        fees, stamp duty, maintenance charges, and potential GST
                        implications. Get pre-approved for loans if financing is
                        required and compare multiple lenders.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Site Visits</AccordionTrigger>
                      <AccordionContent>
                        Always conduct multiple site visits at different times
                        of day to assess factors like natural light, noise
                        levels, and neighborhood activity. Check for amenities,
                        infrastructure, and proximity to essential services.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger>Builder Reputation</AccordionTrigger>
                      <AccordionContent>
                        Research the builder's track record, previous projects,
                        delivery timelines, and customer feedback. Verify RERA
                        registration and compliance with local regulations.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Seller Advisory */}
              <Card>
                <CardHeader className="bg-purple-50">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-6 w-6 text-purple-600" />
                    <CardTitle>Seller Advisory</CardTitle>
                  </div>
                  <CardDescription>
                    Guidelines for property sellers and landlords
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        Documentation Requirements
                      </AccordionTrigger>
                      <AccordionContent>
                        Ensure all property documents are up-to-date and readily
                        available, including title deeds, tax receipts, and
                        NOCs. Disclose any known defects or encumbrances to
                        potential buyers.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Listing Guidelines</AccordionTrigger>
                      <AccordionContent>
                        Provide accurate information about your property
                        including exact measurements, amenities, and condition.
                        Use high-quality photographs that truthfully represent
                        the property's current state.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Legal Compliance</AccordionTrigger>
                      <AccordionContent>
                        Ensure compliance with all local regulations, including
                        RERA if applicable. Understand tax implications of
                        property sales, including capital gains tax
                        considerations.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Warning Advisory */}
              <Card>
                <CardHeader className="bg-amber-50">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                    <CardTitle>Warning Advisory</CardTitle>
                  </div>
                  <CardDescription>
                    Important warnings and precautions
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-4">
                    <h3 className="font-semibold text-amber-800 mb-2">
                      Beware of Fraudulent Activities
                    </h3>
                    <p className="text-amber-700">
                      Never make payments to unknown accounts or share sensitive
                      financial information. Verify the identity of all parties
                      involved in transactions.
                    </p>
                  </div>

                  <ul className="list-disc pl-5 space-y-3 text-gray-700">
                    <li>
                      Be cautious of deals that seem too good to be true or
                      sellers pressuring for quick decisions
                    </li>
                    <li>
                      Avoid sharing personal identification documents with
                      unverified parties
                    </li>
                    <li>
                      Use secure payment methods and get receipts for all
                      transactions
                    </li>
                    <li>
                      Report suspicious activities to our customer support team
                      immediately
                    </li>
                    <li>
                      Consider using escrow services for large transactions
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm">
                This advisory is provided for informational purposes only and
                does not constitute legal, financial, or professional advice.
                For specific concerns, please consult with appropriate
                professionals.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
