import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import FormField from '../UI/FormField';
import Tabs from '../UI/Tabs';
import axios from 'axios';
import { Event, Race, AgeGroup, RaceMatrix } from '../../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Partial<Event>) => void;
  modalMode: 'create' | 'view';
  initialEvent?: Partial<Event>;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  modalMode,
  initialEvent,
}) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const isReadOnly = modalMode === 'view';
  const [eventData, setEventData] = useState<any>({
    name: '',
    eventDate: '',
    venue: '',
    regStartingDate: '',
    regEndingDate: '',
    chestNumberPrefix: 'EV',
    ageAsOnDate: '',
    bannerUrl: '',
    advertisementUrl: '',
    declaration: '',
    instruction: '',
    eventFee: 0,
    certificateStatus: true,
    races: [],
    ageGroups: [],
    raceMatrix: [],
  });

  const [races, setRaces] = useState<Race[]>([]);
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);
  const [raceMatrix, setRaceMatrix] = useState<RaceMatrix[]>([]);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [adFile, setAdFile] = useState<File | null>(null);

  const categories = [
    { id: 'beginner', name: 'beginner', description: 'Beginner level' },
    { id: 'fancy', name: 'fancy', description: 'Fancy skating' },
    { id: 'inline', name: 'inline', description: 'Inline skating' },
    { id: 'quad', name: 'quad', description: 'Quad skating' },
  ];

  // Fetch event data in view mode
  useEffect(() => {
    if (modalMode === 'view' && initialEvent?.id) {
      const fetchEventData = async () => {
        try {
          const response = await axios.get(`${baseURL}/events/${initialEvent.id}`);
          const event: any = response.data;
          console.log('Fetched event data:', event);

          setEventData({
            name: event?.event?.name || '',
            eventDate: event.event?.eventDate || '',
            venue: event.event?.venue || '',
            regStartingDate: event.event?.regStartingDate || '',
            regEndingDate: event.event?.regEndingDate || '',
            chestNumberPrefix: event.event?.chestNumberPrefix || 'EV',
            ageAsOnDate: event.event?.ageAsOnDate || '',
            bannerUrl: event.event?.bannerUrl || '',
            advertisementUrl: event.event?.advertisementUrl || '',
            declaration: event.event?.declaration || '',
            instruction: event.event?.instruction || '',
            eventFee: event.event?.eventFee || 0,
            certificateStatus: event.event?.certificateStatus ?? true,
            races: event.event?.races || [],
            ageGroups: event.event?.ageGroups || [],
            raceMatrix: event.event?.raceMatrix || [],
          });
          setRaces(
            (event.races || []).map((race: Race) => ({
              ...race,
              id: race.id || `R${Date.now()}`,
            }))
          );
          setAgeGroups(
            (event.ageGroups || []).map((group: any) => ({
              ...group,
              id: group.id?.toString() || `AG${Date.now()}`, // Ensure ID is string
              name: group.ageGroupName || '', // Map ageGroupName to name
              startingDate: group.startingDate || '',
              endingDate: group.endingDate || '',
            }))
          );
          setRaceMatrix(
            (event.racesForAgeGroups || []).flatMap((entry: any) =>
              entry.raceIds.split(',').map((raceId: string) => ({
                id: `RM${entry.id}-${raceId}`, // Unique ID
                raceId: raceId.trim(),
                ageGroupId: entry.ageGroupId.toString(),
                category: categories.find((c) => c.name === entry.skateCategory) || {
                  id: entry.skateCategory,
                  name: entry.skateCategory,
                  description: entry.skateCategory,
                },
                isEnabled: true, // Assume enabled
                maxRacesPerPlayer: entry.exactRacesToSelectByPlayerCount || 1, // Use exactRacesToSelectByPlayerCount
              }))
            )
          );
        } catch (error) {
          console.error('Failed to fetch event data:', error);
          alert('Failed to load event details. Please try again.');
        }
      };
      fetchEventData();
    } else {
      // Reset for create mode
      setEventData({
        name: '',
        eventDate: '',
        venue: '',
        regStartingDate: '',
        regEndingDate: '',
        chestNumberPrefix: 'EV',
        ageAsOnDate: '',
        bannerUrl: '',
        advertisementUrl: '',
        declaration: '',
        instruction: '',
        eventFee: 0,
        certificateStatus: true,
        races: [],
        ageGroups: [],
        raceMatrix: [],
      });
      setRaces([]);
      setAgeGroups([]);
      setRaceMatrix([]);
      setBannerFile(null);
      setAdFile(null);
    }
  }, [modalMode, initialEvent, baseURL]);

  const addRace = () => {
    const newRace: Race = {
      id: `R${Date.now()}`,
      name: '',
      description: '',
      genderEligibility: 'all',
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
    setRaceMatrix(raceMatrix.filter((rm) => rm.raceId !== races[index].id));
  };

  const addAgeGroup = () => {
    const newAgeGroup: any = {
      id: `AG${Date.now()}`,
      name: '',
      startingDate: '',
      endingDate: '',
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
    setRaceMatrix(raceMatrix.filter((rm) => rm.ageGroupId !== ageGroups[index].id));
  };

  const toggleRaceMatrix = (raceId: string, ageGroupId: string, category: string) => {
    const existingIndex = raceMatrix.findIndex(
      (rm) => rm.raceId === raceId && rm.ageGroupId === ageGroupId && rm.category.name === category
    );

    if (existingIndex >= 0) {
      setRaceMatrix(raceMatrix.filter((_, i) => i !== existingIndex));
    } else {
      const newMatrix: any = {
        id: `RM${Date.now()}`,
        raceId,
        ageGroupId,
        category: categories.find((c) => c.name === category)!,
        isEnabled: true,
        maxRacesPerPlayer: 1,
      };
      setRaceMatrix([...raceMatrix, newMatrix]);
    }
  };

  const updateMaxRaces = (raceId: string, ageGroupId: string, category: string, maxRaces: number) => {
    const updatedMatrix = raceMatrix.map((rm) => {
      if (rm.raceId === raceId && rm.ageGroupId === ageGroupId && rm.category.name === category) {
        return { ...rm, maxRacesPerPlayer: maxRaces };
      }
      return rm;
    });
    setRaceMatrix(updatedMatrix);
  };
  console.log('raceMatrix:', raceMatrix);

  const isRaceEnabled = (raceId: string, ageGroupId: string, category: string) => {
    return raceMatrix.some(
      (rm) => rm.raceId === raceId && rm.ageGroupId === ageGroupId && rm.category.name === category
    );
  };

  const getMaxRaces = (raceId: string, ageGroupId: string, category: string) => {
    const matrix = raceMatrix.find(
      (rm) => rm.raceId === raceId && rm.ageGroupId === ageGroupId && rm.category.name === category
    );
    return matrix?.maxRacesPerPlayer || 1;
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await axios.post(`${baseURL}/upload/image/`, formData);
      return response.data.url;
    } catch (error) {
      console.error('File upload failed:', error);
      alert('Failed to upload file. Please try again.');
      return '';
    }
  };

  const handleSave = async () => {
    if (modalMode === 'view') {
      onClose();
      return;
    }

    let bannerUrl = eventData.bannerUrl;
    let advertisementUrl = eventData.advertisementUrl;
    if (bannerFile) {
      bannerUrl = await handleFileUpload(bannerFile);
    }
    if (adFile) {
      advertisementUrl = await handleFileUpload(adFile);
    }

    const racesForSkateCategories = ageGroups.reduce((acc, ageGroup) => {
      const categoriesForGroup: any = {};
      categories.forEach((category) => {
        const racesForCategory = raceMatrix
          .filter((rm) => rm.ageGroupId === ageGroup.id && rm.category.name === category.name)
          .map((rm) => races.find((race) => race.id === rm.raceId)?.name)
          .filter((name): name is string => !!name);
        if (racesForCategory.length > 0) {
          const maxRaces = getMaxRaces(
            raceMatrix.find((rm) => rm.ageGroupId === ageGroup.id && rm.category.name === category.name)?.raceId || '',
            ageGroup.id,
            category.name
          );
          categoriesForGroup[category.name] = {
            races: racesForCategory,
            min: 0,
            max: maxRaces,
            exact: maxRaces,
          };
        }
      });
      return { ...acc, [ageGroup.id]: categoriesForGroup };
    }, {});

    const payload = {
      event: {
        name: eventData.name || '',
        eventDate: eventData.eventDate || '',
        venue: eventData.venue || '',
        regStartingDate: eventData.regStartingDate || '',
        regEndingDate: eventData.regEndingDate || '',
        chestNumberPrefix: eventData.chestNumberPrefix || 'EV',
        ageAsOnDate: eventData.ageAsOnDate || '',
        bannerUrl: bannerUrl || '',
        advertisementUrl: advertisementUrl || '',
        declaration: eventData.declaration || '',
        instruction: eventData.instruction || '',
        eventFee: eventData.eventFee || 0,
        certificateStatus: eventData.certificateStatus || true,
      },
      races: races.map((race: any) => ({ name: race.name })),
      ageGroups: ageGroups?.map((ageGroup: any) => ({
        ageGroupName: ageGroup.name || '',
        startingDate: ageGroup.startingDate || '',
        endingDate: ageGroup.endingDate || '',
        racesForSkateCategories: racesForSkateCategories[ageGroup.id] || {},
      })),
    };

    console.log('Payload:', JSON.stringify(payload, null, 2)); // Debug

    try {
      await axios.post(`${baseURL}/events/create-new-event`, payload);
      onSave({ ...eventData, races, ageGroups, raceMatrix });
      onClose();
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
    }
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
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Declaration">
            <textarea
              value={eventData.declaration || ''}
              onChange={(e) => setEventData({ ...eventData, declaration: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Enter declaration text"
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Instruction">
            <textarea
              value={eventData.instruction || ''}
              onChange={(e) => setEventData({ ...eventData, instruction: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Enter instruction text"
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Event Venue" required>
            <input
              type="text"
              value={eventData.venue || ''}
              onChange={(e) => setEventData({ ...eventData, venue: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter venue"
              readOnly={isReadOnly}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Event Date" required>
              <input
                type="date"
                value={eventData.eventDate || ''}
                onChange={(e) => setEventData({ ...eventData, eventDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly={isReadOnly}
              />
            </FormField>

            <FormField label="Age As On Date" required>
              <input
                type="date"
                value={eventData.ageAsOnDate || ''}
                onChange={(e) => setEventData({ ...eventData, ageAsOnDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly={isReadOnly}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Registration Start Date" required>
              <input
                type="date"
                value={eventData.regStartingDate || ''}
                onChange={(e) => setEventData({ ...eventData, regStartingDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly={isReadOnly}
              />
            </FormField>

            <FormField label="Registration End Date" required>
              <input
                type="date"
                value={eventData.regEndingDate || ''}
                onChange={(e) => setEventData({ ...eventData, regEndingDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly={isReadOnly}
              />
            </FormField>
          </div>

          <FormField label="Chest Number Prefix" required>
            <input
              type="text"
              value={eventData.chestNumberPrefix || ''}
              onChange={(e) => setEventData({ ...eventData, chestNumberPrefix: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., EV"
              maxLength={2}
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Event Fee" required>
            <input
              type="number"
              step="0.01"
              value={eventData.eventFee || ''}
              onChange={(e) => setEventData({ ...eventData, eventFee: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter event fee"
              min="0"
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Certificate Status">
            <input
              type="checkbox"
              checked={eventData.certificateStatus || false}
              onChange={(e) => setEventData({ ...eventData, certificateStatus: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              disabled={isReadOnly}
            />
            <label className="ml-2 text-sm text-gray-700">Enable Certificates</label>
          </FormField>

          <FormField label="Event Banner">
            {isReadOnly && eventData.bannerUrl ? (
              <a
                href={eventData.bannerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Banner
              </a>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setBannerFile(e.target.files[0]);
                    }
                  }}
                  className="mt-2 text-sm text-gray-600"
                  disabled={isReadOnly}
                />
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            )}
          </FormField>

          <FormField label="Advertisement Image">
            {isReadOnly && eventData.advertisementUrl ? (
              <a
                href={eventData.advertisementUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Advertisement
              </a>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setAdFile(e.target.files[0]);
                    }
                  }}
                  className="mt-2 text-sm text-gray-600"
                  disabled={isReadOnly}
                />
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            )}
          </FormField>
        </div>
      ),
    },
    {
      id: 'races',
      label: 'Define Races',
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Race Types</h3>
            {!isReadOnly && (
              <Button onClick={addRace} size="sm">
                <Plus size={16} className="mr-2" />
                Add Race
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {races.map((race, index) => (
              <div key={race.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Race {index + 1}</h4>
                  {!isReadOnly && (
                    <Button onClick={() => removeRace(index)} variant="danger" size="sm">
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Race Name" required>
                    <input
                      type="text"
                      value={race.name}
                      onChange={(e) => updateRace(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 100m Sprint"
                      readOnly={isReadOnly}
                    />
                  </FormField>

                  <FormField label="Gender Eligibility">
                    <select
                      value={race.genderEligibility}
                      onChange={(e) => updateRace(index, 'genderEligibility', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isReadOnly}
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
                    readOnly={isReadOnly}
                  />
                </FormField>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'ageGroups',
      label: 'Age Groups',
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Age Groups</h3>
            {!isReadOnly && (
              <Button onClick={addAgeGroup} size="sm">
                <Plus size={16} className="mr-2" />
                Add Age Group
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {ageGroups.map((ageGroup: any, index) => (
              <div key={ageGroup.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Age Group {index + 1}</h4>
                  {!isReadOnly && (
                    <Button onClick={() => removeAgeGroup(index)} variant="danger" size="sm">
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField label="Group Name" required>
                    <input
                      type="text"
                      value={ageGroup.name}
                      onChange={(e) => updateAgeGroup(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Under 10"
                      readOnly={isReadOnly}
                    />
                  </FormField>

                  <FormField label="Starting Date" required>
                    <input
                      type="date"
                      value={ageGroup.startingDate || ''}
                      onChange={(e) => updateAgeGroup(index, 'startingDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      readOnly={isReadOnly}
                    />
                  </FormField>

                  <FormField label="Ending Date" required>
                    <input
                      type="date"
                      value={ageGroup.endingDate || ''}
                      onChange={(e) => updateAgeGroup(index, 'endingDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      readOnly={isReadOnly}
                    />
                  </FormField>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'matrix',
      label: 'Race Matrix',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Map Races × Age Groups × Categories</h3>

          {categories.map((category) => (
            <div key={category.id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium mb-4 capitalize">{category.name} Category</h4>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Age Group</th>
                      {races.map((race) => (
                        <th key={race.id} className="border border-gray-300 px-4 py-2 text-center">
                          {race.name || `Race ${races.indexOf(race) + 1}`}
                        </th>
                      ))}
                      <th className="border border-gray-300 px-4 py-2 text-center">Max Races Per Player</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ageGroups.map((ageGroup: any) => (
                      <tr key={ageGroup.id}>
                        <td className="border border-gray-300 px-4 py-2 font-medium">
                          {ageGroup.name || `${ageGroup.startingDate}-${ageGroup.endingDate}`}
                        </td>
                        {races.map((race) => (
                          <td key={race.id} className="border border-gray-300 px-4 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={isRaceEnabled(race.id, ageGroup.id, category.name)}
                              onChange={() => toggleRaceMatrix(race.id, ageGroup.id, category.name)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              disabled={isReadOnly}
                            />
                          </td>
                        ))}
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={
                              eventData.raceMatrix?.find(
                                (rm: any) => rm.ageGroupId === ageGroup.id && rm.skateCategory === category.name
                              )?.exactRacesToSelectByPlayerCount || 1
                            }
                            onChange={(e) =>
                              races.forEach((race) =>
                                updateMaxRaces(race.id, ageGroup.id, category.name, parseInt(e.target.value))
                              )
                            }
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                            readOnly={isReadOnly}
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
      ),
    },
  ];

  

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalMode === 'create' ? 'Create New Event' : 'View Event Details'}
      size="2xl"
    >
      <div className="space-y-6">
        <Tabs tabs={stepTabs} />
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            {isReadOnly ? 'Close' : 'Cancel'}
          </Button>
          {!isReadOnly && <Button onClick={handleSave}>Create Event</Button>}
        </div>
      </div>
    </Modal>
  );
};

export default CreateEventModal;