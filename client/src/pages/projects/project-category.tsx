
import { useParams } from "react-router-dom";
import { Building2, MapPin, Bed, Bath, Square } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function ProjectCategory() {
  const { category } = useParams();
  
  const dummyProjects = [
    {
      id: 1,
      title: "Sunrise Heights",
      location: "Whitefield, Bangalore",
      price: "₹85L - 1.2Cr",
      bedrooms: "2,3 BHK",
      bathrooms: 2,
      area: "1200-1800 sq.ft",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500"
    },
    {
      id: 2,
      title: "Green Valley",
      location: "Electronic City, Bangalore",
      price: "₹45L - 65L",
      bedrooms: "1,2 BHK",
      bathrooms: 1,
      area: "650-1100 sq.ft",
      image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=500"
    },
    // More dummy projects can be added here
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 capitalize">{category?.replace(/-/g, " ")} Projects</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{project.location}</span>
                </div>
                <div className="text-lg font-medium text-primary mb-3">{project.price}</div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    <span>{project.bedrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    <span>{project.bathrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="w-4 h-4 mr-1" />
                    <span>{project.area}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
