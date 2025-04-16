import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function TopProperties() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCategoryHover = (id: string) => {
    setActiveCategory(id);
  };

  const handleCategoryLeave = () => {
    setActiveCategory(null);
  };

  // Function to navigate to results page with appropriate filters
  const navigateToResults = (categoryId: string) => {
    const count = categoryId.replace("top", "");
    return `/top-properties-view/${count}?category=${categoryId}`;
  };

  // Updated categories with exact colors from the image
  const categories = [
    {
      id: "top10",
      label: "Top 10",
      description: "Urgent Sales",
      bgColor: "bg-gradient-to-br from-orange-500 to-red-600",
      hoverColor: "hover:from-orange-600 hover:to-red-700",
      textColor: "text-white",
      borderColor: "border-orange-300",
    },
    {
      id: "top20",
      label: "Top 20",
      description: "Urgent Sales",
      bgColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
      hoverColor: "hover:from-blue-600 hover:to-indigo-700",
      textColor: "text-white",
      borderColor: "border-blue-300",
    },
    {
      id: "top30",
      label: "Top 30",
      description: "Urgent Sales",
      bgColor: "bg-gradient-to-br from-purple-500 to-pink-600",
      hoverColor: "hover:from-purple-600 hover:to-pink-700",
      textColor: "text-white",
      borderColor: "border-purple-300",
    },
    {
      id: "top50",
      label: "Top 50",
      description: "Urgent Sales",
      bgColor: "bg-gradient-to-br from-green-500 to-emerald-600",
      hoverColor: "hover:from-green-600 hover:to-emerald-700",
      textColor: "text-white",
      borderColor: "border-green-300",
    },
    {
      id: "top100",
      label: "Top 100",
      description: "Urgent Sales",
      bgColor: "bg-gradient-to-br from-amber-500 to-yellow-600",
      hoverColor: "hover:from-amber-600 hover:to-yellow-700",
      textColor: "text-white",
      borderColor: "border-amber-300",
    },
  ];

  return (
    <section className="py-4 sm:py-6 md:py-8 bg-white">
      <div className="container mx-auto px-2 sm:px-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 relative inline-block font-serif">
          Top Urgent Sales
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent"></span>
        </h2>

        {/* Mobile view (stacked) */}
        <div className="flex flex-col gap-2 md:hidden">
          {/* Top 10 */}
          <Link
            href={navigateToResults(categories[0].id)}
            onClick={() => window.scrollTo(0, 0)}
            className={`rounded-xl shadow-md transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer overflow-hidden relative block w-full h-[160px] ${categories[0].bgColor} border-2 border-white/10`}
          >
            <div className="absolute inset-0 flex flex-col justify-start p-5">
              <div className="flex flex-col items-start">
                <span className={`${categories[0].textColor} font-bold text-5xl`}>
                  {categories[0].label}
                </span>
                <span className={`${categories[0].textColor} text-sm mt-1`}>
                  {categories[0].description}
                </span>
              </div>
            </div>
          </Link>

          {/* Top 20 */}
          <Link
            href={navigateToResults(categories[1].id)}
            onClick={() => window.scrollTo(0, 0)}
            className={`rounded-xl shadow-md transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer overflow-hidden relative block w-full h-[120px] ${categories[1].bgColor} border-2 border-white/10`}
          >
            <div className="absolute inset-0 flex flex-col justify-start p-4">
              <span className={`${categories[1].textColor} font-bold text-2xl`}>
                {categories[1].label}
              </span>
              <span className={`${categories[1].textColor} text-xs`}>
                {categories[1].description}
              </span>
            </div>
          </Link>

          {/* Top 30 */}
          <Link
            href={navigateToResults(categories[2].id)}
            onClick={() => window.scrollTo(0, 0)}
            className={`rounded-xl shadow-md transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer overflow-hidden relative block w-full h-[100px] ${categories[2].bgColor} border-2 border-white/10`}
          >
            <div className="absolute inset-0 flex flex-col justify-start p-3">
              <span className={`${categories[2].textColor} font-bold text-2xl`}>
                {categories[2].label}
              </span>
              <span className={`${categories[2].textColor} text-xs`}>
                {categories[2].description}
              </span>
            </div>
          </Link>

          {/* Top 50 */}
          <Link
            href={navigateToResults(categories[3].id)}
            onClick={() => window.scrollTo(0, 0)}
            className={`rounded-xl shadow-md transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer overflow-hidden relative block w-full h-[80px] ${categories[3].bgColor} border-2 border-white/10`}
          >
            <div className="absolute inset-0 flex flex-col justify-start p-4">
              <span className={`${categories[3].textColor} font-bold text-2xl`}>
                {categories[3].label}
              </span>
              <span className={`${categories[3].textColor} text-xs`}>
                {categories[3].description}
              </span>
            </div>
          </Link>

          {/* Top 100 */}
          <Link
            href={navigateToResults(categories[4].id)}
            onClick={() => window.scrollTo(0, 0)}
            className={`rounded-xl shadow-md transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer overflow-hidden relative block w-full h-[70px] ${categories[4].bgColor} border-2 border-white/10`}
          >
            <div className="absolute inset-0 flex flex-col justify-start p-3">
              <span className={`${categories[4].textColor} font-bold text-2xl`}>
                {categories[4].label}
              </span>
              <span className={`${categories[4].textColor} text-xs`}>
                {categories[4].description}
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop view (grid layout) - FIXED AND INCREASED SIZES */}
        <div className="hidden md:grid grid-cols-12 gap-4 h-[250px]">
          {/* Top 10 - Larger size */}
          <div className="col-span-5 row-span-2">
            <Link
              href={navigateToResults(categories[0].id)}
              onClick={() => window.scrollTo(0, 0)}
              className={`rounded-xl shadow-md transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer overflow-hidden relative block w-full h-full ${categories[0].bgColor} border-2 border-white/10`}
            >
              <div className="absolute inset-0 flex flex-col justify-start p-8">
                <div className="flex flex-col items-start">
                  <span className={`${categories[0].textColor} font-bold text-7xl`}>
                    {categories[0].label}
                  </span>
                  <span className={`${categories[0].textColor} text-lg mt-2`}>
                    {categories[0].description}
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Top 20 */}
          <div className="col-span-4 row-span-1">
            <Link
              href={navigateToResults(categories[1].id)}
              onClick={() => window.scrollTo(0, 0)}
              className={`rounded-xl shadow-md transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer overflow-hidden relative block w-full h-full ${categories[1].bgColor} border-2 border-white/10`}
            >
              <div className="absolute inset-0 flex flex-col justify-start p-6">
                <span className={`${categories[1].textColor} font-bold text-4xl`}>
                  {categories[1].label}
                </span>
                <span className={`${categories[1].textColor} text-sm mt-1`}>
                  {categories[1].description}
                </span>
              </div>
            </Link>
          </div>

          {/* Top 50 */}
          <div className="col-span-3 row-span-1">
            <Link
              href={navigateToResults(categories[3].id)}
              onClick={() => window.scrollTo(0, 0)}
              className={`rounded-xl shadow-md transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer overflow-hidden relative block w-full h-full ${categories[3].bgColor} border-2 border-white/10`}
            >
              <div className="absolute inset-0 flex flex-col justify-start p-5">
                <span className={`${categories[3].textColor} font-bold text-3xl`}>
                  {categories[3].label}
                </span>
                <span className={`${categories[3].textColor} text-sm`}>
                  {categories[3].description}
                </span>
              </div>
            </Link>
          </div>

          {/* Top 30 */}
          <div className="col-span-4 row-span-1">
            <Link
              href={navigateToResults(categories[2].id)}
              onClick={() => window.scrollTo(0, 0)}
              className={`rounded-xl shadow-md transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer overflow-hidden relative block w-full h-full ${categories[2].bgColor} border-2 border-white/10`}
            >
              <div className="absolute inset-0 flex flex-col justify-start p-6">
                <span className={`${categories[2].textColor} font-bold text-4xl`}>
                  {categories[2].label}
                </span>
                <span className={`${categories[2].textColor} text-sm mt-1`}>
                  {categories[2].description}
                </span>
              </div>
            </Link>
          </div>

          {/* Top 100 */}
          <div className="col-span-3 row-span-1">
            <Link
              href={navigateToResults(categories[4].id)}
              onClick={() => window.scrollTo(0, 0)}
              className={`rounded-xl shadow-md transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer overflow-hidden relative block w-full h-full ${categories[4].bgColor} border-2 border-white/10`}
            >
              <div className="absolute inset-0 flex flex-col justify-start p-5">
                <span className={`${categories[4].textColor} font-bold text-3xl`}>
                  {categories[4].label}
                </span>
                <span className={`${categories[4].textColor} text-sm`}>
                  {categories[4].description}
                </span>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-3 sm:mt-4">
          <Link
            href="/top-properties"
            className="text-primary hover:underline text-sm font-medium flex items-center justify-end"
            onClick={() => window.scrollTo(0, 0)}
          >
            <span>View all top urgent listings</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
