import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import PlayerLayout from './pages/player/PlayerLayout';
import OfficialLayout from './pages/official/OfficialLayout';
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
import PlayerDashboard from './pages/player/PlayerDashboard';
import UpcomingEvents from './pages/player/UpcomingEvents';
import MyEvents from './pages/player/MyEvents';
import PlayerProfile from './pages/player/PlayerProfile';
import OfficialDashboard from './pages/official/OfficialDashboard';
import ScheduleManagement from './pages/official/ScheduleManagement';
import UpdateResults from './pages/official/UpdateResults';
import ResultsView from './pages/official/ResultsView';
import ParticipantsView from './pages/official/ParticipantsView';
import ReportsPage from './pages/official/ReportsPage';
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
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="users/players" element={<Players />} />
          <Route path="users/clubs" element={<Clubs />} />
          <Route path="users/districts" element={<Districts />} />
          <Route path="users/states" element={<States />} />
          <Route path="users/admins" element={<Admins />} />
          <Route path="approvals/players" element={<PlayersApproval />} />
          <Route path="approvals/clubs" element={<ClubsApproval />} />
          <Route path="approvals/districts" element={<DistrictsApproval />} />
          <Route path="approvals/states" element={<StatesApproval />} />
          <Route path="events" element={<Events />} />
          <Route path="/eventsDetails/participation" element={<EventParticipation />} />
          <Route path="/eventsDetails/event-participation/:eventId" element={<EventParticipantsDetails />} />
          <Route path="/eventsDetails/payment" element={<PaymentReport />} />
          <Route path="/eventOfficial" element={<EventOfficial />} />
          <Route path="/eventOrganisers" element={<EventOrganisers />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="news" element={<News />} />
        </Route>

        {/* Player Routes */}
        <Route path="/player" element={<PlayerLayout />}>
          <Route index element={<PlayerDashboard />} />
          <Route path="events" element={<UpcomingEvents />} />
          <Route path="my-events" element={<MyEvents />} />
          <Route path="profile" element={<PlayerProfile />} />
        </Route>

        {/* Event Official Routes */}
        <Route path="/official" element={<OfficialLayout />}>
          <Route index element={<OfficialDashboard />} />
          <Route path="schedules" element={<ScheduleManagement />} />
          <Route path="update-results" element={<UpdateResults />} />
          <Route path="results" element={<ResultsView />} />
          <Route path="participants" element={<ParticipantsView />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>

        {/* Club Routes */}
        <Route path="/club" element={<ClubLayout />}>
          <Route index element={<ClubDashboard />} />
          <Route path="players" element={<ClubPlayers />} />
          <Route path="events" element={<ClubEvents />} />
          <Route path="reports" element={<ClubReports />} />
          <Route path="profile" element={<ClubProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;