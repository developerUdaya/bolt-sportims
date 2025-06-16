import React, { useEffect, useMemo } from 'react';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import ClubModal from '../../components/Users/ClubModal';
import { Club } from '../../types';
import { useClubs } from '../../context/ClubContext';
import axios from 'axios';
import Badge from '../../components/UI/Badge';
import { exportToExcel } from '../../ExportToExcel/ExportToExcel';

const clubsData: React.FC = () => {

  const { clubs, fetchClubs } = useClubs();
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const [clubsData, setclubsData] = React.useState<any>(clubs);
  const [sortBy, setSortBy] = React.useState<string>('');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [showModal, setShowModal] = React.useState(false);
  const [selectedClub, setSelectedClub] = React.useState<Club | null>(null);
  const [modalMode, setModalMode] = React.useState<'create' | 'edit' | 'view'>('create');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }

    const sorted = [...clubsData].sort((a, b) => {
      const aValue = a[key as keyof Club];
      const bValue = b[key as keyof Club];

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setclubsData(sorted);
  };
  useEffect(() => {
    setclubsData(clubs);
  }, [clubs, fetchClubs]);

  const handleSearch = (query: string) => {
    const filtered = clubs
      .filter((c: any) => c.approved)
      .filter((club: any) =>
        club.name.toLowerCase().includes(query.toLowerCase()) ||
        club.email.toLowerCase().includes(query.toLowerCase()) ||
        club.clubId.toLowerCase().includes(query.toLowerCase()) ||
        club.contactPerson.toLowerCase().includes(query.toLowerCase())
      );
    setclubsData(filtered);
  };

  const handleCreateClub = () => {
    setSelectedClub(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleViewClub = (club: Club) => {
    console.log(club, 'club view');

    setSelectedClub(club);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEditClub = (club: Club) => {
    setSelectedClub(club);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDeleteClub = async (clubId: string) => {
    if (confirm('Are you sure you want to delete this club?')) {
      try {
        await axios.delete(`${baseURL}/clubs/${clubId}`);
        fetchClubs()
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };
  ;

  const handleSaveClub = async (clubData: any) => {
    try {
      if (modalMode === 'create') {
        await axios.post(`${baseURL}/clubs/register`, clubData);
      } else if (modalMode === 'edit' && selectedClub) {
        await axios.put(`${baseURL}/clubs/${selectedClub.id}`, clubData);
      }
      setShowModal(false);
      fetchClubs()
    } catch (error) {
      console.error('Save failed:', error);
    }
  }


  const columns = [
    { key: 'clubId', label: 'Club ID', sortable: true },
    { key: 'clubName', label: 'Club Name', sortable: true },
    { key: 'coachName', label: 'Contact Person', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'mobileNumber', label: 'Phone', sortable: true },
    {
      key: 'createdAt',
      label: 'Established',
      sortable: true
    },
    { key: 'districtName', label: 'District', sortable: true },
    { key: 'stateName', label: 'State', sortable: true },
    {
      key: 'approvalStatus',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === 'approved' ? 'success' : 'warning'} size="sm">
          {value === 'approved' ? 'Approved' : 'Pending'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_value: any, club: Club) => (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="secondary" onClick={() => handleViewClub(club)}>
            <Eye size={16} />
          </Button>
          <Button size="sm" variant="primary" onClick={() => handleEditClub(club)}>
            <Edit size={16} />
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDeleteClub(club.id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];
  // Filter players based on statusFilter
  const filteredClubs = useMemo(() => {
    if (statusFilter === 'all') return clubsData;
    return clubsData.filter((player: any) => player.approvalStatus === statusFilter);
  }, [clubsData, statusFilter]);

  return (
    <div className="space-y-6">
      <div className='flex justify-end'>
        <Button variant="secondary" onClick={() => exportToExcel(clubsData,'club_list')}>
          Export to Excel
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clubs Management</h1>
          <p className="text-gray-600 mt-1">Manage registered clubsData</p>
        </div>
        <Button variant="primary" onClick={handleCreateClub}>
          <Plus size={16} className="mr-2" />
          Add New Secretary
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{clubsData.length}</div>
            <div className="text-sm text-gray-600">Total Clubs</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {clubsData.filter((d: any) => d.approvalStatus === 'approved').length}
            </div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {clubsData.filter((d: any) => d.approvalStatus === 'pending').length}
            </div>
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
              { value: 'all', label: 'All Clubs' },
              { value: 'approved', label: 'Approved' },
              { value: 'pending', label: 'Pending' },
            ].map((status) => (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${statusFilter === status.value
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
          data={filteredClubs}
          searchable
          searchPlaceholder="Search clubsData..."
          onSearch={handleSearch}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      </Card>

      <ClubModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveClub}
        club={selectedClub}
        mode={modalMode}
      />
    </div>
  );
};

export default clubsData;