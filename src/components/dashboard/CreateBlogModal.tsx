import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { BlogPost } from '@/services/investorDashboardService';

interface CreateBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onCreateBlog: (blog: Partial<BlogPost>) => Promise<void>;
}

export default function CreateBlogModal({ isOpen, onClose, onSuccess, onCreateBlog }: CreateBlogModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [blogData, setBlogData] = useState({
    title: '',
    category: '',
    tags: 'fintech, investment, startup',
    excerpt: '',
    content: ''
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (publish: boolean) => {
    if (!user?.id) {
      toast.error('Please log in to create blog posts');
      return;
    }

    if (!blogData.title || !blogData.content) {
      toast.error('Please fill in title and content');
      return;
    }

    setLoading(true);
    try {
      const tagsArray = blogData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const blogPost: Partial<BlogPost> = {
        author_id: user.id,
        title: blogData.title,
        slug: generateSlug(blogData.title),
        summary: blogData.excerpt,
        content: blogData.content,
        tags: tagsArray,
        published: publish,
        published_at: publish ? new Date().toISOString() : null,
        cover_image_url: '',
        views: 0
      };

      await onCreateBlog(blogPost);
      
      toast.success(`Blog post ${publish ? 'published' : 'saved as draft'} successfully!`);
      
      // Reset form
      setBlogData({
        title: '',
        category: '',
        tags: 'fintech, investment, startup',
        excerpt: '',
        content: ''
      });
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast.error(`Failed to ${publish ? 'publish' : 'save'} blog post`);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = () => handleSubmit(true);
  const handleSaveDraft = () => handleSubmit(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Blog Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-300">Title *</Label>
            <Input
              id="title"
              placeholder="Enter blog title"
              value={blogData.title}
              onChange={(e) => setBlogData({...blogData, title: e.target.value})}
              className="bg-gray-800 border-gray-700 text-white focus:border-orange-400"
              required
            />
          </div>

          {/* Category and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-300">Category</Label>
              <Select value={blogData.category} onValueChange={(value) => setBlogData({...blogData, category: value})}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="e.g., Market Analysis" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="market-analysis">Market Analysis</SelectItem>
                  <SelectItem value="investment-tips">Investment Tips</SelectItem>
                  <SelectItem value="portfolio-management">Portfolio Management</SelectItem>
                  <SelectItem value="startup-insights">Startup Insights</SelectItem>
                  <SelectItem value="industry-trends">Industry Trends</SelectItem>
                  <SelectItem value="case-studies">Case Studies</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-gray-300">Tags</Label>
              <Input
                id="tags"
                placeholder="e.g., fintech, investment, startup"
                value={blogData.tags}
                onChange={(e) => setBlogData({...blogData, tags: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-gray-300">Excerpt</Label>
            <Textarea
              id="excerpt"
              placeholder="Brief description of the blog post..."
              value={blogData.excerpt}
              onChange={(e) => setBlogData({...blogData, excerpt: e.target.value})}
              className="bg-gray-800 border-gray-700 text-white min-h-[100px] resize-none"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-gray-300">Content *</Label>
            <Textarea
              id="content"
              placeholder="Write your blog content here..."
              value={blogData.content}
              onChange={(e) => setBlogData({...blogData, content: e.target.value})}
              className="bg-gray-800 border-gray-700 text-white min-h-[300px] resize-none"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              onClick={handlePublish}
              disabled={loading || !blogData.title || !blogData.content}
              className="bg-orange-600 hover:bg-orange-700 px-8 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Publishing...
                </>
              ) : (
                'Publish Now'
              )}
            </Button>
            <Button
              onClick={handleSaveDraft}
              disabled={loading || !blogData.title || !blogData.content}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save as Draft'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
