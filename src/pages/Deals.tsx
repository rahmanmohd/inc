import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Clock, Tag, Zap, Cloud, Mail, CreditCard, Users, Star } from "lucide-react";

const Deals = () => {
  const featuredDeals = [
    {
      id: 1,
      company: "AWS",
      title: "AWS Activate Credits",
      description: "Get up to $5,000 in AWS credits for your startup infrastructure",
      value: "$5,000",
      discount: "Free Credits",
      category: "Cloud Services",
      validUntil: "Dec 31, 2024",
      claimed: 45,
      totalSlots: 100,
      requirements: ["Startup must be < 2 years old", "First-time AWS user"],
      logo: "☁️"
    },
    {
      id: 2,
      company: "Notion",
      title: "Notion Pro for Startups",
      description: "6 months free of Notion Pro for teams up to 50 members",
      value: "$600",
      discount: "100% Off",
      category: "Productivity",
      validUntil: "Jan 15, 2025",
      claimed: 78,
      totalSlots: 150,
      requirements: ["Inc Combinator member", "Team size < 50"],
      logo: "📝"
    },
    {
      id: 3,
      company: "Stripe",
      title: "Stripe Fee Waiver",
      description: "First $20,000 in payment processing fees waived",
      value: "$500",
      discount: "Fees Waived",
      category: "Payments",
      validUntil: "Mar 31, 2025",
      claimed: 23,
      totalSlots: 75,
      requirements: ["Active startup", "New Stripe account"],
      logo: "💳"
    }
  ];

  const cloudDeals = [
    { company: "Google Cloud", offer: "$3,000 Credits", discount: "Free", logo: "🌐" },
    { company: "Microsoft Azure", offer: "$2,500 Credits", discount: "Free", logo: "🔷" },
    { company: "DigitalOcean", offer: "$200 Credits", discount: "Free", logo: "🌊" },
    { company: "Vercel", offer: "Pro Plan 6 months", discount: "100% Off", logo: "▲" }
  ];

  const saasDeals = [
    { company: "Slack", offer: "Pro Plan 3 months", discount: "100% Off", logo: "💬" },
    { company: "Figma", offer: "Professional 1 year", discount: "50% Off", logo: "🎨" },
    { company: "Calendly", offer: "Professional 6 months", discount: "100% Off", logo: "📅" },
    { company: "Mailchimp", offer: "Standard Plan 6 months", discount: "50% Off", logo: "📧" }
  ];

  const businessDeals = [
    { company: "LegalZoom", offer: "Business Formation", discount: "30% Off", logo: "⚖️" },
    { company: "QuickBooks", offer: "Simple Start 6 months", discount: "50% Off", logo: "📊" },
    { company: "Freshworks", offer: "CRM Suite 3 months", discount: "100% Off", logo: "📞" },
    { company: "HubSpot", offer: "Startup Program", discount: "90% Off", logo: "🎯" }
  ];

  const renderDealCard = (deal: any, isDetailed = false) => (
    <Card key={deal.id || deal.company} className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{deal.logo}</div>
            <div>
              <CardTitle className="text-lg">{deal.title || `${deal.company} Deal`}</CardTitle>
              <CardDescription>{deal.company}</CardDescription>
            </div>
          </div>
          <Badge variant="secondary">{deal.discount}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isDetailed && (
          <>
            <p className="text-sm text-muted-foreground">{deal.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Value:</span>
              <span className="font-bold text-primary">{deal.value}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Category:</span>
              <Badge variant="outline">{deal.category}</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Claimed:</span>
                <span>{deal.claimed}/{deal.totalSlots}</span>
              </div>
              <Progress value={(deal.claimed / deal.totalSlots) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Requirements:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                {deal.requirements.map((req: string, index: number) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-primary rounded-full"></div>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Valid until {deal.validUntil}</span>
            </div>
          </>
        )}
        {!isDetailed && (
          <div className="space-y-2">
            <p className="font-medium">{deal.offer}</p>
            <Badge variant="outline" className="text-xs">{deal.discount}</Badge>
          </div>
        )}
        <Button className="w-full">
          {isDetailed ? "Claim Deal" : "View Details"}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-4">
            Exclusive Startup Deals
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Access premium tools, services, and resources at incredible discounts. Save thousands on essential startup infrastructure.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">₹25L+</div>
              <p className="text-sm text-muted-foreground">Total Value</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">150+</div>
              <p className="text-sm text-muted-foreground">Active Deals</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">2K+</div>
              <p className="text-sm text-muted-foreground">Startups Benefited</p>
            </div>
          </div>
        </section>

        {/* Featured Deals */}
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <Star className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Featured Deals</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredDeals.map((deal) => renderDealCard(deal, true))}
          </div>
        </section>

        {/* Deal Categories */}
        <Tabs defaultValue="cloud" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cloud" className="flex items-center space-x-2">
              <Cloud className="h-4 w-4" />
              <span>Cloud & Infrastructure</span>
            </TabsTrigger>
            <TabsTrigger value="saas" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>SaaS Tools</span>
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Business Services</span>
            </TabsTrigger>
            <TabsTrigger value="marketing" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Marketing & Sales</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cloud" className="space-y-6">
            <h3 className="text-2xl font-bold mb-4">Cloud & Infrastructure Deals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cloudDeals.map((deal) => renderDealCard(deal))}
            </div>
          </TabsContent>

          <TabsContent value="saas" className="space-y-6">
            <h3 className="text-2xl font-bold mb-4">SaaS Tools & Productivity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {saasDeals.map((deal) => renderDealCard(deal))}
            </div>
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            <h3 className="text-2xl font-bold mb-4">Business & Legal Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {businessDeals.map((deal) => renderDealCard(deal))}
            </div>
          </TabsContent>

          <TabsContent value="marketing" className="space-y-6">
            <h3 className="text-2xl font-bold mb-4">Marketing & Sales Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">📧</div>
                    <div>
                      <CardTitle className="text-lg">Email Marketing Suite</CardTitle>
                      <CardDescription>Mailchimp, SendGrid, ConvertKit</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-medium mb-2">Up to 6 months free</p>
                  <Badge variant="outline" className="text-xs mb-4">100% Off</Badge>
                  <Button className="w-full">View Offers</Button>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">📊</div>
                    <div>
                      <CardTitle className="text-lg">Analytics & Tracking</CardTitle>
                      <CardDescription>Google Analytics, Mixpanel, Hotjar</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-medium mb-2">Premium features</p>
                  <Badge variant="outline" className="text-xs mb-4">50% Off</Badge>
                  <Button className="w-full">View Offers</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* How It Works */}
        <section className="py-16 mt-16">
          <h2 className="text-3xl font-bold text-center mb-12">How to Access Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Apply to Inc Combinator</h3>
              <p className="text-muted-foreground">Join our accelerator program to unlock exclusive partner deals</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse & Select</h3>
              <p className="text-muted-foreground">Explore hundreds of deals tailored for startups in your stage</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Claim & Save</h3>
              <p className="text-muted-foreground">Activate deals instantly and start saving thousands on tools</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 bg-gradient-to-r from-primary/10 to-orange-400/10 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Save Thousands?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join Inc Combinator today and get instant access to our exclusive deal marketplace worth over ₹25 lakhs.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow mr-4">
            Apply Now
          </Button>
          <Button variant="outline" size="lg">
            View All Deals
          </Button>
        </section>
      </main>
    </div>
  );
};

export default Deals;