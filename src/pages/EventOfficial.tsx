import React from 'react';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import OfficialModel from '../components/Users/OfficialModel';
import { mockEventOfficials } from '../data/mockData';
import { EventOfficialType } from '../types';

const EventOfficial: React.FC = () => {
    const [officials, setOfficials] = React.useState<EventOfficialType[]>(mockEventOfficials);
    const [sortBy, setSortBy] = React.useState<string>('');
    const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
    const [showModal, setShowModal] = React.useState(false);
    const [selectedOfficial, setSelectedOfficial] = React.useState<EventOfficialType | null>(null);
    const [modalMode, setModalMode] = React.useState<'create' | 'edit' | 'view'>('create');
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleSort = (key: string) => {
        if (sortBy === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortOrder('asc');
        }

        const sorted = [...officials].sort((a, b) => {
            const aValue = a[key as keyof EventOfficialType] ?? '';
            const bValue = b[key as keyof EventOfficialType] ?? '';
            return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
        });

        setOfficials(sorted);
    };
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const filtered = mockEventOfficials.filter((official) =>
            official.name.toLowerCase().includes(query.toLowerCase()) ||
            official.username.toLowerCase().includes(query.toLowerCase()) ||
            official.eventName.toLowerCase().includes(query.toLowerCase())
        );
        setOfficials(filtered);
    };

    const handleCreateOfficial = () => {
        setSelectedOfficial(null);
        setModalMode('create');
        setShowModal(true);
    };

    const handleViewOfficial = (official: EventOfficialType) => {
        setSelectedOfficial(official);
        setModalMode('view');
        setShowModal(true);
    };

    const handleEditOfficial = (official: EventOfficialType) => {
        setSelectedOfficial(official);
        setModalMode('edit');
        setShowModal(true);
    };

    const handleDeleteOfficial = (officialId: string) => {
        if (confirm('Are you sure you want to delete this official?')) {
            setOfficials(prev => prev.filter(o => o.id !== officialId));
        }
    };

    const handleToggleStatus = (officialId: string) => {
        setOfficials(prev =>
            prev.map(o =>
                o.id === officialId ? { ...o, status: !o.status } : o
            )
        );
    };

    const handleSaveOfficial = (officialData: Partial<EventOfficialType>) => {
        if (modalMode === 'create') {
            const newOfficial: EventOfficialType = {
                id: `OFF${Date.now()}`,
                ...officialData,
                status: false,
            } as EventOfficialType;
            setOfficials(prev => [...prev, newOfficial]);
        } else if (modalMode === 'edit' && selectedOfficial) {
            setOfficials(prev =>
                prev.map(o =>
                    o.id === selectedOfficial.id ? { ...o, ...officialData } : o
                )
            );
        }
    };

    const columns = [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'username', label: 'User Name', sortable: true },
        { key: 'eventId', label: 'Event ID', sortable: true },
        { key: 'eventName', label: 'Event Name', sortable: true },
        {
            key: 'status',
            label: 'Status',
            render: (value: boolean, row: EventOfficialType) => (
                <div
                    className={`w-10 h-5 rounded-full flex items-center cursor-pointer p-0.5 ${value ? 'bg-purple-600' : 'bg-gray-400'
                        }`}
                    onClick={() => handleToggleStatus(row.id)}
                >
                    <div
                        className={`w-4 h-4 rounded-full bg-white transform duration-300 ${value ? 'translate-x-5' : 'translate-x-0'
                            }`}
                    ></div>
                </div>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (value: any, official: EventOfficialType) => (
                <div className="flex items-center space-x-2">
                    <Button size="sm" variant="secondary" onClick={() => handleViewOfficial(official)}>
                        <Eye size={16} />
                    </Button>
                    <Button size="sm" variant="primary" onClick={() => handleEditOfficial(official)}>
                        <Edit size={16} />
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDeleteOfficial(official.id)}>
                        <Trash2 size={16} />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Officials Management</h1>
                    <p className="text-gray-600 mt-1">Manage registered officials</p>
                </div>
                <Button variant="primary" onClick={handleCreateOfficial}>
                    <Plus size={16} className="mr-2" />
                    Add New Official
                </Button>
            </div>

            <Card>
                <Table
                    columns={columns}
                    data={officials}
                    searchable
                    searchPlaceholder="Search officials..."
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    onSearch={handleSearch}
                />
            </Card>

            <OfficialModel
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSaveOfficial}
                official={selectedOfficial}
                mode={modalMode}
            />
        </div>
    );
};

export default EventOfficial;
