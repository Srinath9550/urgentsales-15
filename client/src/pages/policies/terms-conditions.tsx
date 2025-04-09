import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function TermsConditions() {
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

          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Terms and Conditions
          </h1>

          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Introduction
              </h2>
              Welcome to UrgentSales.in, operated by UrgentSales.in By accessing
              or using our platform (website, mobile app, or APIs), you agree to
              be bound by these Terms and Conditions, our Privacy Policy, and
              Community Guidelines. Please read them carefully before using our
              services.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 mb-4">
              By accessing or using UrgentSales.in (website, mobile application,
              or any affiliated platform), you agree to comply with and be bound
              by these Terms and Conditions, our Privacy Policy, and any other
              policies incorporated herein by reference. If you do not agree,
              you must not access or use the platform.
            </p>
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              2. Services Offered
            </h2>
            <p className="text-gray-700 mb-4">
              UrgentSales.in is an online platform facilitating the listing,
              advertisement, search, and promotion of real estate properties for
              sale, rent, or purchase. We do not represent any party in real
              estate transactions and are not a real estate agent or broker. We
              provide information services only.
            </p>
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              3. User Obligations
            </h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>
                Users shall provide accurate and truthful information in
                listings and communications.
              </li>
              <li>
                Users represent that they have lawful authority to list any
                property and shall comply with RERA (Real Estate Regulation and
                Development Act, 2016) where applicable.
              </li>
              <li>
                Users are solely responsible for verifying property titles,
                legal documentation, and financial due diligence.
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              4. Content and Intellectual Property Rights
            </h2>
            <p className="text-gray-700 mb-4">
              All content on UrgentSales.in, including logos, software, design,
              and data, are the intellectual property of the Company. Users are
              granted a limited, non-exclusive, non-transferable right to use
              the platform for personal, non-commercial purposes.
            </p>
            <p className="text-gray-700 mb-4">Users may not:</p>
            <ul>
              <li>
                Copy, reproduce, or distribute content without written consent
              </li>{" "}
              <li>Use the platform for unauthorized or unlawful activities.</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              5. Payment Terms
            </h2>
            <p className="text-gray-700 mb-4">
              <b>a) Advance Payment</b>
            </p>
            <p className="text-gray-700 mb-4">
              All services offered by UrgentSales.in are provided on a 100%
              advance payment basis. Users must pay in full before availing any
              paid feature, including but not limited to property listings,
              promotional services, and advertising tools.
            </p>
            <p className="text-gray-700 mb-4">
              <b>b) Accepted Payment Methods</b>
            </p>
            <p className="text-gray-700 mb-4">
              We accept payments through the following secure channels:
            </p>
            <ul>
              <li> Credit/Debit Cards (Visa, MasterCard, American Express)</li>
              <li> Net Banking (All Major Indian Banks)</li>
              <li> UPI (Unified Payments Interface)</li>
              <li> Digital Wallets (e.g., Paytm, PhonePe, Google Pay)</li>
              <li> Payment Gateways (e.g., Razorpay, PayU)</li>
            </ul>
            <p>
              UrgentSales.in does not store any credit/debit card details.
              Payments are processed via PCI-DSS-compliant third-party payment
              gateways.
            </p>
            <p className="text-gray-700 mb-4">
              <b>
                {" "}
                <b>Payment Confirmation</b>
              </b>
            </p>
            <p>Upon successful payment, users will receive:</p>
            <ul>
              {" "}
              <li>
                {" "}
                An electronic invoice sent to their registered email ID.{" "}
              </li>
              <li>
                {" "}
                Access to the chosen service within 24–48 hours, unless
                otherwise specified.
              </li>
            </ul>
            <p>
              UrgentSales.in shall not be liable for delays caused by technical
              errors or banking network issues beyond our control.
            </p>
            <p className="text-gray-700 mb-4">
              <b>
                {" "}
                <b> Refund Policy</b>
              </b>
            </p>
            <p className="text-gray-700 mb-4">
              {" "}
              <b> a) General Policy</b>
            </p>
            <p>
              All payments made to UrgentSales.in are non-refundable, except in
              the following cases:
            </p>
            <ul>
              {" "}
              <li>
                {" "}
                Double Payment: If a user is charged twice for the same service.{" "}
              </li>
              <li>
                {" "}
                Failed Transaction: If the user’s account is debited but the
                service is not activated due to a technical error.
              </li>
              <li>
                {" "}
                Service Non-Delivery: In rare instances where the service cannot
                be rendered, solely due to reasons attributable to
                UrgentSales.in.
              </li>
            </ul>
            <p className="text-gray-700 mb-4">
              {" "}
              <b> b) Eligibility for Refund</b>
            </p>
            <p>
              Refund requests must be submitted in writing within 7 days of the
              transaction, along with:
            </p>
            <ul>
              {" "}
              <li> Proof of payment (transaction reference ID or invoice)</li>
              <li>Description of the issue or reason for refund</li>
            </ul>
            <p>
              All eligible refunds will be processed within 10-15 business days.
              Refunds will be credited to the original payment method used by
              the user.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              6. Limitation of Liability
            </h2>
            <p className="text-gray-700 mb-4">
              UrgentSales.in shall not be liable for any direct, indirect,
              incidental, special, or consequential damages, including but not
              limited to, loss of data, profits, or property arising from:
            </p>
            <ul>
              {" "}
              <li> Use or inability to use the platform.</li>
              <li>Errors, omissions, or inaccuracies in listings.</li>
              <li>Unauthorized access or misuse by third parties.</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Maximum liability shall be limited to the fees paid by the user
              for the service in question.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              7. Termination of Access
            </h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to suspend, limit, or terminate user access
              without notice in cases of:
            </p>
            <ul>
              {" "}
              <li> Violation of these Terms.</li>
              <li>Misuse, fraud, or illegal activity.</li>
              <li> Technical, maintenance, or security reasons.</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Users may request restoration of access by contacting our support
              team.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              8. Privacy and Data Protection
            </h2>
            <p className="text-gray-700 mb-4">
              We are committed to safeguarding user data. Information collected
              will be handled in accordance with our Privacy Policy and may be
              shared with third parties for service provision, legal compliance,
              or marketing with user consent.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              9. Dispute Resolution
            </h2>
            <p className="text-gray-700 mb-4">
              All disputes arising out of or in connection with these Terms
              shall first be attempted to be resolved amicably. If unresolved,
              disputes shall be referred to arbitration under the Arbitration
              and Conciliation Act, 1996, with a sole arbitrator appointed by
              UrgentSales.in. Seat of Arbitration: Hyderabad, India.
              GoverningLaw:IndianLaw. Jurisdiction: Courts in Hyderabad, India.
            </p>
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              10. Force Majeure
            </h2>
            <p className="text-gray-700 mb-4">
              UrgentSales.in shall not be liable for delays or failures in
              performance due to force majeure events, including but not limited
              to, natural disasters, war, governmental actions, strikes, or
              internet outages.
            </p>
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              11. Amendments
            </h2>
            <p className="text-gray-700 mb-4">
              UrgentSales.in reserves the right to modify these Terms at any
              time. Updated terms shall be effective upon posting. Continued use
              constitutes acceptance of revised terms.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              12. Contact Information
            </h2>
            <p className="text-gray-700 mb-4">
              For any queries or grievances, please
            </p>
            <p className="text-gray-700 mb-4">
              contact:9951211555
              <br /> Officer:Mr.Chandrashekhar
              <br />
              Time: 10 AM – 6 PM IST, 7 days a week
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              13. Miscellaneous
            </h2>
            <ul>
              {" "}
              <li>
                {" "}
                <b>Severability: </b>If any provision is deemed invalid,
                remaining terms remain in full effect
              </li>
              <li>
                <b>Waiver:</b> Failure to enforce any term shall not constitute
                a waiver.
              </li>
              <li>
                {" "}
                <b>Entire Agreement: </b>These Terms, along with the Privacy
                Policy, constitute the entire agreement between you and
                UrgentSales.in.
              </li>
            </ul>
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              14.Information Sharing
            </h2>
            <p className="text-gray-700 mt-8">
              By accessing and using UrgentSales.in, users agree to share
              certain personal and non-personal information. This information is
              collected to facilitate real estate services, improve user
              experience, provide customer support, and deliver relevant
              property-related content and services.
            </p>
            <b>Types of Information Collected</b>
            <p className="text-gray-700 mt-8">
              We may collect and process the following types of user data:
            </p>
            <ul>
              {" "}
              <li>
                {" "}
                <b> Personal Information: </b>Name, contact number, email
                address, residential address, property ownership details,
                identity proof (where applicable).
              </li>
              <li>
                <b> Financial Information: </b> Transaction details for services
                purchased, payment history (via secure gateways).
              </li>
              <li>
                {" "}
                <b> Usage Data: </b>IP address, device type, browser
                information, interaction with the platform (cookies,
                preferences, etc.).
              </li>
              <li>
                {" "}
                <b> Third-Party Data: </b>Data shared with or obtained from
                third-party service providers (e.g., payment gateways,
                verification agencies).
              </li>
            </ul>
            <p className="text-gray-700 mt-8">
              <b> User Rights </b>
            </p>
            <p className="text-gray-700 mt-8">Users have the right to:</p>
            <ul>
              {" "}
              <li>
                {" "}
                Access, review, and request correction of their personal data.
              </li>
              <li> Withdraw consent for promotional communications.</li>
              <li>
                Request deletion of personal data (subject to legal and
                operational obligations).
              </li>
            </ul>

            <p className="text-gray-700 mt-8">Last Updated: March 21, 2025</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
