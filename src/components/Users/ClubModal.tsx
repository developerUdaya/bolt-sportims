import React from 'react';
import { Save } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import FormField from '../UI/FormField';
import { Club } from '../../types';

interface ClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (club: Partial<Club>) => void;
  club?: Club | null;
  mode: 'create' | 'edit' | 'view';
}

const ClubModal: React.FC<ClubModalProps> = ({ isOpen, onClose, onSave, club, mode }) => {
  const [formData, setFormData] = React.useState<Partial<Club>>({
    name: '',
    email: '',
    phone: '',
    contactPerson: '',
    registrationNumber: '',
    district: '',
    state: '',
    establishedYear: new Date().getFullYear(),
    approved: false
  });

  React.useEffect(() => {
    if (club && mode !== 'create') {
      setFormData(club);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        contactPerson: '',
        registrationNumber: '',
        district: '',
        state: '',
        establishedYear: new Date().getFullYear(),
        approved: false
      });
    }
  }, [club, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clubData = {
      ...formData,
      clubId: club?.clubId || `C${Date.now()}`,
      dateOfBirth: club?.dateOfBirth || new Date().toISOString().split('T')[0],
      gender: 'other' as const,
      createdAt: club?.createdAt || new Date().toISOString()
    };
    onSave(clubData);
    onClose();
  };

  const isReadOnly = mode === 'view';

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`${mode === 'create' ? 'Add New' : mode === 'edit' ? 'Edit' : 'View'} Club`}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Club Name" required>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter club name"
              required
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Registration Number" required>
            <input
              type="text"
              value={formData.registrationNumber || ''}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter registration number"
              required
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Contact Person" required>
            <input
              type="text"
              value={formData.contactPerson || ''}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter contact person name"
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

          <FormField label="Established Year" required>
            <input
              type="number"
              value={formData.establishedYear || ''}
              onChange={(e) => setFormData({ ...formData, establishedYear: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter established year"
              min="1900"
              max={new Date().getFullYear()}
              required
              readOnly={isReadOnly}
            />
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
              Approve club registration
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
              {mode === 'create' ? 'Create Club' : 'Update Club'}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default ClubModal;