
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Hackathon from "./pages/Hackathon";
import Incubation from "./pages/Incubation";
import InvestorCentre from "./pages/InvestorCentre";
import MeetCofounder from "./pages/MeetCofounder";
import StartupDirectory from "./pages/StartupDirectory";
import ProgramDetails from "./pages/ProgramDetails";
import MVPLab from "./pages/MVPLab";
import INCLab from "./pages/INCLab";
import SuccessStories from "./pages/SuccessStories";
import BecomeMentor from "./pages/BecomeMentor";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import StartupProfile from "./pages/StartupProfile";
import ConsultationBooking from "./pages/ConsultationBooking";
import HackathonDetail from "./pages/HackathonDetail";
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/hackathon" element={<Hackathon />} />
            <Route path="/hackathon/:id" element={<HackathonDetail />} />
            <Route path="/incubation" element={<Incubation />} />
            <Route path="/investor-centre" element={<InvestorCentre />} />
            <Route path="/meet-cofounder" element={<MeetCofounder />} />
            <Route path="/startup-directory" element={<StartupDirectory />} />
            <Route path="/startup-profile/:id" element={<StartupProfile />} />
            <Route path="/program-details" element={<ProgramDetails />} />
            <Route path="/mvp-lab" element={<MVPLab />} />
            <Route path="/inc-lab" element={<INCLab />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/become-mentor" element={<BecomeMentor />} />
            <Route path="/consultation-booking" element={<ConsultationBooking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
