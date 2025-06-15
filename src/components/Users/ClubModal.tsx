import React, { useEffect } from 'react';
import { Save } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import FormField from '../UI/FormField';
import { useLocation } from '../../context/LocationContext';
import ImageUpload from '../UI/ImageUpload';

interface Club {
  clubId?: string;
  stateId: number;
  districtId: number;
  clubName: string;
  coachName: string;
  mobileNumber: string;
  email: string;
  password?: string;
  societyCertificateNumber: string;
  aadharNumber: string;
  certificateUrl: string;
  address: string;
  approvalStatus?: 'approved' | 'pending';
}

interface ClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (club: Partial<Club>) => void;
  club?: any;
  mode: 'create' | 'edit' | 'view';
}

const ClubModal: React.FC<ClubModalProps> = ({ isOpen, onClose, onSave, club, mode }) => {

  const { states, districts, loading } = useLocation();

  const [formData, setFormData] = React.useState<Partial<Club>>({
    clubName: '',
    stateId: undefined,
    districtId: undefined,
    coachName: '',
    mobileNumber: '',
    email: '',
    password: '',
    societyCertificateNumber: '',
    aadharNumber: '',
    certificateUrl: '',
    address: '',
    approvalStatus: 'pending',
  });

  useEffect(() => {
    if (club && mode !== 'create' && isOpen) {
      // Populate formData with club data for edit/view modes
      setFormData({
        clubId: club.clubId,
        clubName: club.clubName || '',
        stateId: club.stateId || undefined,
        districtId: club.districtId || undefined,
        coachName: club.coachName || '',
        mobileNumber: club.mobileNumber || '',
        email: club.email || '',
        password: club.password || '',
        societyCertificateNumber: club.societyCertificateNumber || '',
        aadharNumber: club.aadharNumber || '',
        certificateUrl: club.certificateUrl || '',
        address: club.address || '',
        approvalStatus: club.approvalStatus || 'pending',
      });
    } else if (isOpen) {
      // Reset formData for create mode
      setFormData({
        clubName: '',
        stateId: undefined,
        districtId: undefined,
        coachName: '',
        mobileNumber: '',
        email: '',
        password: '',
        societyCertificateNumber: '',
        aadharNumber: '',
        certificateUrl: '',
        address: '',
        approvalStatus: 'pending',
      });
    }
    console.log('FormData after useEffect:', formData); // Debug formData
  }, [club, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clubData: Partial<Club> = {
      ...formData,
      clubId: formData.clubId || `C${Date.now()}`, // Generate clubId for create mode
    };
    console.log('Submitting clubData:', clubData); // Debug submitted data
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
              value={formData.clubName || ''}
              onChange={(e) => setFormData({ ...formData, clubName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter club name"
              required
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Coach Name" required>
            <input
              type="text"
              value={formData.coachName || ''}
              onChange={(e) => setFormData({ ...formData, coachName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter coach name"
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

          <FormField label="Mobile Number" required>
            <input
              type="tel"
              value={formData.mobileNumber || ''}
              onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter mobile number"
              required
              readOnly={isReadOnly}
            />
          </FormField>

          {mode === 'create' && (
            <FormField label="Password" required>
              <input
                type="password"
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password"
                required
                readOnly={isReadOnly}
              />
            </FormField>
          )}

          <FormField label="Society Certificate Number" required>
            <input
              type="text"
              value={formData.societyCertificateNumber || ''}
              onChange={(e) => setFormData({ ...formData, societyCertificateNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter society certificate number"
              required
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Aadhar Number" required>
            <input
              type="text"
              value={formData.aadharNumber || ''}
              onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter Aadhar number"
              required
              readOnly={isReadOnly}
            />
          </FormField>

          {/* <FormField label="Certificate URL">
            <input
              type="url"
              value={formData.certificateUrl || ''}
              onChange={(e) => setFormData({ ...formData, certificateUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter certificate URL"
              readOnly={isReadOnly}
            />
          </FormField> */}

          <ImageUpload
            label="Certificate URL"
            value={formData.certificateUrl}
            onChange={(url) => setFormData({ ...formData, certificateUrl: url })}
            readOnly={isReadOnly}
            uploadUrl="http://103.174.10.153:3011/upload/image/"
          />

          <FormField label="Address" required>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter address"
              required
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="State" required>
            <select
              value={formData.stateId || ''}
              onChange={(e) => {
                const stateId = parseInt(e.target.value);
                setFormData({ ...formData, stateId, districtId: undefined });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isReadOnly || loading}
            >
              <option value="">Select State</option>
              {states?.map((state: any) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="District" required>
            <select
              value={formData.districtId || ''}
              onChange={(e) => setFormData({ ...formData, districtId: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isReadOnly || loading || !formData.stateId}
            >
              <option value="">Select District</option>
              {districts
                ?.filter((district: any) => district.stateId === formData.stateId)
                .map((district: any) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
            </select>
          </FormField>
        </div>

        {mode !== 'view' && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="approved"
              checked={formData.approvalStatus === 'approved'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  approvalStatus: e.target.checked ? 'approved' : 'pending',
                })
              }
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