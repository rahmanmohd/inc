
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Award, ExternalLink, MapPin, Calendar } from "lucide-react";

const SuccessStories = () => {
  const successStories = [
    {
      id: 1,
      company: "HealthTech Solutions",
      founders: ["Dr. Priya Sharma", "Rajesh Kumar"],
      program: "Incubation Program",
      year: "2022",
      sector: "HealthTech",
      location: "Bangalore",
      description: "AI-powered diagnostic platform serving 50,000+ patients across rural India",
      metrics: {
        funding: "₹15 Cr",
        users: "50,000+",
        revenue: "₹5 Cr ARR",
        employees: "45"
      },
      achievements: [
        "Won National Healthcare Innovation Award 2023",
        "Featured in Forbes 30 Under 30",
        "Partnered with 100+ healthcare centers"
      ],
      logo: "🏥",
      website: "healthtechsolutions.com"
    },
    {
      id: 2,
      company: "EduLearn Platform",
      founders: ["Anita Singh", "Vikram Patel"],
      program: "MVP Lab",
      year: "2023",
      sector: "EdTech",
      location: "Mumbai",
      description: "Personalized learning platform using AI to improve K-12 education outcomes",
      metrics: {
        funding: "₹8 Cr",
        users: "100,000+",
        revenue: "₹2 Cr ARR",
        employees: "28"
      },
      achievements: [
        "Reduced learning gaps by 40%",
        "Partnership with 200+ schools",
        "Winner of EdTech Innovation Challenge 2023"
      ],
      logo: "📚",
      website: "edulearn.in"
    },
    {
      id: 3,
      company: "GreenTech Innovations",
      founders: ["Arjun Reddy"],
      program: "Hackathon Winner → Incubation",
      year: "2021",
      sector: "CleanTech",
      location: "Hyderabad",
      description: "Renewable energy solutions for residential and commercial properties",
      metrics: {
        funding: "₹25 Cr",
        users: "10,000+",
        revenue: "₹12 Cr ARR",
        employees: "60"
      },
      achievements: [
        "Installed solar systems in 500+ homes",
        "Reduced carbon footprint by 10,000 tons",
        "Government partnership for rural electrification"
      ],
      logo: "🌱",
      website: "greentech.co.in"
    }
  ];

  const programStats = [
    { program: "Incubation Program", startups: 156, funding: "₹450 Cr", successRate: "78%" },
    { program: "MVP Lab", startups: 89, funding: "₹180 Cr", successRate: "85%" },
    { program: "Hackathons", startups: 234, funding: "₹120 Cr", successRate: "65%" },
    { program: "INC Lab", startups: 67, funding: "₹280 Cr", successRate: "82%" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Breadcrumbs />
      
      <main className="container mx-auto px-4 pb-12">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-4">
            Success Stories
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover how Inc Combinator has helped transform innovative ideas into successful businesses that are making a real impact.
          </p>
        </section>

        {/* Program Statistics */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {programStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{stat.program}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">{stat.startups}</div>
                  <p className="text-sm text-muted-foreground">Startups</p>
                  <div className="text-xl font-bold text-green-600">{stat.funding}</div>
                  <p className="text-sm text-muted-foreground">Total Funding</p>
                  <Badge variant="secondary">{stat.successRate} Success Rate</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Success Stories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Success Stories</h2>
          <div className="space-y-8">
            {successStories.map((story) => (
              <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{story.logo}</div>
                      <div>
                        <CardTitle className="text-2xl">{story.company}</CardTitle>
                        <CardDescription className="text-lg">
                          Founded by {story.founders.join(" & ")}
                        </CardDescription>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline">{story.program}</Badge>
                          <Badge variant="secondary">{story.sector}</Badge>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{story.year}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{story.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground text-lg">{story.description}</p>
                  
                  {/* Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/50 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{story.metrics.funding}</div>
                      <p className="text-sm text-muted-foreground">Funding Raised</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{story.metrics.users}</div>
                      <p className="text-sm text-muted-foreground">Users</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{story.metrics.revenue}</div>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{story.metrics.employees}</div>
                      <p className="text-sm text-muted-foreground">Employees</p>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center space-x-2">
                      <Award className="h-4 w-4 text-primary" />
                      <span>Key Achievements</span>
                    </h4>
                    <ul className="space-y-2">
                      {story.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full shrink-0"></div>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 bg-gradient-to-r from-primary/10 to-orange-400/10 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Write Your Success Story?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of successful entrepreneurs who have built amazing companies with Inc Combinator's support.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
              Apply Now
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default SuccessStories;
