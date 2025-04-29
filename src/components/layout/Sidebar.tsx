import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  BarChart2, 
  Home, 
  FileSpreadsheet,
  LayoutDashboard,
  Grid as GridIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  
  const links = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'EDA Generator', icon: FileSpreadsheet, path: '/eda' },
    { name: 'KPI Builder', icon: BarChart2, path: '/kpi-builder' },
    { name: 'My Dashboards', icon: GridIcon, path: '/my-dashboards' },
  ];

  return (
    <aside className={cn(
      "bg-[#352060] text-white h-screen transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_10px_rgba(216,180,254,0.5)]">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#D946EF" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  strokeWidth="15"
                  stroke="url(#gradient)"
                  strokeLinecap="round"
                  className="filter brightness-125"
                />
                <line
                  x1="20"
                  y1="85"
                  x2="80"
                  y2="85"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex flex-col -space-y-0.5">
              <h1 className="text-xl font-semibold tracking-wide text-white">Dashboardly</h1>
              <span className="text-[10px] text-purple-200 uppercase tracking-widest">BUILD IT RIGHT</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="relative w-8 h-8 mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_10px_rgba(216,180,254,0.5)]">
              <defs>
                <linearGradient id="gradient-collapsed" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D946EF" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                strokeWidth="15"
                stroke="url(#gradient-collapsed)"
                strokeLinecap="round"
                className="filter brightness-125"
              />
              <line
                x1="20"
                y1="85"
                x2="80"
                y2="85"
                stroke="url(#gradient-collapsed)"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
        <button 
          onClick={onToggle}
          className="text-white rounded-full p-1 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="13 17 18 12 13 7"></polyline>
              <polyline points="6 17 11 12 6 7"></polyline>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="11 17 6 12 11 7"></polyline>
              <polyline points="18 17 13 12 18 7"></polyline>
            </svg>
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto dashboard-scrollbar pt-4">
        <ul className="space-y-1 px-2">
          {links.map((link) => (
            <li key={link.path}>
              <Link 
                to={link.path} 
                className={cn(
                  "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
                  "hover:bg-white/10",
                  location.pathname === link.path 
                    ? "bg-white/10 text-white" 
                    : "text-white/80"
                )}
              >
                <link.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-2")} />
                {!collapsed && <span>{link.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
