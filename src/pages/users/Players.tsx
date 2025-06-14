import React from 'react';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Card from '../../components/UI/Card';
import PlayerModal from '../../components/Users/PlayerModal';
import { mockPlayers } from '../../data/mockData';
import { Player } from '../../types';

const Players: React.FC = () => {
  const [players, setPlayers] = React.useState<Player[]>(mockPlayers.filter(p => p.approved));
  const [sortBy, setSortBy] = React.useState<string>('');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [showModal, setShowModal] = React.useState(false);
  const [selectedPlayer, setSelectedPlayer] = React.useState<Player | null>(null);
  const [modalMode, setModalMode] = React.useState<'create' | 'edit' | 'view'>('create');

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
    const filtered = mockPlayers
      .filter(p => p.approved)
      .filter(player =>
        player.name.toLowerCase().includes(query.toLowerCase()) ||
        player.email.toLowerCase().includes(query.toLowerCase()) ||
        player.playerId.toLowerCase().includes(query.toLowerCase()) ||
        player.clubName.toLowerCase().includes(query.toLowerCase())
      );
    setPlayers(filtered);
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
    setSelectedPlayer(player);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDeletePlayer = (playerId: string) => {
    if (confirm('Are you sure you want to delete this player?')) {
      setPlayers(prev => prev.filter(p => p.id !== playerId));
    }
  };

  const handleSavePlayer = (playerData: Partial<Player>) => {
    if (modalMode === 'create') {
      const newPlayer: Player = {
        id: `${Date.now()}`,
        ...playerData
      } as Player;
      setPlayers(prev => [...prev, newPlayer]);
    } else if (modalMode === 'edit' && selectedPlayer) {
      setPlayers(prev => prev.map(p => 
        p.id === selectedPlayer.id ? { ...p, ...playerData } : p
      ));
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
    { key: 'clubName', label: 'Club', sortable: true },
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
    { key: 'district', label: 'District', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, player: Player) => (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="secondary" onClick={() => handleViewPlayer(player)}>
            <Eye size={16} />
          </Button>
          <Button size="sm" variant="primary" onClick={() => handleEditPlayer(player)}>
            <Edit size={16} />
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDeletePlayer(player.id)}>
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