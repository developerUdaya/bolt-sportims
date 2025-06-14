import React from 'react';
import { Save } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import FormField from '../UI/FormField';

interface DistrictRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const DistrictRegistrationModal: React.FC<DistrictRegistrationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    districtCode: '',
    state: '',
    population: '',
    area: '',
    headquarters: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: ''
  });

  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit(formData);
      alert('District registration submitted successfully! You will receive a confirmation email shortly.');
      onClose();
      // Reset form
      setFormData({
        name: '',
        districtCode: '',
        state: '',
        population: '',
        area: '',
        headquarters: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        description: ''
      });
    } catch (error) {
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="District Registration" size="2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="District Name" required>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter district name"
              required
            />
          </FormField>

          <FormField label="District Code" required>
            <input
              type="text"
              value={formData.districtCode}
              onChange={(e) => setFormData({ ...formData, districtCode: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter district code (e.g., CD, ND)"
              required
            />
          </FormField>

          <FormField label="State" required>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter state name"
              required
            />
          </FormField>

          <FormField label="Headquarters" required>
            <input
              type="text"
              value={formData.headquarters}
              onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter headquarters city"
              required
            />
          </FormField>

          <FormField label="Population">
            <input
              type="number"
              value={formData.population}
              onChange={(e) => setFormData({ ...formData, population: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter population"
            />
          </FormField>

          <FormField label="Area (sq km)">
            <input
              type="number"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter area in square kilometers"
            />
          </FormField>

          <FormField label="Contact Person" required>
            <input
              type="text"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter contact person name"
              required
            />
          </FormField>

          <FormField label="Email Address" required>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email address"
              required
            />
          </FormField>

          <FormField label="Phone Number" required>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter phone number"
              required
            />
          </FormField>
        </div>

        <FormField label="District Office Address" required>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Enter complete district office address"
            required
          />
        </FormField>

        <FormField label="Website">
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://district.gov.in"
          />
        </FormField>

        <FormField label="Description">
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Describe the district and its sports activities"
          />
        </FormField>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Required Documents</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Official district authorization letter</li>
            <li>• Contact person identification and authorization</li>
            <li>• District sports policy document</li>
            <li>• List of sports facilities in the district</li>
          </ul>
          <p className="text-sm text-blue-700 mt-2">
            You will be contacted to submit these documents after initial registration.
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            <Save size={16} className="mr-2" />
            Register District
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DistrictRegistrationModal;