import React from 'react';
import { Download, Filter, Medal, Trophy } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Table from '../../components/UI/Table';
import { mockSchedules, mockEvents } from '../../data/mockData';

const ResultsView: React.FC = () => {
  const [selectedEvent] = React.useState(mockEvents[0]);
  const [raceFilter, setRaceFilter] = React.useState('all');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [ageGroupFilter, setAgeGroupFilter] = React.useState('all');
  const [genderFilter, setGenderFilter] = React.useState('all');

  // Get all results from completed schedules
  const getAllResults = () => {
    const results: any[] = [];
    
    mockSchedules
      .filter(schedule => schedule.resultsEntered)
      .forEach(schedule => {
        schedule.participants
          .filter(participant => participant.status === 'completed')
          .forEach(participant => {
            results.push({
              id: `${schedule.id}_${participant.id}`,
              raceName: schedule.raceName,
              ageGroupName: schedule.ageGroupName,
              category: schedule.category,
              playerName: participant.playerName,
              gender: participant.gender,
              club: participant.club,
              district: participant.district,
              score: participant.totalScore,
              rank: participant.rank,
              medal: participant.medal,
              status: participant.status
            });
          });
      });
    
    return results;
  };

  const allResults = getAllResults();

  const filteredResults = allResults.filter(result => {
    return (
      (raceFilter === 'all' || result.raceName === raceFilter) &&
      (categoryFilter === 'all' || result.category === categoryFilter) &&
      (ageGroupFilter === 'all' || result.ageGroupName === ageGroupFilter) &&
      (genderFilter === 'all' || result.gender === genderFilter)
    );
  });

  const getMedalIcon = (medal?: string) => {
    if (!medal) return null;
    const colors = {
      gold: 'text-yellow-500',
      silver: 'text-gray-400',
      bronze: 'text-orange-600'
    };
    return <Medal className={`w-4 h-4 ${colors[medal as keyof typeof colors]}`} />;
  };

  const exportToExcel = () => {
    // Implementation for Excel export
    console.log('Exporting to Excel...');
    alert('Excel export functionality would be implemented here');
  };

  const exportToPDF = () => {
    // Implementation for PDF export
    console.log('Exporting to PDF...');
    alert('PDF export functionality would be implemented here');
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
    { key: 'playerName', label: 'Player Name', sortable: true },
    { 
      key: 'gender', 
      label: 'Gender', 
      sortable: true,
      render: (value: string) => (
        <Badge variant="info" size="sm">
          {value.charAt(0).toUpperCase()}
        </Badge>
      )
    },
    { key: 'club', label: 'Club', sortable: true },
    { 
      key: 'score', 
      label: 'Score/Time', 
      sortable: true,
      render: (value: number) => value.toFixed(2)
    },
    { 
      key: 'rank', 
      label: 'Rank', 
      sortable: true,
      render: (value: number) => `#${value}`
    },
    { 
      key: 'medal', 
      label: 'Medal',
      render: (value: string, result: any) => (
        <div className="flex items-center justify-center space-x-1">
          {value && (
            <>
              <span className="text-sm font-medium capitalize">{value}</span>
              {getMedalIcon(value)}
            </>
          )}
        </div>
      )
    }
  ];

  // Calculate medal tally
  const medalTally = {
    byClub: {} as Record<string, { gold: number; silver: number; bronze: number; total: number }>,
    byDistrict: {} as Record<string, { gold: number; silver: number; bronze: number; total: number }>
  };

  allResults.forEach(result => {
    if (result.medal) {
      // Club tally
      if (!medalTally.byClub[result.club]) {
        medalTally.byClub[result.club] = { gold: 0, silver: 0, bronze: 0, total: 0 };
      }
      medalTally.byClub[result.club][result.medal as keyof typeof medalTally.byClub[string]]++;
      medalTally.byClub[result.club].total++;

      // District tally
      if (!medalTally.byDistrict[result.district]) {
        medalTally.byDistrict[result.district] = { gold: 0, silver: 0, bronze: 0, total: 0 };
      }
      medalTally.byDistrict[result.district][result.medal as keyof typeof medalTally.byDistrict[string]]++;
      medalTally.byDistrict[result.district].total++;
    }
  });

  const uniqueRaces = [...new Set(allResults.map(r => r.raceName))];
  const uniqueCategories = [...new Set(allResults.map(r => r.category))];
  const uniqueAgeGroups = [...new Set(allResults.map(r => r.ageGroupName))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Results View</h1>
          <p className="text-gray-600 mt-1">View consolidated results for {selectedEvent.name}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={exportToExcel}>
            <Download size={16} className="mr-2" />
            Export Excel
          </Button>
          <Button variant="secondary" onClick={exportToPDF}>
            <Download size={16} className="mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Race</label>
            <select
              value={raceFilter}
              onChange={(e) => setRaceFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Races</option>
              {uniqueRaces.map(race => (
                <option key={race} value={race}>{race}</option>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
            <select
              value={ageGroupFilter}
              onChange={(e) => setAgeGroupFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Age Groups</option>
              {uniqueAgeGroups.map(ageGroup => (
                <option key={ageGroup} value={ageGroup}>{ageGroup}</option>
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
        </div>
      </Card>

      {/* Results Table */}
      <Card>
        <Table
          columns={columns}
          data={filteredResults}
          searchable
          searchPlaceholder="Search results..."
        />
      </Card>

      {/* Medal Tally */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Medal Tally by Club">
          <div className="space-y-3">
            {Object.entries(medalTally.byClub)
              .sort(([,a], [,b]) => b.total - a.total)
              .map(([club, medals]) => (
                <div key={club} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">{club}</div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Medal className="w-4 h-4 text-yellow-500" />
                      <span>{medals.gold}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Medal className="w-4 h-4 text-gray-400" />
                      <span>{medals.silver}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Medal className="w-4 h-4 text-orange-600" />
                      <span>{medals.bronze}</span>
                    </div>
                    <div className="font-medium">
                      Total: {medals.total}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Card>

        <Card title="Medal Tally by District">
          <div className="space-y-3">
            {Object.entries(medalTally.byDistrict)
              .sort(([,a], [,b]) => b.total - a.total)
              .map(([district, medals]) => (
                <div key={district} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">{district}</div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Medal className="w-4 h-4 text-yellow-500" />
                      <span>{medals.gold}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Medal className="w-4 h-4 text-gray-400" />
                      <span>{medals.silver}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Medal className="w-4 h-4 text-orange-600" />
                      <span>{medals.bronze}</span>
                    </div>
                    <div className="font-medium">
                      Total: {medals.total}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResultsView;