import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventParticipation from './pages/eventDetails/EventParticipation';
import PaymentReport from './pages/eventDetails/PaymentReport';
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