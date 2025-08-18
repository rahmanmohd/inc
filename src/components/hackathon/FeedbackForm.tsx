import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Star } from "lucide-react";
import hackathonService from "@/services/hackathonService";

interface FeedbackFormProps {
  children: React.ReactNode;
  hackathonId: string;
  hackathonTitle: string;
  registrationId?: string;
}

const FeedbackForm = ({ children, hackathonId, hackathonTitle, registrationId }: FeedbackFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    rating: 0,
    feedback: "",
    suggestions: "",
    wouldRecommend: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide a rating for the hackathon",
        variant: "destructive"
      });
      return;
    }

    if (!formData.feedback.trim()) {
      toast({
        title: "Feedback Required",
        description: "Please provide your feedback about the hackathon",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const feedbackData = {
        hackathonId,
        registrationId: registrationId || "",
        rating: formData.rating,
        feedback: formData.feedback,
        suggestions: formData.suggestions,
        wouldRecommend: formData.wouldRecommend
      };

      const response = await hackathonService.submitFeedback(feedbackData);

      if (response.success) {
        toast({
          title: "Feedback Submitted Successfully! 🎉",
          description: "Thank you for your valuable feedback. It helps us improve future events.",
        });
        
        // Reset form
        setFormData({
          rating: 0,
          feedback: "",
          suggestions: "",
          wouldRecommend: false
        });
        
        setIsOpen(false);
      } else {
        toast({
          title: "Feedback Submission Failed",
          description: response.message || "Failed to submit feedback. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast({
        title: "Feedback Submission Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div onClick={() => setIsOpen(true)}>
          {children}
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
            Hackathon Feedback
          </DialogTitle>
          <p className="text-center text-muted-foreground">Share your experience with {hackathonTitle}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <Card className="p-6 bg-card-gradient border-border">
            <h3 className="text-xl font-semibold mb-4 text-primary">Overall Rating</h3>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className={`p-1 transition-colors ${
                    star <= formData.rating 
                      ? 'text-yellow-400 hover:text-yellow-500' 
                      : 'text-gray-300 hover:text-gray-400'
                  }`}
                >
                  <Star className="h-8 w-8 fill-current" />
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {formData.rating === 0 && "Click to rate"}
              {formData.rating === 1 && "Poor"}
              {formData.rating === 2 && "Fair"}
              {formData.rating === 3 && "Good"}
              {formData.rating === 4 && "Very Good"}
              {formData.rating === 5 && "Excellent"}
            </p>
          </Card>

          {/* Feedback */}
          <Card className="p-6 bg-card-gradient border-border">
            <h3 className="text-xl font-semibold mb-4 text-primary">Your Experience</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="feedback">What did you think of the hackathon? *</Label>
                <Textarea
                  id="feedback"
                  value={formData.feedback}
                  onChange={(e) => handleInputChange("feedback", e.target.value)}
                  placeholder="Share your experience, what you liked, what could be improved..."
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label htmlFor="suggestions">Suggestions for Improvement</Label>
                <Textarea
                  id="suggestions"
                  value={formData.suggestions}
                  onChange={(e) => handleInputChange("suggestions", e.target.value)}
                  placeholder="Any suggestions to make future hackathons better..."
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Recommendation */}
          <Card className="p-6 bg-card-gradient border-border">
            <h3 className="text-xl font-semibold mb-4 text-primary">Recommendation</h3>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="wouldRecommend"
                checked={formData.wouldRecommend}
                onCheckedChange={(checked) => handleInputChange("wouldRecommend", checked as boolean)}
                disabled={isLoading}
              />
              <Label htmlFor="wouldRecommend" className="text-sm leading-5">
                I would recommend this hackathon to others
              </Label>
            </div>
          </Card>

          <div className="flex gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)} 
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="hero" 
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Feedback 📝"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackForm;
