import React from 'react';
import { Users, Smartphone, Eye, EyeOff } from 'lucide-react';
import Button from '../components/UI/Button';
import FormField from '../components/UI/FormField';
import Card from '../components/UI/Card';
import PlayerRegistrationModal from '../components/Registration/PlayerRegistrationModal';
import ClubRegistrationModal from '../components/Registration/ClubRegistrationModal';
import DistrictRegistrationModal from '../components/Registration/DistrictRegistrationModal';
import StateRegistrationModal from '../components/Registration/StateRegistrationModal';

const Login: React.FC = () => {
  const [loginType, setLoginType] = React.useState<'admin' | 'player'>('admin');
  const [showPassword, setShowPassword] = React.useState(false);
  const [adminCredentials, setAdminCredentials] = React.useState({
    username: '',
    password: ''
  });
  const [playerCredentials, setPlayerCredentials] = React.useState({
    mobileNumber: '',
    otp: ''
  });
  const [otpSent, setOtpSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Registration modal states
  const [showPlayerRegistration, setShowPlayerRegistration] = React.useState(false);
  const [showClubRegistration, setShowClubRegistration] = React.useState(false);
  const [showDistrictRegistration, setShowDistrictRegistration] = React.useState(false);
  const [showStateRegistration, setShowStateRegistration] = React.useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Handle admin login logic here
      console.log('Admin login:', adminCredentials);
    }, 1000);
  };

  const handleSendOTP = async () => {
    if (!playerCredentials.mobileNumber) return;
    setLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 1000);
  };

  const handlePlayerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Handle player login logic here
      console.log('Player login:', playerCredentials);
    }, 1000);
  };

  const handleRegistrationSubmit = (data: any, type: string) => {
    console.log(`${type} registration data:`, data);
    // Here you would submit the registration data to your backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sports Management</h1>
          <p className="text-gray-600">ERP System Login</p>
        </div>

        <Card>
          {/* Login Type Selector */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setLoginType('admin')}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginType === 'admin'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users size={16} className="mr-2" />
              Admin Login
            </button>
            <button
              onClick={() => setLoginType('player')}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginType === 'player'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Smartphone size={16} className="mr-2" />
              Player Login
            </button>
          </div>

          {/* Admin Login Form */}
          {loginType === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <FormField label="Username" required>
                <input
                  type="text"
                  value={adminCredentials.username}
                  onChange={(e) => setAdminCredentials({ ...adminCredentials, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your username"
                  required
                />
              </FormField>

              <FormField label="Password" required>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminCredentials.password}
                    onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormField>

              <Button type="submit" className="w-full" loading={loading}>
                Sign In as Admin
              </Button>
            </form>
          )}

          {/* Player Login Form */}
          {loginType === 'player' && (
            <form onSubmit={handlePlayerLogin} className="space-y-4">
              <FormField label="Mobile Number" required>
                <div className="flex space-x-2">
                  <input
                    type="tel"
                    value={playerCredentials.mobileNumber}
                    onChange={(e) => setPlayerCredentials({ ...playerCredentials, mobileNumber: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter mobile number"
                    required
                  />
                  <Button
                    type="button"
                    onClick={handleSendOTP}
                    variant="secondary"
                    loading={loading && !otpSent}
                    disabled={!playerCredentials.mobileNumber || otpSent}
                  >
                    {otpSent ? 'Sent' : 'Send OTP'}
                  </Button>
                </div>
              </FormField>

              {otpSent && (
                <FormField label="OTP" required>
                  <input
                    type="text"
                    value={playerCredentials.otp}
                    onChange={(e) => setPlayerCredentials({ ...playerCredentials, otp: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    required
                  />
                </FormField>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                loading={loading && otpSent}
                disabled={!otpSent || !playerCredentials.otp}
              >
                Verify & Sign In
              </Button>
            </form>
          )}

          {/* Registration Links */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600 mb-4">
              Don't have an account?
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                className="text-xs"
                onClick={() => setShowPlayerRegistration(true)}
              >
                Register as Player
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="text-xs"
                onClick={() => setShowClubRegistration(true)}
              >
                Register as Club
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button 
                variant="secondary" 
                size="sm" 
                className="text-xs"
                onClick={() => setShowDistrictRegistration(true)}
              >
                Register District
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="text-xs"
                onClick={() => setShowStateRegistration(true)}
              >
                Register State
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Registration Modals */}
      <PlayerRegistrationModal
        isOpen={showPlayerRegistration}
        onClose={() => setShowPlayerRegistration(false)}
        onSubmit={(data) => handleRegistrationSubmit(data, 'Player')}
      />

      <ClubRegistrationModal
        isOpen={showClubRegistration}
        onClose={() => setShowClubRegistration(false)}
        onSubmit={(data) => handleRegistrationSubmit(data, 'Club')}
      />

      <DistrictRegistrationModal
        isOpen={showDistrictRegistration}
        onClose={() => setShowDistrictRegistration(false)}
        onSubmit={(data) => handleRegistrationSubmit(data, 'District')}
      />

      <StateRegistrationModal
        isOpen={showStateRegistration}
        onClose={() => setShowStateRegistration(false)}
        onSubmit={(data) => handleRegistrationSubmit(data, 'State')}
      />
    </div>
  );
};

export default Login;