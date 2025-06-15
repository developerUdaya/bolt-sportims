import React from 'react';
import { Edit, Trash2, Eye, Plus, Shield, UserCheck, UserX } from 'lucide-react';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Card from '../../components/UI/Card';
import Modal from '../../components/UI/Modal';
import FormField from '../../components/UI/FormField';
import { mockAdmins } from '../../data/mockData';
import { Admin } from '../../types';

const Admins: React.FC = () => {
  const [admins, setAdmins] = React.useState<Admin[]>(mockAdmins);
  const [filteredAdmins, setFilteredAdmins] = React.useState<Admin[]>(admins);
  const [sortBy, setSortBy] = React.useState<string>('');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [showModal, setShowModal] = React.useState(false);
  const [selectedAdmin, setSelectedAdmin] = React.useState<Admin | null>(null);
  const [modalMode, setModalMode] = React.useState<'create' | 'edit' | 'view'>('create');
  const [roleFilter, setRoleFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    role: 'admin' as 'super_admin' | 'admin' | 'moderator',
    permissions: [] as string[],
    approved: false
  });

  const availablePermissions = [
    'user_management',
    'event_management',
    'results_management',
    'approval_management',
    'system_settings',
    'reports_access',
    'gallery_management',
    'news_management'
  ];

  React.useEffect(() => {
    let filtered = admins;
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(admin => admin.role === roleFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(admin => 
        statusFilter === 'approved' ? admin.approved : !admin.approved
      );
    }
    
    setFilteredAdmins(filtered);
  }, [admins, roleFilter, statusFilter]);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }

    const sorted = [...filteredAdmins].sort((a, b) => {
      const aValue = a[key as keyof Admin];
      const bValue = b[key as keyof Admin];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredAdmins(sorted);
  };

  const handleSearch = (query: string) => {
    let filtered = admins.filter(admin =>
      admin.name.toLowerCase().includes(query.toLowerCase()) ||
      admin.email.toLowerCase().includes(query.toLowerCase()) ||
      admin.adminId.toLowerCase().includes(query.toLowerCase()) ||
      admin.role.toLowerCase().includes(query.toLowerCase())
    );

    if (roleFilter !== 'all') {
      filtered = filtered.filter(admin => admin.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(admin => 
        statusFilter === 'approved' ? admin.approved : !admin.approved
      );
    }

    setFilteredAdmins(filtered);
  };

  const handleCreateAdmin = () => {
    setSelectedAdmin(null);
    setModalMode('create');
    setFormData({
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'male',
      role: 'admin',
      permissions: [],
      approved: false
    });
    setShowModal(true);
  };

  const handleViewAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    setModalMode('view');
    setFormData({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      dateOfBirth: admin.dateOfBirth,
      gender: admin.gender,
      role: admin.role,
      permissions: admin.permissions,
      approved: admin.approved
    });
    setShowModal(true);
  };

  const handleEditAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    setModalMode('edit');
    setFormData({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      dateOfBirth: admin.dateOfBirth,
      gender: admin.gender,
      role: admin.role,
      permissions: admin.permissions,
      approved: admin.approved
    });
    setShowModal(true);
  };

  const handleDeleteAdmin = (adminId: string) => {
    if (confirm('Are you sure you want to delete this admin?')) {
      setAdmins(prev => prev.filter(a => a.id !== adminId));
    }
  };

  const handleApproveAdmin = (adminId: string) => {
    setAdmins(prev => prev.map(a => 
      a.id === adminId ? { ...a, approved: true } : a
    ));
  };

  const handleRejectAdmin = (adminId: string) => {
    if (confirm('Are you sure you want to reject this admin registration?')) {
      setAdmins(prev => prev.filter(a => a.id !== adminId));
    }
  };

  const handlePermissionChange = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleSaveAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modalMode === 'create') {
      const newAdmin: Admin = {
        id: `A${Date.now()}`,
        adminId: `A${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        role: formData.role,
        permissions: formData.permissions,
        approved: formData.approved,
        createdAt: new Date().toISOString()
      };
      setAdmins(prev => [...prev, newAdmin]);
    } else if (modalMode === 'edit' && selectedAdmin) {
      setAdmins(prev => prev.map(a => 
        a.id === selectedAdmin.id ? {
          ...a,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          role: formData.role,
          permissions: formData.permissions,
          approved: formData.approved
        } : a
      ));
    }
    
    setShowModal(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'danger';
      case 'admin': return 'warning';
      case 'moderator': return 'info';
      default: return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Admin';
      case 'moderator': return 'Moderator';
      default: return role;
    }
  };

  const columns = [
    { key: 'adminId', label: 'Admin ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    { 
      key: 'role', 
      label: 'Role', 
      sortable: true,
      render: (value: string) => (
        <Badge variant={getRoleColor(value) as any} size="sm">
          {getRoleLabel(value)}
        </Badge>
      )
    },
    { 
      key: 'permissions', 
      label: 'Permissions',
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map(permission => (
            <Badge key={permission} variant="default" size="sm">
              {permission.replace('_', ' ')}
            </Badge>
          ))}
          {value.length > 2 && (
            <Badge variant="default" size="sm">
              +{value.length - 2} more
            </Badge>
          )}
        </div>
      )
    },
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
      render: (value: any, admin: Admin) => (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="secondary" onClick={() => handleViewAdmin(admin)} title="View Details">
            <Eye size={16} />
          </Button>
          <Button size="sm" variant="primary" onClick={() => handleEditAdmin(admin)} title="Edit Admin">
            <Edit size={16} />
          </Button>
          {!admin.approved && (
            <>
              <Button size="sm" variant="success" onClick={() => handleApproveAdmin(admin.id)} title="Approve">
                <UserCheck size={16} />
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleRejectAdmin(admin.id)} title="Reject">
                <UserX size={16} />
              </Button>
            </>
          )}
          <Button size="sm" variant="danger" onClick={() => handleDeleteAdmin(admin.id)} title="Delete">
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
          <h1 className="text-2xl font-bold text-gray-900">Admins Management</h1>
          <p className="text-gray-600 mt-1">Manage system administrators and their permissions</p>
        </div>
        <Button variant="primary" onClick={handleCreateAdmin}>
          <Plus size={16} className="mr-2" />
          Add New Admin
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{admins.length}</div>
            <div className="text-sm text-gray-600">Total Admins</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{admins.filter(a => a.role === 'super_admin').length}</div>
            <div className="text-sm text-gray-600">Super Admins</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{admins.filter(a => a.role === 'admin').length}</div>
            <div className="text-sm text-gray-600">Admins</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{admins.filter(a => a.role === 'moderator').length}</div>
            <div className="text-sm text-gray-600">Moderators</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Role:</span>
            <div className="flex space-x-2">
              {[
                { value: 'all', label: 'All Roles' },
                { value: 'super_admin', label: 'Super Admin' },
                { value: 'admin', label: 'Admin' },
                { value: 'moderator', label: 'Moderator' }
              ].map(role => (
                <button
                  key={role.value}
                  onClick={() => setRoleFilter(role.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    roleFilter === role.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <div className="flex space-x-2">
              {[
                { value: 'all', label: 'All Status' },
                { value: 'approved', label: 'Approved' },
                { value: 'pending', label: 'Pending' }
              ].map(status => (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === status.value
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <Table
          columns={columns}
          data={filteredAdmins}
          searchable
          searchPlaceholder="Search admins..."
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
        title={`${modalMode === 'create' ? 'Add New' : modalMode === 'edit' ? 'Edit' : 'View'} Admin`}
        size="xl"
      >
        <form onSubmit={handleSaveAdmin} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Full Name" required>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter full name"
                required
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

            <FormField label="Date of Birth" required>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                readOnly={isReadOnly}
              />
            </FormField>

            <FormField label="Gender" required>
              <select
                value={formData.gender}
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

            <FormField label="Role" required>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isReadOnly}
              >
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </FormField>
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availablePermissions.map(permission => (
                <label key={permission} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission)}
                    onChange={() => handlePermissionChange(permission)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    disabled={isReadOnly}
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {permission.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
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
                Approve admin registration
              </label>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              {modalMode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {modalMode !== 'view' && (
              <Button type="submit">
                {modalMode === 'create' ? 'Create Admin' : 'Update Admin'}
              </Button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Admins;