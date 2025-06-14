import React from 'react';
import { Search, Filter, Users, Trophy } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Table from '../../components/UI/Table';
import { mockPlayers, mockSchedules, mockEvents } from '../../data/mockData';

const ParticipantsView: React.FC = () => {
  const [selectedEvent] = React.useState(mockEvents[0]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [clubFilter, setClubFilter] = React.useState('all');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [genderFilter, setGenderFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');

  // Get participants for the current event
  const getEventParticipants = () => {
    const participantMap = new Map();
    
    mockSchedules.forEach(schedule => {
      schedule.participants.forEach(participant => {
        const player = mockPlayers.find(p => p.id === participant.playerId);
        if (player) {
          const key = participant.playerId;
          if (!participantMap.has(key)) {
            participantMap.set(key, {
              id: player.id,
              playerId: player.playerId,
              playerName: player.name,
              gender: player.gender,
              ageGroup: player.ageGroup,
              club: player.clubName,
              district: player.district,
              category: player.category,
              racesRegistered: [],
              status: 'not_scheduled',
              completedRaces: 0,
              totalRaces: 0
            });
          }
          
          const participantData = participantMap.get(key);
          participantData.racesRegistered.push(schedule.raceName);
          participantData.totalRaces++;
          
          if (schedule.resultsEntered && participant.status === 'completed') {
            participantData.completedRaces++;
          }
          
          // Update status
          if (schedule.resultsEntered) {
            participantData.status = 'completed';
          } else if (participantData.status !== 'completed') {
            participantData.status = 'scheduled';
          }
        }
      });
    });
    
    return Array.from(participantMap.values());
  };

  const allParticipants = getEventParticipants();

  const filteredParticipants = allParticipants.filter(participant => {
    const matchesSearch = participant.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         participant.club.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClub = clubFilter === 'all' || participant.club === clubFilter;
    const matchesCategory = categoryFilter === 'all' || participant.category === categoryFilter;
    const matchesGender = genderFilter === 'all' || participant.gender === genderFilter;
    const matchesStatus = statusFilter === 'all' || participant.status === statusFilter;
    
    return matchesSearch && matchesClub && matchesCategory && matchesGender && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'scheduled': return 'info';
      case 'not_scheduled': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'scheduled': return 'Scheduled';
      case 'not_scheduled': return 'Not Scheduled';
      default: return status;
    }
  };

  const viewPlayerResults = (playerId: string) => {
    // Implementation to view individual player results
    console.log('Viewing results for player:', playerId);
    alert('Player results view would be implemented here');
  };

  const columns = [
    { key: 'playerId', label: 'Player ID', sortable: true },
    { key: 'playerName', label: 'Player Name', sortable: true },
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
    { key: 'ageGroup', label: 'Age Group', sortable: true },
    { key: 'club', label: 'Club', sortable: true },
    { key: 'district', label: 'District', sortable: true },
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
    { 
      key: 'racesRegistered', 
      label: 'Races Registered',
      render: (value: string[]) => value.length
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (value: string) => (
        <Badge variant={getStatusColor(value) as any} size="sm">
          {getStatusLabel(value)}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, participant: any) => (
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant="primary" 
            onClick={() => viewPlayerResults(participant.id)}
            title="View Results"
          >
            <Trophy size={16} />
          </Button>
        </div>
      )
    }
  ];

  const uniqueClubs = [...new Set(allParticipants.map(p => p.club))];
  const uniqueCategories = [...new Set(allParticipants.map(p => p.category))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Event Participants</h1>
        <p className="text-gray-600 mt-1">View and manage all participants for {selectedEvent.name}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Participants</p>
              <p className="text-2xl font-bold text-gray-900">{allParticipants.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Trophy className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {allParticipants.filter(p => p.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Users className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">
                {allParticipants.filter(p => p.status === 'scheduled').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <Users className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Not Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">
                {allParticipants.filter(p => p.status === 'not_scheduled').length}
              </p>
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
              placeholder="Search participants by name or club..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Club</label>
              <select
                value={clubFilter}
                onChange={(e) => setClubFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Clubs</option>
                {uniqueClubs.map(club => (
                  <option key={club} value={club}>{club}</option>
                ))}
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
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                ))}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="scheduled">Scheduled</option>
                <option value="not_scheduled">Not Scheduled</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Participants Table */}
      <Card>
        <Table
          columns={columns}
          data={filteredParticipants}
        />
      </Card>
    </div>
  );
};

export default ParticipantsView;