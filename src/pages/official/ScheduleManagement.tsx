import React from 'react';
import { Plus, Edit, Trash2, Eye, Clock, Users, Search } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Table from '../../components/UI/Table';
import Modal from '../../components/UI/Modal';
import FormField from '../../components/UI/FormField';
import { mockEvents, mockSchedules, mockPlayers } from '../../data/mockData';
import { Schedule, Player } from '../../types';

const ScheduleManagement: React.FC = () => {
  const [schedules, setSchedules] = React.useState<Schedule[]>(mockSchedules);
  const [showModal, setShowModal] = React.useState(false);
  const [selectedEvent] = React.useState(mockEvents[0]);
  const [modalMode, setModalMode] = React.useState<'create' | 'edit'>('create');
  const [selectedSchedule, setSelectedSchedule] = React.useState<Schedule | null>(null);
  
  const [formData, setFormData] = React.useState({
    raceId: '',
    ageGroupId: '',
    category: 'beginner' as const,
    gender: 'all' as const,
    scheduledTime: '',
    heatNumber: '',
    selectedPlayers: [] as string[]
  });

  const [playerSearch, setPlayerSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [genderFilter, setGenderFilter] = React.useState('all');

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

  const getEligiblePlayers = () => {
    if (!formData.ageGroupId || !formData.category) return [];

    const selectedAgeGroup = selectedEvent.ageGroups.find(ag => ag.id === formData.ageGroupId);
    if (!selectedAgeGroup) return [];

    return mockPlayers.filter(player => {
      const age = calculateAge(player.dateOfBirth);
      const isAgeEligible = age >= selectedAgeGroup.startAge && age <= selectedAgeGroup.endAge;
      const isCategoryEligible = player.category === formData.category;
      const isGenderEligible = formData.gender === 'all' || player.gender === formData.gender;
      const matchesSearch = player.name.toLowerCase().includes(playerSearch.toLowerCase()) ||
                           player.clubName.toLowerCase().includes(playerSearch.toLowerCase());
      
      return player.approved && isAgeEligible && isCategoryEligible && isGenderEligible && matchesSearch;
    });
  };

  const handleCreateSchedule = () => {
    setSelectedSchedule(null);
    setModalMode('create');
    setFormData({
      raceId: '',
      ageGroupId: '',
      category: 'beginner',
      gender: 'all',
      scheduledTime: '',
      heatNumber: '',
      selectedPlayers: []
    });
    setShowModal(true);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setModalMode('edit');
    setFormData({
      raceId: schedule.raceId,
      ageGroupId: schedule.ageGroupId,
      category: schedule.category,
      gender: 'all', // This would come from schedule data
      scheduledTime: schedule.scheduledTime,
      heatNumber: schedule.heatNumber,
      selectedPlayers: schedule.participants.map(p => p.playerId)
    });
    setShowModal(true);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      setSchedules(prev => prev.filter(s => s.id !== scheduleId));
    }
  };

  const handleSaveSchedule = () => {
    const selectedPlayerData = mockPlayers.filter(p => formData.selectedPlayers.includes(p.id));
    const participants = selectedPlayerData.map(player => ({
      id: `SP${Date.now()}_${player.id}`,
      playerId: player.id,
      playerName: player.name,
      gender: player.gender,
      club: player.clubName,
      district: player.district,
      rounds: Array.from({ length: 5 }, (_, i) => ({ round: i + 1, score: null })),
      totalScore: 0,
      rank: 0,
      status: 'pending' as const
    }));

    if (modalMode === 'create') {
      const newSchedule: Schedule = {
        id: `S${Date.now()}`,
        eventId: selectedEvent.id,
        raceId: formData.raceId,
        raceName: selectedEvent.races.find(r => r.id === formData.raceId)?.name || '',
        ageGroupId: formData.ageGroupId,
        ageGroupName: selectedEvent.ageGroups.find(ag => ag.id === formData.ageGroupId)?.name || '',
        category: formData.category,
        scheduledTime: formData.scheduledTime,
        heatNumber: formData.heatNumber,
        participants,
        resultsEntered: false
      };
      setSchedules(prev => [...prev, newSchedule]);
    } else if (modalMode === 'edit' && selectedSchedule) {
      setSchedules(prev => prev.map(s => 
        s.id === selectedSchedule.id 
          ? { 
              ...s, 
              raceId: formData.raceId,
              raceName: selectedEvent.races.find(r => r.id === formData.raceId)?.name || '',
              ageGroupId: formData.ageGroupId,
              ageGroupName: selectedEvent.ageGroups.find(ag => ag.id === formData.ageGroupId)?.name || '',
              category: formData.category,
              scheduledTime: formData.scheduledTime,
              heatNumber: formData.heatNumber,
              participants
            }
          : s
      ));
    }
    
    setShowModal(false);
  };

  const togglePlayerSelection = (playerId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPlayers: prev.selectedPlayers.includes(playerId)
        ? prev.selectedPlayers.filter(id => id !== playerId)
        : [...prev.selectedPlayers, playerId]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'info';
      case 'completed': return 'success';
      case 'not_started': return 'warning';
      default: return 'default';
    }
  };

  const columns = [
    { key: 'raceName', label: 'Race Name', sortable: true },
    { key: 'ageGroupName', label: 'Age Group', sortable: true },
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
      key: 'scheduledTime', 
      label: 'Schedule Time',
      render: (value: string) => new Date(value).toLocaleString()
    },
    { 
      key: 'participants', 
      label: 'Players',
      render: (value: any[]) => value.length
    },
    { 
      key: 'resultsEntered', 
      label: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'warning'} size="sm">
          {value ? 'Completed' : 'Scheduled'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, schedule: Schedule) => (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="secondary" title="View Details">
            <Eye size={16} />
          </Button>
          <Button size="sm" variant="primary" onClick={() => handleEditSchedule(schedule)} title="Edit Schedule">
            <Edit size={16} />
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDeleteSchedule(schedule.id)} title="Delete Schedule">
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  const eligiblePlayers = getEligiblePlayers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule Management</h1>
          <p className="text-gray-600 mt-1">Create and manage race schedules for {selectedEvent.name}</p>
        </div>
        <Button variant="primary" onClick={handleCreateSchedule}>
          <Plus size={16} className="mr-2" />
          Add New Schedule
        </Button>
      </div>

      {/* Event Info */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Event:</span> {selectedEvent.name}
          </div>
          <div>
            <span className="font-medium">Venue:</span> {selectedEvent.venue}
          </div>
          <div>
            <span className="font-medium">Dates:</span> {new Date(selectedEvent.startDate).toLocaleDateString()} - {new Date(selectedEvent.endDate).toLocaleDateString()}
          </div>
          <div>
            <span className="font-medium">Total Schedules:</span> {schedules.length}
          </div>
        </div>
      </Card>

      {/* Schedules Table */}
      <Card>
        <Table
          columns={columns}
          data={schedules}
          searchable
          searchPlaceholder="Search schedules..."
        />
      </Card>

      {/* Create/Edit Schedule Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${modalMode === 'create' ? 'Create New' : 'Edit'} Schedule`}
        size="2xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Select Race" required>
              <select
                value={formData.raceId}
                onChange={(e) => setFormData({ ...formData, raceId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a race</option>
                {selectedEvent.races.map(race => (
                  <option key={race.id} value={race.id}>{race.name}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Select Age Group" required>
              <select
                value={formData.ageGroupId}
                onChange={(e) => setFormData({ ...formData, ageGroupId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select age group</option>
                {selectedEvent.ageGroups.map(ageGroup => (
                  <option key={ageGroup.id} value={ageGroup.id}>{ageGroup.name}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Category" required>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="beginner">Beginner</option>
                <option value="fancy">Fancy</option>
                <option value="inline">Inline</option>
                <option value="quad">Quad</option>
              </select>
            </FormField>

            <FormField label="Gender" required>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="all">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </FormField>

            <FormField label="Schedule Date & Time" required>
              <input
                type="datetime-local"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </FormField>

            <FormField label="Heat Number">
              <input
                type="text"
                value={formData.heatNumber}
                onChange={(e) => setFormData({ ...formData, heatNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Heat 1, Group A"
              />
            </FormField>
          </div>

          {formData.raceId && formData.ageGroupId && formData.category && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Select Players</h3>
                <Badge variant="info">
                  {formData.selectedPlayers.length} selected
                </Badge>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search players..."
                  value={playerSearch}
                  onChange={(e) => setPlayerSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                {eligiblePlayers.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {eligiblePlayers.map(player => (
                      <div key={player.id} className="p-3 hover:bg-gray-50">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.selectedPlayers.includes(player.id)}
                            onChange={() => togglePlayerSelection(player.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">{player.name}</p>
                                <p className="text-sm text-gray-500">{player.clubName}</p>
                              </div>
                              <div className="text-right">
                                <Badge variant="info" size="sm">
                                  Age {calculateAge(player.dateOfBirth)}
                                </Badge>
                                <p className="text-sm text-gray-500 mt-1">{player.district}</p>
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No eligible players found for the selected criteria
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveSchedule}
              disabled={!formData.raceId || !formData.ageGroupId || !formData.category || formData.selectedPlayers.length === 0}
            >
              {modalMode === 'create' ? 'Create Schedule' : 'Update Schedule'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ScheduleManagement;