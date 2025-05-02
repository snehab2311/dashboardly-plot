import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BarChart, Grid, LayoutDashboard, Plus, Search, Settings, Share2, Star, StarOff, MoreHorizontal, Filter, Clock, Calendar, ListFilter, Trash2, Sun, Moon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const MyDashboards: React.FC = () => {
  const { theme, setTheme } = useTheme();
  // Load dashboards from localStorage if available, else use empty array
  const getInitialDashboards = () => {
    const saved = localStorage.getItem('dashboards');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (error) {
        console.error('Error parsing saved dashboards:', error);
      }
    }
    return [];
  };

  const [dashboards, setDashboards] = useState(getInitialDashboards());
  const [sortBy, setSortBy] = useState('updated');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [shareDashboard, setShareDashboard] = useState<any>(null);
  const { toast } = useToast();
  
  // Persist dashboards to localStorage on change
  useEffect(() => {
    localStorage.setItem('dashboards', JSON.stringify(dashboards));
  }, [dashboards]);
  
  const sortedDashboards = [...dashboards].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'created':
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      case 'updated':
        return new Date(b.updated).getTime() - new Date(a.updated).getTime();
      default:
        return 0;
    }
  });
  
  const toggleFavorite = (id: string) => {
    setDashboards(dashboards.map(dashboard => 
      dashboard.id === id ? { ...dashboard, favorite: !dashboard.favorite } : dashboard
    ));
  };
  
  const deleteDashboard = (id: string) => {
    setDashboards(dashboards.filter(dashboard => dashboard.id !== id));
    toast({
      title: "Dashboard Deleted",
      description: "The dashboard has been deleted successfully.",
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#7C3AED] mb-1">My Dashboards</h1>
          <p className="text-muted-foreground text-lg">Manage and view all your saved dashboards.</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                {theme === 'light' ? <Sun className="h-5 w-5 text-[#7C3AED]" /> : <Moon className="h-5 w-5" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="mr-2 h-4 w-4" /> Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" /> Dark
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/kpi-builder">
            <Button className="bg-dashboardly-primary hover:bg-dashboardly-dark text-white font-semibold text-base ml-2">
              + New Dashboard
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Last Updated</SelectItem>
              <SelectItem value="created">Date Created</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
          
          <Tabs defaultValue="grid">
            <TabsList className="grid w-24 grid-cols-2">
              <TabsTrigger value="grid">
                <Grid className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list">
                <ListFilter className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="all">All Dashboards</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDashboards.map((dashboard) => (
              <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full" key={dashboard.id}>
                <div className="relative h-48 bg-muted">
                  {dashboard.thumbnail ? (
                    <img 
                      src={dashboard.thumbnail}
                      alt={dashboard.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BarChart className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(dashboard.id);
                    }}
                    className="absolute top-2 right-2 h-8 w-8 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition-colors"
                  >
                    {dashboard.favorite ? (
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ) : (
                      <StarOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{dashboard.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{dashboard.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground pb-2 flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <LayoutDashboard className="h-3 w-3" />
                    <span>{dashboard.charts} charts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>Updated {formatDate(dashboard.updated)}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between items-center text-xs">
                  <div />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/kpi-builder?id=${dashboard.id}`} className="cursor-pointer">
                          <Settings className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600 focus:text-red-600"
                        onClick={(e) => {
                          e.preventDefault();
                          deleteDashboard(dashboard.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDashboards
              .filter(dashboard => dashboard.favorite)
              .map((dashboard) => (
                <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full" key={dashboard.id}>
                  <div className="relative h-48 bg-muted">
                    {dashboard.thumbnail ? (
                      <img 
                        src={dashboard.thumbnail}
                        alt={dashboard.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <BarChart className="h-12 w-12 text-muted-foreground/50" />
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(dashboard.id);
                      }}
                      className="absolute top-2 right-2 h-8 w-8 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    </button>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{dashboard.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{dashboard.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground pb-2 flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <LayoutDashboard className="h-3 w-3" />
                      <span>{dashboard.charts} charts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>Updated {formatDate(dashboard.updated)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between items-center text-xs">
                    <div />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/kpi-builder?id=${dashboard.id}`} className="cursor-pointer">
                            <Settings className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteDashboard(dashboard.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="recent" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDashboards
              .slice(0, 3) // Just showing the most recently updated ones
              .map((dashboard) => (
                <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full" key={dashboard.id}>
                  <div className="relative h-48 bg-muted">
                    {dashboard.thumbnail ? (
                      <img 
                        src={dashboard.thumbnail}
                        alt={dashboard.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <BarChart className="h-12 w-12 text-muted-foreground/50" />
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(dashboard.id);
                      }}
                      className="absolute top-2 right-2 h-8 w-8 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition-colors"
                    >
                      {dashboard.favorite ? (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <StarOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{dashboard.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{dashboard.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground pb-2 flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <LayoutDashboard className="h-3 w-3" />
                      <span>{dashboard.charts} charts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>Updated {formatDate(dashboard.updated)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between items-center text-xs">
                    <div />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/kpi-builder?id=${dashboard.id}`} className="cursor-pointer">
                            <Settings className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteDashboard(dashboard.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyDashboards;
