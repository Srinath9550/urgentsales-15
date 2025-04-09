import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Landmark,
  Truck as TruckIcon,
  MapPin,
  Monitor,
  Users,
  LineChart,
  Handshake,
  Check,
} from "lucide-react";
// Uncomment these imports
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function PartnerWithUs() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    category: "",
    subcategories: [] as string[],
    message: "",
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setFormData({
      ...formData,
      category: value,
      subcategories: [], // Reset subcategories when category changes
    });
  };

  const handleSubcategoryToggle = (item: string) => {
    setFormData((prev) => {
      const subcategories = prev.subcategories.includes(item)
        ? prev.subcategories.filter((sc) => sc !== item)
        : [...prev.subcategories, item];

      return { ...prev, subcategories };
    });
  };

  const benefits = [
    {
      title: "Expand Your Reach",
      description:
        "Access a wider audience through our trusted real estate platform.",
    },
    {
      title: "Quality Leads",
      description: "Gain access to exclusive leads and potential customers.",
    },
    {
      title: "Marketing Support",
      description:
        "Benefit from our expert marketing and promotional strategies.",
    },
    {
      title: "Professional Network",
      description:
        "Join a network of professionals in the real estate industry.",
    },
    {
      title: "Revenue Growth",
      description: "Increase revenue through our structured partnership model.",
    },
    {
      title: "Urgent Property Solutions",
      description:
        "Connect with clients who need immediate property transactions, creating unique business opportunities.",
    },
  ];

  const partnerCategories = [
    {
      value: "real-estate",
      title: "Real Estate & Construction",
      icon: <Building2 className="h-6 w-6 text-primary" />,
      items: [
        "Real Estate Developers & Builders",
        "Property Brokers & Agents",
        "Interior Designers & Architects",
        "Property Management Companies",
        "Renovation Services",
      ],
    },
    {
      value: "financial",
      title: "Financial & Legal Services",
      icon: <Landmark className="h-6 w-6 text-primary" />,
      items: [
        "Home Loan Providers & Banks",
        "Property Insurance Companies",
        "Real Estate Lawyers",
        "Financial Advisors",
        "Investment Consultants",
      ],
    },
    {
      value: "relocation",
      title: "Relocation & Home Services",
      icon: <TruckIcon className="h-6 w-6 text-primary" />,
      items: [
        "Packers & Movers Services",
        "Storage Solutions",
        "Utility Setup Services",
        "Home Cleaning Services",
        "Rental Furniture Providers",
      ],
    },
    {
      value: "area-wise",
      title: "Area-Wise Partners",
      icon: <MapPin className="h-6 w-6 text-primary" />,
      items: [
        "Local Real Estate Consultants",
        "Verified Contractors",
        "Home Inspection Services",
        "Property Maintenance",
        "Regional Partners",
      ],
    },
    {
      value: "technology",
      title: "Technology & Marketing",
      icon: <Monitor className="h-6 w-6 text-primary" />,
      items: [
        "Digital Marketing Agencies",
        "CRM Software Providers",
        "AI & Data Analytics",
        "Virtual Tour Services",
        "PropTech Solutions",
      ],
    },
    {
      value: "investment",
      title: "Investment Partners",
      icon: <LineChart className="h-6 w-6 text-primary" />,
      items: [
        "Real Estate Investment Funds",
        "Private Investors",
        "Investment Advisory Firms",
        "International Consultants",
        "REITs",
      ],
    },
  ];

  // Find the selected category object
  const selectedCategoryObj = partnerCategories.find(
    (cat) => cat.value === selectedCategory,
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
              Partnernship Opportunities with Us
            </h1>
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
              Join our network of industry professionals and service providers
              to create a seamless real estate ecosystem. Together, we help
              buyers, sellers, and investors navigate the property market with
              ease.
            </p>
          </div>
        </section>

        {/* Why Partner With Us Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Why Partner With Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partner Categories */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Partner Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {partnerCategories.map((category, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center mb-4">
                    {category.icon}
                    <h3 className="text-xl font-semibold ml-3">
                      {category.title}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {category.items.map((item, idx) => (
                      <li key={idx} className="text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership Form */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-3xl font-bold text-center mb-8">
              Interested in Partnering?
            </h2>
            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-white p-8 rounded-lg shadow-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <Input
                    required
                    placeholder="Enter company name"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    required
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    required
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Partner Category</label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your category" />
                  </SelectTrigger>
                  <SelectContent>
                    {partnerCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center">
                          <span className="mr-2">{category.icon}</span>
                          {category.title}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subcategory selection - only shown when a category is selected */}
              {selectedCategoryObj && (
                <div className="space-y-3 p-4 border rounded-md bg-gray-50">
                  <label className="font-medium text-sm">
                    Select your specific services in {selectedCategoryObj.title}
                    :
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {selectedCategoryObj.items.map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <Checkbox
                          id={`subcategory-${idx}`}
                          checked={formData.subcategories.includes(item)}
                          onCheckedChange={() => handleSubcategoryToggle(item)}
                          className="mt-1"
                        />
                        <Label
                          htmlFor={`subcategory-${idx}`}
                          className="text-sm cursor-pointer"
                        >
                          {item}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {formData.subcategories.length === 0 && (
                    <p className="text-sm text-amber-600 mt-2">
                      Please select at least one service type
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Tell us about your business and how you'd like to partner with us"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="h-32"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={
                  selectedCategoryObj && formData.subcategories.length === 0
                }
              >
                Submit Partnership Request
              </Button>

              {/* Selected services summary */}
              {formData.subcategories.length > 0 && (
                <div className="mt-4 p-3 bg-primary/5 rounded-md">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Check className="h-4 w-4 mr-1 text-green-600" />
                    Selected Services:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.subcategories.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
