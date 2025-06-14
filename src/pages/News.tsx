import React from 'react';
import { Plus, Edit, Trash2, Eye, Calendar, User } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import Modal from '../components/UI/Modal';
import FormField from '../components/UI/FormField';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: 'announcement' | 'event' | 'result' | 'general';
  status: 'draft' | 'published';
  publishedAt: string;
  author: string;
  imageUrl?: string;
  featured: boolean;
}

const News: React.FC = () => {
  const [newsArticles, setNewsArticles] = React.useState<NewsArticle[]>([
    {
      id: '1',
      title: 'State Championship 2024 Results Announced',
      content: 'The results for the State Championship 2024 have been officially announced. Over 200 participants from across the state competed in various categories...',
      excerpt: 'Official results for State Championship 2024 with over 200 participants competing across various categories.',
      category: 'result',
      status: 'published',
      publishedAt: '2024-12-01',
      author: 'Sports Admin',
      imageUrl: 'https://images.pexels.com/photos/163444/sport-treadmill-tor-route-163444.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: true
    },
    {
      id: '2',
      title: 'New Training Facility Opens',
      content: 'We are excited to announce the opening of our new state-of-the-art training facility. The facility includes modern equipment and professional coaching staff...',
      excerpt: 'New state-of-the-art training facility opens with modern equipment and professional coaching staff.',
      category: 'announcement',
      status: 'published',
      publishedAt: '2024-11-28',
      author: 'Facility Manager',
      featured: false
    },
    {
      id: '3',
      title: 'Upcoming Winter Cup 2024',
      content: 'Registration is now open for the Winter Cup 2024. This annual event brings together the best athletes from across the region...',
      excerpt: 'Registration opens for Winter Cup 2024, bringing together the best regional athletes.',
      category: 'event',
      status: 'draft',
      publishedAt: '2024-12-15',
      author: 'Event Coordinator',
      featured: false
    }
  ]);

  const [showModal, setShowModal] = React.useState(false);
  const [selectedArticle, setSelectedArticle] = React.useState<NewsArticle | null>(null);
  const [modalMode, setModalMode] = React.useState<'create' | 'edit' | 'view'>('create');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all');

  const [formData, setFormData] = React.useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'general' as NewsArticle['category'],
    status: 'draft' as NewsArticle['status'],
    imageUrl: '',
    featured: false
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'announcement', label: 'Announcements' },
    { value: 'event', label: 'Events' },
    { value: 'result', label: 'Results' },
    { value: 'general', label: 'General' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' }
  ];

  const filteredArticles = newsArticles.filter(article => {
    const categoryMatch = selectedCategory === 'all' || article.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || article.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const handleCreateArticle = () => {
    setSelectedArticle(null);
    setModalMode('create');
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: 'general',
      status: 'draft',
      imageUrl: '',
      featured: false
    });
    setShowModal(true);
  };

  const handleViewArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
    setModalMode('view');
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      category: article.category,
      status: article.status,
      imageUrl: article.imageUrl || '',
      featured: article.featured
    });
    setShowModal(true);
  };

  const handleEditArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
    setModalMode('edit');
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      category: article.category,
      status: article.status,
      imageUrl: article.imageUrl || '',
      featured: article.featured
    });
    setShowModal(true);
  };

  const handleDeleteArticle = (articleId: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      setNewsArticles(prev => prev.filter(article => article.id !== articleId));
    }
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modalMode === 'create') {
      const newArticle: NewsArticle = {
        id: `${Date.now()}`,
        ...formData,
        publishedAt: formData.status === 'published' 
          ? new Date().toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        author: 'Current User'
      };
      setNewsArticles(prev => [...prev, newArticle]);
    } else if (modalMode === 'edit' && selectedArticle) {
      setNewsArticles(prev => prev.map(article => 
        article.id === selectedArticle.id 
          ? { ...article, ...formData }
          : article
      ));
    }
    
    setShowModal(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'announcement': return 'info';
      case 'event': return 'warning';
      case 'result': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'published' ? 'success' : 'warning';
  };

  const isReadOnly = modalMode === 'view';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News Management</h1>
          <p className="text-gray-600 mt-1">Create and manage news articles and announcements</p>
        </div>
        <Button variant="primary" onClick={handleCreateArticle}>
          <Plus size={16} className="mr-2" />
          Create Article
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            {statuses.map(status => (
              <button
                key={status.value}
                onClick={() => setSelectedStatus(status.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedStatus === status.value
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredArticles.map(article => (
          <Card key={article.id} className="overflow-hidden">
            {article.imageUrl && (
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/163444/sport-treadmill-tor-route-163444.jpeg?auto=compress&cs=tinysrgb&w=400';
                }}
              />
            )}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Badge variant={getCategoryColor(article.category) as any} size="sm">
                    {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                  </Badge>
                  <Badge variant={getStatusColor(article.status) as any} size="sm">
                    {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                  </Badge>
                  {article.featured && (
                    <Badge variant="warning" size="sm">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <User size={12} />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar size={12} />
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="secondary" onClick={() => handleViewArticle(article)}>
                  <Eye size={14} />
                </Button>
                <Button size="sm" variant="primary" onClick={() => handleEditArticle(article)}>
                  <Edit size={14} />
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDeleteArticle(article.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first news article.
            </p>
          </div>
        </Card>
      )}

      {/* Create/Edit/View Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${modalMode === 'create' ? 'Create New' : modalMode === 'edit' ? 'Edit' : 'View'} Article`}
        size="2xl"
      >
        <form onSubmit={handleSaveArticle} className="space-y-4">
          <FormField label="Title" required>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter article title"
              required
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Excerpt" required>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="Enter brief excerpt"
              required
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Content" required>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={8}
              placeholder="Enter full article content"
              required
              readOnly={isReadOnly}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Category" required>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as NewsArticle['category'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isReadOnly}
              >
                <option value="general">General</option>
                <option value="announcement">Announcement</option>
                <option value="event">Event</option>
                <option value="result">Result</option>
              </select>
            </FormField>

            <FormField label="Status" required>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as NewsArticle['status'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isReadOnly}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </FormField>
          </div>

          <FormField label="Featured Image URL">
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter image URL"
              readOnly={isReadOnly}
            />
          </FormField>

          {modalMode !== 'view' && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                Mark as featured article
              </label>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              {modalMode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {modalMode !== 'view' && (
              <Button type="submit">
                {modalMode === 'create' ? 'Create Article' : 'Update Article'}
              </Button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default News;