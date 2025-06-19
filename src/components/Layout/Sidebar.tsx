import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  MapPin,
  Map,
  UserCheck,
  Calendar,
  Trophy,
  Image,
  Newspaper,
  Settings,
  ChevronRight,
  Cog,
  UserRoundCog,
  UserSearch
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },

    { icon: Calendar, label: 'Events', path: '/events' },
    {
      icon: Cog,
      label: 'Events Details',
      path: '/eventsDetails',
      submenu: [
        { label: 'Event Participation', path: '/eventsDetails/participation' },
        { label: 'Payment Report', path: '/eventsDetails/payment' },
      ]
    },

  ];

  const [expandedMenu, setExpandedMenu] = React.useState<string | null>('/users');

  return (
    <div className="bg-slate-900 text-white w-64 min-h-full p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-blue-400">Sports Management</h1>
        <p className="text-slate-400 text-sm">ERP System</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <div key={item.path}>
            {item.submenu ? (
              <div>
                <button
                  onClick={() => setExpandedMenu(expandedMenu === item.path ? null : item.path)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`transform transition-transform ${
                      expandedMenu === item.path ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {expandedMenu === item.path && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.submenu.map((subItem) => (
                      <NavLink
                        key={subItem.path}
                        to={subItem.path}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                          }`
                        }
                      >
                        {subItem.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;