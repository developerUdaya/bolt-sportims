import React from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import FormField from '../UI/FormField';
import Tabs from '../UI/Tabs';
import { Event, Race, AgeGroup, RaceMatrix } from '../../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Partial<Event>) => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [eventData, setEventData] = React.useState<Partial<Event>>({
    name: '',
    description: '',
    venue: '',
    startDate: '',
    endDate: '',
    races: [],
    ageGroups: [],
    raceMatrix: []
  });

  const [races, setRaces] = React.useState<Race[]>([]);
  const [ageGroups, setAgeGroups] = React.useState<AgeGroup[]>([]);
  const [raceMatrix, setRaceMatrix] = React.useState<RaceMatrix[]>([]);

  const categories = [
    { id: 'beginner', name: 'beginner', description: 'Beginner level' },
    { id: 'fancy', name: 'fancy', description: 'Fancy skating' },
    { id: 'inline', name: 'inline', description: 'Inline skating' },
    { id: 'quad', name: 'quad', description: 'Quad skating' }
  ];

  const addRace = () => {
    const newRace: Race = {
      id: `R${Date.now()}`,
      name: '',
      description: '',
      genderEligibility: 'all'
    };
    setRaces([...races, newRace]);
  };

  const updateRace = (index: number, field: keyof Race, value: string) => {
    const updatedRaces = [...races];
    updatedRaces[index] = { ...updatedRaces[index], [field]: value };
    setRaces(updatedRaces);
  };

  const removeRace = (index: number) => {
    setRaces(races.filter((_, i) => i !== index));
  };

  const addAgeGroup = () => {
    const newAgeGroup: AgeGroup = {
      id: `AG${Date.now()}`,
      name: '',
      startAge: 0,
      endAge: 0
    };
    setAgeGroups([...ageGroups, newAgeGroup]);
  };

  const updateAgeGroup = (index: number, field: keyof AgeGroup, value: string | number) => {
    const updatedAgeGroups = [...ageGroups];
    updatedAgeGroups[index] = { ...updatedAgeGroups[index], [field]: value };
    setAgeGroups(updatedAgeGroups);
  };

  const removeAgeGroup = (index: number) => {
    setAgeGroups(ageGroups.filter((_, i) => i !== index));
  };

  const toggleRaceMatrix = (raceId: string, ageGroupId: string, category: string) => {
    const existingIndex = raceMatrix.findIndex(
      rm => rm.raceId === raceId && rm.ageGroupId === ageGroupId && rm.category.name === category
    );

    if (existingIndex >= 0) {
      setRaceMatrix(raceMatrix.filter((_, i) => i !== existingIndex));
    } else {
      const newMatrix: RaceMatrix = {
        id: `RM${Date.now()}`,
        raceId,
        ageGroupId,
        category: categories.find(c => c.name === category)!,
        isEnabled: true,
        maxRacesPerPlayer: 1
      };
      setRaceMatrix([...raceMatrix, newMatrix]);
    }
  };

  const updateMaxRaces = (raceId: string, ageGroupId: string, category: string, maxRaces: number) => {
    const updatedMatrix = raceMatrix.map(rm => {
      if (rm.raceId === raceId && rm.ageGroupId === ageGroupId && rm.category.name === category) {
        return { ...rm, maxRacesPerPlayer: maxRaces };
      }
      return rm;
    });
    setRaceMatrix(updatedMatrix);
  };

  const isRaceEnabled = (raceId: string, ageGroupId: string, category: string) => {
    return raceMatrix.some(rm => 
      rm.raceId === raceId && rm.ageGroupId === ageGroupId && rm.category.name === category
    );
  };

  const getMaxRaces = (raceId: string, ageGroupId: string, category: string) => {
    const matrix = raceMatrix.find(rm => 
      rm.raceId === raceId && rm.ageGroupId === ageGroupId && rm.category.name === category
    );
    return matrix?.maxRacesPerPlayer || 1;
  };

  const handleSave = () => {
    const finalEventData = {
      ...eventData,
      races,
      ageGroups,
      raceMatrix,
      totalParticipants: 0,
      status: 'upcoming' as const,
      createdAt: new Date().toISOString()
    };
    onSave(finalEventData);
    onClose();
  };

  const stepTabs = [
    {
      id: 'basic',
      label: 'Basic Details',
      content: (
        <div className="space-y-4">
          <FormField label="Event Name" required>
            <input
              type="text"
              value={eventData.name || ''}
              onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter event name"
            />
          </FormField>

          <FormField label="Description">
            <textarea
              value={eventData.description || ''}
              onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Enter event description"
            />
          </FormField>

          <FormField label="Venue" required>
            <input
              type="text"
              value={eventData.venue || ''}
              onChange={(e) => setEventData({ ...eventData, venue: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter venue location"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Date" required>
              <input
                type="date"
                value={eventData.startDate || ''}
                onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </FormField>

            <FormField label="End Date" required>
              <input
                type="date"
                value={eventData.endDate || ''}
                onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </FormField>
          </div>

          <FormField label="Event Banner">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
            </div>
          </FormField>
        </div>
      )
    },
    {
      id: 'races',
      label: 'Define Races',
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Race Types</h3>
            <Button onClick={addRace} size="sm">
              <Plus size={16} className="mr-2" />
              Add Race
            </Button>
          </div>

          <div className="space-y-4">
            {races.map((race, index) => (
              <div key={race.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Race {index + 1}</h4>
                  <Button
                    onClick={() => removeRace(index)}
                    variant="danger"
                    size="sm"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Race Name" required>
                    <input
                      type="text"
                      value={race.name}
                      onChange={(e) => updateRace(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 100m Sprint"
                    />
                  </FormField>

                  <FormField label="Gender Eligibility">
                    <select
                      value={race.genderEligibility}
                      onChange={(e) => updateRace(index, 'genderEligibility', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </FormField>
                </div>

                <FormField label="Description">
                  <textarea
                    value={race.description || ''}
                    onChange={(e) => updateRace(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="Optional race description"
                  />
                </FormField>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'ageGroups',
      label: 'Age Groups',
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Age Groups</h3>
            <Button onClick={addAgeGroup} size="sm">
              <Plus size={16} className="mr-2" />
              Add Age Group
            </Button>
          </div>

          <div className="space-y-4">
            {ageGroups.map((ageGroup, index) => (
              <div key={ageGroup.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Age Group {index + 1}</h4>
                  <Button
                    onClick={() => removeAgeGroup(index)}
                    variant="danger"
                    size="sm"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField label="Group Name" required>
                    <input
                      type="text"
                      value={ageGroup.name}
                      onChange={(e) => updateAgeGroup(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 4-6 years"
                    />
                  </FormField>

                  <FormField label="Start Age" required>
                    <input
                      type="number"
                      value={ageGroup.startAge}
                      onChange={(e) => updateAgeGroup(index, 'startAge', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </FormField>

                  <FormField label="End Age" required>
                    <input
                      type="number"
                      value={ageGroup.endAge}
                      onChange={(e) => updateAgeGroup(index, 'endAge', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </FormField>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'matrix',
      label: 'Race Matrix',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Map Races × Age Groups × Categories</h3>
          
          {categories.map(category => (
            <div key={category.id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium mb-4 capitalize">{category.name} Category</h4>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Age Group</th>
                      {races.map(race => (
                        <th key={race.id} className="border border-gray-300 px-4 py-2 text-center">
                          {race.name || `Race ${races.indexOf(race) + 1}`}
                        </th>
                      ))}
                      <th className="border border-gray-300 px-4 py-2 text-center">Max Races Per Player</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ageGroups.map(ageGroup => (
                      <tr key={ageGroup.id}>
                        <td className="border border-gray-300 px-4 py-2 font-medium">
                          {ageGroup.name || `${ageGroup.startAge}-${ageGroup.endAge} years`}
                        </td>
                        {races.map(race => (
                          <td key={race.id} className="border border-gray-300 px-4 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={isRaceEnabled(race.id, ageGroup.id, category.name)}
                              onChange={() => toggleRaceMatrix(race.id, ageGroup.id, category.name)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </td>
                        ))}
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={getMaxRaces(races[0]?.id, ageGroup.id, category.name)}
                            onChange={(e) => races.forEach(race => 
                              updateMaxRaces(race.id, ageGroup.id, category.name, parseInt(e.target.value))
                            )}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Event" size="2xl">
      <div className="space-y-6">
        <Tabs tabs={stepTabs} />
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Create Event
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateEventModal;