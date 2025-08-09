
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Hackathon from "./pages/Hackathon";
import Incubation from "./pages/Incubation";
import MVPLab from "./pages/MVPLab";
import INCLab from "./pages/INCLab";
import Resources from "./pages/Resources";
import Partnership from "./pages/Partnership";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import StartupDashboard from "./pages/StartupDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StartupDirectory from "./pages/StartupDirectory";
import Deals from "./pages/Deals";
import Blogs from "./pages/Blogs";
import News from "./pages/News";
import MeetCofounder from "./pages/MeetCofounder";
import InvestorCentre from "./pages/InvestorCentre";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import BlogDetail from "./pages/BlogDetail";
import RequirementsDetail from "./pages/RequirementsDetail";
import CurrentCohort from "./pages/CurrentCohort";
import FeaturedStartups from "./pages/FeaturedStartups";
import Philosophy from "./pages/Philosophy";
import AllApplications from "./pages/AllApplications";
import SuccessStories from "./pages/SuccessStories";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/hackathon" element={<Hackathon />} />
          <Route path="/incubation" element={<Incubation />} />
          <Route path="/mvp-lab" element={<MVPLab />} />
          <Route path="/inclab" element={<INCLab />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/partnership" element={<Partnership />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/startup-dashboard" element={<StartupDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/requirements" element={<RequirementsDetail />} />
          <Route path="/startup-directory" element={<StartupDirectory />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/news" element={<News />} />
          <Route path="/meet-cofounder" element={<MeetCofounder />} />
          <Route path="/investor-centre" element={<InvestorCentre />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/current-cohort" element={<CurrentCohort />} />
          <Route path="/featured-startups" element={<FeaturedStartups />} />
          <Route path="/philosophy" element={<Philosophy />} />
          <Route path="/all-applications" element={<AllApplications />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
