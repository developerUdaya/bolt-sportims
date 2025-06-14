import React from 'react';
import { Calendar, Clock, MapPin, Download, Eye, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import Button from '../../components/UI/Button';
import Tabs from '../../components/UI/Tabs';

interface PlayerEvent {
  id: string;
  eventName: string;
  venue: string;
  date: string;
  races: string[];
  status: 'registered' | 'approved' | 'scheduled' | 'completed';
  scheduledTime?: string;
  results?: {
    race: string;
    time?: string;
    score?: number;
    rank: number;
    medal?: 'gold' | 'silver' | 'bronze';
  }[];
}

const MyEvents: React.FC = () => {
  const [playerEvents] = React.useState<PlayerEvent[]>([
    {
      id: '1',
      eventName: 'California State Championship 2024',
      venue: 'Olympic Sports Complex',
      date: '2024-12-25',
      races: ['100m Sprint', '200m Sprint'],
      status: 'scheduled',
      scheduledTime: '2024-12-25T10:00:00',
    },
    {
      id: '2',
      eventName: 'Winter Cup 2024',
      venue: 'Metro Sports Arena',
      date: '2024-12-30',
      races: ['100m Sprint'],
      status: 'approved'
    },
    {
      id: '3',
      eventName: 'Regional Championship 2024',
      venue: 'City Sports Center',
      date: '2024-11-15',
      races: ['100m Sprint', 'Artistic Performance'],
      status: 'completed',
      results: [
        {
          race: '100m Sprint',
          time: '12.32s',
          rank: 1,
          medal: 'gold'
        },
        {
          race: 'Artistic Performance',
          score: 85.5,
          rank: 3,
          medal: 'bronze'
        }
      ]
    },
    {
      id: '4',
      eventName: 'District Championship 2024',
      venue: 'Local Sports Ground',
      date: '2024-10-20',
      races: ['100m Sprint'],
      status: 'completed',
      results: [
        {
          race: '100m Sprint',
          time: '12.45s',
          rank: 2,
          medal: 'silver'
        }
      ]
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'registered':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'scheduled':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered': return 'warning';
      case 'approved': return 'success';
      case 'scheduled': return 'info';
      case 'completed': return 'default';
      default: return 'default';
    }
  };

  const getMedalIcon = (medal?: string) => {
    if (!medal) return null;
    const colors = {
      gold: 'text-yellow-500',
      silver: 'text-gray-400',
      bronze: 'text-orange-600'
    };
    return <span className={`text-lg ${colors[medal as keyof typeof colors]}`}>🏅</span>;
  };

  const registeredEvents = playerEvents.filter(e => ['registered', 'approved', 'scheduled'].includes(e.status));
  const pastEvents = playerEvents.filter(e => e.status === 'completed');

  const registeredEventsTab = {
    id: 'registered',
    label: 'Registered Events',
    content: (
      <div className="space-y-4">
        {registeredEvents.map(event => (
          <Card key={event.id}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{event.eventName}</h3>
                  {getStatusIcon(event.status)}
                  <Badge variant={getStatusColor(event.status) as any} size="sm">
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    {event.venue}
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  {event.scheduledTime && (
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2" />
                      Scheduled: {new Date(event.scheduledTime).toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <h4 className="font-medium text-gray-900 mb-1">Registered Races:</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.races.map((race, index) => (
                      <Badge key={index} variant="info" size="sm">{race}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                {event.status === 'scheduled' && (
                  <Button size="sm" variant="primary">
                    <Download size={16} className="mr-2" />
                    Download Ticket
                  </Button>
                )}
                <Button size="sm" variant="secondary">
                  <Eye size={16} className="mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {registeredEvents.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No registered events</h3>
            <p>You haven't registered for any upcoming events yet.</p>
          </div>
        )}
      </div>
    )
  };

  const pastEventsTab = {
    id: 'past',
    label: 'Past Events',
    content: (
      <div className="space-y-4">
        {pastEvents.map(event => (
          <Card key={event.id}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{event.eventName}</h3>
                  <Badge variant="default" size="sm">Completed</Badge>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    {event.venue}
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                </div>

                {event.results && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Results:</h4>
                    <div className="space-y-3">
                      {event.results.map((result, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">{result.race}</div>
                              <div className="text-sm text-gray-600">
                                {result.time && `Time: ${result.time}`}
                                {result.score && `Score: ${result.score}`}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={result.rank <= 3 ? 'success' : 'default'} size="sm">
                                Rank #{result.rank}
                              </Badge>
                              {getMedalIcon(result.medal)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <Button size="sm" variant="secondary">
                  <Download size={16} className="mr-2" />
                  Certificate
                </Button>
                <Button size="sm" variant="secondary">
                  <Eye size={16} className="mr-2" />
                  Full Results
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {pastEvents.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No past events</h3>
            <p>You haven't participated in any events yet.</p>
          </div>
        )}
      </div>
    )
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
        <p className="text-gray-600 mt-1">Track your registered and completed events</p>
      </div>

      <Tabs tabs={[registeredEventsTab, pastEventsTab]} />
    </div>
  );
};

export default MyEvents;