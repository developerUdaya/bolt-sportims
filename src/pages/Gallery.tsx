import React from 'react';
import { Plus, Edit, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Modal from '../components/UI/Modal';
import FormField from '../components/UI/FormField';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'event' | 'training' | 'competition' | 'general';
  uploadedAt: string;
  uploadedBy: string;
}

const Gallery: React.FC = () => {
  const [galleryItems, setGalleryItems] = React.useState<GalleryItem[]>([
    {
      id: '1',
      title: 'State Championship 2024',
      description: 'Winners of the annual state championship',
      imageUrl: 'https://images.pexels.com/photos/163444/sport-treadmill-tor-route-163444.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'competition',
      uploadedAt: '2024-12-01',
      uploadedBy: 'Admin'
    },
    {
      id: '2',
      title: 'Training Session',
      description: 'Daily training session at the sports complex',
      imageUrl: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'training',
      uploadedAt: '2024-11-28',
      uploadedBy: 'Coach Smith'
    },
    {
      id: '3',
      title: 'Team Building Event',
      description: 'Annual team building and sports day',
      imageUrl: 'https://images.pexels.com/photos/1263348/pexels-photo-1263348.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'event',
      uploadedAt: '2024-11-25',
      uploadedBy: 'Event Manager'
    }
  ]);

  const [showModal, setShowModal] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<GalleryItem | null>(null);
  const [modalMode, setModalMode] = React.useState<'create' | 'edit'>('create');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'general' as GalleryItem['category']
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'event', label: 'Events' },
    { value: 'training', label: 'Training' },
    { value: 'competition', label: 'Competitions' },
    { value: 'general', label: 'General' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const handleCreateItem = () => {
    setSelectedItem(null);
    setModalMode('create');
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      category: 'general'
    });
    setShowModal(true);
  };

  const handleEditItem = (item: GalleryItem) => {
    setSelectedItem(item);
    setModalMode('edit');
    setFormData({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      category: item.category
    });
    setShowModal(true);
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      setGalleryItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modalMode === 'create') {
      const newItem: GalleryItem = {
        id: `${Date.now()}`,
        ...formData,
        uploadedAt: new Date().toISOString().split('T')[0],
        uploadedBy: 'Current User'
      };
      setGalleryItems(prev => [...prev, newItem]);
    } else if (modalMode === 'edit' && selectedItem) {
      setGalleryItems(prev => prev.map(item => 
        item.id === selectedItem.id 
          ? { ...item, ...formData }
          : item
      ));
    }
    
    setShowModal(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'event': return 'bg-blue-100 text-blue-800';
      case 'training': return 'bg-green-100 text-green-800';
      case 'competition': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-600 mt-1">Manage sports event photos and media</p>
        </div>
        <Button variant="primary" onClick={handleCreateItem}>
          <Plus size={16} className="mr-2" />
          Add New Image
        </Button>
      </div>

      {/* Category Filter */}
      <Card>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map(item => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/163444/sport-treadmill-tor-route-163444.jpeg?auto=compress&cs=tinysrgb&w=400';
                }}
              />
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button size="sm" variant="secondary" onClick={() => handleEditItem(item)}>
                  <Edit size={14} />
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDeleteItem(item.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
              <div className="absolute bottom-2 left-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>By {item.uploadedBy}</span>
                <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No images found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedCategory === 'all' 
                ? 'Get started by adding your first image.'
                : `No images found in the ${selectedCategory} category.`
              }
            </p>
          </div>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${modalMode === 'create' ? 'Add New' : 'Edit'} Image`}
        size="lg"
      >
        <form onSubmit={handleSaveItem} className="space-y-4">
          <FormField label="Title" required>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter image title"
              required
            />
          </FormField>

          <FormField label="Description">
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Enter image description"
            />
          </FormField>

          <FormField label="Category" required>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as GalleryItem['category'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="general">General</option>
              <option value="event">Event</option>
              <option value="training">Training</option>
              <option value="competition">Competition</option>
            </select>
          </FormField>

          <FormField label="Image URL" required>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter image URL"
              required
            />
          </FormField>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Or click to upload image</p>
            <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {modalMode === 'create' ? 'Add Image' : 'Update Image'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Gallery;