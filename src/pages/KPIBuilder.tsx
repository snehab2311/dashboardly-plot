
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Grid, 
  LayoutDashboard, 
  Plus, 
  BarChart, 
  LineChart as LineIcon, 
  PieChart as PieIcon, 
  Loader2,
  Save,
  Share2,
  ArrowDown,
  ArrowRight,
  Filter,
  Gauge,
  ChevronDown,
  Trash2,
  Eye,
  Pencil,
  Copy,
  MonitorSmartphone,
  MoveVertical,
  Table
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { BarChart as BarChartComponent, LineChart, PieChart, DoughnutChart } from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

// Sample chart data for demonstration
const lineChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Revenue',
      data: [65, 59, 80, 81, 56, 55, 40, 54, 76, 88, 92, 67],
      borderColor: 'rgb(139, 92, 246)',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      tension: 0.4,
      fill: true,
    },
    {
      label: 'Profit',
      data: [28, 25, 36, 30, 25, 24, 18, 22, 35, 41, 44, 29],
      borderColor: 'rgb(217, 70, 239)',
      backgroundColor: 'rgba(217, 70, 239, 0.1)',
      tension: 0.4,
      fill: true,
    }
  ],
};

const barChartData = {
  labels: ['Electronics', 'Clothing', 'Food', 'Books', 'Other'],
  datasets: [
    {
      label: 'Sales',
      data: [65, 59, 80, 81, 56],
      backgroundColor: 'rgba(139, 92, 246, 0.8)',
    }
  ],
};

const pieChartData = {
  labels: ['North', 'South', 'East', 'West', 'Central'],
  datasets: [
    {
      label: 'Sales by Region',
      data: [300, 200, 150, 250, 100],
      backgroundColor: [
        'rgba(139, 92, 246, 0.8)',
        'rgba(216, 180, 254, 0.8)',
        'rgba(217, 70, 239, 0.8)',
        'rgba(76, 29, 149, 0.8)',
        'rgba(245, 243, 255, 0.8)',
      ],
      borderColor: ['white', 'white', 'white', 'white', 'white'],
      borderWidth: 2,
    }
  ],
};

// KPI Dashboard Builder Chart Types
type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'kpi' | 'table';

interface ChartWidget {
  id: string;
  type: ChartType;
  title: string;
  description?: string;
  data: any;
  size: 'small' | 'medium' | 'large';
  options?: any;
}

const KPIBuilder: React.FC = () => {
  const [dashboardTitle, setDashboardTitle] = useState('My Dashboard');
  const [showChart, setShowChart] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('bar');
  const [widgets, setWidgets] = useState<ChartWidget[]>([
    {
      id: '1',
      type: 'bar',
      title: 'Sales by Category',
      description: 'Distribution of sales across product categories',
      data: barChartData,
      size: 'medium',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        },
      }
    },
    {
      id: '2',
      type: 'line',
      title: 'Revenue Trends',
      description: 'Monthly revenue and profit trends',
      data: lineChartData,
      size: 'large',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        },
      }
    },
    {
      id: '3',
      type: 'pie',
      title: 'Regional Sales Distribution',
      description: 'Sales distribution across regions',
      data: pieChartData,
      size: 'medium',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          }
        }
      }
    },
    {
      id: '4',
      type: 'kpi',
      title: 'Total Sales',
      description: 'Total sales for the current period',
      data: {
        value: '$142,384',
        comparison: '+12.5%',
        positive: true,
      },
      size: 'small'
    },
  ]);
  const [editingWidget, setEditingWidget] = useState<ChartWidget | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const handleAddChart = () => {
    setShowChart(true);
    
    // Create a new widget
    const newWidget: ChartWidget = {
      id: Date.now().toString(),
      type: selectedChartType,
      title: `New ${selectedChartType.charAt(0).toUpperCase() + selectedChartType.slice(1)} Chart`,
      description: 'Edit this description',
      data: selectedChartType === 'bar' ? barChartData : 
            selectedChartType === 'line' ? lineChartData :
            selectedChartType === 'pie' || selectedChartType === 'doughnut' ? pieChartData :
            selectedChartType === 'kpi' ? {
              value: '$0',
              comparison: '0%',
              positive: true,
            } : {},
      size: 'medium',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        },
      }
    };
    
    setWidgets([...widgets, newWidget]);
    setEditingWidget(newWidget);
  };
  
  const handleSaveDashboard = () => {
    setIsSaving(true);
    
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Dashboard Saved",
        description: "Your dashboard has been saved successfully.",
      });
    }, 1500);
  };
  
  const handleDeleteWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
    if (editingWidget?.id === id) {
      setEditingWidget(null);
    }
  };
  
  const handleEditWidget = (widget: ChartWidget) => {
    setEditingWidget(widget);
  };
  
  const handleUpdateWidget = (updatedWidget: ChartWidget) => {
    setWidgets(widgets.map(widget => 
      widget.id === updatedWidget.id ? updatedWidget : widget
    ));
    setEditingWidget(null);
  };
  
  const renderWidgetContent = (widget: ChartWidget) => {
    switch (widget.type) {
      case 'bar':
        return (
          <BarChartComponent
            data={widget.data}
            className="chart-container"
            options={widget.options}
          />
        );
      case 'line':
        return (
          <LineChart
            data={widget.data}
            className="chart-container"
            options={widget.options}
          />
        );
      case 'pie':
        return (
          <PieChart
            data={widget.data}
            className="chart-container"
            options={widget.options}
          />
        );
      case 'doughnut':
        return (
          <DoughnutChart
            data={widget.data}
            className="chart-container"
            options={widget.options}
          />
        );
      case 'kpi':
        return (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <p className="text-4xl font-bold">{widget.data.value}</p>
            <div className={cn(
              "flex items-center mt-2 text-sm",
              widget.data.positive ? "text-green-500" : "text-red-500"
            )}>
              {widget.data.positive ? (
                <ArrowDown className="h-4 w-4 mr-1 rotate-180" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              <span>{widget.data.comparison}</span>
            </div>
          </div>
        );
      case 'table':
        return (
          <div className="h-full overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Category', 'Sales', 'Revenue', 'Profit'].map((header) => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {['Electronics', 'Clothing', 'Food', 'Books', 'Other'].map((category, index) => (
                  <tr key={category}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Math.floor(Math.random() * 1000)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${Math.floor(Math.random() * 10000)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${Math.floor(Math.random() * 5000)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">KPI Dashboard Builder</h1>
          <p className="text-muted-foreground">Create interactive dashboards with drag-and-drop visualizations.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Add Filters
          </Button>
          <Button variant="outline" className="flex items-center">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button 
            className="bg-dashboardly-primary hover:bg-dashboardly-dark text-white flex items-center"
            onClick={handleSaveDashboard}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Dashboard
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <Input
                    value={dashboardTitle}
                    onChange={(e) => setDashboardTitle(e.target.value)}
                    className="text-xl font-bold border-none focus-visible:ring-0 px-0 h-auto"
                  />
                  <p className="text-sm text-muted-foreground">Last updated: Apr 8, 2023</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Label htmlFor="auto-refresh" className="text-sm">Auto-refresh</Label>
                    <Switch id="auto-refresh" />
                  </div>
                  
                  <Select defaultValue="1h">
                    <SelectTrigger className="w-24 h-8">
                      <SelectValue placeholder="Refresh" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5m">5 min</SelectItem>
                      <SelectItem value="15m">15 min</SelectItem>
                      <SelectItem value="30m">30 min</SelectItem>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="1d">1 day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
          </Card>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* KPI Cards */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Sales</p>
                      <p className="text-2xl font-bold">$142,384</p>
                    </div>
                    <div className="bg-green-100 text-green-700 text-xs p-1 rounded flex items-center">
                      <ArrowDown className="h-3 w-3 mr-1 rotate-180" />
                      12.5%
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Orders</p>
                      <p className="text-2xl font-bold">3,265</p>
                    </div>
                    <div className="bg-green-100 text-green-700 text-xs p-1 rounded flex items-center">
                      <ArrowDown className="h-3 w-3 mr-1 rotate-180" />
                      8.2%
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                      <p className="text-2xl font-bold">$43.62</p>
                    </div>
                    <div className="bg-green-100 text-green-700 text-xs p-1 rounded flex items-center">
                      <ArrowDown className="h-3 w-3 mr-1 rotate-180" />
                      3.6%
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Conversion Rate</p>
                      <p className="text-2xl font-bold">18.4%</p>
                    </div>
                    <div className="bg-red-100 text-red-700 text-xs p-1 rounded flex items-center">
                      <ArrowDown className="h-3 w-3 mr-1" />
                      1.2%
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {widgets.map(widget => (
                <Card 
                  key={widget.id}
                  className={cn(
                    "overflow-hidden",
                    widget.size === 'large' && "md:col-span-2",
                    widget.size === 'small' && "md:col-span-1",
                    editingWidget?.id === widget.id && "ring-2 ring-dashboardly-primary"
                  )}
                >
                  <CardHeader className="bg-muted/30 p-3 flex flex-row justify-between items-center">
                    <div>
                      <CardTitle className="text-base">{widget.title}</CardTitle>
                      {widget.description && (
                        <CardDescription className="text-xs">{widget.description}</CardDescription>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => handleEditWidget(widget)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleDeleteWidget(widget.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="p-0 h-[250px]">
                    {renderWidgetContent(widget)}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Chart Widget</CardTitle>
              <CardDescription>Select a visualization type to add to your dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-2 mb-4">
                <Button
                  variant="outline"
                  className={cn(
                    "flex flex-col h-24 gap-2 items-center justify-center",
                    selectedChartType === 'bar' && "border-dashboardly-primary bg-dashboardly-primary/5"
                  )}
                  onClick={() => setSelectedChartType('bar')}
                >
                  <BarChart className="h-6 w-6" />
                  <span className="text-xs">Bar Chart</span>
                </Button>
                
                <Button
                  variant="outline"
                  className={cn(
                    "flex flex-col h-24 gap-2 items-center justify-center",
                    selectedChartType === 'line' && "border-dashboardly-primary bg-dashboardly-primary/5"
                  )}
                  onClick={() => setSelectedChartType('line')}
                >
                  <LineIcon className="h-6 w-6" />
                  <span className="text-xs">Line Chart</span>
                </Button>
                
                <Button
                  variant="outline"
                  className={cn(
                    "flex flex-col h-24 gap-2 items-center justify-center",
                    selectedChartType === 'pie' && "border-dashboardly-primary bg-dashboardly-primary/5"
                  )}
                  onClick={() => setSelectedChartType('pie')}
                >
                  <PieIcon className="h-6 w-6" />
                  <span className="text-xs">Pie Chart</span>
                </Button>
                
                <Button
                  variant="outline"
                  className={cn(
                    "flex flex-col h-24 gap-2 items-center justify-center",
                    selectedChartType === 'doughnut' && "border-dashboardly-primary bg-dashboardly-primary/5"
                  )}
                  onClick={() => setSelectedChartType('doughnut')}
                >
                  <PieIcon className="h-6 w-6" />
                  <span className="text-xs">Doughnut</span>
                </Button>
                
                <Button
                  variant="outline"
                  className={cn(
                    "flex flex-col h-24 gap-2 items-center justify-center",
                    selectedChartType === 'kpi' && "border-dashboardly-primary bg-dashboardly-primary/5"
                  )}
                  onClick={() => setSelectedChartType('kpi')}
                >
                  <Gauge className="h-6 w-6" />
                  <span className="text-xs">KPI Card</span>
                </Button>
                
                <Button
                  variant="outline"
                  className={cn(
                    "flex flex-col h-24 gap-2 items-center justify-center",
                    selectedChartType === 'table' && "border-dashboardly-primary bg-dashboardly-primary/5"
                  )}
                  onClick={() => setSelectedChartType('table')}
                >
                  <Table className="h-6 w-6" />
                  <span className="text-xs">Data Table</span>
                </Button>
              </div>
              
              <Button 
                className="w-full bg-dashboardly-primary hover:bg-dashboardly-dark text-white"
                onClick={handleAddChart}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Dashboard
              </Button>
            </CardContent>
          </Card>
          
          {editingWidget && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Widget</CardTitle>
                <CardDescription>Customize your {editingWidget.type} visualization.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="widget-title">Title</Label>
                  <Input 
                    id="widget-title"
                    value={editingWidget.title}
                    onChange={(e) => setEditingWidget({...editingWidget, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="widget-description">Description</Label>
                  <Input 
                    id="widget-description"
                    value={editingWidget.description || ''}
                    onChange={(e) => setEditingWidget({...editingWidget, description: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Size</Label>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline"
                      className={cn(
                        editingWidget.size === 'small' && "bg-dashboardly-primary/10 border-dashboardly-primary"
                      )}
                      onClick={() => setEditingWidget({...editingWidget, size: 'small'})}
                    >
                      Small
                    </Button>
                    <Button 
                      variant="outline"
                      className={cn(
                        editingWidget.size === 'medium' && "bg-dashboardly-primary/10 border-dashboardly-primary"
                      )}
                      onClick={() => setEditingWidget({...editingWidget, size: 'medium'})}
                    >
                      Medium
                    </Button>
                    <Button 
                      variant="outline"
                      className={cn(
                        editingWidget.size === 'large' && "bg-dashboardly-primary/10 border-dashboardly-primary"
                      )}
                      onClick={() => setEditingWidget({...editingWidget, size: 'large'})}
                    >
                      Large
                    </Button>
                  </div>
                </div>
                
                {editingWidget.type === 'kpi' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="kpi-value">Value</Label>
                      <Input 
                        id="kpi-value"
                        value={editingWidget.data.value}
                        onChange={(e) => setEditingWidget({
                          ...editingWidget, 
                          data: {...editingWidget.data, value: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kpi-comparison">Comparison</Label>
                      <Input 
                        id="kpi-comparison"
                        value={editingWidget.data.comparison}
                        onChange={(e) => setEditingWidget({
                          ...editingWidget, 
                          data: {...editingWidget.data, comparison: e.target.value}
                        })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="kpi-positive">Positive Trend</Label>
                      <Switch 
                        id="kpi-positive" 
                        checked={editingWidget.data.positive}
                        onCheckedChange={(checked) => setEditingWidget({
                          ...editingWidget, 
                          data: {...editingWidget.data, positive: checked}
                        })}
                      />
                    </div>
                  </>
                )}
                
                {editingWidget.type !== 'kpi' && (
                  <div className="space-y-2">
                    <Label>Data Source</Label>
                    <Select defaultValue="sales_data_2023">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Data Source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales_data_2023">Sales Data 2023</SelectItem>
                        <SelectItem value="customer_data">Customer Data</SelectItem>
                        <SelectItem value="inventory_data">Inventory Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="pt-4 flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingWidget(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-dashboardly-primary hover:bg-dashboardly-dark text-white"
                    onClick={() => handleUpdateWidget(editingWidget)}
                  >
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Theme</p>
                  <p className="text-xs text-muted-foreground">Choose dark or light theme</p>
                </div>
                <Select defaultValue="light">
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Responsive Layout</p>
                  <p className="text-xs text-muted-foreground">Optimize for mobile devices</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Grid Snap</p>
                  <p className="text-xs text-muted-foreground">Snap widgets to grid</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <Button variant="outline" className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Dashboard
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="flex items-center justify-between">
                  <span className="flex items-center">
                    <MonitorSmartphone className="h-4 w-4 mr-2" />
                    Preview on Mobile
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default KPIBuilder;
