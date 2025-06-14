import React from 'react';
import { Trophy, Clock, Users, Save, Medal } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Table from '../../components/UI/Table';
import Modal from '../../components/UI/Modal';
import { mockSchedules } from '../../data/mockData';
import { Schedule, ScheduledPlayer } from '../../types';

const UpdateResults: React.FC = () => {
  const [schedules, setSchedules] = React.useState<Schedule[]>(mockSchedules);
  const [showResultsModal, setShowResultsModal] = React.useState(false);
  const [selectedSchedule, setSelectedSchedule] = React.useState<Schedule | null>(null);
  const [participants, setParticipants] = React.useState<ScheduledPlayer[]>([]);

  const handleEnterResults = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setParticipants(schedule.participants);
    setShowResultsModal(true);
  };

  const updateScore = (participantId: string, round: number, score: number | null) => {
    setParticipants(prev => prev.map(participant => {
      if (participant.id === participantId) {
        const updatedRounds = participant.rounds.map(r => 
          r.round === round ? { ...r, score } : r
        );
        
        const validScores = updatedRounds.filter(r => r.score !== null).map(r => r.score!);
        const totalScore = validScores.length > 0 ? validScores.reduce((sum, s) => sum + s, 0) / validScores.length : 0;
        
        return {
          ...participant,
          rounds: updatedRounds,
          totalScore
        };
      }
      return participant;
    }));
  };

  const updateStatus = (participantId: string, status: 'completed' | 'dnf' | 'dq' | 'pending') => {
    setParticipants(prev => prev.map(participant => 
      participant.id === participantId ? { ...participant, status } : participant
    ));
  };

  const calculateRanks = () => {
    const completedParticipants = participants.filter(p => p.status === 'completed');
    const sortedParticipants = [...completedParticipants].sort((a, b) => {
      // For time-based events, lower is better
      if (selectedSchedule?.raceName.toLowerCase().includes('sprint') || selectedSchedule?.raceName.toLowerCase().includes('time')) {
        return a.totalScore - b.totalScore;
      }
      // For score-based events, higher is better
      return b.totalScore - a.totalScore;
    });

    const updatedParticipants = participants.map(participant => {
      if (participant.status === 'completed') {
        const rank = sortedParticipants.findIndex(p => p.id === participant.id) + 1;
        let medal: 'gold' | 'silver' | 'bronze' | undefined;
        if (rank === 1) medal = 'gold';
        else if (rank === 2) medal = 'silver';
        else if (rank === 3) medal = 'bronze';
        
        return { ...participant, rank, medal };
      }
      return { ...participant, rank: 0, medal: undefined };
    });

    setParticipants(updatedParticipants);
  };

  const handleSaveResults = () => {
    if (!selectedSchedule) return;
    
    calculateRanks();
    const updatedSchedule = {
      ...selectedSchedule,
      participants,
      resultsEntered: true
    };
    
    setSchedules(prev => prev.map(s => 
      s.id === selectedSchedule.id ? updatedSchedule : s
    ));
    
    setShowResultsModal(false);
    alert('Results saved successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'dnf': return 'warning';
      case 'dq': return 'danger';
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
    return <Medal className={`w-4 h-4 ${colors[medal as keyof typeof colors]}`} />;
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
      label: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'warning'} size="sm">
          {value ? 'Completed' : 'Pending'}
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
            onClick={() => handleEnterResults(schedule)}
            title="Enter Results"
          >
            <Trophy size={16} />
          </Button>
          <Button size="sm" variant="secondary" title="Reschedule">
            <Clock size={16} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Update Results</h1>
        <p className="text-gray-600 mt-1">Enter and manage race results for scheduled events</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Results</p>
              <p className="text-2xl font-bold text-gray-900">
                {schedules.filter(s => !s.resultsEntered).length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Trophy className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Results</p>
              <p className="text-2xl font-bold text-gray-900">
                {schedules.filter(s => s.resultsEntered).length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Participants</p>
              <p className="text-2xl font-bold text-gray-900">
                {schedules.reduce((sum, s) => sum + s.participants.length, 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Schedules Table */}
      <Card>
        <Table
          columns={columns}
          data={schedules}
          searchable
          searchPlaceholder="Search schedules..."
        />
      </Card>

      {/* Results Entry Modal */}
      {selectedSchedule && (
        <Modal 
          isOpen={showResultsModal} 
          onClose={() => setShowResultsModal(false)} 
          title={`Enter Results - ${selectedSchedule.raceName}`} 
          size="2xl"
        >
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Race:</span> {selectedSchedule.raceName}
                </div>
                <div>
                  <span className="font-medium">Age Group:</span> {selectedSchedule.ageGroupName}
                </div>
                <div>
                  <span className="font-medium">Category:</span> {selectedSchedule.category}
                </div>
                <div>
                  <span className="font-medium">Heat:</span> {selectedSchedule.heatNumber}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-3 py-2 text-left">Player</th>
                    <th className="border border-gray-300 px-3 py-2 text-center">Gender</th>
                    <th className="border border-gray-300 px-3 py-2 text-center">Round 1</th>
                    <th className="border border-gray-300 px-3 py-2 text-center">Round 2</th>
                    <th className="border border-gray-300 px-3 py-2 text-center">Round 3</th>
                    <th className="border border-gray-300 px-3 py-2 text-center">Round 4</th>
                    <th className="border border-gray-300 px-3 py-2 text-center">Round 5</th>
                    <th className="border border-gray-300 px-3 py-2 text-center">Average</th>
                    <th className="border border-gray-300 px-3 py-2 text-center">Status</th>
                    <th className="border border-gray-300 px-3 py-2 text-center">Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map(participant => (
                    <tr key={participant.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2">
                        <div>
                          <div className="font-medium">{participant.playerName}</div>
                          <div className="text-sm text-gray-500">{participant.club}</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        <Badge variant="info" size="sm">
                          {participant.gender.charAt(0).toUpperCase()}
                        </Badge>
                      </td>
                      {participant.rounds.map(round => (
                        <td key={round.round} className="border border-gray-300 px-3 py-2 text-center">
                          <input
                            type="number"
                            step="0.01"
                            value={round.score || ''}
                            onChange={(e) => updateScore(
                              participant.id, 
                              round.round, 
                              e.target.value ? parseFloat(e.target.value) : null
                            )}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                            placeholder="0.00"
                            disabled={participant.status === 'dnf' || participant.status === 'dq'}
                          />
                        </td>
                      ))}
                      <td className="border border-gray-300 px-3 py-2 text-center font-medium">
                        {participant.totalScore > 0 ? participant.totalScore.toFixed(2) : '-'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        <select
                          value={participant.status}
                          onChange={(e) => updateStatus(participant.id, e.target.value as any)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="dnf">DNF</option>
                          <option value="dq">DQ</option>
                        </select>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          {participant.rank > 0 && (
                            <>
                              <span className="font-medium">{participant.rank}</span>
                              {getMedalIcon(participant.medal)}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <Button onClick={calculateRanks} variant="secondary">
                Calculate Ranks
              </Button>
              <div className="flex space-x-3">
                <Button variant="secondary" onClick={() => setShowResultsModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveResults}>
                  <Save size={16} className="mr-2" />
                  Save Results
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UpdateResults;