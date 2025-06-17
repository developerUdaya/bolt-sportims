import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, Clock, CheckCircle } from 'lucide-react';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import FormField from '../../components/UI/FormField';
import { mockEvents, mockRaces, mockAgeGroups } from '../../data/mockData';
import { Event } from '../../types';
import axios from 'axios';
import { usePlayer } from '../../context/PlayerContext';

interface RegistrationData {
  selectedRaces: string[];
  ageGroup: string;
  category: string;
}

const UpcomingEvents: React.FC = () => {
  const [events, setEvents] = React.useState(mockEvents.filter(e => e.status === 'upcoming'));
  const [showRegistrationModal, setShowRegistrationModal] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<any>(null);
  const [registrationData, setRegistrationData] = React.useState<RegistrationData>({
    selectedRaces: [],
    ageGroup: '',
    category: 'beginner'
  });

  

  // Mock current player data
  const currentPlayer = {
    dateOfBirth: '2010-05-12',
    gender: 'female',
    category: 'beginner'
  };

    const { player } = usePlayer();

  
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const [upcomingEvents, setUpcomingEvents] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseURL}/events/get-all-with-full-details`);
        console.log(response);

        const currentDate = new Date(); // Dynamic current date
        const events = response.data.filter((event: any) => new Date(event.eventDate) > currentDate);
        setUpcomingEvents(events);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load upcoming events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [baseURL]);

  console.log(upcomingEvents,'upcomingEvents');
  

const calculateAge = (dob: string, ageAsOnDate: string) => {
  
  const asOn = new Date(ageAsOnDate);
  const birthDate = new Date(dob);

  let age = asOn.getFullYear() - birthDate.getFullYear();
  const monthDiff = asOn.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && asOn.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

  const getEligibleAgeGroups = () => {
    const age = calculateAge(currentPlayer.dateOfBirth);
  return mockAgeGroups.filter(ag => age >= ag.startAge && age <= ag.endAge);
  };

  const getEligibleRaces = () => {
    if (!selectedEvent) return [];
    return selectedEvent?.races?.filter((race:any) => 
      race.genderEligibility === 'all' || race.genderEligibility === currentPlayer.gender
    );
  };

  const handleRegister = (event: Event) => {
    setSelectedEvent(event);
    setRegistrationData({
      selectedRaces: [],
      ageGroup: '',
      category: currentPlayer.category
    });
    setShowRegistrationModal(true);
  };

  const handleRaceSelection = (raceId: string) => {
    const maxRaces = 3; // Admin configured limit
    setRegistrationData(prev => {
      const isSelected = prev.selectedRaces.includes(raceId);
      if (isSelected) {
        return {
          ...prev,
          selectedRaces: prev.selectedRaces.filter(id => id !== raceId)
        };
      } else if (prev.selectedRaces.length < maxRaces) {
        return {
          ...prev,
          selectedRaces: [...prev.selectedRaces, raceId]
        };
      }
      return prev;
    });
  };

  const handleSubmitRegistration = () => {
    // Here you would submit the registration to the backend
    console.log('Registration submitted:', {
      eventId: selectedEvent?.id,
      ...registrationData
    });
    
    // Show success message and close modal
    alert('Registration submitted successfully! Awaiting admin approval.');
    setShowRegistrationModal(false);
  };

  const eligibleAgeGroups = getEligibleAgeGroups();
  const eligibleRaces = getEligibleRaces();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upcoming Events</h1>
        <p className="text-gray-600 mt-1">Register for upcoming sports events and competitions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {upcomingEvents.map((event:any) => (
          <Card key={event?.id} className="overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{event?.name}</h3>
                  <p className="text-gray-600 mb-3">{event?.description}</p>
                </div>
                <Badge variant="success" size="sm">Open</Badge>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-2 text-gray-400" />
                  {event?.venue}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2 text-gray-400" />
                  {new Date(event.eventDate).toLocaleDateString()}
                </div>
                {/* <div className="flex items-center text-sm text-gray-600">
                  <Users size={16} className="mr-2 text-gray-400" />
                  {event?.totalParticipants} participants registered
                </div> */}
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Available Categories:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="info" size="sm">Beginner</Badge>
                  <Badge variant="info" size="sm">Fancy</Badge>
                  <Badge variant="info" size="sm">Inline</Badge>
                  <Badge variant="info" size="sm">Quad</Badge>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Age Groups:</h4>
                <div className="flex flex-wrap gap-2">
                  {event?.ageGroups?.map((ag:any) => (
                    <Badge key={ag?.id} variant="default" size="sm">
                      {ag?.ageGroupName}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Available Races:</h4>
                <div className="space-y-1">
                  {event?.races?.slice(0, 3).map((race:any) => (
                    <div key={race.id} className="text-sm text-gray-600">
                      • {race.name}
                    </div>
                  ))}
                  {event?.races?.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{event.races.length - 3} more races
                    </div>
                  )}
                </div>
              </div>

              <Button 
                variant="primary" 
                className="w-full"
                onClick={() => handleRegister(event)}
              >
                Register for Event
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming events</h3>
            <p className="mt-1 text-sm text-gray-500">
              Check back later for new events and competitions.
            </p>
          </div>
        </Card>
      )}

      {/* Registration Modal */}
      <Modal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        title={`Register for ${selectedEvent?.name}`}
        size="xl"
      >
        <div className="space-y-6">
          {/* Event Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Event Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Event:</span> {selectedEvent?.name}
              </div>
              <div>
                <span className="font-medium">Venue:</span> {selectedEvent?.venue}
              </div>
              <div>
                <span className="font-medium">Dates:</span> {selectedEvent && new Date(selectedEvent?.eventDate).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Your Age:</span> {calculateAge(player?.dob, selectedEvent?.ageAsOnDate)} years
              </div>
            </div>
          </div>

          {/* Age Group Selection */}
          <FormField label="Select Age Group" required>
            <select
              value={registrationData.ageGroup}
              onChange={(e) => setRegistrationData({ ...registrationData, ageGroup: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {selectedEvent?.ageGroups.map((ag:any) => (
                <option key={ag?.id} value={ag?.id}>{ag?.ageGroupName}</option>
              ))}
            </select>
          </FormField>

          {/* Category Selection */}
          <FormField label="Category" required>
            <select
              value={registrationData.category}
              onChange={(e) => setRegistrationData({ ...registrationData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="beginner">Beginner</option>
              <option value="fancy">Fancy</option>
              <option value="inline">Inline</option>
              <option value="quad">Quad</option>
            </select>
          </FormField>

          {/* Race Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Races (Maximum 3)
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {eligibleRaces?.map((race:any) => (
                <label key={race.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={registrationData.selectedRaces.includes(race.id)}
                    onChange={() => handleRaceSelection(race.id)}
                    disabled={!registrationData.selectedRaces.includes(race.id) && registrationData.selectedRaces.length >= 3}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{race.name}</div>
                    {race.description && (
                      <div className="text-sm text-gray-500">{race.description}</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Selected: {registrationData.selectedRaces.length}/3 races
            </p>
          </div>

          {/* Registration Summary */}
          {registrationData.selectedRaces.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Registration Summary</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <div>Age Group: {eligibleAgeGroups.find((ag:any) => ag.id === registrationData.ageGroup)?.name}</div>
                <div>Category: {registrationData.category.charAt(0).toUpperCase() + registrationData.category.slice(1)}</div>
                <div>Selected Races: {registrationData.selectedRaces.length}</div>
                <ul className="list-disc list-inside ml-4">
                  {registrationData.selectedRaces.map(raceId => {
                    const race = eligibleRaces.find((r:any) => r.id === raceId);
                    return <li key={raceId}>{race?.name}</li>;
                  })}
                </ul>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowRegistrationModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitRegistration}
              disabled={!registrationData.ageGroup || registrationData.selectedRaces.length === 0}
            >
              <CheckCircle size={16} className="mr-2" />
              Submit Registration
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UpcomingEvents;