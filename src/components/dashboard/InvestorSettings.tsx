import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bell, User, Briefcase, DollarSign, Target, Settings, Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { InvestorProfile } from '@/services/investorDashboardService';

interface InvestorSettingsProps {
  investorProfile: InvestorProfile | null;
  loading: boolean;
  onUpdateProfile: (updates: Partial<InvestorProfile>) => Promise<boolean>;
}

const InvestorSettings = ({ investorProfile, loading, onUpdateProfile }: InvestorSettingsProps) => {
  const [updating, setUpdating] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    organization: '',
    bio: '',
    website: '',
    linkedin: '',
    twitter: '',
    ticket_min: '',
    ticket_max: '',
    sectors: [] as string[],
    stages: [] as string[]
  });
  const [notifications, setNotifications] = useState({
    dealAlerts: true,
    portfolioUpdates: true,
    marketInsights: false,
    emailDigest: true
  });

  useEffect(() => {
    if (investorProfile) {
      setProfileForm({
        name: investorProfile.name || '',
        organization: investorProfile.organization || '',
        bio: investorProfile.bio || '',
        website: investorProfile.website || '',
        linkedin: investorProfile.linkedin || '',
        twitter: investorProfile.twitter || '',
        ticket_min: investorProfile.ticket_min || '',
        ticket_max: investorProfile.ticket_max || '',
        sectors: investorProfile.sectors || [],
        stages: investorProfile.stages || []
      });
    }
  }, [investorProfile]);

  const handleSaveProfile = async () => {
    setUpdating(true);
    try {
      await onUpdateProfile({
        name: profileForm.name,
        organization: profileForm.organization,
        bio: profileForm.bio,
        website: profileForm.website,
        linkedin: profileForm.linkedin,
        twitter: profileForm.twitter
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleInvestmentPreferences = async () => {
    setUpdating(true);
    try {
      await onUpdateProfile({
        ticket_min: profileForm.ticket_min,
        ticket_max: profileForm.ticket_max,
        sectors: profileForm.sectors,
        stages: profileForm.stages
      });
      toast.success('Investment preferences updated successfully!');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    } finally {
      setUpdating(false);
    }
  };

  const toggleSector = (sector: string) => {
    setProfileForm(prev => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter(s => s !== sector)
        : [...prev.sectors, sector]
    }));
  };

  const toggleStage = (stage: string) => {
    setProfileForm(prev => ({
      ...prev,
      stages: prev.stages.includes(stage)
        ? prev.stages.filter(s => s !== stage)
        : [...prev.stages, stage]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Management */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <User className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded animate-pulse" />
                    <div className="h-10 bg-gray-800 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="investor-name" className="text-gray-300">Investor/Firm Name</Label>
                  <Input 
                    id="investor-name" 
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization" className="text-gray-300">Organization</Label>
                  <Input 
                    id="organization" 
                    value={profileForm.organization}
                    onChange={(e) => setProfileForm({...profileForm, organization: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-gray-300">Website</Label>
                  <Input 
                    id="website" 
                    value={profileForm.website}
                    onChange={(e) => setProfileForm({...profileForm, website: e.target.value})}
                    placeholder="https://yourwebsite.com"
                    className="bg-gray-800 border-gray-700 text-white" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="text-gray-300">LinkedIn</Label>
                    <Input 
                      id="linkedin" 
                      value={profileForm.linkedin}
                      onChange={(e) => setProfileForm({...profileForm, linkedin: e.target.value})}
                      placeholder="linkedin.com/in/username"
                      className="bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="text-gray-300">Twitter</Label>
                    <Input 
                      id="twitter" 
                      value={profileForm.twitter}
                      onChange={(e) => setProfileForm({...profileForm, twitter: e.target.value})}
                      placeholder="@username"
                      className="bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-gray-300">About</Label>
                  <Textarea 
                    id="bio" 
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                    placeholder="Tell us about your investment focus..."
                    className="bg-gray-800 border-gray-700 text-white min-h-[100px]" 
                  />
                </div>
                <Button 
                  onClick={handleSaveProfile} 
                  disabled={updating}
                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Profile'
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Investment Preferences */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Target className="h-5 w-5" />
              <span>Investment Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded animate-pulse" />
                    <div className="h-10 bg-gray-800 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label className="text-gray-300">Check Size Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input 
                      placeholder="Min (₹)"
                      value={profileForm.ticket_min}
                      onChange={(e) => setProfileForm({...profileForm, ticket_min: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white" 
                    />
                    <Input 
                      placeholder="Max (₹)"
                      value={profileForm.ticket_max}
                      onChange={(e) => setProfileForm({...profileForm, ticket_max: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Preferred Sectors</Label>
                  <div className="flex flex-wrap gap-2">
                    {['FinTech', 'HealthTech', 'EdTech', 'AI/ML', 'CleanTech', 'E-commerce', 'SaaS'].map((sector) => (
                      <Badge 
                        key={sector}
                        variant={profileForm.sectors.includes(sector) ? "default" : "secondary"}
                        className={`cursor-pointer ${
                          profileForm.sectors.includes(sector) 
                            ? 'bg-orange-600 hover:bg-orange-700' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        onClick={() => toggleSector(sector)}
                      >
                        {sector}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Investment Stages</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Growth'].map((stage) => (
                      <Badge 
                        key={stage}
                        variant={profileForm.stages.includes(stage) ? "default" : "secondary"}
                        className={`cursor-pointer ${
                          profileForm.stages.includes(stage) 
                            ? 'bg-orange-600 hover:bg-orange-700' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        onClick={() => toggleStage(stage)}
                      >
                        {stage}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button 
                  onClick={handleInvestmentPreferences} 
                  disabled={updating}
                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    'Update Preferences'
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Bell className="h-5 w-5" />
              <span>Notification Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="deal-alerts" className="text-gray-300">New Deal Alerts</Label>
              <Switch 
                id="deal-alerts" 
                checked={notifications.dealAlerts}
                onCheckedChange={(checked) => setNotifications({...notifications, dealAlerts: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="portfolio-updates" className="text-gray-300">Portfolio Updates</Label>
              <Switch 
                id="portfolio-updates" 
                checked={notifications.portfolioUpdates}
                onCheckedChange={(checked) => setNotifications({...notifications, portfolioUpdates: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="market-insights" className="text-gray-300">Market Insights</Label>
              <Switch 
                id="market-insights" 
                checked={notifications.marketInsights}
                onCheckedChange={(checked) => setNotifications({...notifications, marketInsights: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-digest" className="text-gray-300">Weekly Email Digest</Label>
              <Switch 
                id="email-digest" 
                checked={notifications.emailDigest}
                onCheckedChange={(checked) => setNotifications({...notifications, emailDigest: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Settings className="h-5 w-5" />
              <span>Account Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Account Type</Label>
              <div className="flex items-center space-x-2">
                <Badge variant="default" className="bg-orange-600">
                  {investorProfile?.published ? 'Verified Investor' : 'Pending Verification'}
                </Badge>
                <Badge variant="secondary" className="bg-gray-700 text-gray-300">Standard</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
              Change Password
            </Button>
            <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
              Download Investment History
            </Button>
            <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
              Manage Subscription
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestorSettings;