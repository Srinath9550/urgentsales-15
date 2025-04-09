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
  Briefcase,
  GraduationCap,
  Users,
  LineChart,
  Award,
  Heart,
  Upload,
  CheckCircle,
  Clock,
  Building,
  MapPin,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

// Job positions data - empty array to be populated from backend
const openPositions = [];

// You can add a function to fetch real data from your backend
// Example:
// async function fetchJobPositions() {
//   try {
//     const response = await fetch('/api/job-positions');
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching job positions:', error);
//     return [];
//   }
// }

export default function Careers() {
  const [activePosition, setActivePosition] = useState(null);
  // You can add state to store fetched positions
  // const [positions, setPositions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    resume: null,
    coverLetter: "",
  });

  // You can use useEffect to fetch data when component mounts
  // useEffect(() => {
  //   async function getPositions() {
  //     const jobPositions = await fetchJobPositions();
  //     setPositions(jobPositions);
  //   }
  //   getPositions();
  // }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      resume: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);

    toast({
      title: "Application Submitted",
      description:
        "Thank you for your interest! We'll review your application and get back to you soon.",
      variant: "default",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      resume: null,
      coverLetter: "",
    });
  };

  // The rest of your component remains the same
  // Just replace references to openPositions with positions if you implement the fetching logic

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/10 to-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
              Join With US
            </h1>
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
              Join India's first AI-powered real estate platform and help
              transform how people buy and sell properties. We're looking for
              passionate individuals to be part of our journey.
            </p>
          </div>
        </section>

        {/* Why Join Us Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Join Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LineChart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Growing Platform</h3>
                <p className="text-gray-600">
                  Be part of India's fastest-growing real estate platform
                  dedicated to urgent property sales and discover new
                  opportunities for professional growth.
                </p>
              </div>
              <div className="text-center p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Mission & Values</h3>
                <p className="text-gray-600">
                  Our mission is to make property transactions faster, easier,
                  and more profitable for both parties through innovative
                  technology and exceptional service.
                </p>
              </div>
              <div className="text-center p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Industry Impact</h3>
                <p className="text-gray-600">
                  Make a meaningful impact in the real estate industry by
                  helping transform traditional property transactions with
                  AI-driven solutions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Work Culture Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our Work Culture
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-full shadow-md mb-4">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Collaborative Environment
                </h3>
                <p className="text-center text-gray-600">
                  We foster a dynamic and collaborative work environment where
                  every team member's ideas and contributions are valued.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-full shadow-md mb-4">
                  <LineChart className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Innovation-Driven
                </h3>
                <p className="text-center text-gray-600">
                  Our approach is centered around innovation and continuous
                  growth, encouraging creative solutions to industry challenges.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-full shadow-md mb-4">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Open Communication
                </h3>
                <p className="text-center text-gray-600">
                  We believe in transparent communication and teamwork, creating
                  an environment where everyone can thrive professionally.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Career Growth Opportunities */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Career Growth Opportunities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <GraduationCap className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Skill Development
                </h3>
                <p className="text-gray-600">
                  Access comprehensive training programs and skill development
                  opportunities to enhance your professional capabilities.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <Award className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Leadership Roles</h3>
                <p className="text-gray-600">
                  We believe in promoting from within, offering clear paths to
                  leadership roles and internal advancement.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Industry Experts</h3>
                <p className="text-gray-600">
                  Work alongside industry experts and thought leaders, gaining
                  valuable insights and expanding your professional network.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Employee Benefits */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Employee Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  Competitive Salary
                </h3>
                <p className="text-gray-600 text-sm">
                  We offer competitive compensation packages aligned with
                  industry standards.
                </p>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  Performance Incentives
                </h3>
                <p className="text-gray-600 text-sm">
                  Earn additional rewards through our performance-based
                  incentives and bonus programs.
                </p>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  Health Benefits
                </h3>
                <p className="text-gray-600 text-sm">
                  Comprehensive health and wellness benefits to ensure your
                  well-being.
                </p>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  Flexible Work Policy
                </h3>
                <p className="text-gray-600 text-sm">
                  Enjoy flexible work arrangements and generous leave benefits.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Open Positions Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Open Positions
            </h2>

            {openPositions.length > 0 ? (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="all">All Positions</TabsTrigger>
                  <TabsTrigger value="sales">Sales</TabsTrigger>
                  <TabsTrigger value="tech">Technology</TabsTrigger>
                  <TabsTrigger value="operations">Operations</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-1 gap-4">
                    {openPositions.map((position) => (
                      <Card key={position.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div
                            className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() =>
                              setActivePosition(
                                activePosition === position.id
                                  ? null
                                  : position.id,
                              )
                            }
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-semibold text-primary">
                                  {position.title}
                                </h3>
                                <div className="flex items-center mt-2 text-sm text-gray-600">
                                  <Briefcase className="h-4 w-4 mr-1" />
                                  <span className="mr-4">
                                    {position.department}
                                  </span>
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span className="mr-4">
                                    {position.location}
                                  </span>
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{position.experience}</span>
                                </div>
                              </div>
                              <Button variant="outline">
                                {activePosition === position.id
                                  ? "Hide Details"
                                  : "View Details"}
                              </Button>
                            </div>

                            {activePosition === position.id && (
                              <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
                                <p className="mb-4 text-gray-700">
                                  {position.description}
                                </p>
                                <h4 className="font-semibold mb-2">
                                  Requirements:
                                </h4>
                                <ul className="list-disc pl-5 mb-4 text-gray-700">
                                  {position.requirements.map((req, index) => (
                                    <li key={index}>{req}</li>
                                  ))}
                                </ul>
                                <Button
                                  className="mt-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    document
                                      .getElementById("application-form")
                                      .scrollIntoView({ behavior: "smooth" });
                                    setFormData({
                                      ...formData,
                                      position: position.title,
                                    });
                                  }}
                                >
                                  Apply Now
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="sales" className="mt-0">
                  <div className="grid grid-cols-1 gap-4">
                    {openPositions
                      .filter((p) => p.department === "Sales")
                      .map((position) => (
                        <Card key={position.id} className="overflow-hidden">
                          {/* Same card content as above */}
                          <CardContent className="p-0">
                            {/* Position card content */}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="tech" className="mt-0">
                  <div className="grid grid-cols-1 gap-4">
                    {openPositions
                      .filter((p) => p.department === "Technology")
                      .map((position) => (
                        <Card key={position.id} className="overflow-hidden">
                          {/* Position card content */}
                        </Card>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="operations" className="mt-0">
                  <div className="grid grid-cols-1 gap-4">
                    {openPositions
                      .filter((p) => p.department === "Operations")
                      .map((position) => (
                        <Card key={position.id} className="overflow-hidden">
                          {/* Position card content */}
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-xl font-medium text-gray-700 mb-4">
                  No open positions at the moment
                </h3>
                <p className="text-gray-600 max-w-lg mx-auto">
                  We don't have any open positions right now, but we're always
                  looking for talented individuals. Feel free to submit your
                  resume for future opportunities.
                </p>
                <Button
                  className="mt-6"
                  onClick={() =>
                    document
                      .getElementById("application-form")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Submit Your Resume
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* How to Apply Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              How to Apply
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Browse Open Positions
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Review our current job openings and find the role that
                      matches your skills and career goals.
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-6">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Prepare Your Application
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Update your resume and prepare a cover letter explaining
                      why you're interested in joining UrgentSales.in.
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-6">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Submit Your Application
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Fill out the application form below with your details and
                      upload your resume.
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Interview Process</h3>
                    <p className="text-gray-600 mt-1">
                      If your profile matches our requirements, our HR team will
                      contact you within 7 working days to schedule an
                      interview.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form Section */}
        <section id="application-form" className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Apply Now</h2>
            <div className="max-w-3xl mx-auto bg-gray-50 p-8 rounded-lg shadow-sm">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="name" className="block mb-2">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="block mb-2">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="phone" className="block mb-2">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="position" className="block mb-2">
                      Position Applied For
                    </Label>
                    <Input
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      placeholder="Enter position or 'General Application'"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <Label htmlFor="experience" className="block mb-2">
                    Years of Experience *
                  </Label>
                  <Select
                    value={formData.experience}
                    onValueChange={(value) =>
                      setFormData({ ...formData, experience: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 years</SelectItem>
                      <SelectItem value="1-3">1-3 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="5-10">5-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-6">
                  <Label htmlFor="resume" className="block mb-2">
                    Upload Resume *
                  </Label>
                  <div className="border border-gray-200 rounded-md p-4 bg-white">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="resume-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PDF, DOC or DOCX (MAX. 2MB)
                          </p>
                        </div>
                        <input
                          id="resume-upload"
                          name="resume"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                    </div>
                    {formData.resume && (
                      <div className="mt-3 flex items-center text-sm text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1.5" />
                        {formData.resume.name} uploaded successfully
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <Label htmlFor="coverLetter" className="block mb-2">
                    Cover Letter
                  </Label>
                  <Textarea
                    id="coverLetter"
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    placeholder="Tell us why you're interested in joining our team and what makes you a good fit"
                    className="min-h-[150px]"
                  />
                </div>

                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    required
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 block text-sm text-gray-600"
                  >
                    I agree to the processing of my personal data according to
                    the Privacy Policy
                  </label>
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  Submit Application
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
