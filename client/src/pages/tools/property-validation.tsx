import { useState } from "react";
import {
  Shield,
  CheckCircle,
  Search,
  FileText,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  Home,
  Gift,
  Info,
  Clock,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function PropertyValidation() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyType: "",
    propertyId: "",
    address: "",
    city: "",
    state: "",
    documentType: "",
    additionalInfo: "",
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3); // Show success message
  };

  const validationServices = [
    {
      title: "Document Verification",
      icon: <FileText className="h-6 w-6 text-primary" />,
      description:
        "We verify all property documents for authenticity and legal compliance.",
    },
    {
      title: "Title Search",
      icon: <Search className="h-6 w-6 text-primary" />,
      description:
        "Comprehensive title search to ensure clear ownership history.",
    },
    {
      title: "Legal Compliance Check",
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      description:
        "Verification of all legal approvals and compliance with local regulations.",
    },
    {
      title: "Encumbrance Certificate",
      icon: <Shield className="h-6 w-6 text-primary" />,
      description:
        "Check for any existing loans, mortgages, or legal disputes on the property.",
    },
    {
      title: "Site Inspection",
      icon: <Search className="h-6 w-6 text-primary" />,
      description:
        "Physical verification of property boundaries and construction quality.",
    },
    {
      title: "Fraud Alert",
      icon: <AlertTriangle className="h-6 w-6 text-primary" />,
      description:
        "Detection of potential fraud or misrepresentation in property details.",
    },
  ];

  const faqs = [
    {
      question: "Why is property validation important?",
      answer:
        "Property validation is crucial to protect your investment from fraud, legal disputes, and hidden liabilities. It ensures the property has clear title, proper documentation, and complies with all legal requirements before you make a purchase decision.",
    },
    {
      question: "How long does the property validation process take?",
      answer:
        "The standard property validation process typically takes 3-7 business days, depending on the property type, location, and document availability. For urgent requirements, we offer expedited services that can be completed within 48 hours.",
    },
    {
      question: "What documents are required for property validation?",
      answer:
        "Common documents include the sale deed, title deed, property tax receipts, encumbrance certificate, approved building plan, NOC from relevant authorities, and any previous agreements. The exact requirements may vary based on property type and location.",
    },
    {
      question: "Can I validate a property before making an offer?",
      answer:
        "Yes, we recommend conducting a preliminary validation before making an offer. This helps identify any potential issues early in the process and strengthens your negotiating position.",
    },
    {
      question: "What happens if issues are found during validation?",
      answer:
        "If our validation process uncovers any issues, we provide a detailed report highlighting the problems and potential solutions. Our legal experts can also guide you on the next steps to resolve these issues or help you make an informed decision.",
    },
  ];

  const processSteps = [
    {
      title: "Submit Request",
      description: "Fill out our simple form with property and contact details",
      icon: <FileText className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Document Collection",
      description: "Our team will contact you to collect necessary documents",
      icon: <CheckCircle className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Verification Process",
      description: "Comprehensive validation of all property aspects",
      icon: <Search className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Detailed Report",
      description: "Receive a complete validation report with findings",
      icon: <Shield className="h-6 w-6 text-blue-600" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Property Validation Service
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Verify property details and ensure legitimacy before making any
              purchase decisions
            </p>
            {step === 1 && (
              <div className="mt-8">
                <Button
                  onClick={() => setStep(2)}
                  className="px-8 py-6 text-lg rounded-lg bg-green-600 hover:bg-green-700"
                >
                  Request Validation Now
                </Button>
              </div>
            )}
          </div>

          {/* Process Steps */}
          <div className="max-w-5xl mx-auto mb-16 px-4">
            <h2 className="text-2xl font-bold text-center mb-10">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 relative"
                >
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-100 rounded-full p-2">
                    {step.icon}
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Our Validation Services
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {validationServices.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-start p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="bg-green-50 p-2 rounded-full mr-3 flex-shrink-0">
                          {service.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {service.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 text-center">
                    <Button onClick={() => setStep(2)} className="px-8">
                      Request Validation
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Request Property Validation
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="propertyType">Property Type</Label>
                        <Select
                          value={formData.propertyType}
                          onValueChange={(value) =>
                            handleSelectChange("propertyType", value)
                          }
                        >
                          <SelectTrigger id="propertyType">
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="house">House</SelectItem>
                            <SelectItem value="villa">Villa</SelectItem>
                            <SelectItem value="plot">Plot</SelectItem>
                            <SelectItem value="commercial">
                              Commercial
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="propertyId">
                          Property ID/Number (if any)
                        </Label>
                        <Input
                          id="propertyId"
                          name="propertyId"
                          value={formData.propertyId}
                          onChange={handleChange}
                          placeholder="Enter property ID"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Property Address</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter complete property address"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Enter city"
                        />
                      </div>

                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="Enter state"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="documentType">
                        Document Type for Verification
                      </Label>
                      <Select
                        value={formData.documentType}
                        onValueChange={(value) =>
                          handleSelectChange("documentType", value)
                        }
                      >
                        <SelectTrigger id="documentType">
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sale-deed">Sale Deed</SelectItem>
                          <SelectItem value="title-deed">Title Deed</SelectItem>
                          <SelectItem value="khata">
                            Khata Certificate
                          </SelectItem>
                          <SelectItem value="ec">
                            Encumbrance Certificate
                          </SelectItem>
                          <SelectItem value="approved-plan">
                            Approved Plan
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="additionalInfo">
                        Additional Information
                      </Label>
                      <Textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        placeholder="Any specific concerns or details you want us to verify"
                        rows={3}
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Contact Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email address"
                            required
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </Button>
                      <Button type="submit">Submit Request</Button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden text-center p-8">
                <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Request Submitted Successfully!
                </h2>
                <p className="text-gray-600 mb-6">
                  Thank you for submitting your property validation request. Our
                  team will review your details and contact you within 24-48
                  hours to proceed with the verification process.
                </p>
                <div className="p-4 bg-blue-50 rounded-lg mb-6 text-left">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    What happens next?
                  </h3>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>• Our validation team will review your submission</li>
                    <li>
                      • You'll receive a confirmation email with request details
                    </li>
                    <li>
                      • A validation specialist will contact you to collect
                      documents
                    </li>
                    <li>
                      • We'll provide regular updates throughout the process
                    </li>
                  </ul>
                </div>
                <Button onClick={() => setStep(1)}>Back to Services</Button>
              </div>
            )}

            {/* Why Validate Section */}
            <div className="mt-12 bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Why Validate Your Property?
              </h3>
              <p className="text-gray-700 mb-4">
                Property validation is a crucial step before making any real
                estate investment. It helps you:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Avoid fraud and scams in property transactions</li>
                <li>Ensure clear title and ownership history</li>
                <li>Verify legal compliance and approvals</li>
                <li>Identify any hidden liabilities or disputes</li>
                <li>Make informed decisions with complete peace of mind</li>
              </ul>
            </div>

            {/* FAQ Section */}
            <div className="mt-12 bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h3>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Property Validation Checklist - Added instead of testimonials */}
            <div className="mt-12 bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Property Validation Checklist
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">
                    Legal Documents
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Sale Deed / Title Deed
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Encumbrance Certificate
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Property Tax Receipts
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Approved Building Plan
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Khata Certificate & Extract
                      </p>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">
                    Physical Verification
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Property Boundaries & Measurements
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Construction Quality Assessment
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Neighborhood & Locality Analysis
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Access to Utilities & Amenities
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Environmental Concerns Assessment
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Pro Tip:</span> Our
                  comprehensive property validation service covers all these
                  aspects and more. We recommend completing this checklist
                  before finalizing any property purchase to avoid future
                  complications.
                </p>
              </div>
            </div>

            {/* Related Tools & Resources */}
            <div className="mt-12 bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Related Tools & Resources
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <Link href="/contact">
                  <a className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <Info className="h-5 w-5 text-purple-600" />
                      </div>
                      <span className="font-medium">Get Expert Advice</span>
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
