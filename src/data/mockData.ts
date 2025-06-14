import { Player, Club, District, State, Admin, Event, DashboardStats, Race, AgeGroup, RaceMatrix, Schedule, ScheduledPlayer, PlayerResult } from '../types';

export const mockPlayers: Player[] = [
  {
    id: '1',
    playerId: 'P001',
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1234567890',
    dateOfBirth: '2005-03-15',
    gender: 'male',
    approved: true,
    createdAt: '2024-01-15',
    clubId: 'C001',
    clubName: 'Thunder Skating Club',
    category: 'inline',
    ageGroup: '18-25',
    district: 'Central District',
    state: 'California'
  },
  {
    id: '2',
    playerId: 'P002',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '+1234567891',
    dateOfBirth: '2003-07-22',
    gender: 'female',
    approved: true,
    createdAt: '2024-01-20',
    clubId: 'C002',
    clubName: 'Speed Demons SC',
    category: 'fancy',
    ageGroup: '18-25',
    district: 'North District',
    state: 'California'
  },
  {
    id: '3',
    playerId: 'P003',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@email.com',
    phone: '+1234567892',
    dateOfBirth: '2008-11-08',
    gender: 'male',
    approved: false,
    createdAt: '2024-12-01',
    clubId: 'C001',
    clubName: 'Thunder Skating Club',
    category: 'beginner',
    ageGroup: '14-17',
    district: 'Central District',
    state: 'California'
  },
  {
    id: '4',
    playerId: 'P004',
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    phone: '+1234567893',
    dateOfBirth: '2010-05-12',
    gender: 'female',
    approved: true,
    createdAt: '2024-01-25',
    clubId: 'C001',
    clubName: 'Thunder Skating Club',
    category: 'beginner',
    ageGroup: '10-13',
    district: 'Central District',
    state: 'California'
  },
  {
    id: '5',
    playerId: 'P005',
    name: 'David Park',
    email: 'david.park@email.com',
    phone: '+1234567894',
    dateOfBirth: '2006-09-30',
    gender: 'male',
    approved: true,
    createdAt: '2024-02-01',
    clubId: 'C002',
    clubName: 'Speed Demons SC',
    category: 'inline',
    ageGroup: '14-17',
    district: 'North District',
    state: 'California'
  }
];

export const mockClubs: Club[] = [
  {
    id: 'C001',
    clubId: 'C001',
    name: 'Thunder Skating Club',
    email: 'info@thunderskating.com',
    phone: '+1234567900',
    dateOfBirth: '2020-01-01',
    gender: 'other',
    approved: true,
    createdAt: '2020-01-01',
    registrationNumber: 'TSC2020001',
    district: 'Central District',
    state: 'California',
    establishedYear: 2020,
    contactPerson: 'John Thunder'
  },
  {
    id: 'C002',
    clubId: 'C002',
    name: 'Speed Demons SC',
    email: 'contact@speeddemons.com',
    phone: '+1234567901',
    dateOfBirth: '2019-06-15',
    gender: 'other',
    approved: true,
    createdAt: '2019-06-15',
    registrationNumber: 'SD2019001',
    district: 'North District',
    state: 'California',
    establishedYear: 2019,
    contactPerson: 'Maria Speed'
  }
];

export const mockDistricts: District[] = [
  {
    id: 'D001',
    districtId: 'D001',
    name: 'Central District',
    email: 'admin@central.gov',
    phone: '+1234567910',
    dateOfBirth: '1950-01-01',
    gender: 'other',
    approved: true,
    createdAt: '1950-01-01',
    districtCode: 'CD',
    state: 'California',
    population: 500000,
    area: 1200
  },
  {
    id: 'D002',
    districtId: 'D002',
    name: 'North District',
    email: 'admin@north.gov',
    phone: '+1234567911',
    dateOfBirth: '1948-01-01',
    gender: 'other',
    approved: true,
    createdAt: '1948-01-01',
    districtCode: 'ND',
    state: 'California',
    population: 750000,
    area: 1800
  }
];

export const mockStates: State[] = [
  {
    id: 'S001',
    stateId: 'S001',
    name: 'California',
    email: 'admin@california.gov',
    phone: '+1234567920',
    dateOfBirth: '1850-01-01',
    gender: 'other',
    approved: true,
    createdAt: '1850-01-01',
    stateCode: 'CA',
    capital: 'Sacramento',
    population: 39538223,
    area: 423967
  }
];

export const mockAdmins: Admin[] = [
  {
    id: 'A001',
    adminId: 'A001',
    name: 'John Administrator',
    email: 'john.admin@sportsmanagement.com',
    phone: '+1234567930',
    dateOfBirth: '1985-01-01',
    gender: 'male',
    approved: true,
    createdAt: '2020-01-01',
    role: 'super_admin',
    permissions: ['all']
  }
];

export const mockRaces: Race[] = [
  {
    id: 'R001',
    name: '100m Sprint',
    description: 'Speed skating 100 meter sprint',
    genderEligibility: 'all'
  },
  {
    id: 'R002',
    name: '200m Sprint',
    description: 'Speed skating 200 meter sprint',
    genderEligibility: 'all'
  },
  {
    id: 'R003',
    name: 'Relay Race',
    description: '4x100m relay race',
    genderEligibility: 'all'
  },
  {
    id: 'R004',
    name: 'Artistic Performance',
    description: 'Artistic skating performance',
    genderEligibility: 'all'
  }
];

export const mockAgeGroups: AgeGroup[] = [
  { id: 'AG001', name: '4-6 years', startAge: 4, endAge: 6 },
  { id: 'AG002', name: '7-9 years', startAge: 7, endAge: 9 },
  { id: 'AG003', name: '10-12 years', startAge: 10, endAge: 12 },
  { id: 'AG004', name: '13-15 years', startAge: 13, endAge: 15 },
  { id: 'AG005', name: '16-18 years', startAge: 16, endAge: 18 },
  { id: 'AG006', name: '19+ years', startAge: 19, endAge: 99 }
];

export const mockEvents: Event[] = [
  {
    id: 'E001',
    name: 'California State Championship 2024',
    description: 'Annual state championship for all categories',
    venue: 'Olympic Sports Complex',
    startDate: '2024-12-25',
    endDate: '2024-12-27',
    status: 'upcoming',
    totalParticipants: 156,
    races: mockRaces,
    ageGroups: mockAgeGroups,
    raceMatrix: [],
    createdAt: '2024-11-01'
  },
  {
    id: 'E002',
    name: 'Winter Cup 2024',
    description: 'End of year competition',
    venue: 'Metro Sports Arena',
    startDate: '2024-12-30',
    endDate: '2024-12-31',
    status: 'upcoming',
    totalParticipants: 89,
    races: mockRaces.slice(0, 2),
    ageGroups: mockAgeGroups.slice(0, 4),
    raceMatrix: [],
    createdAt: '2024-11-15'
  }
];

export const mockSchedules: Schedule[] = [
  {
    id: 'S001',
    eventId: 'E001',
    raceId: 'R001',
    raceName: '100m Sprint',
    ageGroupId: 'AG003',
    ageGroupName: '10-12 years',
    category: 'beginner',
    scheduledTime: '2024-12-25T10:00:00',
    heatNumber: 'Heat 1',
    participants: [
      {
        id: 'SP001',
        playerId: '4',
        playerName: 'Emma Wilson',
        gender: 'female',
        club: 'Thunder Skating Club',
        district: 'Central District',
        rounds: [
          { round: 1, score: 12.5 },
          { round: 2, score: 12.2 },
          { round: 3, score: 12.8 },
          { round: 4, score: 12.1 },
          { round: 5, score: 12.0 }
        ],
        totalScore: 12.32,
        rank: 1,
        status: 'completed',
        medal: 'gold'
      }
    ],
    resultsEntered: true
  }
];

export const mockPlayerResults: PlayerResult[] = [
  {
    playerId: '4',
    playerName: 'Emma Wilson',
    eventName: 'California State Championship 2024',
    raceName: '100m Sprint',
    ageGroup: '10-12 years',
    category: 'beginner',
    score: 12.32,
    time: '12.32s',
    rank: 1,
    medal: 'gold',
    status: 'completed'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalPlayers: 156,
  totalClubs: 24,
  totalDistricts: 8,
  totalStates: 3,
  upcomingEvents: mockEvents,
  upcomingBirthdays: mockPlayers.filter(player => {
    const today = new Date();
    const birthday = new Date(player.dateOfBirth);
    const thisYear = today.getFullYear();
    const birthdayThisYear = new Date(thisYear, birthday.getMonth(), birthday.getDate());
    const daysUntilBirthday = Math.ceil((birthdayThisYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilBirthday >= 0 && daysUntilBirthday <= 30;
  })
};