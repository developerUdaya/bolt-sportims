import React from 'react';
import { Save, Upload, User, Mail, Phone, Calendar, MapPin, Award, Camera } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import FormField from '../../components/UI/FormField';
import Badge from '../../components/UI/Badge';
import { mockClubs } from '../../data/mockData';

const PlayerProfile: React.FC = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [profileData, setProfileData] = React.useState({
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    phone: '+1234567893',
    dateOfBirth: '2010-05-12',
    gender: 'female',
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    address: '123 Main Street, Apartment 4B',
    district: 'Central District',
    state: 'California',
    clubId: 'C001',
    category: 'beginner',
    emergencyContact: {
      name: 'Sarah Wilson',
      relationship: 'Mother',
      phone: '+1234567894'
    }
  });

  const [pendingChanges, setPendingChanges] = React.useState(false);

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const handleSave = () => {
    // Here you would submit the changes to the backend
    console.log('Profile updated:', profileData);
    setIsEditing(false);
    setPendingChanges(true);
    // Show success message
    alert('Profile updated successfully! Changes are pending admin approval.');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData({
          ...profileData,
          profileImage: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const selectedClub = mockClubs.find(club => club.id === profileData.clubId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal and sports profile information</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {pendingChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Changes Pending Approval
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Your profile changes have been submitted and are awaiting admin verification.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture and Basic Info */}
        <Card>
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 bg-gray-200">
                <img
                  src={profileData.profileImage}
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400';
                  }}
                />
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900">{profileData.name}</h2>
            <p className="text-gray-600">{selectedClub?.name}</p>
            <div className="flex justify-center space-x-2 mt-2">
              <Badge variant="info" size="sm">
                {profileData.category.charAt(0).toUpperCase() + profileData.category.slice(1)}
              </Badge>
              <Badge variant="default" size="sm">
                Age {calculateAge(profileData.dateOfBirth)}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <div className="lg:col-span-2">
          <Card title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Full Name" required>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly={!isEditing}
                />
              </FormField>

              <FormField label="Email Address" required>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly={!isEditing}
                />
              </FormField>

              <FormField label="Phone Number" required>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly={!isEditing}
                />
              </FormField>

              <FormField label="Date of Birth" required>
                <input
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly={!isEditing}
                />
              </FormField>

              <FormField label="Gender" required>
                <select
                  value={profileData.gender}
                  onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!isEditing}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </FormField>

              <FormField label="Skating Category" required>
                <select
                  value={profileData.category}
                  onChange={(e) => setProfileData({ ...profileData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!isEditing}
                >
                  <option value="beginner">Beginner</option>
                  <option value="fancy">Fancy</option>
                  <option value="inline">Inline</option>
                  <option value="quad">Quad</option>
                </select>
              </FormField>
            </div>

            <div className="mt-4">
              <FormField label="Address">
                <textarea
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  readOnly={!isEditing}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField label="District" required>
                <input
                  type="text"
                  value={profileData.district}
                  onChange={(e) => setProfileData({ ...profileData, district: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly={!isEditing}
                />
              </FormField>

              <FormField label="State" required>
                <input
                  type="text"
                  value={profileData.state}
                  onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly={!isEditing}
                />
              </FormField>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Club Information */}
        <Card title="Club Information">
          <div className="space-y-4">
            <FormField label="Club" required>
              <select
                value={profileData.clubId}
                onChange={(e) => setProfileData({ ...profileData, clubId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isEditing}
              >
                {mockClubs.map(club => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </select>
            </FormField>

            {selectedClub && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Club Details</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Contact: {selectedClub.contactPerson}</div>
                  <div>Phone: {selectedClub.phone}</div>
                  <div>Email: {selectedClub.email}</div>
                  <div>District: {selectedClub.district}</div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Emergency Contact */}
        <Card title="Emergency Contact">
          <div className="space-y-4">
            <FormField label="Contact Name" required>
              <input
                type="text"
                value={profileData.emergencyContact.name}
                onChange={(e) => setProfileData({
                  ...profileData,
                  emergencyContact: { ...profileData.emergencyContact, name: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly={!isEditing}
              />
            </FormField>

            <FormField label="Relationship" required>
              <input
                type="text"
                value={profileData.emergencyContact.relationship}
                onChange={(e) => setProfileData({
                  ...profileData,
                  emergencyContact: { ...profileData.emergencyContact, relationship: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly={!isEditing}
              />
            </FormField>

            <FormField label="Phone Number" required>
              <input
                type="tel"
                value={profileData.emergencyContact.phone}
                onChange={(e) => setProfileData({
                  ...profileData,
                  emergencyContact: { ...profileData.emergencyContact, phone: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly={!isEditing}
              />
            </FormField>
          </div>
        </Card>
      </div>

      {/* Document Upload Section */}
      <Card title="Documents & Certificates">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">Date of Birth Certificate</p>
              <Button size="sm" variant="secondary" disabled={!isEditing}>
                Upload Document
              </Button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">Club Membership Certificate</p>
              <Button size="sm" variant="secondary" disabled={!isEditing}>
                Upload Document
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <p>• Accepted formats: PDF, JPG, PNG (Max 5MB per file)</p>
            <p>• All document changes require admin verification</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PlayerProfile;