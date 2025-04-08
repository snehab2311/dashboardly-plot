
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BarChart, Grid, LayoutDashboard, Plus, Search, Settings, Share2, Star, StarOff, MoreHorizontal, Filter, Clock, Calendar, ListFilter, Trash2 } from 'lucide-react';
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

// Sample dashboard data
const sampleDashboards = [
  {
    id: '1',
    title: 'Sales Performance',
    description: 'Monthly sales performance dashboard with KPIs',
    created: '2023-04-01T12:00:00Z',
    updated: '2023-04-08T15:30:00Z',
    favorite: true,
    shared: true,
    thumbnail: 'dashboard-1.jpg',
    owner: 'You',
    charts: 7,
  },
  {
    id: '2',
    title: 'Customer Analytics',
    description: 'Customer segmentation and behavior analysis',
    created: '2023-03-15T09:45:00Z',
    updated: '2023-04-05T11:20:00Z',
    favorite: false,
    shared: true,
    thumbnail: 'dashboard-2.jpg',
    owner: 'You',
    charts: 5,
  },
  {
    id: '3',
    title: 'Marketing Campaign Results',
    description: 'Performance metrics for recent marketing campaigns',
    created: '2023-03-28T14:30:00Z',
    updated: '2023-04-07T10:15:00Z',
    favorite: true,
    shared: false,
    thumbnail: 'dashboard-3.jpg',
    owner: 'You',
    charts: 6,
  },
  {
    id: '4',
    title: 'Inventory Overview',
    description: 'Stock levels and inventory movement analysis',
    created: '2023-03-20T08:15:00Z',
    updated: '2023-04-02T16:45:00Z',
    favorite: false,
    shared: false,
    thumbnail: 'dashboard-4.jpg',
    owner: 'You',
    charts: 4,
  },
  {
    id: '5',
    title: 'Regional Performance',
    description: 'Sales and performance by geographic region',
    created: '2023-04-03T11:30:00Z',
    updated: '2023-04-06T09:20:00Z',
    favorite: false,
    shared: true,
    thumbnail: 'dashboard-5.jpg',
    owner: 'Alex Chen',
    charts: 8,
  },
  {
    id: '6',
    title: 'Product Analysis',
    description: 'Product performance and category analysis',
    created: '2023-03-25T13:10:00Z',
    updated: '2023-04-04T14:50:00Z',
    favorite: true,
    shared: true,
    thumbnail: 'dashboard-6.jpg',
    owner: 'Sarah Johnson',
    charts: 5,
  },
];

const MyDashboards: React.FC = () => {
  const [dashboards, setDashboards] = useState(sampleDashboards);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const { toast } = useToast();
  
  const filteredDashboards = dashboards.filter(dashboard => 
    dashboard.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dashboard.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const sortedDashboards = [...filteredDashboards].sort((a, b) => {
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Dashboards</h1>
          <p className="text-muted-foreground">Manage and view all your saved dashboards.</p>
        </div>
        <div>
          <Link to="/kpi-builder">
            <Button className="bg-dashboardly-primary hover:bg-dashboardly-dark text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Dashboard
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search dashboards..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
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
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
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
          <TabsTrigger value="shared">Shared with Me</TabsTrigger>
          <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDashboards.map((dashboard) => (
              <Card key={dashboard.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link to={`/my-dashboards/${dashboard.id}`} className="flex flex-col h-full">
                  <div className="relative h-48 bg-muted">
                    {dashboard.id === '1' && (
                      <img 
                        src="public/lovable-uploads/66e4ad22-9473-462a-9d3a-fae2c8a9ff5e.png" 
                        alt={dashboard.title} 
                        className="object-cover w-full h-full"
                      />
                    )}
                    {dashboard.id !== '1' && (
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
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Owner:</span>
                      <span className="font-medium">{dashboard.owner}</span>
                    </div>
                    
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
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
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
                </Link>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDashboards
              .filter(dashboard => dashboard.favorite)
              .map((dashboard) => (
                <Card key={dashboard.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Link to={`/my-dashboards/${dashboard.id}`} className="flex flex-col h-full">
                    <div className="relative h-48 bg-muted">
                      {dashboard.id === '1' && (
                        <img 
                          src="public/lovable-uploads/66e4ad22-9473-462a-9d3a-fae2c8a9ff5e.png" 
                          alt={dashboard.title} 
                          className="object-cover w-full h-full"
                        />
                      )}
                      {dashboard.id !== '1' && (
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
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Owner:</span>
                        <span className="font-medium">{dashboard.owner}</span>
                      </div>
                      
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
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
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
                  </Link>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="shared" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDashboards
              .filter(dashboard => dashboard.shared && dashboard.owner !== 'You')
              .map((dashboard) => (
                <Card key={dashboard.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Link to={`/my-dashboards/${dashboard.id}`} className="flex flex-col h-full">
                    <div className="relative h-48 bg-muted">
                      <div className="flex items-center justify-center h-full">
                        <BarChart className="h-12 w-12 text-muted-foreground/50" />
                      </div>
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
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Owner:</span>
                        <span className="font-medium">{dashboard.owner}</span>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardFooter>
                  </Link>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="recent" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDashboards
              .slice(0, 3) // Just showing the most recently updated ones
              .map((dashboard) => (
                <Card key={dashboard.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Link to={`/my-dashboards/${dashboard.id}`} className="flex flex-col h-full">
                    <div className="relative h-48 bg-muted">
                      {dashboard.id === '1' && (
                        <img 
                          src="public/lovable-uploads/66e4ad22-9473-462a-9d3a-fae2c8a9ff5e.png" 
                          alt={dashboard.title} 
                          className="object-cover w-full h-full"
                        />
                      )}
                      {dashboard.id !== '1' && (
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
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Owner:</span>
                        <span className="font-medium">{dashboard.owner}</span>
                      </div>
                      
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
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
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
                  </Link>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyDashboards;
