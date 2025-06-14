import React from 'react';
import { Save, X } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import FormField from '../UI/FormField';
import { Player } from '../../types';
import { mockClubs } from '../../data/mockData';

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (player: Partial<Player>) => void;
  player?: Player | null;
  mode: 'create' | 'edit' | 'view';
}

const PlayerModal: React.FC<PlayerModalProps> = ({ isOpen, onClose, onSave, player, mode }) => {
  const [formData, setFormData] = React.useState<Partial<Player>>({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    clubId: '',
    category: 'beginner',
    district: '',
    state: '',
    approved: false
  });

  React.useEffect(() => {
    if (player && mode !== 'create') {
      setFormData(player);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: 'male',
        clubId: '',
        category: 'beginner',
        district: '',
        state: '',
        approved: false
      });
    }
  }, [player, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const playerData = {
      ...formData,
      playerId: player?.playerId || `P${Date.now()}`,
      clubName: mockClubs.find(c => c.id === formData.clubId)?.name || '',
      ageGroup: calculateAgeGroup(formData.dateOfBirth || ''),
      createdAt: player?.createdAt || new Date().toISOString()
    };
    onSave(playerData);
    onClose();
  };

  const calculateAgeGroup = (dateOfBirth: string) => {
    if (!dateOfBirth) return '';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age <= 6) return '4-6';
    if (age <= 9) return '7-9';
    if (age <= 12) return '10-12';
    if (age <= 15) return '13-15';
    if (age <= 18) return '16-18';
    return '19+';
  };

  const isReadOnly = mode === 'view';

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`${mode === 'create' ? 'Add New' : mode === 'edit' ? 'Edit' : 'View'} Player`}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Full Name" required>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter full name"
              required
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Email" required>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email address"
              required
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Phone Number" required>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter phone number"
              required
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Date of Birth" required>
            <input
              type="date"
              value={formData.dateOfBirth || ''}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Gender" required>
            <select
              value={formData.gender || 'male'}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isReadOnly}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </FormField>

          <FormField label="Club" required>
            <select
              value={formData.clubId || ''}
              onChange={(e) => setFormData({ ...formData, clubId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isReadOnly}
            >
              <option value="">Select a club</option>
              {mockClubs.map(club => (
                <option key={club.id} value={club.id}>{club.name}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Category" required>
            <select
              value={formData.category || 'beginner'}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isReadOnly}
            >
              <option value="beginner">Beginner</option>
              <option value="fancy">Fancy</option>
              <option value="inline">Inline</option>
              <option value="quad">Quad</option>
            </select>
          </FormField>

          <FormField label="District" required>
            <input
              type="text"
              value={formData.district || ''}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter district"
              required
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="State" required>
            <input
              type="text"
              value={formData.state || ''}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter state"
              required
              readOnly={isReadOnly}
            />
          </FormField>
        </div>

        {mode !== 'view' && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="approved"
              checked={formData.approved || false}
              onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="approved" className="ml-2 text-sm text-gray-700">
              Approve player registration
            </label>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            {mode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {mode !== 'view' && (
            <Button type="submit">
              <Save size={16} className="mr-2" />
              {mode === 'create' ? 'Create Player' : 'Update Player'}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default PlayerModal;