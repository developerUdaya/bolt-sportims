import React from 'react';
import { Check, X, Eye, Edit } from 'lucide-react';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Card from '../../components/UI/Card';
import { mockPlayers } from '../../data/mockData';
import { Player } from '../../types';

const PlayersApproval: React.FC = () => {
  const [pendingPlayers, setPendingPlayers] = React.useState<Player[]>(
    mockPlayers.filter(p => !p.approved)
  );

  const handleApprove = (playerId: string) => {
    setPendingPlayers(prev => prev.filter(p => p.id !== playerId));
    // In real app, would make API call to approve
  };

  const handleReject = (playerId: string) => {
    setPendingPlayers(prev => prev.filter(p => p.id !== playerId));
    // In real app, would make API call to reject
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
    { key: 'playerId', label: 'Player ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { 
      key: 'dateOfBirth', 
      label: 'Age',
      render: (value: string) => calculateAge(value)
    },
    { 
      key: 'gender', 
      label: 'Gender',
      render: (value: string) => (
        <Badge variant="info" size="sm">
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    },
    { key: 'clubName', label: 'Club' },
    { 
      key: 'category', 
      label: 'Category',
      render: (value: string) => (
        <Badge variant="default" size="sm">
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Applied Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, player: Player) => (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="secondary">
            <Eye size={16} />
          </Button>
          <Button size="sm" variant="primary">
            <Edit size={16} />
          </Button>
          <Button 
            size="sm" 
            variant="success"
            onClick={() => handleApprove(player.id)}
          >
            <Check size={16} />
          </Button>
          <Button 
            size="sm" 
            variant="danger"
            onClick={() => handleReject(player.id)}
          >
            <X size={16} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Players Pending Approval</h1>
          <p className="text-gray-600 mt-1">Review and approve player registrations</p>
        </div>
        <Badge variant="warning">
          {pendingPlayers.length} Pending
        </Badge>
      </div>

      <Card>
        <Table
          columns={columns}
          data={pendingPlayers}
          searchable
          searchPlaceholder="Search pending players..."
        />
      </Card>
    </div>
  );
};

export default PlayersApproval;