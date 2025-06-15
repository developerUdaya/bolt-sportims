import React from 'react';
import { Check, X, Eye, Edit } from 'lucide-react';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Card from '../../components/UI/Card';
import { mockDistricts } from '../../data/mockData';
import { District } from '../../types';

const DistrictsApproval: React.FC = () => {
    const [pendingDistrict, setPendingDistrict] = React.useState<District[]>(
        mockDistricts.filter(p => !p.approved)
    );

    const handleApprove = (playerId: string) => {
        setPendingDistrict(prev => prev.filter(p => p.id !== playerId));
        // In real app, would make API call to approve
    };

    const handleReject = (playerId: string) => {
        setPendingDistrict(prev => prev.filter(p => p.id !== playerId));
        // In real app, would make API call to reject
    };

    const columns = [
        { key: 'districtCode', label: 'District Code', sortable: true },
        { key: 'name', label: 'District Name', sortable: true },
        { key: 'state', label: 'State', sortable: true },
        {
            key: 'population',
            label: 'Population',
            sortable: true,
            render: (value: number) => value.toLocaleString()
        },
        {
            key: 'area',
            label: 'Area (sq km)',
            sortable: true,
            render: (value: number) => value.toLocaleString()
        },
        { key: 'email', label: 'Email', sortable: true },
        {
            key: 'actions',
            label: 'Actions',
            render: (value: any, player: District) => (
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
                    <h1 className="text-2xl font-bold text-gray-900">Districts Pending Approval</h1>
                    <p className="text-gray-600 mt-1">Review and approve districts registrations</p>
                </div>
                <Badge variant="warning">
                    {pendingDistrict.length} Pending
                </Badge>
            </div>

            <Card>
                <Table
                    columns={columns}
                    data={pendingDistrict}
                    searchable
                    searchPlaceholder="Search districts club..."
                />
            </Card>
        </div>
    );
};

export default DistrictsApproval