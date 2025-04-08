
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  BarChart2, 
  Home, 
  FileSpreadsheet, 
  LayoutDashboard, 
  Settings, 
  Users, 
  LogOut,
  PieChart,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  
  const links = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'EDA Generator', icon: FileSpreadsheet, path: '/eda' },
    { name: 'KPI Builder', icon: BarChart2, path: '/kpi-builder' },
    { name: 'My Dashboards', icon: LayoutDashboard, path: '/my-dashboards' },
    { name: 'Data Sources', icon: Database, path: '/data-sources' },
    { name: 'Analytics', icon: PieChart, path: '/analytics' },
    { name: 'Users', icon: Users, path: '/users' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className={cn(
      "bg-sidebar text-sidebar-foreground h-screen transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-purple-400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="currentColor" />
              <path d="M15 12C15 13.66 13.66 15 12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12Z" fill="currentColor" />
            </svg>
            <h1 className="text-xl font-bold ml-2">Dashboardly</h1>
          </div>
        )}
        {collapsed && (
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-purple-400 mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="currentColor" />
            <path d="M15 12C15 13.66 13.66 15 12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12Z" fill="currentColor" />
          </svg>
        )}
        <button 
          onClick={onToggle}
          className="text-sidebar-foreground rounded-full p-1 hover:bg-sidebar-accent transition-colors focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
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
                  "hover:bg-sidebar-accent",
                  location.pathname === link.path 
                    ? "bg-sidebar-accent text-white" 
                    : "text-sidebar-foreground"
                )}
              >
                <link.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-2")} />
                {!collapsed && <span>{link.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button 
          variant="outline" 
          className={cn(
            "w-full bg-sidebar-accent hover:bg-sidebar-accent/80 flex items-center justify-center text-sidebar-foreground",
            collapsed ? "px-2" : ""
          )}
        >
          <LogOut className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-2")} />
          {!collapsed && <span>Log Out</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
