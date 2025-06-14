import React from 'react';
import { Calendar, Users, Clock, CheckCircle, XCircle, Lock, Eye, UserPlus } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Table from '../../components/UI/Table';
import Modal from '../../components/UI/Modal';
import FormField from '../../components/UI/FormField';
import { mockEvents, mockPlayers, mockSchedules } from '../../data/mockData';
import { Event, Player } from '../../types';

const ClubEvents: React.FC = () => {
  const currentClubId = 'C001'; // Thunder Skating Club
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = React.useState(false);
  const [selectedPlayers, setSelectedPlayers] = React.useState<string[]>([]);

  // Get club players
  const clubPlayers = mockPlayers.filter(player => 
    player.clubId === currentClubId && player.approved
  );

  // Get events (both active and past)
  const allEvents = mockEvents;

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

  const getRegisteredPlayers = (eventId: string) => {
    return mockSchedules
      .filter(schedule => schedule.eventId === eventId)
      .flatMap(schedule => schedule.participants)
      .filter(participant => 
        clubPlayers.some(player => player.id === participant.playerId)
      );
  };

  const getNotRegisteredPlayers = (eventId: string) => {
    const registeredPlayerIds = getRegisteredPlayers(eventId).map(p => p.playerId);
    return clubPlayers.filter(player => !registeredPlayerIds.includes(player.id));
  };

  const isRegistrationOpen = (event: Event) => {
    const eventDate = new Date(event.startDate);
    const today = new Date();
    return event.status === 'upcoming' && eventDate > today;
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleRegisterPlayers = () => {
    if (!selectedEvent) return;
    setShowRegistrationModal(true);
  };

  const handlePlayerSelection = (playerId: string) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleSubmitRegistration = () => {
    // Here you would submit the registration to the backend
    console.log('Registering players:', selectedPlayers, 'for event:', selectedEvent?.id);
    alert(`Successfully registered ${selectedPlayers.length} players for ${selectedEvent?.name}!`);
    setShowRegistrationModal(false);
    setSelectedPlayers([]);
  };

  const eventsColumns = [
    { key: 'name', label: 'Event Name', sortable: true },
    { key: 'venue', label: 'Venue', sortable: true },
    { 
      key: 'startDate', 
      label: 'Date', 
      sortable: true,
      render: (value: string, event: Event) => (
        <div>
          <div>{new Date(event.startDate).toLocaleDateString()}</div>
          <div className="text-sm text-gray-500">to {new Date(event.endDate).toLocaleDateString()}</div>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (value: string) => (
        <Badge variant={
          value === 'upcoming' ? 'info' :
          value === 'ongoing' ? 'warning' : 'default'
        } size="sm">
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, event: Event) => (
        <Button size="sm" variant="primary" onClick={() => handleEventSelect(event)}>
          <Eye size={16} className="mr-2" />
          View Details
        </Button>
      )
    }
  ];

  const registeredPlayersColumns = [
    { key: 'playerName', label: 'Player Name' },
    { key: 'gender', label: 'Gender', render: (value: string) => value.charAt(0).toUpperCase() },
    { key: 'club', label: 'Club' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'completed' ? 'success' : 'info'} size="sm">
          {value === 'completed' ? 'Completed' : 'Scheduled'}
        </Badge>
      )
    },
    { 
      key: 'rank', 
      label: 'Result',
      render: (value: number, participant: any) => (
        participant.rank > 0 ? (
          <div className="flex items-center space-x-1">
            <span>Rank #{participant.rank}</span>
            {participant.medal && (
              <span className={`text-sm ${
                participant.medal === 'gold' ? 'text-yellow-500' :
                participant.medal === 'silver' ? 'text-gray-400' :
                'text-orange-600'
              }`}>
                🏅
              </span>
            )}
          </div>
        ) : '-'
      )
    }
  ];

  const notRegisteredPlayersColumns = [
    { key: 'name', label: 'Player Name' },
    { 
      key: 'dateOfBirth', 
      label: 'Age',
      render: (value: string) => calculateAge(value)
    },
    { key: 'gender', label: 'Gender', render: (value: string) => value.charAt(0).toUpperCase() },
    { key: 'category', label: 'Category', render: (value: string) => value.charAt(0).toUpperCase() + value.slice(1) },
    { key: 'ageGroup', label: 'Age Group' }
  ];

  const registeredPlayers = selectedEvent ? getRegisteredPlayers(selectedEvent.id) : [];
  const notRegisteredPlayers = selectedEvent ? getNotRegisteredPlayers(selectedEvent.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Club Events</h1>
        <p className="text-gray-600 mt-1">View and manage club participation in events</p>
      </div>

      {/* Events List */}
      <Card title="All Events">
        <Table
          columns={eventsColumns}
          data={allEvents}
          searchable
          searchPlaceholder="Search events..."
        />
      </Card>

      {/* Event Details */}
      {selectedEvent && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{selectedEvent.name}</h2>
                <p className="text-gray-600 mb-4">{selectedEvent.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    {new Date(selectedEvent.startDate).toLocaleDateString()} - {new Date(selectedEvent.endDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2 text-gray-400" />
                    {selectedEvent.venue}
                  </div>
                  <div className="flex items-center">
                    <Users size={16} className="mr-2 text-gray-400" />
                    {selectedEvent.totalParticipants} total participants
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant={
                  selectedEvent.status === 'upcoming' ? 'info' :
                  selectedEvent.status === 'ongoing' ? 'warning' : 'default'
                } size="sm">
                  {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
                </Badge>
                
                {isRegistrationOpen(selectedEvent) ? (
                  <Button variant="primary" onClick={handleRegisterPlayers}>
                    <UserPlus size={16} className="mr-2" />
                    Register Players
                  </Button>
                ) : (
                  <Button variant="secondary" disabled>
                    <Lock size={16} className="mr-2" />
                    Registration Closed
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Registered Players */}
          <Card title={`Registered Players from Your Club (${registeredPlayers.length})`}>
            {registeredPlayers.length > 0 ? (
              <Table
                columns={registeredPlayersColumns}
                data={registeredPlayers}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No players registered</h3>
                <p>No players from your club are registered for this event yet.</p>
              </div>
            )}
          </Card>

          {/* Not Registered Players */}
          <Card title={`Available Players for Registration (${notRegisteredPlayers.length})`}>
            {notRegisteredPlayers.length > 0 ? (
              <Table
                columns={notRegisteredPlayersColumns}
                data={notRegisteredPlayers}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">All players registered</h3>
                <p>All eligible players from your club are already registered for this event.</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Registration Modal */}
      <Modal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        title={`Register Players for ${selectedEvent?.name}`}
        size="xl"
      >
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Event Information</h3>
            <div className="text-sm text-blue-800">
              <p><strong>Event:</strong> {selectedEvent?.name}</p>
              <p><strong>Venue:</strong> {selectedEvent?.venue}</p>
              <p><strong>Dates:</strong> {selectedEvent && new Date(selectedEvent.startDate).toLocaleDateString()} - {selectedEvent && new Date(selectedEvent.endDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Select Players to Register ({selectedPlayers.length} selected)
            </h3>
            
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              {notRegisteredPlayers.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {notRegisteredPlayers.map(player => (
                    <div key={player.id} className="p-3 hover:bg-gray-50">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPlayers.includes(player.id)}
                          onChange={() => handlePlayerSelection(player.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{player.name}</p>
                              <p className="text-sm text-gray-500">
                                Age {calculateAge(player.dateOfBirth)} • {player.category.charAt(0).toUpperCase() + player.category.slice(1)} • {player.gender.charAt(0).toUpperCase() + player.gender.slice(1)}
                              </p>
                            </div>
                            <Badge variant="info" size="sm">
                              {player.ageGroup}
                            </Badge>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No players available for registration
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowRegistrationModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitRegistration}
              disabled={selectedPlayers.length === 0}
            >
              Register {selectedPlayers.length} Player{selectedPlayers.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClubEvents;