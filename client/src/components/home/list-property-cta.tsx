import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { propertyTypes } from "@shared/schema";
import { Check } from "lucide-react";

export default function ListPropertyCTA() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    propertyType: "",
    city: "",
    locality: "",
    price: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      navigate("/add-property");
    } else {
      navigate("/auth");
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
            <h2 className="text-3xl font-bold font-heading mb-4 leading-tight">
              Sell or Rent Your Property Without Broker Fees!
            </h2>
            <p className="text-lg mb-6 text-blue-100">
              List your property directly without paying hefty broker
              commissions. Reach thousands of genuine buyers and tenants.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-white bg-opacity-20 p-1 rounded-md">
                  <Check className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold">Free Listing for 30 Days</h3>
                  <p className="text-blue-100">
                    Get started without any upfront costs
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-white bg-opacity-20 p-1 rounded-md">
                  <Check className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold">Verified Buyer Contacts</h3>
                  <p className="text-blue-100">
                    Connect with serious, verified buyers only
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-white bg-opacity-20 p-1 rounded-md">
                  <Check className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold">Legal Documentation Support</h3>
                  <p className="text-blue-100">
                    Get help with paperwork and legal procedures
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button asChild variant="secondary" size="lg">
                <Link
                  to={user ? "/post-property-free" : "/auth"}
                  onClick={() => {
                    window.scrollTo(0, 0);
                    if (!user) {
                      toast({
                        title: "Login Required",
                        description:
                          "You need to login before posting a property.",
                        variant: "default",
                      });
                    }
                  }}
                >
                  <span>List Your Property</span>
                  <i className="ri-arrow-right-line ml-2"></i>
                </Link>
              </Button>
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Quick Property Listing
                </h3>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <Label htmlFor="propertyType" className="text-gray-700">
                      Property Type
                    </Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) =>
                        handleSelectChange("propertyType", value)
                      }
                    >
                      <SelectTrigger
                        id="propertyType"
                        className="w-full text-gray-900"
                      >
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-gray-700">
                        City
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                        className="text-gray-900"
                      />
                    </div>
                    <div>
                      <Label htmlFor="locality" className="text-gray-700">
                        Locality
                      </Label>
                      <Input
                        id="locality"
                        name="locality"
                        value={formData.locality}
                        onChange={handleChange}
                        placeholder="Enter locality"
                        className="text-gray-900"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="price" className="text-gray-700">
                      Expected Price (₹)
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Enter expected price"
                      className="text-gray-900"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-gray-700">
                      Your Contact Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your mobile number"
                      className="text-gray-900"
                    />
                  </div>

                  <Button
                    type="submit"
                    onClick={() => window.scrollTo(0, 0)}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Continue to Add Details
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
