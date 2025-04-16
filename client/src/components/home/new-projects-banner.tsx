import React from "react";
import { Building2, ChevronRight, Image, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { formatImageUrl, handleImageError } from "@/lib/image-utils";

export default function NewProjectsBanner() {
  const [, navigate] = useLocation();

  return (
    <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 rounded-xl shadow-sm border border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col space-y-4 sm:space-y-6">
          {/* Header Section - Redesigned */}
          <div className="relative">
            {/* MagicHomes Box - Wider and shorter */}
            <div className="w-full bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 p-3 sm:p-4 pt-6 sm:pt-8 mt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                All Projects
              </h2>
              <p className="text-sm sm:text-base text-gray-500">
                Encyclopedia For All Projects
              </p>
            </div>
          </div>

          {/* Interactive Boxes */}
          <div className="flex flex-col sm:flex-row items-center sm:justify-center gap-4 sm:gap-6 my-2 sm:my-4">
            {/* Company Box */}
            <div
              className="w-full sm:w-48 h-auto sm:h-48 py-4 bg-indigo-50 rounded-lg shadow-md border border-indigo-100 hover:border-indigo-300 transition-all hover:shadow-lg cursor-pointer flex flex-col items-center justify-center p-4 text-center"
              onClick={() => {
                navigate("/coming-soon");
                window.scrollTo(0, 0);
              }}
            >
              <div className="bg-indigo-100 p-2 sm:p-3 rounded-full mb-2 sm:mb-3">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
              Companies
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                View companies details and info
              </p>
            </div>

            {/* Projects Box */}
            <div
              className="w-full sm:w-48 h-auto sm:h-48 py-4 bg-emerald-50 rounded-lg shadow-md border border-emerald-100 hover:border-emerald-300 transition-all hover:shadow-lg cursor-pointer flex flex-col items-center justify-center p-4 text-center"
              onClick={() => {
                navigate("/coming-soon");
                window.scrollTo(0, 0);
              }}
            >
              <div className="bg-emerald-100 p-2 sm:p-3 rounded-full mb-2 sm:mb-3">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                Projects
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                View all available projects
              </p>
            </div>

            {/* Submit Project Box */}
            <div
              className="w-full sm:w-48 h-auto sm:h-48 py-4 bg-amber-50 rounded-lg shadow-md border border-amber-100 hover:border-amber-300 transition-all hover:shadow-lg cursor-pointer flex flex-col items-center justify-center p-4 text-center"
              onClick={() => {
                // Check if user is logged in
                const isLoggedIn = localStorage.getItem('token'); // Assuming token is stored in localStorage
                if (!isLoggedIn) {
                  navigate("/auth"); // Redirect to auth page if not logged in
                } else {
                  navigate("/submit-project"); // Redirect to submit project if logged in
                }
                window.scrollTo(0, 0);
              }}
            >
              <div className="bg-amber-100 p-2 sm:p-3 rounded-full mb-2 sm:mb-3">
                <PlusCircle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                Submit Project
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Add your own real estate project
              </p>
            </div>
          </div>

          {/* View All Button - Repositioned */}
          <div className="flex justify-between">
            {/* <Button
              onClick={() => navigate("/submit-project")}
              className="gap-2 bg-amber-600 hover:bg-amber-700"
            >
              <PlusCircle className="h-4 w-4" />
              Submit New Project
            </Button> */}
            {/* <Button
              onClick={() => navigate("/projects")}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              View All New Projects
              <ChevronRight className="h-4 w-4" />
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
