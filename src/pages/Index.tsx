import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WeeklyShowcase from "@/components/WeeklyShowcase";
import ProgramOverview from "@/components/ProgramOverview";
import CohortInfo from "@/components/CohortInfo";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <WeeklyShowcase />
        <ProgramOverview />
        <CohortInfo />
      </main>
      
      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">IC</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  Inc Combinator
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Empowering crazy founders to build scalable solutions for India's biggest challenges.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Programs</h4>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground hover:text-primary cursor-pointer">MVP Lab</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Incubation</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Hackathon Track</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">INClab</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Resources</h4>
              <div className="space-y-2 text-sm">
                <Link to="/resources" className="block text-muted-foreground hover:text-primary cursor-pointer">Resources</Link>
                <Link to="/partnership" className="block text-muted-foreground hover:text-primary cursor-pointer">Partnership</Link>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Sponsorship</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Alumni Network</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Connect</h4>
              <div className="space-y-2 text-sm">
                <Link to="/about" className="block text-muted-foreground hover:text-primary cursor-pointer">About Us</Link>
                <Link to="/contact" className="block text-muted-foreground hover:text-primary cursor-pointer">Contact</Link>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Mentorship</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Funding Guide</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Inc Combinator. Inspired by the vision of transforming India through innovation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
