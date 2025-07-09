
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import ApplicationDialog from "@/components/ApplicationDialog";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Inc Combinator Hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/95"></div>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 z-10 text-center space-y-8 animate-fade-in">
        {/* Philosophical Quote */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            We need{" "}
            <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent animate-glow-pulse">
              crazy founders
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Ratan Tata backed Inc Combinator - Where visionary Indian entrepreneurs 
            transform impossible ideas into scalable solutions for mass problems.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center pt-8">
          <ApplicationDialog program="INClab">
            <Button variant="hero" size="lg" className="text-lg px-8 py-6">
              Apply to INClab
            </Button>
          </ApplicationDialog>
          <Link to="/current-cohort">
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              View Current Cohort
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto">
          <Card className="p-6 bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Startups Accelerated</div>
            </div>
          </Card>
          <Card className="p-6 bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">₹1000Cr+</div>
              <div className="text-muted-foreground">Total Funding Raised</div>
            </div>
          </Card>
          <Card className="p-6 bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-muted-foreground">Unicorn Potential</div>
            </div>
          </Card>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-primary" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
