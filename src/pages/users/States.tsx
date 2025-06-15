import React from 'react';
import { Edit, Trash2, Eye, Plus, FileText, CheckCircle, XCircle } from 'lucide-react';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Card from '../../components/UI/Card';
import Modal from '../../components/UI/Modal';
import FormField from '../../components/UI/FormField';
import { mockStates } from '../../data/mockData';
import { State } from '../../types';

const States: React.FC = () => {
  const [states, setStates] = React.useState<State[]>(mockStates);
  const [filteredStates, setFilteredStates] = React.useState<State[]>(states);
  const [sortBy, setSortBy] = React.useState<string>('');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [showModal, setShowModal] = React.useState(false);
  const [showDocumentModal, setShowDocumentModal] = React.useState(false);
  const [selectedState, setSelectedState] = React.useState<State | null>(null);
  const [modalMode, setModalMode] = React.useState<'create' | 'edit' | 'view'>('create');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const [formData, setFormData] = React.useState({
    name: '',
    stateCode: '',
    capital: '',
    population: '',
    area: '',
    email: '',
    phone: '',
    approved: false
  });

  React.useEffect(() => {
    let filtered = states;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(state => 
        statusFilter === 'approved' ? state.approved : !state.approved
      );
    }
    
    setFilteredStates(filtered);
  }, [states, statusFilter]);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }

    const sorted = [...filteredStates].sort((a, b) => {
      const aValue = a[key as keyof State];
      const bValue = b[key as keyof State];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredStates(sorted);
  };

  const handleSearch = (query: string) => {
    let filtered = states.filter(state =>
      state.name.toLowerCase().includes(query.toLowerCase()) ||
      state.stateCode.toLowerCase().includes(query.toLowerCase()) ||
      state.capital.toLowerCase().includes(query.toLowerCase()) ||
      state.email.toLowerCase().includes(query.toLowerCase())
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(state => 
        statusFilter === 'approved' ? state.approved : !state.approved
      );
    }

    setFilteredStates(filtered);
  };

  const handleCreateState = () => {
    setSelectedState(null);
    setModalMode('create');
    setFormData({
      name: '',
      stateCode: '',
      capital: '',
      population: '',
      area: '',
      email: '',
      phone: '',
      approved: false
    });
    setShowModal(true);
  };

  const handleViewState = (state: State) => {
    setSelectedState(state);
    setModalMode('view');
    setFormData({
      name: state.name,
      stateCode: state.stateCode,
      capital: state.capital,
      population: state.population.toString(),
      area: state.area.toString(),
      email: state.email,
      phone: state.phone,
      approved: state.approved
    });
    setShowModal(true);
  };

  const handleEditState = (state: State) => {
    setSelectedState(state);
    setModalMode('edit');
    setFormData({
      name: state.name,
      stateCode: state.stateCode,
      capital: state.capital,
      population: state.population.toString(),
      area: state.area.toString(),
      email: state.email,
      phone: state.phone,
      approved: state.approved
    });
    setShowModal(true);
  };

  const handleDeleteState = (stateId: string) => {
    if (confirm('Are you sure you want to delete this state?')) {
      setStates(prev => prev.filter(s => s.id !== stateId));
    }
  };

  const handleApproveState = (stateId: string) => {
    setStates(prev => prev.map(s => 
      s.id === stateId ? { ...s, approved: true } : s
    ));
  };

  const handleRejectState = (stateId: string) => {
    if (confirm('Are you sure you want to reject this state registration?')) {
      setStates(prev => prev.filter(s => s.id !== stateId));
    }
  };

  const handleViewDocuments = (state: State) => {
    setSelectedState(state);
    setShowDocumentModal(true);
  };

  const handleSaveState = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modalMode === 'create') {
      const newState: State = {
        id: `S${Date.now()}`,
        stateId: `S${Date.now()}`,
        name: formData.name,
        stateCode: formData.stateCode,
        capital: formData.capital,
        population: parseInt(formData.population) || 0,
        area: parseInt(formData.area) || 0,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: new Date().toISOString().split('T')[0],
        gender: 'other',
        approved: formData.approved,
        createdAt: new Date().toISOString()
      };
      setStates(prev => [...prev, newState]);
    } else if (modalMode === 'edit' && selectedState) {
      setStates(prev => prev.map(s => 
        s.id === selectedState.id ? {
          ...s,
          name: formData.name,
          stateCode: formData.stateCode,
          capital: formData.capital,
          population: parseInt(formData.population) || 0,
          area: parseInt(formData.area) || 0,
          email: formData.email,
          phone: formData.phone,
          approved: formData.approved
        } : s
      ));
    }
    
    setShowModal(false);
  };

  const columns = [
    { key: 'stateCode', label: 'State Code', sortable: true },
    { key: 'name', label: 'State Name', sortable: true },
    { key: 'capital', label: 'Capital', sortable: true },
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
      render: (value: any, state: State) => (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="secondary" onClick={() => handleViewState(state)} title="View Details">
            <Eye size={16} />
          </Button>
          <Button size="sm" variant="primary" onClick={() => handleEditState(state)} title="Edit State">
            <Edit size={16} />
          </Button>
          <Button size="sm" variant="secondary" onClick={() => handleViewDocuments(state)} title="View Documents">
            <FileText size={16} />
          </Button>
          {!state.approved && (
            <>
              <Button size="sm" variant="success" onClick={() => handleApproveState(state.id)} title="Approve">
                <CheckCircle size={16} />
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleRejectState(state.id)} title="Reject">
                <XCircle size={16} />
              </Button>
            </>
          )}
          <Button size="sm" variant="danger" onClick={() => handleDeleteState(state.id)} title="Delete">
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
          <h1 className="text-2xl font-bold text-gray-900">States Management</h1>
          <p className="text-gray-600 mt-1">Manage state registrations and approvals</p>
        </div>
        <Button variant="primary" onClick={handleCreateState}>
          <Plus size={16} className="mr-2" />
          Add New State
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{states.length}</div>
            <div className="text-sm text-gray-600">Total States</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{states.filter(s => s.approved).length}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{states.filter(s => !s.approved).length}</div>
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
              { value: 'all', label: 'All States' },
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
          data={filteredStates}
          searchable
          searchPlaceholder="Search states..."
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
        title={`${modalMode === 'create' ? 'Add New' : modalMode === 'edit' ? 'Edit' : 'View'} State`}
        size="xl"
      >
        <form onSubmit={handleSaveState} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="State Name" required>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter state name"
                required
                readOnly={isReadOnly}
              />
            </FormField>

            <FormField label="State Code" required>
              <input
                type="text"
                value={formData.stateCode}
                onChange={(e) => setFormData({ ...formData, stateCode: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter state code"
                maxLength={2}
                required
                readOnly={isReadOnly}
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
                Approve state registration
              </label>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              {modalMode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {modalMode !== 'view' && (
              <Button type="submit">
                {modalMode === 'create' ? 'Create State' : 'Update State'}
              </Button>
            )}
          </div>
        </form>
      </Modal>

      {/* Documents Modal */}
      <Modal
        isOpen={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        title={`Documents - ${selectedState?.name}`}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Government Authorization</h4>
              <div className="text-sm text-gray-600 mb-3">Official state government authorization</div>
              <Button size="sm" variant="secondary">
                <FileText size={16} className="mr-2" />
                View Document
              </Button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Sports Department Order</h4>
              <div className="text-sm text-gray-600 mb-3">Sports department establishment order</div>
              <Button size="sm" variant="secondary">
                <FileText size={16} className="mr-2" />
                View Document
              </Button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Sports Policy</h4>
              <div className="text-sm text-gray-600 mb-3">State sports policy document</div>
              <Button size="sm" variant="secondary">
                <FileText size={16} className="mr-2" />
                View Document
              </Button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Infrastructure List</h4>
              <div className="text-sm text-gray-600 mb-3">State sports facilities and infrastructure</div>
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

export default States;