import React from 'react';
import { Edit, Trash2, Eye, Plus, FileText, CheckCircle, XCircle } from 'lucide-react';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Card from '../../components/UI/Card';
import Modal from '../../components/UI/Modal';
import FormField from '../../components/UI/FormField';
import { mockDistricts } from '../../data/mockData';
import { District } from '../../types';

const Districts: React.FC = () => {
  const [districts, setDistricts] = React.useState<District[]>(mockDistricts);
  const [filteredDistricts, setFilteredDistricts] = React.useState<District[]>(districts);
  const [sortBy, setSortBy] = React.useState<string>('');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [showModal, setShowModal] = React.useState(false);
  const [showDocumentModal, setShowDocumentModal] = React.useState(false);
  const [selectedDistrict, setSelectedDistrict] = React.useState<District | null>(null);
  const [modalMode, setModalMode] = React.useState<'create' | 'edit' | 'view'>('create');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const [formData, setFormData] = React.useState({
    name: '',
    districtCode: '',
    state: '',
    population: '',
    area: '',
    email: '',
    phone: '',
    approved: false
  });

  React.useEffect(() => {
    let filtered = districts;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(district => 
        statusFilter === 'approved' ? district.approved : !district.approved
      );
    }
    
    setFilteredDistricts(filtered);
  }, [districts, statusFilter]);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }

    const sorted = [...filteredDistricts].sort((a, b) => {
      const aValue = a[key as keyof District];
      const bValue = b[key as keyof District];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredDistricts(sorted);
  };

  const handleSearch = (query: string) => {
    let filtered = districts.filter(district =>
      district.name.toLowerCase().includes(query.toLowerCase()) ||
      district.districtCode.toLowerCase().includes(query.toLowerCase()) ||
      district.state.toLowerCase().includes(query.toLowerCase()) ||
      district.email.toLowerCase().includes(query.toLowerCase())
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(district => 
        statusFilter === 'approved' ? district.approved : !district.approved
      );
    }

    setFilteredDistricts(filtered);
  };

  const handleCreateDistrict = () => {
    setSelectedDistrict(null);
    setModalMode('create');
    setFormData({
      name: '',
      districtCode: '',
      state: '',
      population: '',
      area: '',
      email: '',
      phone: '',
      approved: false
    });
    setShowModal(true);
  };

  const handleViewDistrict = (district: District) => {
    setSelectedDistrict(district);
    setModalMode('view');
    setFormData({
      name: district.name,
      districtCode: district.districtCode,
      state: district.state,
      population: district.population.toString(),
      area: district.area.toString(),
      email: district.email,
      phone: district.phone,
      approved: district.approved
    });
    setShowModal(true);
  };

  const handleEditDistrict = (district: District) => {
    setSelectedDistrict(district);
    setModalMode('edit');
    setFormData({
      name: district.name,
      districtCode: district.districtCode,
      state: district.state,
      population: district.population.toString(),
      area: district.area.toString(),
      email: district.email,
      phone: district.phone,
      approved: district.approved
    });
    setShowModal(true);
  };

  const handleDeleteDistrict = (districtId: string) => {
    if (confirm('Are you sure you want to delete this district?')) {
      setDistricts(prev => prev.filter(d => d.id !== districtId));
    }
  };

  const handleApproveDistrict = (districtId: string) => {
    setDistricts(prev => prev.map(d => 
      d.id === districtId ? { ...d, approved: true } : d
    ));
  };

  const handleRejectDistrict = (districtId: string) => {
    if (confirm('Are you sure you want to reject this district registration?')) {
      setDistricts(prev => prev.filter(d => d.id !== districtId));
    }
  };

  const handleViewDocuments = (district: District) => {
    setSelectedDistrict(district);
    setShowDocumentModal(true);
  };

  const handleSaveDistrict = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modalMode === 'create') {
      const newDistrict: District = {
        id: `D${Date.now()}`,
        districtId: `D${Date.now()}`,
        name: formData.name,
        districtCode: formData.districtCode,
        state: formData.state,
        population: parseInt(formData.population) || 0,
        area: parseInt(formData.area) || 0,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: new Date().toISOString().split('T')[0],
        gender: 'other',
        approved: formData.approved,
        createdAt: new Date().toISOString()
      };
      setDistricts(prev => [...prev, newDistrict]);
    } else if (modalMode === 'edit' && selectedDistrict) {
      setDistricts(prev => prev.map(d => 
        d.id === selectedDistrict.id ? {
          ...d,
          name: formData.name,
          districtCode: formData.districtCode,
          state: formData.state,
          population: parseInt(formData.population) || 0,
          area: parseInt(formData.area) || 0,
          email: formData.email,
          phone: formData.phone,
          approved: formData.approved
        } : d
      ));
    }
    
    setShowModal(false);
  };

  const columns = [
    { key: 'districtCode', label: 'District Code', sortable: true },
    { key: 'name', label: 'District Name', sortable: true },
    { key: 'state', label: 'State', sortable: true },
    { 
      key: 'population', 
      label: 'Population', 
      sortable: true,
      render: (value: number) => value.toLocaleString()
    },
    { 
      key: 'area', 
      label: 'Area (sq km)', 
      sortable: true,
      render: (value: number) => value.toLocaleString()
    },
    { key: 'email', label: 'Email', sortable: true },
    { 
      key: 'approved', 
      label: 'Status', 
      sortable: true,
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'warning'} size="sm">
          {value ? 'Approved' : 'Pending'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, district: District) => (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="secondary" onClick={() => handleViewDistrict(district)} title="View Details">
            <Eye size={16} />
          </Button>
          <Button size="sm" variant="primary" onClick={() => handleEditDistrict(district)} title="Edit District">
            <Edit size={16} />
          </Button>
          <Button size="sm" variant="secondary" onClick={() => handleViewDocuments(district)} title="View Documents">
            <FileText size={16} />
          </Button>
          {!district.approved && (
            <>
              <Button size="sm" variant="success" onClick={() => handleApproveDistrict(district.id)} title="Approve">
                <CheckCircle size={16} />
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleRejectDistrict(district.id)} title="Reject">
                <XCircle size={16} />
              </Button>
            </>
          )}
          <Button size="sm" variant="danger" onClick={() => handleDeleteDistrict(district.id)} title="Delete">
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  const isReadOnly = modalMode === 'view';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Districts Management</h1>
          <p className="text-gray-600 mt-1">Manage district registrations and approvals</p>
        </div>
        <Button variant="primary" onClick={handleCreateDistrict}>
          <Plus size={16} className="mr-2" />
          Add New District
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{districts.length}</div>
            <div className="text-sm text-gray-600">Total Districts</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{districts.filter(d => d.approved).length}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{districts.filter(d => !d.approved).length}</div>
            <div className="text-sm text-gray-600">Pending Approval</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
          <div className="flex space-x-2">
            {[
              { value: 'all', label: 'All Districts' },
              { value: 'approved', label: 'Approved' },
              { value: 'pending', label: 'Pending' }
            ].map(status => (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === status.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <Table
          columns={columns}
          data={filteredDistricts}
          searchable
          searchPlaceholder="Search districts..."
          onSearch={handleSearch}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      </Card>

      {/* Create/Edit/View Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${modalMode === 'create' ? 'Add New' : modalMode === 'edit' ? 'Edit' : 'View'} District`}
        size="xl"
      >
        <form onSubmit={handleSaveDistrict} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="District Name" required>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter district name"
                required
                readOnly={isReadOnly}
              />
            </FormField>

            <FormField label="District Code" required>
              <input
                type="text"
                value={formData.districtCode}
                onChange={(e) => setFormData({ ...formData, districtCode: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter district code"
                required
                readOnly={isReadOnly}
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
                readOnly={isReadOnly}
              />
            </FormField>

            <FormField label="Population">
              <input
                type="number"
                value={formData.population}
                onChange={(e) => setFormData({ ...formData, population: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter population"
                readOnly={isReadOnly}
              />
            </FormField>

            <FormField label="Area (sq km)">
              <input
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter area"
                readOnly={isReadOnly}
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
                readOnly={isReadOnly}
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
                readOnly={isReadOnly}
              />
            </FormField>
          </div>

          {modalMode !== 'view' && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="approved"
                checked={formData.approved}
                onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="approved" className="ml-2 text-sm text-gray-700">
                Approve district registration
              </label>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              {modalMode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {modalMode !== 'view' && (
              <Button type="submit">
                {modalMode === 'create' ? 'Create District' : 'Update District'}
              </Button>
            )}
          </div>
        </form>
      </Modal>

      {/* Documents Modal */}
      <Modal
        isOpen={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        title={`Documents - ${selectedDistrict?.name}`}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Authorization Letter</h4>
              <div className="text-sm text-gray-600 mb-3">Official district authorization document</div>
              <Button size="sm" variant="secondary">
                <FileText size={16} className="mr-2" />
                View Document
              </Button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Sports Policy</h4>
              <div className="text-sm text-gray-600 mb-3">District sports policy document</div>
              <Button size="sm" variant="secondary">
                <FileText size={16} className="mr-2" />
                View Document
              </Button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Facilities List</h4>
              <div className="text-sm text-gray-600 mb-3">List of sports facilities in district</div>
              <Button size="sm" variant="secondary">
                <FileText size={16} className="mr-2" />
                View Document
              </Button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Contact Authorization</h4>
              <div className="text-sm text-gray-600 mb-3">Contact person identification</div>
              <Button size="sm" variant="secondary">
                <FileText size={16} className="mr-2" />
                View Document
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowDocumentModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Districts;