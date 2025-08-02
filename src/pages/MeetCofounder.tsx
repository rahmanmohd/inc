import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CofounderPostDialog from "@/components/CofounderPostDialog";
import ApplicationDialog from "@/components/ApplicationDialog";
import { useNavigate } from "react-router-dom";

const MeetCofounder = () => {
  const navigate = useNavigate();

  const cofounderPosts = [
    {
      id: 1,
      title: "Looking for CTO",
      description: "Seeking a technical co-founder with experience in AI/ML and full-stack development...",
      posted: "3 days ago",
      applications: 8,
      tags: ["AI/ML", "Full-stack", "5+ years exp"],
    },
    {
      id: 2,
      title: "Looking for CMO",
      description: "Need a marketing co-founder with expertise in growth hacking and digital marketing...",
      posted: "1 week ago",
      applications: 4,
      tags: ["Growth Hacking", "Digital Marketing", "B2B SaaS"],
    },
    {
      id: 3,
      title: "Looking for CFO",
      description: "Seeking a financial co-founder with experience in fundraising and financial modeling...",
      posted: "5 days ago",
      applications: 6,
      tags: ["Fundraising", "Financial Modeling", "Venture Capital"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/95"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary text-lg px-4 py-2">
                🤝 Meet Your Co-founder
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Find the Perfect{" "}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  Co-founder
                </span>{" "}
                for Your Startup
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Connect with talented entrepreneurs, industry experts, and potential co-founders to
                bring your startup vision to life.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center pt-6">
              <CofounderPostDialog>
                <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                  Post Your Requirement
                </Button>
              </CofounderPostDialog>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate('/startup-directory')}
              >
                Browse Profiles
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Our platform makes it easy to find and connect with potential co-founders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">1. Post Your Requirement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Describe the skills, experience, and qualities you're looking for in a co-founder.
                </p>
                <CofounderPostDialog>
                  <Button variant="outline" className="w-full">
                    Post Now
                  </Button>
                </CofounderPostDialog>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">2. Browse Profiles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Explore a diverse pool of talented individuals with various backgrounds and expertise.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/startup-directory')}
                >
                  Browse Now
                </Button>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">3. Connect & Collaborate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Reach out to potential co-founders, share your vision, and start building your dream
                  startup together.
                </p>
                <Button variant="outline" className="w-full" disabled>
                  Connect Now (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <Card className="p-12 bg-card-gradient border-border text-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Take Your Startup to the{" "}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  Next Level?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Find the perfect co-founder and unlock the full potential of your startup. Join our
                community of ambitious entrepreneurs today!
              </p>

              <div className="flex flex-col md:flex-row gap-4 justify-center pt-6">
                <ApplicationDialog>
                  <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                    Get Started Today
                  </Button>
                </ApplicationDialog>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6"
                  onClick={() => navigate('/success-stories')}
                >
                  Success Stories
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Co-founder Listings Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Featured Co-founder Requirements</h2>
            <p className="text-xl text-muted-foreground">
              Explore the latest co-founder opportunities from promising startups
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cofounderPosts.map((post) => (
              <Card key={post.id} className="bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>
                    Posted {post.posted} • {post.applications} applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{post.description}</p>
                  <div className="flex space-x-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index}>{tag}</Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button size="sm">View Applications ({post.applications})</Button>
                    <Button variant="outline" size="sm">
                      Edit Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/startup-directory')}
            >
              View and Connect
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MeetCofounder;
