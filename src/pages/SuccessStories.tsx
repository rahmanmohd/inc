
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, TrendingUp, Users, Calendar, ExternalLink, Quote } from "lucide-react";
import { Link } from "react-router-dom";

const SuccessStories = () => {
  const successStories = [
    {
      id: 1,
      startup: "TechHealth Solutions",
      founders: [
        { name: "Dr. Priya Sharma", role: "CEO", avatar: "👩‍⚕️" },
        { name: "Rajesh Kumar", role: "CTO", avatar: "👨‍💻" }
      ],
      story: "We met through the co-founder matching platform in January 2023. Priya had the healthcare expertise and vision, while I brought the technical skills. Together, we've built an AI-powered diagnostic platform that's now helping 10,000+ patients.",
      metrics: {
        funding: "₹5Cr raised",
        users: "10,000+ patients",
        growth: "400% YoY",
        team: "25 employees"
      },
      founded: "2023",
      sector: "HealthTech",
      testimonial: "The platform didn't just help us find each other - it helped us build a structured approach to co-founder collaboration from day one.",
      website: "https://techhealth.com"
    },
    {
      id: 2,
      startup: "EduTech Innovations",
      founders: [
        { name: "Anita Singh", role: "CEO", avatar: "👩‍💼" },
        { name: "Vikram Patel", role: "CTO", avatar: "👨‍💻" }
      ],
      story: "After months of searching for the right technical co-founder, I found Vikram through the platform. His passion for education technology matched perfectly with my vision for transforming rural education in India.",
      metrics: {
        funding: "₹2Cr raised",
        users: "50,000+ students",
        growth: "600% YoY",
        team: "15 employees"
      },
      founded: "2022",
      sector: "EdTech",
      testimonial: "The structured matching process helped us align on vision, equity, and responsibilities before we even met in person.",
      website: "https://edutech.com"
    },
    {
      id: 3,
      startup: "GreenTech Solutions",
      founders: [
        { name: "Amit Gupta", role: "CEO", avatar: "👨‍💼" },
        { name: "Kavya Reddy", role: "CTO", avatar: "👩‍💻" }
      ],
      story: "We connected through the platform's sustainability-focused matching algorithm. Our shared passion for environmental impact and complementary skills in business and technology created the perfect partnership.",
      metrics: {
        funding: "₹8Cr raised",
        users: "1,000+ businesses",
        growth: "300% YoY",
        team: "30 employees"
      },
      founded: "2021",
      sector: "CleanTech",
      testimonial: "The platform's focus on values alignment was crucial. We weren't just looking for skills - we needed someone who shared our mission.",
      website: "https://greentech.com"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Header */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-4">
            Success Stories
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Real stories from entrepreneurs who found their perfect co-founder match and built successful startups together.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">200+</div>
              <p className="text-sm text-muted-foreground">Successful Matches</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">₹100Cr+</div>
              <p className="text-sm text-muted-foreground">Total Funding Raised</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="space-y-12">
          {successStories.map((story) => (
            <Card key={story.id} className="bg-card-gradient border-border overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-orange-400/5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{story.startup}</CardTitle>
                    <CardDescription className="text-lg">
                      Founded in {story.founded} • {story.sector}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {story.sector}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Story */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-start space-x-4">
                      <Quote className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <p className="text-muted-foreground italic text-lg leading-relaxed">
                        "{story.story}"
                      </p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Testimonial</p>
                      <p className="font-medium">"{story.testimonial}"</p>
                    </div>

                    {/* Founders */}
                    <div>
                      <h4 className="font-semibold mb-4">Meet the Co-founders</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {story.founders.map((founder, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <div className="text-2xl">{founder.avatar}</div>
                            <div>
                              <h5 className="font-medium">{founder.name}</h5>
                              <p className="text-sm text-muted-foreground">{founder.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-4">Key Metrics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-primary/5 rounded-lg">
                          <TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary" />
                          <div className="font-bold text-primary">{story.metrics.funding}</div>
                          <div className="text-xs text-muted-foreground">Funding</div>
                        </div>
                        <div className="text-center p-3 bg-primary/5 rounded-lg">
                          <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
                          <div className="font-bold text-primary">{story.metrics.users}</div>
                          <div className="text-xs text-muted-foreground">Users</div>
                        </div>
                        <div className="text-center p-3 bg-primary/5 rounded-lg">
                          <Star className="h-5 w-5 mx-auto mb-1 text-primary" />
                          <div className="font-bold text-primary">{story.metrics.growth}</div>
                          <div className="text-xs text-muted-foreground">Growth</div>
                        </div>
                        <div className="text-center p-3 bg-primary/5 rounded-lg">
                          <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
                          <div className="font-bold text-primary">{story.metrics.team}</div>
                          <div className="text-xs text-muted-foreground">Team</div>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full" variant="outline" onClick={() => window.open(story.website, '_blank')}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit Website
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 mt-16 bg-gradient-to-r from-primary/10 to-orange-400/10 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Write Your Success Story?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join these successful entrepreneurs and find your perfect co-founder match today.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow" asChild>
              <Link to="/meet-cofounder">
                Find Your Co-founder
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/startup-directory">
                Explore Startups
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SuccessStories;
