import React, { useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Card from '../../components/UI/Card';
import PlayerModal from '../../components/Users/PlayerModal';
import { Player } from '../../types';

// const API_URL = 'http://103.174.10.153:3011/players/';
// const API_URL = 'https://x92kpthd-3011.inc1.devtunnels.ms/players/';
const baseURL = import.meta.env.VITE_API_BASE_URL;
const Players: React.FC = () => {
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [sortBy, setSortBy] = React.useState<string>('');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [showModal, setShowModal] = React.useState(false);
  const [selectedPlayer, setSelectedPlayer] = React.useState<Player | null>(null);
  const [modalMode, setModalMode] = React.useState<'create' | 'edit' | 'view'>('create');

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${baseURL}/players/`);
      console.log(response, "Fetched players");

      setPlayers(response.data);
    } catch (error) {
      console.error('Failed to fetch players:', error);
    }
  };

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }

    const sorted = [...players].sort((a, b) => {
      const aValue = a[key as keyof Player];
      const bValue = b[key as keyof Player];

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setPlayers(sorted);
  };

  const handleSearch = (query: string) => {
    fetchPlayers(); // Always re-fetch to reset filters
    setPlayers(prev =>
      prev.filter(player =>
        player.Name.toLowerCase().includes(query.toLowerCase()) ||
        player.Email.toLowerCase().includes(query.toLowerCase()) ||
        player.playerId.toString().toLowerCase().includes(query.toLowerCase())
        // player.clubName.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const handleCreatePlayer = () => {
    setSelectedPlayer(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleViewPlayer = (player: any) => {
    console.log('View player:', player);
    
    setSelectedPlayer(player);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEditPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDeletePlayer = async (playerId: number) => {
    if (confirm('Are you sure you want to delete this player?')) {
      try {
        await axios.delete(`${baseURL}/players/${playerId}`);
        fetchPlayers();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleSavePlayer = async (playerData: Partial<Player>) => {
    try {
      if (modalMode === 'create') {
        await axios.post(`${baseURL}/players/register`, playerData);
      } else if (modalMode === 'edit' && selectedPlayer) {
        await axios.put(`${baseURL}/players/${selectedPlayer.playerId}`, playerData);
      }
      setShowModal(false);
      fetchPlayers();
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

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

  const columns = [
    { key: 'playerId', label: 'Player ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'dob',
      label: 'Age',
      sortable: true,
      render: (value: string) => calculateAge(value)
    },
    { key: 'clubName', label: 'Club', sortable: true },
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
    { key: 'schoolName', label: 'School Name', sortable: true }, // or use ClubId if needed
    {
      key: 'skateCategory',
      label: 'Category',
      sortable: true,
      render: (value: string) => (
        <Badge variant="default" size="sm">
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    },
    { key: 'districtName', label: 'District', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (_value: any, row: Player) => (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="secondary" onClick={() => handleViewPlayer(row)}>
            <Eye size={16} />
          </Button>
          <Button size="sm" variant="primary" onClick={() => handleEditPlayer(row)}>
            <Edit size={16} />
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDeletePlayer(Number(row.playerId))}>
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Players Management</h1>
          <p className="text-gray-600 mt-1">Manage registered players</p>
        </div>
        <Button variant="primary" onClick={handleCreatePlayer}>
          <Plus size={16} className="mr-2" />
          Add New Player
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={players}
          searchable
          searchPlaceholder="Search players..."
          onSearch={handleSearch}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      </Card>

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

export default Players;
