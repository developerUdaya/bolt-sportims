import React from 'react';
import { Plus, Edit, Trash2, Eye, UserCheck, UserX, Search, Filter } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Table from '../../components/UI/Table';
import PlayerModal from '../../components/Users/PlayerModal';
import { mockPlayers } from '../../data/mockData';
import { Player } from '../../types';

const ClubPlayers: React.FC = () => {
  const currentClubId = 'C001'; // Thunder Skating Club
  const [players, setPlayers] = React.useState<Player[]>(
    mockPlayers.filter(player => player.clubId === currentClubId)
  );
  const [filteredPlayers, setFilteredPlayers] = React.useState<Player[]>(players);
  const [showModal, setShowModal] = React.useState(false);
  const [selectedPlayer, setSelectedPlayer] = React.useState<Player | null>(null);
  const [modalMode, setModalMode] = React.useState<'create' | 'edit' | 'view'>('create');
  
  // Filters
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [genderFilter, setGenderFilter] = React.useState('all');

  React.useEffect(() => {
    let filtered = players;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(player =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.playerId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'approved') {
        filtered = filtered.filter(player => player.approved);
      } else if (statusFilter === 'pending') {
        filtered = filtered.filter(player => !player.approved);
      }
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(player => player.category === categoryFilter);
    }

    // Gender filter
    if (genderFilter !== 'all') {
      filtered = filtered.filter(player => player.gender === genderFilter);
    }

    setFilteredPlayers(filtered);
  }, [players, searchQuery, statusFilter, categoryFilter, genderFilter]);

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

  const handleCreatePlayer = () => {
    setSelectedPlayer(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleViewPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEditPlayer = (player: Player) => {
    if (!player.approved) {
      setSelectedPlayer(player);
      setModalMode('edit');
      setShowModal(true);
    } else {
      alert('Cannot edit approved players. Contact admin for changes.');
    }
  };

  const handleDeletePlayer = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (player?.approved) {
      alert('Cannot delete approved players. Contact admin for removal.');
      return;
    }
    
    if (confirm('Are you sure you want to delete this player?')) {
      setPlayers(prev => prev.filter(p => p.id !== playerId));
    }
  };

  const handleSavePlayer = (playerData: Partial<Player>) => {
    if (modalMode === 'create') {
      const newPlayer: Player = {
        id: `${Date.now()}`,
        clubId: currentClubId,
        clubName: 'Thunder Skating Club',
        approved: false, // New players need admin approval
        createdAt: new Date().toISOString(),
        ...playerData
      } as Player;
      setPlayers(prev => [...prev, newPlayer]);
      alert('Player added successfully! Awaiting admin approval.');
    } else if (modalMode === 'edit' && selectedPlayer) {
      setPlayers(prev => prev.map(p => 
        p.id === selectedPlayer.id ? { ...p, ...playerData } : p
      ));
      alert('Player updated successfully!');
    }
  };

  const getStatusColor = (approved: boolean) => {
    return approved ? 'success' : 'warning';
  };

  const getStatusLabel = (approved: boolean) => {
    return approved ? 'Approved' : 'Pending';
  };

  const columns = [
    { key: 'playerId', label: 'Player ID', sortable: true },
    { key: 'name', label: 'Player Name', sortable: true },
    { 
      key: 'dateOfBirth', 
      label: 'Age', 
      sortable: true,
      render: (value: string) => calculateAge(value)
    },
    { 
      key: 'gender', 
      label: 'Gender', 
      sortable: true,
      render: (value: string) => (
        <Badge variant="info" size="sm">
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    },
    { 
      key: 'category', 
      label: 'Category', 
      sortable: true,
      render: (value: string) => (
        <Badge variant="default" size="sm">
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    },
    { key: 'ageGroup', label: 'Age Group', sortable: true },
    { 
      key: 'approved', 
      label: 'Status', 
      sortable: true,
      render: (value: boolean) => (
        <Badge variant={getStatusColor(value) as any} size="sm">
          {getStatusLabel(value)}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, player: Player) => (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="secondary" onClick={() => handleViewPlayer(player)} title="View Details">
            <Eye size={16} />
          </Button>
          <Button 
            size="sm" 
            variant="primary" 
            onClick={() => handleEditPlayer(player)} 
            title="Edit Player"
            disabled={player.approved}
          >
            <Edit size={16} />
          </Button>
          <Button 
            size="sm" 
            variant="danger" 
            onClick={() => handleDeletePlayer(player.id)} 
            title="Delete Player"
            disabled={player.approved}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  const approvedCount = players.filter(p => p.approved).length;
  const pendingCount = players.filter(p => !p.approved).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Club Players</h1>
          <p className="text-gray-600 mt-1">Manage players registered under your club</p>
        </div>
        <Button variant="primary" onClick={handleCreatePlayer}>
          <Plus size={16} className="mr-2" />
          Add New Player
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserCheck className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Players</p>
              <p className="text-2xl font-bold text-gray-900">{players.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <UserX className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Filter className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Filtered Results</p>
              <p className="text-2xl font-bold text-gray-900">{filteredPlayers.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search players by name, email, or player ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="beginner">Beginner</option>
                <option value="fancy">Fancy</option>
                <option value="inline">Inline</option>
                <option value="quad">Quad</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                  setGenderFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Players Table */}
      <Card>
        <Table
          columns={columns}
          data={filteredPlayers}
        />
      </Card>

      {/* Player Modal */}
      <PlayerModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSavePlayer}
        player={selectedPlayer}
        mode={modalMode}
      />
    </div>
  );
};

export default ClubPlayers;