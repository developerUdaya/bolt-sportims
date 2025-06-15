import React from 'react';
import { Save } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import FormField from '../UI/FormField';

interface OfficialModelProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (official: any) => void;
    official?: any;
    mode: 'create' | 'edit' | 'view';
}

const OfficialModel: React.FC<OfficialModelProps> = ({ isOpen, onClose, onSave, official, mode }) => {
    const [formData, setFormData] = React.useState({
        officialName: '',
        userName: '',
        password: '',
        event: '',
    });

    React.useEffect(() => {
        if (official && mode !== 'create') {
            setFormData({
                officialName: official.name || '',
                userName: official.username || '',
                password: official.password || '',
                event: official.eventId || '',
            });
        } else {
            setFormData({
                officialName: '',
                userName: '',
                password: '',
                event: '',
            });
        }
    }, [official, mode, isOpen]);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const isReadOnly = mode === 'view';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${mode === 'create' ? 'Add New' : mode === 'edit' ? 'Edit' : 'View'} Event Official`}
            size="xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Official Name" required>
                        <input
                            type="text"
                            value={formData.officialName}
                            onChange={(e) => setFormData({ ...formData, officialName: e.target.value })}
                            placeholder="Enter Official Name"
                            className="w-full px-3 py-2 border rounded-lg"
                            required
                            readOnly={isReadOnly}
                        />
                    </FormField>

                    <FormField label="User Name" required>
                        <input
                            type="text"
                            value={formData.userName}
                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                            placeholder="Enter User Name"
                            className="w-full px-3 py-2 border rounded-lg"
                            required
                            readOnly={isReadOnly}
                        />
                    </FormField>

                    <FormField label="Password" required>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Enter Password"
                            className="w-full px-3 py-2 border rounded-lg"
                            required
                            readOnly={isReadOnly}
                        />
                    </FormField>

                    <FormField label="Select Event" required>
                        <select
                            value={formData.event}
                            onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                            required
                            disabled={isReadOnly}
                        >
                            <option value="">Choose Event</option>
                            <option value="event1">Event One</option>
                            <option value="event2">Event Two</option>
                            {/* Add more options as needed */}
                        </select>
                    </FormField>
                </div>

                {mode !== 'view' && (
                    <div className="flex justify-end pt-4 border-t">
                        <Button type="submit">
                            <Save size={16} className="mr-2" />
                            Submit
                        </Button>
                    </div>
                )}
            </form>
        </Modal>
    );
};

export default OfficialModel;
