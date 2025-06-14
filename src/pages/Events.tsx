import React from 'react';
import { Plus, Calendar, MapPin, Users, Edit, Trash2, Eye, Clock, Trophy, UserPlus } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import Table from '../components/UI/Table';
import CreateEventModal from '../components/Events/CreateEventModal';
import ScheduleModal from '../components/Events/ScheduleModal';
import ResultsModal from '../components/Events/ResultsModal';
import { mockEvents, mockSchedules } from '../data/mockData';
import { Event, Schedule } from '../types';

const Events: React.FC = () => {
  const [events, setEvents] = React.useState<Event[]>(mockEvents);
  const [schedules, setSchedules] = React.useState<Schedule[]>(mockSchedules);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [selectedSchedule, setSelectedSchedule] = React.useState<Schedule | null>(null);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showScheduleModal, setShowScheduleModal] = React.useState(false);
  const [showResultsModal, setShowResultsModal] = React.useState(false);
  const [activeView, setActiveView] = React.useState<'events' | 'schedules' | 'results'>('events');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'info';
      case 'ongoing': return 'warning';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const handleCreateEvent = (eventData: Partial<Event>) => {
    const newEvent: Event = {
      id: `E${Date.now()}`,
      ...eventData,
      totalParticipants: 0,
      status: 'upcoming',
      createdAt: new Date().toISOString()
    } as Event;
    
    setEvents([...events, newEvent]);
  };

  const handleCreateSchedule = (scheduleData: Partial<Schedule>) => {
    const newSchedule: Schedule = {
      id: `S${Date.now()}`,
      ...scheduleData
    } as Schedule;
    
    setSchedules([...schedules, newSchedule]);
  };

  const handleUpdateResults = (updatedSchedule: Schedule) => {
    setSchedules(prev => prev.map(s => s.id === updatedSchedule.id ? updatedSchedule : s));
  };

  const eventsColumns = [
    { key: 'name', label: 'Event Name', sortable: true },
    { key: 'venue', label: 'Location / Venue', sortable: true },
    { 
      key: 'startDate', 
      label: 'Start Date - End Date', 
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
        <Badge variant={getStatusColor(value) as any} size="sm">
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    },
    { key: 'totalParticipants', label: 'Total Participants', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, event: Event) => (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="secondary" title="View Details">
            <Eye size={16} />
          </Button>
          <Button size="sm" variant="primary" title="Edit Event">
            <Edit size={16} />
          </Button>
          <Button 
            size="sm" 
            variant="success" 
            title="Manage Races"
            onClick={() => {
              setSelectedEvent(event);
              setShowScheduleModal(true);
            }}
          >
            <UserPlus size={16} />
          </Button>
          <Button size="sm" variant="warning" title="View Results">
            <Trophy size={16} />
          </Button>
          <Button size="sm" variant="danger" title="Delete Event">
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  const schedulesColumns = [
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
      label: 'Scheduled Time',
      render: (value: string) => new Date(value).toLocaleString()
    },
    { 
      key: 'participants', 
      label: 'Participants',
      render: (value: any[]) => value.length
    },
    { 
      key: 'resultsEntered', 
      label: 'Results',
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'warning'} size="sm">
          {value ? 'Entered' : 'Pending'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, schedule: Schedule) => (
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant="primary" 
            title="Enter Results"
            onClick={() => {
              setSelectedSchedule(schedule);
              setShowResultsModal(true);
            }}
          >
            <Trophy size={16} />
          </Button>
          <Button size="sm" variant="secondary" title="Reschedule">
            <Clock size={16} />
          </Button>
          <Button size="sm" variant="danger" title="Remove">
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  const renderEventsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-600 mt-1">Manage sports events and competitions</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} className="mr-2" />
          Create New Event
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.status === 'upcoming').length}
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
              <p className="text-sm font-medium text-gray-600">Ongoing Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.status === 'ongoing').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <MapPin className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Events Table */}
      <Card>
        <Table
          columns={eventsColumns}
          data={events}
          searchable
          searchPlaceholder="Search events..."
        />
      </Card>
    </div>
  );

  const renderSchedulesView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Race Schedules</h1>
          <p className="text-gray-600 mt-1">View and manage all race schedules</p>
        </div>
      </div>

      <Card>
        <Table
          columns={schedulesColumns}
          data={schedules}
          searchable
          searchPlaceholder="Search schedules..."
        />
      </Card>
    </div>
  );

  const renderResultsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Results</h1>
          <p className="text-gray-600 mt-1">View participant results and rankings</p>
        </div>
      </div>

      <Card>
        <div className="p-8 text-center text-gray-500">
          Results view coming soon...
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveView('events')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeView === 'events'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setActiveView('schedules')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeView === 'schedules'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Race Schedules
          </button>
          <button
            onClick={() => setActiveView('results')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeView === 'results'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Results & Rankings
          </button>
        </nav>
      </div>

      {/* Content based on active view */}
      {activeView === 'events' && renderEventsView()}
      {activeView === 'schedules' && renderSchedulesView()}
      {activeView === 'results' && renderResultsView()}

      {/* Modals */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateEvent}
      />

      {selectedEvent && (
        <ScheduleModal
          isOpen={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
          onSave={handleCreateSchedule}
        />
      )}

      {selectedSchedule && (
        <ResultsModal
          isOpen={showResultsModal}
          onClose={() => {
            setShowResultsModal(false);
            setSelectedSchedule(null);
          }}
          schedule={selectedSchedule}
          onSave={handleUpdateResults}
        />
      )}
    </div>
  );
};

export default Events;