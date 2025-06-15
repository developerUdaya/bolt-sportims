import React from 'react';
import { Check, X, Eye, Edit } from 'lucide-react';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Card from '../../components/UI/Card';
import { mockClubs } from '../../data/mockData';
import { Club } from '../../types';

const ClubsApproval: React.FC = () => {
    const [pendingPlayers, setPendingPlayers] = React.useState<Club[]>(
        mockClubs.filter(p => !p.approved)
    );

    const handleApprove = (playerId: string) => {
        setPendingPlayers(prev => prev.filter(p => p.id !== playerId));
        // In real app, would make API call to approve
    };

    const handleReject = (playerId: string) => {
        setPendingPlayers(prev => prev.filter(p => p.id !== playerId));
        // In real app, would make API call to reject
    };

    const columns = [
        { key: 'clubId', label: 'Club ID', sortable: true },
        { key: 'name', label: 'Club Name', sortable: true },
        { key: 'contactPerson', label: 'Contact Person', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'phone', label: 'Phone', sortable: true },
        {
            key: 'establishedYear',
            label: 'Established',
            sortable: true
        },
        { key: 'district', label: 'District', sortable: true },
        { key: 'state', label: 'State', sortable: true },
        {
            key: 'actions',
            label: 'Actions',
            render: (value: any, player: Club) => (
                <div className="flex items-center space-x-2">
                    <Button size="sm" variant="secondary">
                        <Eye size={16} />
                    </Button>
                    <Button size="sm" variant="primary">
                        <Edit size={16} />
                    </Button>
                    <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleApprove(player.id)}
                    >
                        <Check size={16} />
                    </Button>
                    <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleReject(player.id)}
                    >
                        <X size={16} />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Clubs Pending Approval</h1>
                    <p className="text-gray-600 mt-1">Review and approve club registrations</p>
                </div>
                <Badge variant="warning">
                    {pendingPlayers.length} Pending
                </Badge>
            </div>

            <Card>
                <Table
                    columns={columns}
                    data={pendingPlayers}
                    searchable
                    searchPlaceholder="Search pending club..."
                />
            </Card>
        </div>
    );
};

export default ClubsApproval;