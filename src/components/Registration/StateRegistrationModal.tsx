import React from 'react';
import { Save } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import FormField from '../UI/FormField';

interface StateRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const StateRegistrationModal: React.FC<StateRegistrationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    stateCode: '',
    capital: '',
    population: '',
    area: '',
    contactPerson: '',
    designation: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: '',
    sportsPolicy: ''
  });

  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit(formData);
      alert('State registration submitted successfully! You will receive a confirmation email shortly.');
      onClose();
      // Reset form
      setFormData({
        name: '',
        stateCode: '',
        capital: '',
        population: '',
        area: '',
        contactPerson: '',
        designation: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        description: '',
        sportsPolicy: ''
      });
    } catch (error) {
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="State Registration" size="2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="State Name" required>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter state name"
              required
            />
          </FormField>

          <FormField label="State Code" required>
            <input
              type="text"
              value={formData.stateCode}
              onChange={(e) => setFormData({ ...formData, stateCode: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter state code (e.g., CA, NY)"
              maxLength={2}
              required
            />
          </FormField>

          <FormField label="Capital City" required>
            <input
              type="text"
              value={formData.capital}
              onChange={(e) => setFormData({ ...formData, capital: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter capital city"
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

          <FormField label="Designation" required>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Sports Secretary, Director"
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

        <FormField label="State Sports Department Address" required>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Enter complete sports department address"
            required
          />
        </FormField>

        <FormField label="Official Website">
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://state.gov.in"
          />
        </FormField>

        <FormField label="State Description">
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Describe the state and its sports infrastructure"
          />
        </FormField>

        <FormField label="Sports Policy Overview">
          <textarea
            value={formData.sportsPolicy}
            onChange={(e) => setFormData({ ...formData, sportsPolicy: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Describe the state's sports policy and initiatives"
          />
        </FormField>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">Required Documents</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Official state government authorization</li>
            <li>• Sports department establishment order</li>
            <li>• Contact person appointment letter</li>
            <li>• State sports policy document</li>
            <li>• List of state sports facilities and infrastructure</li>
          </ul>
          <p className="text-sm text-green-700 mt-2">
            You will be contacted to submit these documents after initial registration.
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            <Save size={16} className="mr-2" />
            Register State
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StateRegistrationModal;