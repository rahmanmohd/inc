
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import RequireAuth from "@/routes/RequireAuth";
import { AuthUIProvider } from "@/context/AuthUIContext";
import LoginDialog from "@/components/LoginDialog";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Hackathon from "./pages/Hackathon";
import HackathonDetail from "./pages/HackathonDetail";
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
import InvestorDashboard from "./pages/InvestorDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import StartupDirectory from "./pages/StartupDirectory";
import StartupProfile from "./pages/StartupProfile";
import Deals from "./pages/Deals";
import Blogs from "./pages/Blogs";
import News from "./pages/News";
import MeetCofounder from "./pages/MeetCofounder";
import InvestorCentre from "./pages/InvestorCentre";
import InvestorProfile from "./pages/InvestorProfile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import BlogDetail from "./pages/BlogDetail";
import RequirementsDetail from "./pages/RequirementsDetail";
import CurrentCohort from "./pages/CurrentCohort";
import FeaturedStartups from "./pages/FeaturedStartups";
import Philosophy from "./pages/Philosophy";
import AllApplications from "./pages/AllApplications";
import ProgramDetails from "./pages/ProgramDetails";
import ConsultationBooking from "./pages/ConsultationBooking";
import SuccessStories from "./pages/SuccessStories";
import BecomeMentor from "./pages/BecomeMentor";
import PastEvents from "./pages/PastEvents";
import CloudCredits from "./pages/CloudCredits";
import GrantsFunding from "./pages/GrantsFunding";
import UserDashboard from "./pages/UserDashboard";
import CofounderDashboard from "./pages/CofounderDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AuthUIProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <LoginDialog />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected routes */}
            <Route path="/hackathon" element={<RequireAuth><Hackathon /></RequireAuth>} />
            <Route path="/hackathon/:id" element={<RequireAuth><HackathonDetail /></RequireAuth>} />
            <Route path="/hackathon-detail/:id" element={<RequireAuth><HackathonDetail /></RequireAuth>} />
            <Route path="/incubation" element={<RequireAuth><Incubation /></RequireAuth>} />
            <Route path="/mvp-lab" element={<RequireAuth><MVPLab /></RequireAuth>} />
            <Route path="/inclab" element={<RequireAuth><INCLab /></RequireAuth>} />
            <Route path="/resources" element={<RequireAuth><Resources /></RequireAuth>} />
            <Route path="/partnership" element={<RequireAuth><Partnership /></RequireAuth>} />
            <Route path="/about" element={<RequireAuth><AboutUs /></RequireAuth>} />
            <Route path="/contact" element={<RequireAuth><Contact /></RequireAuth>} />
            <Route path="/startup-dashboard" element={<RequireAuth><StartupDashboard /></RequireAuth>} />
            <Route path="/admin-dashboard" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
            <Route path="/investor-dashboard" element={<RequireAuth><InvestorDashboard /></RequireAuth>} />
            <Route path="/mentor-dashboard" element={<RequireAuth><MentorDashboard /></RequireAuth>} />
            <Route path="/user-dashboard" element={<RequireAuth><UserDashboard /></RequireAuth>} />
            <Route path="/cofounder-dashboard" element={<RequireAuth><CofounderDashboard /></RequireAuth>} />
            <Route path="/blog/:id" element={<RequireAuth><BlogDetail /></RequireAuth>} />
            <Route path="/requirements" element={<RequireAuth><RequirementsDetail /></RequireAuth>} />
            <Route path="/startup-directory" element={<RequireAuth><StartupDirectory /></RequireAuth>} />
            <Route path="/startup-profile/:id" element={<RequireAuth><StartupProfile /></RequireAuth>} />
            <Route path="/deals" element={<RequireAuth><Deals /></RequireAuth>} />
            <Route path="/blogs" element={<RequireAuth><Blogs /></RequireAuth>} />
            <Route path="/news" element={<RequireAuth><News /></RequireAuth>} />
            <Route path="/meet-cofounder" element={<RequireAuth><MeetCofounder /></RequireAuth>} />
            <Route path="/investor-centre" element={<RequireAuth><InvestorCentre /></RequireAuth>} />
            <Route path="/investor-profile/:id" element={<RequireAuth><InvestorProfile /></RequireAuth>} />
            <Route path="/privacy-policy" element={<RequireAuth><PrivacyPolicy /></RequireAuth>} />
            <Route path="/terms-conditions" element={<RequireAuth><TermsConditions /></RequireAuth>} />
            <Route path="/current-cohort" element={<RequireAuth><CurrentCohort /></RequireAuth>} />
            <Route path="/featured-startups" element={<RequireAuth><FeaturedStartups /></RequireAuth>} />
            <Route path="/philosophy" element={<RequireAuth><Philosophy /></RequireAuth>} />
            <Route path="/all-applications" element={<RequireAuth><AllApplications /></RequireAuth>} />
            <Route path="/program-details" element={<RequireAuth><ProgramDetails /></RequireAuth>} />
            <Route path="/consultation-booking" element={<RequireAuth><ConsultationBooking /></RequireAuth>} />
            <Route path="/success-stories" element={<RequireAuth><SuccessStories /></RequireAuth>} />
            <Route path="/become-mentor" element={<RequireAuth><BecomeMentor /></RequireAuth>} />
            <Route path="/past-events" element={<RequireAuth><PastEvents /></RequireAuth>} />
            <Route path="/cloud-credits" element={<RequireAuth><CloudCredits /></RequireAuth>} />
            <Route path="/grants-funding" element={<RequireAuth><GrantsFunding /></RequireAuth>} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </AuthUIProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
