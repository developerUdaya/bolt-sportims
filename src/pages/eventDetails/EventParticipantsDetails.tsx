import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../../components/UI/Card';
import Table from '../../components/UI/Table';
import { ArrowLeft } from 'lucide-react';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const EventParticipantsDetails = () => {
    const { eventId } = useParams();
    const navigate = useNavigate()
    const [event, setEvent] = useState<any>(null);

    useEffect(() => {
        axios.get(`${baseURL}/registrations/fetch-by-event-id/${eventId}`)
            .then(res => setEvent(res.data))
            .catch(err => console.error(err));
    }, [eventId]);

    const columns = [
        { key: 'playerId', label: 'Participant ID' },
        { key: 'name', label: 'Name' },
        { key: 'clubName', label: 'Club Name' },
        { key: 'chestNumber', label: 'Chest No' },
        { key: 'ageGroup', label: 'Age' },
        { key: 'skateCategory', label: 'Category' },
        { key: 'amountPaid', label: 'Amount' },
    ];

    return (
        <div className="space-y-4">

            <h2 className="text-2xl font-bold flex"> <span onClick={() => navigate(-1)} className='cursor-pointer mt-1 mr-4'> <ArrowLeft size={24}/>  </span> Participants - {event?.event?.name}</h2>
            <Card>
                <Table
                    columns={columns}
                    data={event || []}
                />
            </Card>
        </div>
    );
};

export default EventParticipantsDetails;
