import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Hackathons from "./pages/Hackathons";
import Incubation from "./pages/Incubation";
import InvestorCentre from "./pages/InvestorCentre";
import MeetCofounder from "./pages/MeetCofounder";
import StartupDirectory from "./pages/StartupDirectory";
import ProgramDetails from "./pages/ProgramDetails";
import MVPLab from "./pages/MVPLab";
import INCLab from "./pages/INCLab";
import { Toaster } from "@/components/ui/toaster"
import { QueryClient } from '@tanstack/react-query';
import SuccessStories from "./pages/SuccessStories";
import BecomeMentor from "./pages/BecomeMentor";

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/hackathon" element={<Hackathons />} />
            <Route path="/incubation" element={<Incubation />} />
            <Route path="/investor-centre" element={<InvestorCentre />} />
            <Route path="/meet-cofounder" element={<MeetCofounder />} />
            <Route path="/startup-directory" element={<StartupDirectory />} />
            <Route path="/program-details" element={<ProgramDetails />} />
            <Route path="/mvp-lab" element={<MVPLab />} />
            <Route path="/inc-lab" element={<INCLab />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/become-mentor" element={<BecomeMentor />} />
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
