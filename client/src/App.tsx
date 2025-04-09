import React from "react";
import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/use-auth";
import MobileNav from "@/components/layout/mobile-nav";
import ProtectedRoute from "@/components/auth/protected-route";
import ComingSoonPage from "./pages/coming-soon";

// Global UI Components
import ScrollToTop from "@/components/ui/scroll-to-top";
import Chatbot from "@/components/ui/chatbot";
import { Toaster } from "@/components/ui/toaster";

// Pages
import HomePage from "@/pages/home-page";
import NotFound from "@/pages/not-found";
import TopPropertiesList from "@/pages/top-properties-list";
import AuthPage from "@/pages/auth-page";
import AddProperty from "@/pages/add-property";
import PostPropertyFree from "@/pages/post-property-free";
import Dashboard from "@/pages/dashboard";
import PropertyDetail from "@/pages/property-detail";
import ProjectDetail from "@/pages/project-detail";
import PropertiesPage from "@/pages/properties-page";
import ProjectCategory from "@/pages/projects/project-category";
import SearchResults from "@/pages/search-results";
import RecommendationsPage from "@/pages/recommendations";
import AdminDashboard from "@/pages/admin/dashboard";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import UserAdvisory from "@/pages/UserAdvisory";
import TopPropertiesView from "@/pages/top-properties-view";

// Policy Pages
import TermsConditions from "@/pages/policies/terms-conditions";
import PrivacyPolicy from "@/pages/policies/privacy-policy";
import Disclaimer from "@/pages/policies/disclaimer";
import Feedback from "@/pages/policies/feedback";
import ReportProblem from "@/pages/policies/report-problem";
import EMICalculator from "@/pages/tools/emi-calculator";
import PropertyValidation from "@/pages/tools/property-validation";
import ClickAndEarnInfo from "@/pages/tools/click-and-earn";
import ClickAndEarnForm from "@/pages/click-and-earn";
import CreatePost from "@/pages/create-post";
import SubmissionSuccess from "@/pages/submission-success";

import BuyingGuidePage from "@/pages/guides/buying-guide";

// Service Pages
import PropertyManagementPage from "@/pages/services/property-management";
import PropertySearchPage from "@/pages/services/property-search";
import CommercialIndustrialPage from "@/pages/services/commercial-industrial";
import InvestmentAdvisoryPage from "@/pages/services/investment-advisory";
import InvestmentServicesPage from "@/pages/services/investment-services";
import LegalSolutionsPage from "@/pages/services/legal-solutions";
import FinancialManagementPage from "@/pages/services/financial-management";
import WhyChooseUsPage from "@/pages/services/why-choose-us";
import SubmitProjectPage from "@/pages/submit-project";

// Remove these imports that don't exist yet:
// import HomeLoansPage from "@/pages/services/home-loans";
// import InteriorDesignPage from "@/pages/services/interior-design";
// import VaatuConsultationPage from "@/pages/services/vaastu-consultation";
// import PropertyInsurancePage from "@/pages/services/property-insurance";
// import RentalServicesPage from "@/pages/services/rental-services";

import { queryClient } from "@/lib/query-client";

import PartnerWithUs from "./pages/partner-with-us";
import Careers from "@/pages/careers";

//  Ad Packeges
import OwnerAdPackagesPage from '@/pages/owner-ad-packages';
import AgentPricingPage from '@/pages/agent-pricing';
import BuilderPricingPage from '@/pages/builder-pricing';
import CompanyPricingPage from '@/pages/company-pricing';
import BuyerPricingPage from '@/pages/buyer-pricing';


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <MobileNav />
        <ScrollToTop />
        <Chatbot />
        <Switch>
          {/* Public Routes */}
          <Route path="/" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/properties" component={PropertiesPage} />
          <Route path="/property/:id" component={PropertyDetail} />
          <Route path="/property-detail/:id" component={PropertyDetail} />
          <Route path="/project/:id" component={ProjectDetail} />
          <Route path="/search-results" component={SearchResults} />
          <Route path="/projects/:category" component={ProjectCategory} />
          <Route path="/post-property-free" component={PostPropertyFree} />
          <Route path="/about" component={AboutPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/top-properties" component={TopPropertiesList} />
          <Route path="/user-advisory" component={UserAdvisory} />
          <Route path="/submit-project" component={SubmitProjectPage} />

          {/* Policy Routes */}
          <Route path="/terms-conditions" component={TermsConditions} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/disclaimer" component={Disclaimer} />
          <Route path="/feedback" component={Feedback} />
          <Route path="/report-problem" component={ReportProblem} />

          {/* Tools Routes */}
          <Route path="/tools/emi-calculator" component={EMICalculator} />
          <Route
            path="/tools/property-validation"
            component={PropertyValidation}
          />
          <Route path="/tools/click-and-earn" component={ClickAndEarnInfo} />
          <Route path="/click-and-earn" component={ClickAndEarnForm} />
          <Route path="/create-post" component={CreatePost} />
          <Route path="/submission-success" component={SubmissionSuccess} />

          <Route path="/guides/buying-guide" component={BuyingGuidePage} />
          <Route path="/coming-soon" component={ComingSoonPage} />

          {/* Service Routes */}
          <Route
            path="/services/property-management"
            component={PropertyManagementPage}
          />
          <Route
            path="/services/property-search"
            component={PropertySearchPage}
          />
          <Route
            path="/services/commercial-industrial"
            component={CommercialIndustrialPage}
          />
          <Route
            path="/services/investment-advisory"
            component={InvestmentAdvisoryPage}
          />
          <Route
            path="/services/investment-services"
            component={InvestmentServicesPage}
          />
          <Route
            path="/services/legal-solutions"
            component={LegalSolutionsPage}
          />
          <Route
            path="/services/financial-management"
            component={FinancialManagementPage}
          />
          <Route path="/services/why-choose-us" component={WhyChooseUsPage} />


          {/* Ad Packages  */}
          <Route path="/owner-ad-packages" component={OwnerAdPackagesPage} />
          <Route path="/agent-pricing" component={AgentPricingPage} />
          <Route path="/builder-pricing" component={BuilderPricingPage} />
          <Route path="/company-pricing" component={CompanyPricingPage} />
          <Route path="/buyer-pricing" component={BuyerPricingPage} />
          

          {/* Protected Routes */}
          <Route path="/dashboard">
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </Route>
          <Route path="/add-property">
            <ProtectedRoute>
              <AddProperty />
            </ProtectedRoute>
          </Route>
          <Route path="/recommendations">
            <ProtectedRoute>
              <RecommendationsPage />
            </ProtectedRoute>
          </Route>
          <Route path="/admin/dashboard">
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          </Route>
          <Route path="/user/referrals">
            <ProtectedRoute>
              <ClickAndEarnForm />
            </ProtectedRoute>
          </Route>
          <Route path="/top-properties-view/:count">
            <ProtectedRoute>
              <TopPropertiesView />
            </ProtectedRoute>
          </Route>

          <Route path="/partner-with-us" component={PartnerWithUs} />
          <Route path="/careers" component={Careers} />

          {/* 404 Route */}
          <Route component={NotFound} />
        </Switch>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
