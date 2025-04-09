import { Check, Smartphone } from "lucide-react";

export default function MobileApp() {
  return (
    <section className="py-16 bg-gradient-to-r from-white to-primary/5 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-6 leading-tight">
              Download Our Mobile App
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Take Urgentsales.in with you wherever you go. Search properties,
              chat with owners, and get instant notifications.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-primary/10 p-1 rounded-md text-primary">
                  <Check className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">
                    Property Search on the Go
                  </h3>
                  <p className="text-gray-600">
                    Find properties anytime, anywhere
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-primary/10 p-1 rounded-md text-primary">
                  <Check className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">
                    Real-time Chat with Owners
                  </h3>
                  <p className="text-gray-600">
                    Communicate directly through the app
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-primary/10 p-1 rounded-md text-primary">
                  <Check className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">
                    Instant Property Alerts
                  </h3>
                  <p className="text-gray-600">
                    Get notified when new properties match your criteria
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="inline-flex items-center bg-black text-white py-3 px-5 rounded-lg hover:bg-gray-900 transition-colors"
              >
                <svg
                  className="w-6 h-6 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.79 1.25-.18 2.44-.89 3.56-.84 1.52.09 2.67.68 3.4 1.76-3.13 1.88-2.51 5.89.55 6.97-.56 1.5-1.31 2.99-2.59 4.29zm-5.1-15.62C13.2.93 16.45.32 17.97 3.09c-1.96 1.22-3.58 3.13-2.54 5.57-2.19.35-4.22-1.31-4.48-4z" />
                </svg>
                <div>
                  <p className="text-xs">Download on the</p>
                  <p className="text-sm font-medium">App Store</p>
                </div>
              </a>

              <a
                href="#"
                className="inline-flex items-center bg-black text-white py-3 px-5 rounded-lg hover:bg-gray-900 transition-colors"
              >
                <svg
                  className="w-6 h-6 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 0 1-.293-.707V2.521c0-.265.106-.52.293-.707zM14.208 12l5.679-5.679 2.123 1.236c.725.42.974 1.152.974 1.855s-.249 1.434-.974 1.854l-2.123 1.236L14.208 12zm-1.56 1.431L4.224 21.855l10.599-6.159 4.766 4.766-2.421 1.41a2.918 2.918 0 0 1-2.94 0l-2.378-1.379-1.561-1.431zm0-2.862L4.224 2.145l10.599 6.159 4.766-4.766-2.421-1.41a2.918 2.918 0 0 0-2.94 0L12.85 3.507l-1.56 1.431z" />
                </svg>
                <div>
                  <p className="text-xs">Get it on</p>
                  <p className="text-sm font-medium">Google Play</p>
                </div>
              </a>
            </div>
          </div>

          {/* Mobile App Advertisement Image */}
          <div className="lg:w-1/2 flex justify-center relative">
            <div className="relative">
              {/* Phone frame */}
              <div className="absolute inset-0 border-[12px] border-gray-800 rounded-[36px] shadow-xl z-10"></div>

              {/* Phone screen content */}
              <div className="relative bg-white rounded-[24px] overflow-hidden h-[540px] w-[270px] z-0">
                {/* App header */}
                <div className="bg-primary text-white p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg"> Coming Soon !</h3>
                    <div className="flex space-x-2">
                      <span className="block w-2 h-2 bg-white rounded-full"></span>
                      <span className="block w-2 h-2 bg-white rounded-full"></span>
                      <span className="block w-2 h-2 bg-white rounded-full"></span>
                    </div>
                  </div>
                </div>

                {/* App content */}
                <div className="p-3">
                  {/* Featured property */}
                  <div className="mb-3 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                    <div className="h-32 bg-gradient-to-r from-primary/70 to-primary bg-center bg-cover"></div>
                    <div className="p-3">
                      <div className="text-xs font-semibold text-primary">
                        Featured Property
                      </div>
                      <div className="text-sm font-bold">
                        The Pinnacle Residences
                      </div>
                      <div className="text-xs text-gray-600">
                        Jubilee Hills, Hyderabad
                      </div>
                      <div className="text-xs font-medium mt-1">₹ 4.5 Cr</div>
                    </div>
                  </div>

                  {/* Property list */}
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex bg-gray-50 p-2 rounded-lg">
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0"></div>
                        <div className="ml-2 flex-1">
                          <div className="text-xs font-bold truncate">
                            Property Listing {i}
                          </div>
                          <div className="text-[10px] text-gray-600">
                            Location {i}
                          </div>
                          <div className="text-[10px] font-medium mt-1">
                            ₹ {i * 85} Lakhs
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex justify-around">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                      </div>
                      <span className="text-[8px] text-primary font-medium">
                        Home
                      </span>
                    </div>
                    {["Search", "Chat", "Saved", "Profile"].map((item) => (
                      <div key={item} className="flex flex-col items-center">
                        <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                        <span className="text-[8px] text-gray-500">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notification popup */}
              <div className="absolute top-20 -right-10 bg-white p-3 rounded-lg shadow-lg w-48 z-20">
                <div className="flex items-start">
                  <div className="bg-primary/20 p-1 rounded-md">
                    <Smartphone className="h-4 w-4 text-primary" />
                  </div>
                  <div className="ml-2">
                    <p className="text-xs font-bold">New Property Match!</p>
                    <p className="text-[10px] text-gray-600">
                      A new property matching your criteria is available.
                    </p>
                  </div>
                </div>
              </div>

              {/* Download prompt */}
              <div className="absolute bottom-24 -left-16 bg-primary text-white p-3 rounded-lg shadow-lg z-20">
                <p className="text-xs font-bold">Download Now!</p>
                <p className="text-[10px]">Access premium features</p>
                <div className="mt-2 flex justify-center">
                  <span className="text-[10px] bg-white text-primary px-3 py-1 rounded-full font-medium">
                    Get the App
                  </span>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/10 rounded-full z-[-1]"></div>
              <div className="absolute -top-5 -left-5 w-16 h-16 bg-primary/20 rounded-full z-[-1]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
