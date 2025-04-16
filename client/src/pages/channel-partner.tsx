import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function ChannelPartnerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary text-white py-14 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Sell Your Real Estate Projects Faster
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Partner with UrgentSales.in for Marketing, Lead Generation & Conversions
            </p>
            <Button
              size="lg"
              className="bg-white text-primary font-semibold hover:bg-gray-100"
              onClick={() => {
                const el = document.getElementById("contact-sales");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Start Selling with Us
            </Button>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
              Why Choose UrgentSales.in?
            </h2>
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm text-gray-700 text-base">
              As a professional real estate marketing and channel partner agency, <b>UrgentSales.in</b> is dedicated to bridging the gap between real estate developers and serious buyers. We specialize in high-velocity sales through a combination of targeted digital campaigns, lead engagement, and on-ground conversion strategies. Whether you’re launching a new project or clearing inventory, we help you close faster — with minimal hassle.
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
              Our Sales & Marketing Services
            </h2>
            <ul className="bg-white rounded-lg shadow-sm p-6 grid gap-3 text-gray-700">
              <li>
                <b>Digital Promotions</b> – Reach targeted audiences via Google, Facebook, Instagram & YouTube.
              </li>
              <li>
                <b>Lead Generation</b> – We bring you verified, high-intent buyer leads from online and offline channels.
              </li>
              <li>
                <b>Follow-Up CRM & WhatsApp Support</b> – Our CRM system ensures consistent lead nurturing, while WhatsApp boosts engagement.
              </li>
              <li>
                <b>Site Visit Scheduling</b> – We coordinate with buyers and your team to arrange seamless site visits.
              </li>
              <li>
                <b>Site Assistance</b> – Our team supports sales closures with follow-ups and buyer persuasion techniques.
              </li>
              <li>
                <b>Property Listing on UrgentSales.in</b> – Your property gains visibility among our growing buyer community.
              </li>
            </ul>
          </div>
        </section>

        {/* Engagement Models */}
        <section className="py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
              Flexible Engagement Models
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-sm text-sm md:text-base">
                <thead>
                  <tr className="bg-primary/10">
                    <th className="py-2 px-3 text-left font-semibold">Model</th>
                    <th className="py-2 px-3 text-left font-semibold">How It Works</th>
                    <th className="py-2 px-3 text-left font-semibold">Ideal For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-3 font-medium">Commission-Only</td>
                    <td className="py-2 px-3">We work on commission, and you pay only on successful sale closure, so you retain margin.</td>
                    <td className="py-2 px-3">Builders with low upfront budget who want risk-free results.</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">Marketing + Bonus</td>
                    <td className="py-2 px-3">You pay a small marketing fee + bonus per sale as an incentive.</td>
                    <td className="py-2 px-3">Brands looking to build long-term visibility and scale sales in parallel.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
              Who We Serve
            </h2>
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Real Estate Builders & Developers</li>
                <li>Venture Owners Selling Residential Plots & Layouts</li>
                <li>Farmlands & Villa Project Promoters</li>
                <li>Flats & Apartment Builders</li>
                <li>Commercial Space Owners (Shops, Offices, Warehouses)</li>
              </ul>
              <div className="mt-3 text-gray-600">
                Whether you’re a small local promoter or an established developer, our platform and team scale with your vision.
              </div>
            </div>
          </div>
        </section>

        {/* How to Get Started */}
        <section className="py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
              How to Get Started?
            </h2>
            <div className="bg-white rounded-lg shadow-sm p-6 text-gray-700">
              <p className="mb-3">
                It’s simple. Share your project details with us — including pricing, location, and key features. Our team will evaluate your property, propose a suitable engagement model, and launch a marketing campaign within 48 hours.
              </p>
              <p className="mb-3">
                Our priority is transparency, speed, and result-oriented execution. We become your extended sales arm — without adding to your overhead costs.
              </p>
              <div id="contact-sales" className="text-center mt-6">
                <Button 
                  size="lg" 
                  className="bg-primary text-white font-semibold hover:bg-primary/90"
                  onClick={() => window.location.href = '/contact'}
                >
                  Contact Our Sales Team
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}