import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  FileText,
  TrendingUp,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import CreateBlogModal from './CreateBlogModal'
import { BlogPost } from '@/services/investorDashboardService'

interface BlogManagementProps {
  blogPosts: BlogPost[];
  loading: boolean;
  onRefresh: () => void;
  onCreateBlog: (blog: Partial<BlogPost>) => Promise<boolean>;
  onUpdateBlog: (id: string, updates: Partial<BlogPost>) => Promise<boolean>;
  onDeleteBlog: (id: string) => Promise<boolean>;
}

export default function BlogManagement({
  blogPosts,
  loading,
  onRefresh,
  onCreateBlog,
  onUpdateBlog,
  onDeleteBlog
}: BlogManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [isCreateBlogModalOpen, setIsCreateBlogModalOpen] = useState(false)
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [publishing, setPublishing] = useState<string | null>(null)

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate blog metrics
  const totalViews = blogPosts.reduce((sum, post) => sum + (post.views || 0), 0);
  const publishedPosts = blogPosts.filter(post => post.published).length;
  const thisMonthPosts = blogPosts.filter(post => {
    const postDate = new Date(post.created_at);
    const currentDate = new Date();
    return postDate.getMonth() === currentDate.getMonth() && 
           postDate.getFullYear() === currentDate.getFullYear();
  }).length;
  const avgReads = publishedPosts > 0 ? Math.round(totalViews / publishedPosts) : 0;

  const filteredPosts = blogPosts.filter(post => {
    const authorName = post.author ? `${post.author.first_name} ${post.author.last_name}` : 'Unknown';
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         authorName.toLowerCase().includes(searchTerm.toLowerCase());
    const postStatus = post.published ? 'Published' : 'Draft';
    const matchesStatus = statusFilter === 'all' || postStatus === statusFilter;
    const postCategory = post.tags?.[0] || 'Uncategorized';
    const matchesCategory = categoryFilter === 'all' || postCategory === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Event handlers
  const handlePublishPost = async (postId: string) => {
    setPublishing(postId);
    try {
      await onUpdateBlog(postId, { 
        published: true, 
        published_at: new Date().toISOString() 
      });
      toast.success('Blog post published successfully!');
    } catch (error) {
      console.error('Error publishing post:', error);
      toast.error('Failed to publish blog post');
    } finally {
      setPublishing(null);
    }
  };

  const handleDeletePost = async () => {
    if (!deletingPost) return;

    setDeleting(true);
    try {
      await onDeleteBlog(deletingPost.id);
      toast.success('Blog post deleted successfully!');
      setDeletingPost(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete blog post');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (published: boolean) => {
    if (published) {
      return <Badge className="bg-orange-600">Published</Badge>
    } else {
      return <Badge variant="secondary" className="bg-gray-700 text-gray-300">Draft</Badge>
    }
  }



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Blog Management</h2>
          <p className="text-gray-400">
            Manage blog posts and content
          </p>
        </div>
        <Button 
          className="bg-orange-600 hover:bg-orange-700"
          onClick={() => setIsCreateBlogModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Blog
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Blogs</CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{loading ? '...' : blogPosts.length}</div>
            <p className="text-xs text-gray-400">Blog posts</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{loading ? '...' : totalViews.toLocaleString()}</div>
            <p className="text-xs text-gray-400">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{loading ? '...' : thisMonthPosts}</div>
            <p className="text-xs text-gray-400">New posts</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Avg. Reads</CardTitle>
            <Eye className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{loading ? '...' : avgReads}</div>
            <p className="text-xs text-gray-400">Per post</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Published">Published</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Review">Under Review</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Market Analysis">Market Analysis</SelectItem>
            <SelectItem value="Investment Tips">Investment Tips</SelectItem>
            <SelectItem value="Portfolio Management">Portfolio Management</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Blog Posts Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Blog Posts</CardTitle>
          <p className="text-sm text-gray-400">
            {filteredPosts.length} posts found
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Title</TableHead>
                <TableHead className="text-gray-300">Category</TableHead>
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Views</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <p className="text-gray-400">Loading blog posts...</p>
                  </TableCell>
                </TableRow>
              ) : filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400 mb-2">No blog posts found</p>
                    <Button 
                      onClick={() => setIsCreateBlogModalOpen(true)}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Blog Post
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => {
                  const authorName = post.author ? `${post.author.first_name} ${post.author.last_name}` : 'Unknown';
                  const category = post.tags?.[0] || 'Uncategorized';
                  const views = post.views || 0;
                  
                  return (
                    <TableRow key={post.id} className="border-gray-700">
                      <TableCell className="font-medium text-white">{post.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                          {category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">{formatDate(post.created_at)}</TableCell>
                      <TableCell>{getStatusBadge(post.published)}</TableCell>
                      <TableCell className="text-white">{views.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {!post.published && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-gray-600 text-gray-300 hover:bg-gray-800"
                              onClick={() => handlePublishPost(post.id)}
                              disabled={publishing === post.id}
                            >
                              {publishing === post.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                'Publish'
                              )}
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-gray-600 text-red-400 hover:bg-red-900/20"
                            onClick={() => setDeletingPost(post)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Blog Modal */}
      <CreateBlogModal 
        isOpen={isCreateBlogModalOpen}
        onClose={() => setIsCreateBlogModalOpen(false)}
        onSuccess={onRefresh}
        onCreateBlog={onCreateBlog}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingPost} onOpenChange={() => setDeletingPost(null)}>
        <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete the blog post <span className="font-medium text-white">"{deletingPost?.title}"</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Post'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}