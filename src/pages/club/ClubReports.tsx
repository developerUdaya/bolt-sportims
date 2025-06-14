import React from 'react';
import { Download, Calendar, Trophy, Medal, Filter, FileText, BarChart3 } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Table from '../../components/UI/Table';
import { mockEvents, mockPlayers, mockSchedules } from '../../data/mockData';

const ClubReports: React.FC = () => {
  const currentClubId = 'C001'; // Thunder Skating Club
  const [selectedEvent, setSelectedEvent] = React.useState('all');
  const [selectedPlayer, setSelectedPlayer] = React.useState('all');
  const [dateRange, setDateRange] = React.useState({ start: '', end: '' });

  // Get club players
  const clubPlayers = mockPlayers.filter(player => player.clubId === currentClubId);

  // Get past events (completed events)
  const pastEvents = mockEvents.filter(event => event.status === 'completed');

  // Generate report data
  const getReportData = () => {
    let results: any[] = [];

    mockSchedules
      .filter(schedule => schedule.resultsEntered)
      .forEach(schedule => {
        const event = mockEvents.find(e => e.id === schedule.eventId);
        if (!event) return;

        schedule.participants
          .filter(participant => 
            clubPlayers.some(player => player.id === participant.playerId) &&
            participant.status === 'completed'
          )
          .forEach(participant => {
            const player = clubPlayers.find(p => p.id === participant.playerId);
            if (!player) return;

            results.push({
              eventName: event.name,
              eventDate: event.startDate,
              playerName: participant.playerName,
              playerId: player.playerId,
              raceName: schedule.raceName,
              ageGroup: schedule.ageGroupName,
              category: schedule.category,
              timeScore: participant.totalScore > 0 ? participant.totalScore.toFixed(2) : '-',
              rank: participant.rank,
              medal: participant.medal || '-',
              status: participant.status
            });
          });
      });

    // Apply filters
    if (selectedEvent !== 'all') {
      results = results.filter(result => result.eventName === selectedEvent);
    }

    if (selectedPlayer !== 'all') {
      results = results.filter(result => result.playerName === selectedPlayer);
    }

    if (dateRange.start) {
      results = results.filter(result => new Date(result.eventDate) >= new Date(dateRange.start));
    }

    if (dateRange.end) {
      results = results.filter(result => new Date(result.eventDate) <= new Date(dateRange.end));
    }

    return results;
  };

  const reportData = getReportData();

  // Calculate statistics
  const statistics = {
    totalEvents: [...new Set(reportData.map(r => r.eventName))].length,
    totalParticipations: reportData.length,
    totalMedals: reportData.filter(r => r.medal !== '-').length,
    goldMedals: reportData.filter(r => r.medal === 'gold').length,
    silverMedals: reportData.filter(r => r.medal === 'silver').length,
    bronzeMedals: reportData.filter(r => r.medal === 'bronze').length
  };

  // Medal tally by player
  const medalTallyByPlayer = clubPlayers.map(player => {
    const playerResults = reportData.filter(r => r.playerName === player.name);
    return {
      playerName: player.name,
      playerId: player.playerId,
      totalParticipations: playerResults.length,
      gold: playerResults.filter(r => r.medal === 'gold').length,
      silver: playerResults.filter(r => r.medal === 'silver').length,
      bronze: playerResults.filter(r => r.medal === 'bronze').length,
      totalMedals: playerResults.filter(r => r.medal !== '-').length
    };
  }).filter(player => player.totalParticipations > 0);

  const exportToPDF = () => {
    console.log('Exporting to PDF...');
    alert('PDF export functionality would be implemented here');
  };

  const exportToExcel = () => {
    console.log('Exporting to Excel...');
    alert('Excel export functionality would be implemented here');
  };

  const getMedalIcon = (medal: string) => {
    if (medal === '-') return null;
    const colors = {
      gold: 'text-yellow-500',
      silver: 'text-gray-400',
      bronze: 'text-orange-600'
    };
    return <Medal className={`w-4 h-4 ${colors[medal as keyof typeof colors]}`} />;
  };

  const columns = [
    { key: 'eventName', label: 'Event Name', sortable: true },
    { 
      key: 'eventDate', 
      label: 'Date', 
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { key: 'playerName', label: 'Player Name', sortable: true },
    { key: 'raceName', label: 'Race', sortable: true },
    { key: 'ageGroup', label: 'Age Group', sortable: true },
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
    { key: 'timeScore', label: 'Time/Score', sortable: true },
    { 
      key: 'rank', 
      label: 'Rank', 
      sortable: true,
      render: (value: number) => `#${value}`
    },
    { 
      key: 'medal', 
      label: 'Medal',
      render: (value: string) => (
        <div className="flex items-center justify-center space-x-1">
          {value !== '-' && (
            <>
              <span className="text-sm font-medium capitalize">{value}</span>
              {getMedalIcon(value)}
            </>
          )}
          {value === '-' && <span className="text-gray-400">-</span>}
        </div>
      )
    }
  ];

  const medalTallyColumns = [
    { key: 'playerName', label: 'Player Name', sortable: true },
    { key: 'playerId', label: 'Player ID', sortable: true },
    { key: 'totalParticipations', label: 'Events', sortable: true },
    { 
      key: 'gold', 
      label: 'Gold', 
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center justify-center space-x-1">
          <span className="font-medium">{value}</span>
          {value > 0 && <Medal className="w-4 h-4 text-yellow-500" />}
        </div>
      )
    },
    { 
      key: 'silver', 
      label: 'Silver', 
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center justify-center space-x-1">
          <span className="font-medium">{value}</span>
          {value > 0 && <Medal className="w-4 h-4 text-gray-400" />}
        </div>
      )
    },
    { 
      key: 'bronze', 
      label: 'Bronze', 
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center justify-center space-x-1">
          <span className="font-medium">{value}</span>
          {value > 0 && <Medal className="w-4 h-4 text-orange-600" />}
        </div>
      )
    },
    { key: 'totalMedals', label: 'Total Medals', sortable: true }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Past Events Report</h1>
          <p className="text-gray-600 mt-1">View participation and results from all past events</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={exportToExcel}>
            <Download size={16} className="mr-2" />
            Export Excel
          </Button>
          <Button variant="secondary" onClick={exportToPDF}>
            <FileText size={16} className="mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{statistics.totalEvents}</div>
            <div className="text-sm text-gray-600">Events Participated</div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{statistics.totalParticipations}</div>
            <div className="text-sm text-gray-600">Total Participations</div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{statistics.totalMedals}</div>
            <div className="text-sm text-gray-600">Total Medals</div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{statistics.goldMedals}</div>
            <div className="text-sm text-gray-600">Gold</div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-500">{statistics.silverMedals}</div>
            <div className="text-sm text-gray-600">Silver</div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{statistics.bronzeMedals}</div>
            <div className="text-sm text-gray-600">Bronze</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card title="Filters">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event</label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Events</option>
              {pastEvents.map(event => (
                <option key={event.id} value={event.name}>{event.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Player</label>
            <select
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Players</option>
              {clubPlayers.map(player => (
                <option key={player.id} value={player.name}>{player.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </Card>

      {/* Results Table */}
      <Card title={`Event Results (${reportData.length} records)`}>
        <Table
          columns={columns}
          data={reportData}
          searchable
          searchPlaceholder="Search results..."
        />
      </Card>

      {/* Medal Tally by Player */}
      <Card title="Medal Tally by Player">
        <Table
          columns={medalTallyColumns}
          data={medalTallyByPlayer.sort((a, b) => b.totalMedals - a.totalMedals)}
        />
      </Card>
    </div>
  );
};

export default ClubReports;