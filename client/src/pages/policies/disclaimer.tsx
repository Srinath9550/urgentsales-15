import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function Disclaimer() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-500">
            <button
              onClick={() => window.history.back()}
              className="hover:text-primary focus:outline-none"
            >
              ← Back
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-6">Disclaimer</h1>

          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              This disclaimer ("Disclaimer") sets forth the general guidelines,
              disclosures, and terms of use for the Urgent Sales website
              ("Website" or "Service"). This Disclaimer is a legally binding
              agreement between you ("User", "you" or "your") and Urgent Sales
              ("Company", "we", "us" or "our").
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              1. Representation
            </h2>
            <p className="text-gray-700 mb-4">
              Any views or opinions represented on the Website belong solely to
              the content creators and do not represent those of people,
              institutions, or organizations that the Company or creators may or
              may not be associated with in a professional or personal capacity,
              unless explicitly stated.
            </p>
            <p className="text-gray-700 mb-4">
              The views and opinions expressed on this Website do not constitute
              the official policy or position of the Company.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              2. Content and Postings
            </h2>
            <p className="text-gray-700 mb-4">
              Urgent Sales does not make any warranties about the completeness,
              reliability, and accuracy of the information on this Website. Any
              action you take upon the information you find on this Website is
              strictly at your own risk. Urgent Sales will not be liable for any
              losses and/or damages in connection with the use of our Website.
            </p>
            <p className="text-gray-700 mb-4">
              The information provided on this Website is for general
              information purposes only. The Company assumes no responsibility
              for errors or omissions in the contents of the Website.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              3. Property Listings
            </h2>
            <p className="text-gray-700 mb-4">
              While we strive to provide accurate and up-to-date information
              about properties listed on our platform, we do not guarantee the
              accuracy, completeness, or reliability of any property listings,
              descriptions, prices, availability, or other information related
              to properties.
            </p>
            <p className="text-gray-700 mb-4">
              The information about properties listed on our Website is provided
              by sellers, agents, or other third parties. We do not verify the
              accuracy of such information and are not responsible for any
              inaccuracies, misrepresentations, or omissions.
            </p>
            <p className="text-gray-700 mb-4">
              Users should independently verify all property information and
              details before making any decisions or taking any actions based on
              property listings on our Website.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              4. External Links
            </h2>
            <p className="text-gray-700 mb-4">
              Our Website may contain links to external websites that are not
              provided or maintained by or in any way affiliated with the
              Company. Please note that the Company does not guarantee the
              accuracy, relevance, timeliness, or completeness of any
              information on these external websites.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              5. Errors and Omissions
            </h2>
            <p className="text-gray-700 mb-4">
              The information given by the Website is for general guidance on
              matters of interest only. Even if the Company takes every
              precaution to ensure that the content of the Website is both
              current and accurate, errors can occur. Plus, given the changing
              nature of laws, rules, and regulations, there may be delays,
              omissions, or inaccuracies in the information contained on the
              Website.
            </p>
            <p className="text-gray-700 mb-4">
              The Company is not responsible for any errors or omissions, or for
              the results obtained from the use of this information.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              6. Fair Use
            </h2>
            <p className="text-gray-700 mb-4">
              The Company may use copyrighted material which has not always been
              specifically authorized by the copyright owner. The Company is
              making such material available for criticism, comment, news
              reporting, teaching, scholarship, or research.
            </p>
            <p className="text-gray-700 mb-4">
              The Company believes this constitutes a "fair use" of any such
              copyrighted material as provided for in section 107 of the United
              States Copyright law.
            </p>
            <p className="text-gray-700 mb-4">
              If you wish to use copyrighted material from the Website for your
              own purposes that go beyond fair use, you must obtain permission
              from the copyright owner.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              7. No Responsibility
            </h2>
            <p className="text-gray-700 mb-4">
              The information on the Website is provided with the understanding
              that the Company is not herein engaged in rendering legal,
              accounting, tax, or other professional advice and services. As
              such, it should not be used as a substitute for consultation with
              professional accounting, tax, legal, or other competent advisers.
            </p>
            <p className="text-gray-700 mb-4">
              In no event shall the Company or its suppliers be liable for any
              special, incidental, indirect, or consequential damages whatsoever
              arising out of or in connection with your access or use or
              inability to access or use the Website.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              8. Changes and Amendments
            </h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify this Disclaimer or its terms
              related to the Website at any time, effective upon posting of an
              updated version of this Disclaimer on the Website. When we do, we
              will revise the updated date at the bottom of this page. Continued
              use of the Website after any such changes shall constitute your
              consent to such changes.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              9. Acceptance of Disclaimer
            </h2>
            <p className="text-gray-700 mb-4">
              By using this Website, you signify your acceptance of this
              Disclaimer. If you do not agree to this Disclaimer, please do not
              use our Website. Your continued use of the Website following the
              posting of changes to this Disclaimer will be deemed your
              acceptance of those changes.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              10. Contact Information
            </h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Disclaimer, please contact us
              at:
            </p>
            <p className="text-gray-700 mb-4">
              Email: support@UrgentSales.in
              <br />
              Phone: +91 9032561155
              <br />
              Address: #301, Madhavaram Towers, Kukatpally Y Junction, Moosapet,
              Hyderabad-500018
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
