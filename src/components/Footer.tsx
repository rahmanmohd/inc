
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
              Inc Combinator
            </h3>
            <p className="text-sm text-muted-foreground">
              India's leading startup accelerator and incubator, empowering entrepreneurs to build the next generation of innovative companies.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <a href="/about-us" className="block text-sm text-muted-foreground hover:text-primary transition-colors">About Us</a>
              <a href="/incubation" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Incubation</a>
              <a href="/hackathon" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Hackathons</a>
              <a href="/investor-centre" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Investor Centre</a>
              <a href="/startup-directory" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Startup Directory</a>
              <a href="/news" className="block text-sm text-muted-foreground hover:text-primary transition-colors">News</a>
            </div>
          </div>

          {/* Programs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Programs</h3>
            <div className="space-y-2">
              <a href="/mvp-lab" className="block text-sm text-muted-foreground hover:text-primary transition-colors">MVP Lab</a>
              <a href="/inc-lab" className="block text-sm text-muted-foreground hover:text-primary transition-colors">INC Lab</a>
              <a href="/meet-cofounder" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Meet Co-founder</a>
              <a href="/resources" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Resources</a>
              <a href="/blogs" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Blogs</a>
              <a href="/partnership" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Partnership</a>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Bangalore, Karnataka, India</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>hello@inccombinator.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Newsletter</h4>
              <div className="flex space-x-2">
                <Input placeholder="Your email" className="flex-1" />
                <Button size="sm">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2024 Inc Combinator. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="/terms-conditions" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
