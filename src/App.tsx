import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ClubLayout from './pages/club/ClubLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Players from './pages/users/Players';
import Clubs from './pages/users/Clubs';
import Districts from './pages/users/Districts';
import States from './pages/users/States';
import Admins from './pages/users/Admins';
import PlayersApproval from './pages/approvals/PlayersApproval';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import News from './pages/News';
import ClubDashboard from './pages/club/ClubDashboard';
import ClubPlayers from './pages/club/ClubPlayers';
import ClubEvents from './pages/club/ClubEvents';
import ClubReports from './pages/club/ClubReports';
import ClubProfile from './pages/club/ClubProfile';
import ClubsApproval from './pages/approvals/ClubsApproval';
import DistrictsApproval from './pages/approvals/DistrictsApprovals';
import StatesApproval from './pages/approvals/StatesApproval';
import EventParticipation from './pages/eventDetails/EventParticipation';
import PaymentReport from './pages/eventDetails/PaymentReport';
import EventOfficial from './pages/EventOfficial';
import EventOrganisers from './pages/EventOrganisers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EventParticipantsDetails from './pages/eventDetails/EventParticipantsDetails';

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
      <Routes>

        {/* Admin Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="events" element={<Events />} />
          <Route path="/eventsDetails/participation" element={<EventParticipation />} />
          <Route path="/eventsDetails/event-participation/:eventId" element={<EventParticipantsDetails />} />
          <Route path="/eventsDetails/payment" element={<PaymentReport />} />
          <Route path="/eventOfficial" element={<EventOfficial />} />
          <Route path="/eventOrganisers" element={<EventOrganisers />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="news" element={<News />} />
        </Route>

      
       
      </Routes>
    </Router>
  );
}

export default App;