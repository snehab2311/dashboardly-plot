import React, { useState, useEffect, ReactNode, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Grid, 
  LayoutDashboard, 
  Plus, 
  BarChart as BarChartIcon, 
  LineChart as LineIcon, 
  PieChart as PieIcon, 
  Loader2,
  Save,
  ArrowDown,
  ArrowRight,
  Gauge,
  ChevronDown,
  Trash2,
  Eye,
  Pencil,
  Copy,
  MonitorSmartphone,
  MoveVertical,
  Table,
  Info as InfoIcon,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Sun,
  Moon
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
} from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ColumnStats {
  mean?: number;
  std?: number;
  min?: number;
  max?: number;
  '50%'?: number;
  unique?: number;
  top?: string;
  freq?: number;
  top_categories?: Array<{category: string, frequency: number}>;
}

interface DatasetInfo {
  total_rows: number;
  total_columns: number;
  missing_values: number;
  missing_percentage: number;
  numeric_columns: number;
  categorical_columns: number;
  date_columns: number;
  duplicate_rows: number;
}

interface AnalyzedData {
  dataset_info: DatasetInfo;
  describe: Record<string, ColumnStats>;
  categorical_distributions: Record<string, Record<string, number>>;
  time_series_labels?: string[];
  time_series_data?: Record<string, number[]>;
  null_counts: Record<string, number>;
  raw_data: any[];
}

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

// Sample chart data for demonstration
const sampleLineChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Revenue',
      data: [65, 59, 80, 81, 56, 55, 40, 54, 76, 88, 92, 67],
      borderColor: 'rgb(139, 92, 246)',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      tension: 0.4,
      fill: true,
    }
  ],
};

const samplePieChartData = {
  labels: ['Electronics', 'Clothing', 'Food', 'Books', 'Home & Garden'],
  datasets: [
    {
      data: [35, 25, 20, 15, 5],
      backgroundColor: [
        'rgba(139, 92, 246, 0.8)',   // Purple
        'rgba(59, 130, 246, 0.8)',   // Blue
        'rgba(16, 185, 129, 0.8)',   // Green
        'rgba(239, 68, 68, 0.8)',    // Red
        'rgba(245, 158, 11, 0.8)',   // Yellow
      ],
      borderColor: ['white', 'white', 'white', 'white', 'white'],
      borderWidth: 2,
    }
  ],
};

// KPI Dashboard Builder Chart Types
type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'kpi' | 'table' | 'scatter';

// Add new type to distinguish between default and user-added widgets
interface BaseChartWidget {
  id: string;
  type: ChartType;
  title: string;
  description?: string;
  data: any;
  size: 'small' | 'medium' | 'large';
  options?: any;
  selectedFeatures?: string[];
}

interface DefaultChartWidget extends BaseChartWidget {
  isDefault: true;
}

// Add new interfaces for KPI configuration
interface KPIConfig {
  metric?: string;
  aggregation?: 'sum' | 'average' | 'count' | 'max' | 'min';
  filterType?: 'top' | 'bottom' | 'none';
  filterCount?: number;
  comparisonType?: 'previous' | 'target';
  targetValue?: number;
}

// Add new function to calculate KPI values
const calculateKPIValue = (
  data: any[],
  metric: string,
  aggregation: string,
  filterType: string,
  filterCount: number
): { value: number; trend: number; items?: Array<{ label: string; value: number }> } => {
  console.log('calculateKPIValue - Starting calculation with:', {
    dataLength: data?.length,
    metric,
    aggregation,
    filterType,
    filterCount,
    sampleData: data?.slice(0, 2)
  });

  if (!data || !data.length) return { value: 0, trend: 0 };

  // For count aggregation, we'll count occurrences of each unique value
  if (aggregation === 'count') {
    const valueCounts = new Map<any, number>();
    data.forEach(item => {
      const metricValue = item[metric];
      valueCounts.set(metricValue, (valueCounts.get(metricValue) || 0) + 1);
    });

    console.log('Value counts:', Object.fromEntries(valueCounts));

    // Convert to array and sort
    const sortedCounts = Array.from(valueCounts.entries())
      .map(([label, count]) => ({ label: String(label), value: count }))
      .sort((a, b) => b.value - a.value);

    const totalCount = sortedCounts.reduce((sum, item) => sum + item.value, 0);
    const averageCount = totalCount / sortedCounts.length;

    // Get items based on filter
    let filteredItems;
    if (filterType !== 'none' && filterCount > 0) {
      filteredItems = filterType === 'top' 
        ? sortedCounts.slice(0, filterCount)
        : sortedCounts.slice(-filterCount).reverse();
    }

    return {
      value: totalCount,
      trend: ((totalCount / data.length - averageCount) / averageCount) * 100,
      items: filteredItems
    };
  }

  // For numeric aggregations
  let numericValues = data.map(item => Number(item[metric])).filter(val => !isNaN(val));

  // Calculate the main value based on aggregation
  let aggregatedValue = 0;
  switch (aggregation) {
    case 'sum':
      aggregatedValue = numericValues.reduce((a, b) => a + b, 0);
      break;
    case 'average':
      aggregatedValue = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
      break;
    case 'max':
      aggregatedValue = Math.max(...numericValues);
      break;
    case 'min':
      aggregatedValue = Math.min(...numericValues);
      break;
  }

  // Calculate trend (simple percentage change from average)
  const average = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
  const trend = ((aggregatedValue - average) / average) * 100;

  // Get top/bottom items if needed
  let filteredItems;
  if (filterType !== 'none' && filterCount > 0) {
    const sortedData = [...data].sort((a, b) => Number(b[metric]) - Number(a[metric]));
    filteredItems = filterType === 'top'
      ? sortedData.slice(0, filterCount)
      : sortedData.slice(-filterCount);

    filteredItems = filteredItems.map(item => ({
      label: String(item[metric]),
      value: Number(item[metric])
    }));

    if (filterType === 'bottom') {
      filteredItems.reverse();
    }
  }

  console.log('calculateKPIValue - Result:', {
    value: aggregatedValue,
    trend,
    itemsCount: filteredItems?.length,
    sampleItems: filteredItems?.slice(0, 2)
  });

  return { value: aggregatedValue, trend, items: filteredItems };
};

interface UserChartWidget extends BaseChartWidget {
  isDefault: false;
  dateAdded: Date;
  config?: KPIConfig;
}

type ChartWidget = DefaultChartWidget | UserChartWidget;

// Add ScrollableSection component at the top level
const ScrollableSection: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="overflow-y-auto max-h-[600px] pr-4 space-y-4">
        {children}
      </div>
    </div>
  );
};

// Add this type definition near the top with other interfaces
interface ComparisonData {
  primaryVar: string;
  secondaryVar: string;
  data: {
    categories: string[];
    values: number[];
  };
}

// Add this helper function to calculate average values for comparison
const calculateAverageByCategory = (data: any[], primaryVar: string, secondaryVar: string): ComparisonData => {
  // Group the data by the secondary variable (e.g., number of bathrooms)
  const groupedData = {};
  data.forEach(item => {
    const secondaryValue = item[secondaryVar];
    const primaryValue = Number(item[primaryVar]);
    
    if (secondaryValue !== null && secondaryValue !== undefined && !isNaN(primaryValue)) {
      if (!groupedData[secondaryValue]) {
        groupedData[secondaryValue] = {
          sum: 0,
          count: 0
        };
      }
      groupedData[secondaryValue].sum += primaryValue;
      groupedData[secondaryValue].count += 1;
    }
  });

  // Calculate averages and prepare data
  const categories = Object.keys(groupedData).sort((a, b) => Number(a) - Number(b));
  const averages = categories.map(cat => 
    groupedData[cat].count > 0 ? groupedData[cat].sum / groupedData[cat].count : 0
  );

  return {
    primaryVar,
    secondaryVar,
    data: {
      categories,
      values: averages
    }
  };
};

interface ChartComponentProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string;
    }>;
  };
  options: {
    responsive: boolean;
    plugins: {
      legend: {
        position: "top" | "bottom" | "left" | "right";
      };
      title: {
        display: boolean;
        text: string;
      };
    };
  };
}

const ChartComponent: React.FC<ChartComponentProps> = ({ data, options }) => {
  return <Bar data={data} options={options} />;
};

// Add type guard functions
const isUserWidget = (widget: ChartWidget): widget is UserChartWidget => {
  return !widget.isDefault;
};

const isDefaultWidget = (widget: ChartWidget): widget is DefaultChartWidget => {
  return widget.isDefault;
};

const KPIBuilder: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const dashboardId = searchParams.get('id');
  // analyzedData is now managed as state below
  const [analyzedData, setAnalyzedData] = useState<AnalyzedData | undefined>(location.state?.analyzedData);
  
  // Add debug logging
  useEffect(() => {
    console.log('KPIBuilder Component - Initial Data:', {
      hasAnalyzedData: !!analyzedData,
      rawDataLength: analyzedData?.raw_data?.length,
      describe: analyzedData?.describe
    });
  }, [analyzedData]);

  const [dashboardTitle, setDashboardTitle] = useState('My Dashboard');
  const [showChart, setShowChart] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('bar');
  const [defaultWidgets, setDefaultWidgets] = useState<DefaultChartWidget[]>(() => {
    if (!analyzedData) {
      return [];
    }
    return [];
  });

  const [userWidgets, setUserWidgets] = useState<UserChartWidget[]>([]);
  const [editingWidget, setEditingWidget] = useState<ChartWidget | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [isEditingNew, setIsEditingNew] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [dashboardName, setDashboardName] = useState('');
  const chartAreaRef = useRef<HTMLDivElement>(null);
  
  const dashboardLink = `${window.location.origin}/kpi-builder?id=${dashboardId}`;

  // Load dashboard from localStorage if id is present
  useEffect(() => {
    if (dashboardId) {
      const dashboards = JSON.parse(localStorage.getItem('dashboards') || '[]');
      const dashboard = dashboards.find((d: any) => String(d.id) === String(dashboardId));
      if (dashboard) {
        setDashboardTitle(dashboard.title || 'My Dashboard');
        setDashboardName(dashboard.title || 'My Dashboard');
        setUserWidgets(dashboard.widgets || []);
        setAnalyzedData(dashboard.analyzedData);
      }
    }
  }, [dashboardId]);

  // Function to generate a random color
  const generateColor = (opacity: number = 1) => {
    const hue = Math.floor(Math.random() * 360);
    return `hsla(${hue}, 70%, 50%, ${opacity})`;
  };

  // Function to create trend line data for a column
  const createTrendLineData = (columnName: string, stats: ColumnStats) => {
    if (stats.mean === undefined || stats.std === undefined) return null;

    // Generate sample points for the trend
    const points = 12; // 12 points for the trend
    const data = [];
    const labels = [];
    
    for (let i = 0; i < points; i++) {
      // Generate a value around the mean within 2 standard deviations
      const value = stats.mean + (stats.std * (Math.random() * 4 - 2));
      data.push(Number(value.toFixed(2)));
      labels.push(`Point ${i + 1}`);
    }

    const color = generateColor();
              return {
      labels,
      datasets: [{
        label: columnName,
                data: data,
        borderColor: color,
        backgroundColor: color.replace('1)', '0.1)'),
                tension: 0.4,
        fill: true,
      }]
    };
  };

  // Function to create scatter plot data for two numeric columns
  const createScatterPlotData = (column1: string, column2: string, stats1: ColumnStats, stats2: ColumnStats) => {
    if (!stats1.mean || !stats2.mean || !stats1.std || !stats2.std) return null;

    // Generate sample points for the scatter plot
    const points = 50; // 50 points for a good scatter visualization
    const data = [];
    
    for (let i = 0; i < points; i++) {
      // Generate correlated random values around the means
      const x = stats1.mean + (stats1.std * (Math.random() * 4 - 2));
      const y = stats2.mean + (stats2.std * (Math.random() * 4 - 2));
      data.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
    }

    const color = generateColor();
    return {
      datasets: [{
        label: `${column1} vs ${column2}`,
        data: data,
        backgroundColor: color.replace('1)', '0.6)'),
        pointRadius: 6,
        pointHoverRadius: 8,
      }]
    };
  };

  // Effect to create initial trend line charts and scatter plots when data is received
  useEffect(() => {
    if (analyzedData?.describe) {
      const newDefaultWidgets: DefaultChartWidget[] = [];
      let widgetId = 1;

      // Get numeric columns
      const numericColumns = Object.entries(analyzedData.describe)
        .filter(([_, stats]) => stats.mean !== undefined && stats.std !== undefined)
        .map(([column]) => column);

      // Create trend lines for each numeric column
      numericColumns.forEach((columnName) => {
        const stats = analyzedData.describe[columnName];
        const trendData = createTrendLineData(columnName, stats);
        if (trendData) {
          newDefaultWidgets.push({
            id: String(widgetId++),
              type: 'line',
            title: `${columnName} Trend`,
            description: `Trend analysis for ${columnName}`,
            data: trendData,
            size: 'medium',
      options: {
        responsive: true,
        maintainAspectRatio: false,
              scales: {
                y: { 
                  beginAtZero: false,
                  title: {
                    display: true,
                    text: columnName
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: 'Time Points'
                  }
                }
                  },
              plugins: {
                  tooltip: {
                  mode: 'index',
                  intersect: false,
                },
                legend: {
                  position: 'top',
                }
              }
            },
            selectedFeatures: [columnName],
            isDefault: true
          });
        }
      });

      // Create scatter plots for pairs of numeric columns
      for (let i = 0; i < numericColumns.length; i++) {
        for (let j = i + 1; j < numericColumns.length; j++) {
          const column1 = numericColumns[i];
          const column2 = numericColumns[j];
          const stats1 = analyzedData.describe[column1];
          const stats2 = analyzedData.describe[column2];
          
          const scatterData = createScatterPlotData(column1, column2, stats1, stats2);
          if (scatterData) {
            newDefaultWidgets.push({
              id: String(widgetId++),
              type: 'scatter',
              title: `${column1} vs ${column2}`,
              description: `Relationship between ${column1} and ${column2}`,
              data: scatterData,
              size: 'medium',
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                      display: true,
                      text: column1
                    }
                  },
                  y: {
                    title: {
                      display: true,
                      text: column2
                    }
                  }
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context: any) => {
                        return `${column1}: ${context.parsed.x}, ${column2}: ${context.parsed.y}`;
                      }
                    }
                  }
                }
              },
              selectedFeatures: [column1, column2],
              isDefault: true
          });
        }
      }
      }

      setDefaultWidgets(newDefaultWidgets);
    }
  }, [analyzedData]);
  
  const handleAddChart = () => {
    console.log('Adding new chart:', selectedChartType);
    
    if (!analyzedData) {
      toast({
        title: "No Data Available",
        description: "Please upload data first before creating charts.",
        variant: "destructive",
      });
      return;
    }

    const newWidget: UserChartWidget = {
      id: Date.now().toString(),
      type: selectedChartType,
      title: `New ${selectedChartType.charAt(0).toUpperCase() + selectedChartType.slice(1)}`,
      description: 'Select variables to visualize',
      size: 'medium',
      data: null,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top' as const
          }
        }
      },
      selectedFeatures: [],
      isDefault: false,
      dateAdded: new Date(),
      // Initialize KPI config if it's a KPI widget
      ...(selectedChartType === 'kpi' ? {
        config: {
          aggregation: 'sum',
          filterType: 'none',
          filterCount: 5
        } as KPIConfig
      } : {})
    };

    console.log('Created new widget:', newWidget);
    setUserWidgets(prev => [...prev, newWidget]);
    
    toast({
      title: "Chart Added",
      description: "Successfully added a new visualization to your dashboard.",
      variant: "default",
    });
  };
  
  // Helper to generate thumbnail from chart area
  const generateThumbnail = async () => {
    if (chartAreaRef.current) {
      const canvas = await html2canvas(chartAreaRef.current, { backgroundColor: null, useCORS: true });
      return canvas.toDataURL('image/png');
    }
    return '';
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    const userId = 'demo-user';
    const dashboards = JSON.parse(localStorage.getItem('dashboards') || '[]');
    const thumbnail = await generateThumbnail();
    const newDashboard = {
      id: Date.now().toString(),
      userId,
      title: dashboardName,
      widgets: userWidgets,
      analyzedData,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      thumbnail,
    };
    dashboards.push(newDashboard);
    localStorage.setItem('dashboards', JSON.stringify(dashboards));
    setIsSaving(false);
    setShowSaveDialog(false);
    setDashboardName('');
    toast({
      title: 'Dashboard Saved',
      description: 'Your dashboard has been saved successfully.',
    });
  };

  const handleDeleteWidget = (id: string) => {
    setUserWidgets(userWidgets.filter(widget => widget.id !== id));
    if (editingWidget?.id === id) {
      setEditingWidget(null);
    }
  };
  
  const handleEditWidget = (widget: ChartWidget) => {
    if (!isUserWidget(widget)) return;
    console.log('Editing widget:', widget);
    setIsEditingNew(false);
    setEditingWidget(widget);
  };
  
  const handleUpdateWidget = (updatedWidget: UserChartWidget) => {
    console.log('Updating widget:', updatedWidget);
    setUserWidgets(prevWidgets => 
      prevWidgets.map(w => 
        w.id === updatedWidget.id ? updatedWidget : w
      )
    );
    setEditingWidget(null);
    toast({
      title: "Widget Updated",
      description: "Your changes have been saved successfully.",
    });
  };
  
  const updateStatisticalComparison = (var1: string, var2: string | null, widget: UserChartWidget) => {
    console.log('Statistical Comparison Data Flow - Step 1:', {
      var1,
      var2,
      widgetId: widget.id,
      hasAnalyzedData: !!analyzedData,
      hasDescribe: !!analyzedData?.describe,
      availableStats: analyzedData?.describe?.[var1]
    });

    if (!analyzedData?.describe) {
      console.error('Statistical Comparison Error: No describe data available');
      return;
    }

    if (!var1) {
      console.error('Statistical Comparison Error: Missing first variable');
      return;
    }

    // Get the statistics for the first variable
    const stats1 = analyzedData.describe[var1];
    console.log('Statistical Comparison Data Flow - Step 2:', {
      variable: var1,
      stats: stats1,
      hasStats: !!stats1,
      mean: stats1?.mean,
      median: stats1?.['50%'],
      min: stats1?.min,
      max: stats1?.max
    });

    if (!stats1) {
      console.error('Statistical Comparison Error: Missing statistics for first variable');
      return;
    }

    // Define our measures and labels
    const labels = ['Minimum', 'Maximum', 'Mean', 'Median'];
    const measures = ['min', 'max', 'mean', '50%'] as const;

    // Create data for first variable with detailed logging
    const firstVarData = measures.map(measure => {
      const value = stats1[measure];
      console.log(`Statistical Comparison Data Flow - Step 3 (${var1} ${measure}):`, {
        measure,
        rawValue: value,
        isNumber: typeof value === 'number',
        processedValue: typeof value === 'number' ? value : 0
      });
      return typeof value === 'number' ? value : 0;
    });

    // Create the base chart data
    const chartData = {
      labels,
      datasets: [
        {
          label: var1,
          data: firstVarData,
          backgroundColor: 'rgba(139, 92, 246, 0.8)',
          borderColor: 'rgba(139, 92, 246, 1)',
          borderWidth: 1,
          barPercentage: 0.8,
          categoryPercentage: var2 ? 0.4 : 0.8
        }
      ]
    };

    console.log('Statistical Comparison Data Flow - Step 4:', {
      chartData,
      firstVarDataPoints: firstVarData,
      labels
    });

    // Add second variable if provided
    if (var2) {
      const stats2 = analyzedData.describe[var2];
      if (stats2) {
        const secondVarData = measures.map(measure => {
          const value = stats2[measure];
          console.log(`Statistical Comparison Data Flow - Step 5 (${var2} ${measure}):`, {
            measure,
            rawValue: value,
            isNumber: typeof value === 'number',
            processedValue: typeof value === 'number' ? value : 0
          });
          return typeof value === 'number' ? value : 0;
        });

        chartData.datasets.push({
          label: var2,
          data: secondVarData,
          backgroundColor: 'rgba(216, 180, 254, 0.8)',
          borderColor: 'rgba(216, 180, 254, 1)',
          borderWidth: 1,
          barPercentage: 0.8,
          categoryPercentage: 0.4
        });
      }
    }

    // Create the updated widget with logging
    const updatedWidget: UserChartWidget = {
      ...widget,
      selectedFeatures: var2 ? [var1, var2] : [var1],
      title: var2 ? `Statistical Comparison: ${var1} vs ${var2}` : `Statistical Measures: ${var1}`,
      description: var2 ? 'Comparison of key statistical measures' : 'Key statistical measures',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: false,
                title: {
                  display: true,
                  text: 'Value'
                }
              },
              x: {
                title: {
                  display: true,
              text: 'Statistical Measure'
                }
              }
            },
        plugins: {
          legend: {
            display: true,
                position: 'top' as const
              },
              tooltip: {
            callbacks: {
              label: function(context: any) {
                const measure = labels[context.dataIndex];
                return `${context.dataset.label} ${measure}: ${context.parsed.y.toFixed(2)}`;
              }
            }
          }
        }
      },
      isDefault: false,
      dateAdded: widget.dateAdded
    };

    console.log('Statistical Comparison Data Flow - Final Step:', {
      updatedWidget,
      hasData: !!updatedWidget.data,
      datasetCount: updatedWidget.data.datasets.length,
      firstDatasetPoints: updatedWidget.data.datasets[0]?.data
    });

    // Update the widgets state
    setUserWidgets(prevWidgets => 
      prevWidgets.map(w => w.id === widget.id ? updatedWidget : w)
    );
  };
  
  const updateLineChartData = (variable: string, widget: UserChartWidget) => {
    console.log('Line Chart Update - Step 1:', {
      variable,
      hasAnalyzedData: !!analyzedData,
      hasDescribe: !!analyzedData?.describe,
      stats: analyzedData?.describe?.[variable]
    });

    if (!analyzedData?.describe || !analyzedData.describe[variable]) {
      console.error('No statistical data available for line chart');
      return;
    }

    const stats = analyzedData.describe[variable];
    
    // Generate 12 points between min and max for the trend
    const min = stats.min || 0;
    const max = stats.max || 0;
    const points = 12;
    const step = (max - min) / (points - 1);
    
    const numericData = Array.from({ length: points }, (_, i) => min + (step * i));

    console.log('Line Chart Update - Step 2:', {
      dataPoints: numericData.length,
      min,
      max,
      sampleData: numericData.slice(0, 5)
    });

    // Create updated widget with new data
    const updatedWidget: UserChartWidget = {
      ...widget,
      selectedFeatures: [variable],
      title: `${variable} Trend Analysis`,
      description: `Time series visualization of ${variable}`,
          data: {
        labels: Array.from({ length: points }, (_, i) => `Point ${i + 1}`),
            datasets: [{
          label: variable,
          data: numericData,
          borderColor: 'rgb(139, 92, 246)',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          tension: 0.4,
          fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
            beginAtZero: false,
                title: {
                  display: true,
              text: variable
                }
              },
              x: {
                title: {
                  display: true,
              text: 'Data Points'
                }
              }
            },
            plugins: {
              legend: {
                display: true,
                position: 'top' as const
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        }
      },
      isDefault: false,
      dateAdded: widget.dateAdded
    };

    console.log('Line Chart Update - Step 3:', {
      hasData: !!updatedWidget.data,
      dataPoints: updatedWidget.data.datasets[0].data.length,
      chartOptions: updatedWidget.options
    });

    // Update widgets state
    setUserWidgets(prevWidgets => 
      prevWidgets.map(w => w.id === widget.id ? updatedWidget : w)
    );
  };

  const updatePieChartData = (variable: string, widget: UserChartWidget) => {
    // Step 1: Initial data check
    console.log('Step 1 - Initial Data Check:', {
      hasCategoricalDist: !!analyzedData?.categorical_distributions?.[variable],
      variable,
      stats: analyzedData?.describe?.[variable]
    });

    if (!analyzedData?.describe) {
      console.error('No describe data available for pie chart');
      return;
    }

    const stats = analyzedData.describe[variable];
    if (!stats) {
      console.error('No statistics available for variable:', variable);
      return;
    }

    // Step 2: Log the stats information
    console.log('Step 2 - Variable Statistics:', {
      variable,
      stats,
      uniqueValues: stats.unique,
      topCategory: stats.top,
      topFrequency: stats.freq,
      hasCategoricalDist: !!analyzedData.categorical_distributions?.[variable]
    });

    // For pie charts, we need to get the distribution of categories
    let labels: string[] = [];
    let values: number[] = [];

    // Try categorical distributions first
    if (analyzedData?.categorical_distributions?.[variable]) {
      console.log('Step 3A - Using Categorical Distributions:', {
        distribution: analyzedData.categorical_distributions[variable]
      });

      // Convert distribution to array of [category, frequency] pairs and sort by frequency
      const sortedCategories = Object.entries(analyzedData.categorical_distributions[variable])
        .sort((a, b) => b[1] - a[1]);

      // Use all categories
      labels = sortedCategories.map(([category]) => category);
      values = sortedCategories.map(([_, frequency]) => frequency);

      console.log('Categorical Distribution:', {
        totalCategories: labels.length,
        labels,
        values,
        totalSum: values.reduce((sum, v) => sum + v, 0)
      });
    }
    // Fallback to using describe statistics
    else if (stats.top && stats.freq !== undefined && stats.unique !== undefined) {
      console.log('Step 3C - Using Fallback Method:', {
        fullStats: stats,
        hasTopCategories: !!stats.top_categories,
        topCategoriesLength: stats.top_categories?.length || 0,
        uniqueValues: stats.unique
      });

      const categories: Array<{category: string, frequency: number}> = [];
      const totalEstimate = stats.freq * (stats.unique / 1);

      // For binary variables (exactly 2 unique values)
      if (stats.unique === 2) {
        // Add known top category
        categories.push({
          category: stats.top,
          frequency: stats.freq
        });

        // Calculate second category
        const secondCategoryFreq = totalEstimate - stats.freq;
        categories.push({
          category: 'Other',
          frequency: secondCategoryFreq
        });
      }
      // For variables with more than 2 categories
      else {
        // Add known top category first
        categories.push({
          category: stats.top,
          frequency: stats.freq
        });

        // Calculate average frequency for remaining categories
        const remainingTotal = totalEstimate - stats.freq;
        const avgFrequency = remainingTotal / (stats.unique - 1);

        // Add remaining categories with estimated frequencies
        for (let i = 1; i < stats.unique; i++) {
          categories.push({
            category: `Category ${i + 1}`,
            frequency: Math.round(avgFrequency)
          });
        }
      }

      // Sort categories by frequency
      categories.sort((a, b) => b.frequency - a.frequency);

      // Set labels and values for all categories
      labels = categories.map(cat => cat.category);
      values = categories.map(cat => cat.frequency);

      console.log('Using Fallback Distribution:', {
        labels,
        values,
        uniqueValues: stats.unique,
        totalCategories: labels.length,
        totalSum: values.reduce((sum, v) => sum + v, 0)
      });
    }

    // Step 4: Validate final data
    console.log('Step 4 - Final Data Validation:', {
      labels,
      values,
      totalCategories: labels.length,
      totalValues: values.reduce((sum, v) => sum + v, 0),
      expectedUniqueValues: stats.unique
    });

    if (labels.length === 0 || values.length === 0) {
      console.error('No valid data generated for pie chart');
      return;
    }

    // Create updated widget
    const updatedWidget: UserChartWidget = {
      ...widget,
      selectedFeatures: [variable],
      title: `${variable} Distribution`,
      description: `Distribution of categories in ${variable}`,
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: [
            'rgba(139, 92, 246, 0.8)',   // Purple
            'rgba(59, 130, 246, 0.8)',   // Blue
            'rgba(16, 185, 129, 0.8)',   // Green
            'rgba(239, 68, 68, 0.8)',    // Red
            'rgba(245, 158, 11, 0.8)',   // Yellow
            'rgba(236, 72, 153, 0.8)',   // Pink
            'rgba(107, 114, 128, 0.8)',  // Gray
            'rgba(167, 139, 250, 0.8)',  // Light Purple
            'rgba(14, 165, 233, 0.8)',   // Sky Blue
            'rgba(234, 88, 12, 0.8)',    // Orange
            'rgba(22, 163, 74, 0.8)',    // Emerald
            'rgba(217, 70, 239, 0.8)',   // Fuchsia
            'rgba(251, 146, 60, 0.8)',   // Light Orange
            'rgba(124, 58, 237, 0.8)',   // Violet
            'rgba(6, 182, 212, 0.8)',    // Cyan
            // Generate more colors dynamically if needed
            ...Array.from({ length: Math.max(0, labels.length - 15) }, (_, i) => {
              const hue = (i * 20) % 360;
              return `hsla(${hue}, 70%, 50%, 0.8)`;
            })
          ].slice(0, labels.length),
          borderColor: Array(labels.length).fill('white'),
          borderWidth: 1,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right' as const,
            labels: {
              boxWidth: 20,
              padding: 10,
              font: {
                size: 11
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const count = context.raw;
                const percentage = ((count / values.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                return `${context.label}: ${count} (${percentage}%)`;
              }
            }
          }
        }
      },
      isDefault: false,
      dateAdded: widget.dateAdded
    };

    // Update widgets state
    setUserWidgets(prevWidgets => 
      prevWidgets.map(w => w.id === widget.id ? updatedWidget : w)
    );
  };

  const renderChartByType = (widget: UserChartWidget): React.ReactNode => {
    switch (widget.type) {
      case 'bar':
          return (
            <div className="h-full flex flex-col">
            <div className="p-2 border-b space-y-4 flex-none">
              <div className="flex items-center gap-4">
                {/* First Variable Selection */}
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">First Variable</Label>
                <Select
                  value={widget.selectedFeatures?.[0] || ''}
                  onValueChange={(value) => {
                      const updatedWidget = {
                        ...widget,
                        selectedFeatures: [value]
                      };
                      updateStatisticalComparison(value, null, updatedWidget);
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select first variable" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(analyzedData?.describe || {})
                        .filter(column => analyzedData?.describe[column].mean !== undefined)
                        .map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Second Variable Selection */}
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Second Variable</Label>
                  <Select
                    value={widget.selectedFeatures?.[1] || ''}
                    onValueChange={(value) => {
                      if (!widget.selectedFeatures?.[0]) return;
                      const updatedWidget = {
                        ...widget,
                        selectedFeatures: [widget.selectedFeatures[0], value]
                      };
                      updateStatisticalComparison(widget.selectedFeatures[0], value, updatedWidget);
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select second variable" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(analyzedData?.describe || {})
                        .filter(column => 
                          analyzedData?.describe[column].mean !== undefined && 
                          column !== widget.selectedFeatures?.[0]
                        )
                        .map((column) => (
                          <SelectItem key={column} value={column}>
                            {column}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              {widget.data?.datasets?.[0]?.data?.length > 0 ? (
                <div className="w-full h-full">
                <ChartComponent
                  data={widget.data}
                    options={{
                      ...widget.options,
                      maintainAspectRatio: false,
                      responsive: true
                    }}
                  />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Select at least one variable to view statistics
                </div>
              )}
            </div>
          </div>
        );
      
      case 'line':
        return (
          <div className="h-full flex flex-col">
            <div className="p-2 border-b space-y-4 flex-none">
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Select Variable</Label>
                  <Select
                    value={widget.selectedFeatures?.[0] || ''}
                    onValueChange={(value) => {
                      console.log('Line Chart - Variable Selected:', value);
                      const updatedWidget = {
                        ...widget,
                        selectedFeatures: [value]
                      };
                      updateLineChartData(value, updatedWidget);
                    }}
                >
                  <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select variable to analyze" />
                  </SelectTrigger>
                  <SelectContent>
                      {Object.keys(analyzedData?.describe || {})
                        .filter(column => analyzedData?.describe[column].mean !== undefined)
                        .map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                </div>
              </div>
              </div>
            <div className="flex-1 min-h-0">
              {widget.data?.datasets?.[0]?.data?.length > 0 ? (
                <div className="w-full h-full">
                <LineChart
                    data={widget.data}
                    options={{
                      ...widget.options,
                      maintainAspectRatio: false,
                      responsive: true
                    }}
                />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Select a variable to visualize its trend
                </div>
              )}
              </div>
            </div>
        );

      case 'pie':
        return (
          <div className="h-full flex flex-col">
            <div className="p-2 border-b space-y-4 flex-none">
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Select Variable</Label>
                  <Select
                    value={widget.selectedFeatures?.[0] || ''}
                    onValueChange={(value) => {
                      console.log('Pie Chart - Variable Selected:', value);
                      const updatedWidget = {
                        ...widget,
                        selectedFeatures: [value]
                      };
                      updatePieChartData(value, updatedWidget);
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select categorical variable" />
                    </SelectTrigger>
                    <SelectContent>
                      {analyzedData?.describe && 
                        Object.entries(analyzedData.describe)
                          .filter(([_, stats]) => 
                            stats.unique !== undefined && 
                            stats.freq !== undefined && 
                            stats.mean === undefined
                          )
                          .map(([column]) => (
                            <SelectItem key={column} value={column}>
                              {column}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-0 flex">
              {widget.data?.datasets?.[0]?.data?.length > 0 ? (
                <div className="w-full h-full grid grid-cols-[2fr,1fr] gap-4">
                  <div className="flex items-center justify-center">
                    <PieChart
                      data={widget.data}
                      options={{
                        ...widget.options,
                        maintainAspectRatio: false,
                        responsive: true,
                        plugins: {
                          ...widget.options?.plugins,
                          legend: {
                            position: 'right' as const,
                            align: 'center' as const,
                            display: true,
                            labels: {
                              boxWidth: 15,
                              padding: 10,
                              font: {
                                size: 11
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="overflow-y-auto pr-4 py-2 max-h-full">
                    <div className="space-y-2">
                      {widget.data.labels.map((label, index) => (
                        <div key={label} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-sm flex-shrink-0" 
                            style={{ 
                              backgroundColor: widget.data.datasets[0].backgroundColor[index] 
                            }} 
                          />
                          <span className="text-sm truncate">
                            {label}: {((widget.data.datasets[0].data[index] / widget.data.datasets[0].data.reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Select a categorical variable to visualize its distribution
                </div>
              )}
            </div>
          </div>
        );

      case 'doughnut':
        return (
          <div className="h-full flex flex-col">
            <div className="p-2 border-b space-y-4 flex-none">
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Select Variable</Label>
                  <Select
                    value={widget.selectedFeatures?.[0] || ''}
                    onValueChange={(value) => {
                      console.log('Doughnut Chart - Variable Selected:', value);
                      const updatedWidget = {
                        ...widget,
                        selectedFeatures: [value]
                      };
                      // We can reuse the pie chart data update function
                      updatePieChartData(value, updatedWidget);
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select categorical variable" />
                    </SelectTrigger>
                    <SelectContent>
                      {analyzedData?.describe && 
                        Object.entries(analyzedData.describe)
                          .filter(([_, stats]) => 
                            stats.unique !== undefined && 
                            stats.freq !== undefined && 
                            stats.mean === undefined
                          )
                          .map(([column]) => (
                            <SelectItem key={column} value={column}>
                              {column}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-0 flex">
              {widget.data?.datasets?.[0]?.data?.length > 0 ? (
                <div className="w-full h-full grid grid-cols-[2fr,1fr] gap-4">
                  <div className="flex items-center justify-center">
                    <DoughnutChart
                      data={widget.data}
                      options={{
                        ...widget.options,
                        maintainAspectRatio: false,
                        responsive: true,
                        cutout: '60%', // This makes it a doughnut chart
                        plugins: {
                          ...widget.options?.plugins,
                          legend: {
                            position: 'right' as const,
                            align: 'center' as const,
                            display: true,
                            labels: {
                              boxWidth: 15,
                              padding: 10,
                              font: {
                                size: 11
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="overflow-y-auto pr-4 py-2 max-h-full">
                    <div className="space-y-2">
                      {widget.data.labels.map((label, index) => (
                        <div key={label} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-sm flex-shrink-0" 
                            style={{ 
                              backgroundColor: widget.data.datasets[0].backgroundColor[index] 
                            }} 
                          />
                          <span className="text-sm truncate">
                            {label}: {((widget.data.datasets[0].data[index] / widget.data.datasets[0].data.reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Select a categorical variable to visualize its distribution
                </div>
              )}
            </div>
          </div>
        );

      case 'kpi':
        console.log('Rendering KPI widget:', widget);
        return (
          <div className="h-full flex flex-col">
            <div className="p-2 border-b space-y-4 flex-none">
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Metric</Label>
                  <Select
                    defaultValue={widget.selectedFeatures?.[0]}
                    onValueChange={(value) => {
                      console.log('Metric Selected:', value);
                      const updatedWidget: UserChartWidget = {
                        ...widget,
                        selectedFeatures: [value],
                        config: {
                          ...(widget.config || {}),
                          metric: value,
                          aggregation: (widget.config as KPIConfig)?.aggregation || 'sum',
                          filterType: (widget.config as KPIConfig)?.filterType || 'none',
                          filterCount: (widget.config as KPIConfig)?.filterCount || 5
                        }
                      };
                      console.log('Updating widget with new metric:', updatedWidget);
                      updateKPIData(updatedWidget);
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent>
                      {analyzedData?.describe && 
                        Object.entries(analyzedData.describe)
                          .filter(([_, stats]) => stats.mean !== undefined)
                          .map(([column]) => (
                            <SelectItem key={column} value={column}>
                              {column}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Aggregation</Label>
                  <Select
                    defaultValue={(widget.config as KPIConfig)?.aggregation || 'sum'}
                    onValueChange={(value: 'sum' | 'average' | 'count' | 'max' | 'min') => {
                      console.log('Aggregation Selected:', value);
                      const updatedWidget: UserChartWidget = {
                        ...widget,
                        config: {
                          ...(widget.config || {}),
                          aggregation: value
                        }
                      };
                      console.log('Updating widget with new aggregation:', updatedWidget);
                      updateKPIData(updatedWidget);
                    }}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Aggregation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sum">Sum</SelectItem>
                      <SelectItem value="average">Average</SelectItem>
                      <SelectItem value="count">Count</SelectItem>
                      <SelectItem value="max">Maximum</SelectItem>
                      <SelectItem value="min">Minimum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Filter</Label>
                  <Select
                    defaultValue={(widget.config as KPIConfig)?.filterType || 'none'}
                    onValueChange={(value: 'top' | 'bottom' | 'none') => {
                      console.log('Filter Type Selected:', value);
                      const updatedWidget: UserChartWidget = {
                        ...widget,
                        config: {
                          ...(widget.config || {}),
                          filterType: value
                        }
                      };
                      console.log('Updating widget with new filter type:', updatedWidget);
                      updateKPIData(updatedWidget);
                    }}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Filter type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="top">Top N</SelectItem>
                      <SelectItem value="bottom">Bottom N</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(widget.config as KPIConfig)?.filterType !== 'none' && (
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs">Count</Label>
                    <Select
                      defaultValue={String((widget.config as KPIConfig)?.filterCount || 5)}
                      onValueChange={(value) => {
                        console.log('Filter Count Selected:', value);
                        const updatedWidget: UserChartWidget = {
                          ...widget,
                          config: {
                            ...(widget.config || {}),
                            filterCount: Number(value)
                          }
                        };
                        console.log('Updating widget with new filter count:', updatedWidget);
                        updateKPIData(updatedWidget);
                      }}
                    >
                      <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="N" />
                      </SelectTrigger>
                      <SelectContent>
                        {[3, 5, 10, 15, 20].map(n => (
                          <SelectItem key={n} value={String(n)}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 min-h-0 flex p-4">
              {widget.data ? (
                <div className="w-full grid grid-cols-[1fr,2fr] gap-4">
                  <div className="bg-card rounded-lg p-6 flex flex-col justify-center items-center shadow-sm">
                    <div className="text-2xl font-bold mb-2">
                      {typeof widget.data.value === 'number' 
                        ? widget.data.value.toLocaleString(undefined, {
                            maximumFractionDigits: 2
                          })
                        : widget.data.value}
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      {widget.selectedFeatures?.[0]} ({(widget.config as KPIConfig)?.aggregation || 'sum'})
                    </div>
                    {widget.data.trend !== undefined && (
                      <div className={cn(
                        "flex items-center gap-1 text-sm",
                        widget.data.trend > 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {widget.data.trend > 0 ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                        {Math.abs(widget.data.trend).toFixed(1)}% vs average
                      </div>
                    )}
                  </div>

                  {widget.data.items && (
                    <div className="overflow-y-auto pr-4">
                      <div className="space-y-3">
                        {widget.data.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm truncate flex-1">{item.label}</span>
                            <span className="text-sm font-medium">
                              {item.value.toLocaleString(undefined, {
                                maximumFractionDigits: 2
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Select a metric to display KPI
                </div>
              )}
            </div>
          </div>
        );

      // Add other chart type cases here
      default:
        return (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Configuration options for {widget.type} charts coming soon
          </div>
        );
    }
  };

  const renderWidgetContent = (widget: ChartWidget): React.ReactNode => {
    if (isDefaultWidget(widget)) {
      // Render default widgets (trend lines and correlations) as before
      switch (widget.type) {
        case 'line':
          return (
            <LineChart
              data={widget.data}
              options={widget.options}
            />
        );
      case 'scatter':
        return (
          <LineChart
            data={widget.data}
            options={{
              ...widget.options,
                showLine: false,
            }}
          />
        );
      default:
        return null;
      }
    } else {
      // Render user-added widgets with their specific configurations
      return renderChartByType(widget);
    }
  };
  
  // Restore the edit form functionality
  const renderEditForm = (): React.ReactNode => {
    if (!editingWidget) return null;
    
    return (
      <>
        <div className="space-y-4">
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
        
        <div className="pt-4 flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => {
              setEditingWidget(null);
              setIsEditingNew(false);
            }}
          >
            Cancel
          </Button>
          <Button 
            className="bg-dashboardly-primary hover:bg-dashboardly-dark text-white"
            onClick={() => {
                handleUpdateWidget(editingWidget as UserChartWidget);
              setIsEditingNew(false);
            }}
          >
            {isEditingNew ? 'Add' : 'Update'}
          </Button>
          </div>
        </div>
      </>
    );
  };
  
  // Add updateKPIData function
  const updateKPIData = (widget: UserChartWidget) => {
    console.log('updateKPIData - Starting update with:', {
      widgetId: widget.id,
      selectedFeature: widget.selectedFeatures?.[0],
      config: widget.config,
      hasRawData: !!analyzedData?.raw_data,
      rawDataSample: analyzedData?.raw_data?.slice(0, 2)
    });

    if (!analyzedData?.raw_data || !widget.selectedFeatures?.[0]) {
      console.log('Missing required data for KPI update');
      return;
    }

    const config = widget.config as KPIConfig;
    console.log('Processing with config:', config);

    const result = calculateKPIValue(
      analyzedData.raw_data,
      widget.selectedFeatures[0],
      config?.aggregation || 'sum',
      config?.filterType || 'none',
      config?.filterCount || 5
    );

    console.log('Calculation result:', result);

    const updatedWidget: UserChartWidget = {
      ...widget,
      title: `${widget.selectedFeatures[0]} KPI`,
      description: `${config?.aggregation || 'Sum'} of ${widget.selectedFeatures[0]}`,
      data: result,
      config: {
        ...config,
        metric: widget.selectedFeatures[0],
        aggregation: config?.aggregation || 'sum',
        filterType: config?.filterType || 'none',
        filterCount: config?.filterCount || 5
      }
    };

    console.log('Setting updated widget:', updatedWidget);

    setUserWidgets(prevWidgets => {
      const newWidgets = prevWidgets.map(w => 
        w.id === widget.id ? updatedWidget : w
      );
      console.log('New widgets state:', newWidgets);
      return newWidgets;
    });
  };
  
  const handleUpdateDashboard = async () => {
    setIsSaving(true);
    const dashboards = JSON.parse(localStorage.getItem('dashboards') || '[]');
    const idx = dashboards.findIndex((d: any) => String(d.id) === String(dashboardId));
    if (idx !== -1) {
      const thumbnail = await generateThumbnail();
      dashboards[idx] = {
        ...dashboards[idx],
        title: dashboardName,
        widgets: userWidgets,
        analyzedData,
        updated: new Date().toISOString(),
        thumbnail,
      };
      localStorage.setItem('dashboards', JSON.stringify(dashboards));
      setIsSaving(false);
      setShowSaveDialog(false);
      toast({
        title: 'Dashboard Updated',
        description: 'Your dashboard has been updated successfully.',
      });
    } else {
      setIsSaving(false);
      toast({
        title: 'Update Failed',
        description: 'Dashboard not found.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-dashboardly-primary tracking-tight">KPI Dashboard Builder</h2>
          <p className="text-muted-foreground">
            {analyzedData 
              ? "Create interactive dashboards with your choice of visualizations!"
              : "Upload a dataset to start building your dashboard"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="bg-white">
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
          {analyzedData && (
            <>
              <Link to="/eda" state={{ fileData: analyzedData }}>
                <Button className="bg-dashboardly-primary hover:bg-dashboardly-dark text-white font-normal text-xs px-2 py-1">
                  <ChevronLeft className="h-3 w-3 mr-1" />
                  Back to EDA
                </Button>
              </Link>
              <Button className="bg-dashboardly-primary hover:bg-dashboardly-dark text-white font-normal text-xs px-2 py-1" onClick={() => setShowSaveDialog(true)}>
                <Save className="h-3 w-3 mr-1" />
                Save Dashboard
              </Button>
              <Link to="/my-dashboards">
                <Button className="bg-dashboardly-primary hover:bg-dashboardly-dark text-white font-normal text-xs px-2 py-1 ml-1">
                  Go to Saved Dashboards
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
      
      <div className="grid gap-4 pb-4">
        {/* My Dashboard card - always visible */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-dashboardly-accent">My Dashboard</CardTitle>
            <CardDescription>
              Last updated: {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-purple-700 bg-purple-50 p-3 rounded-lg">
              <InfoIcon className="h-4 w-4 text-purple-500" />
              <p>Save your dashboard to keep updating and editing your work</p>
            </div>
          </CardContent>
        </Card>

        {!analyzedData && (
          <>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex gap-4 items-start">
                  <InfoIcon className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-medium text-purple-900">Sample Dashboard View</h3>
                    <p className="text-sm text-purple-700">
                      This is a sample dashboard showing example visualizations. To create your own dashboard with your data, 
                      please visit the <Link to="/eda" className="text-purple-900 underline">EDA Generator</Link> first 
                      to analyze your data file.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sample Revenue Trend Chart */}
              <Card className="min-h-[400px] flex flex-col">
                <CardHeader className="bg-muted/30 p-3 flex-none">
                  <CardTitle className="text-base">Sample Revenue Trend</CardTitle>
                  <CardDescription className="text-xs">Monthly revenue performance</CardDescription>
                </CardHeader>
                <CardContent className="p-4 flex-1">
                  <div className="w-full h-full">
                    <LineChart
                      data={sampleLineChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: 'Revenue (USD)'
                            }
                          },
                          x: {
                            title: {
                              display: true,
                              text: 'Month'
                            }
                          }
                        },
                        plugins: {
                          legend: {
                            position: 'top'
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Sample Sales Distribution Chart */}
              <Card className="min-h-[400px] flex flex-col">
                <CardHeader className="bg-muted/30 p-3 flex-none">
                  <CardTitle className="text-base">Sample Category Distribution</CardTitle>
                  <CardDescription className="text-xs">Sales distribution by product category</CardDescription>
                </CardHeader>
                <CardContent className="p-4 flex-1">
                  <div className="w-full h-full grid grid-cols-[2fr,1fr] gap-4">
                    <div className="flex items-center justify-center">
                      <PieChart
                        data={samplePieChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'right',
                              align: 'center',
                              labels: {
                                boxWidth: 15,
                                padding: 10,
                                font: {
                                  size: 11
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="overflow-y-auto pr-4 py-2">
                      <div className="space-y-2">
                        {samplePieChartData.labels.map((label, index) => (
                          <div key={label} className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-sm flex-shrink-0" 
                              style={{ 
                                backgroundColor: samplePieChartData.datasets[0].backgroundColor[index] 
                              }} 
                            />
                            <span className="text-sm truncate">
                              {label}: {samplePieChartData.datasets[0].data[index]}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {analyzedData && (
          <>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex gap-4 items-start">
                  <InfoIcon className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-medium text-purple-900">Default Analysis View</h3>
                    <p className="text-sm text-purple-700">
                      We've automatically generated trend and correlation analyses for your numeric columns.<br /><br/>
                      Want to create your own visualizations? Use the "Add Chart Widget" section to create custom.<br />
                      You can edit custom widget's name, description and size of the visualization by clicking the Edit icon once added.
                    </p>
                    <div className="flex gap-6 text-sm text-purple-700 pt-1">
                      <div className="flex items-center gap-2">
                        <BarChartIcon className="h-4 w-4" />
                        <span>Bar Charts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <LineIcon className="h-4 w-4" />
                        <span>Line Charts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PieIcon className="h-4 w-4" />
                        <span>Pie Charts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Table className="h-4 w-4" />
                        <span>Others</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div ref={chartAreaRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Default Analysis Section */}
                {defaultWidgets.some(w => w.type === 'line') && (
                  <ScrollableSection 
                    title="Trend Analysis" 
                    description="Time series analysis of individual metrics"
                  >
                    {defaultWidgets
                      .filter(w => w.type === 'line')
                      .map(widget => (
                          <Card 
                            key={widget.id}
                            className="h-[320px] flex flex-col"
                          >
                            <CardHeader className="bg-muted/30 p-2 flex-none flex flex-row justify-between items-center">
                              <div>
                                <CardTitle className="text-base">{widget.title}</CardTitle>
                                {widget.description && (
                                  <CardDescription className="text-xs">{widget.description}</CardDescription>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="p-4 flex-1 min-h-0">
                              <div className="w-full h-full">
                                {renderWidgetContent(widget)}
                              </div>
                            </CardContent>
                          </Card>
                      ))}
                  </ScrollableSection>
                )}

                {/* Correlation Analysis Section */}
                {defaultWidgets.some(w => w.type === 'scatter') && (
                  <ScrollableSection 
                    title="Correlation Analysis" 
                    description="Relationships between different metrics"
                  >
                    {defaultWidgets
                      .filter(w => w.type === 'scatter')
                      .map(widget => (
                        <Card 
                          key={widget.id}
                          className="h-[320px] flex flex-col"
                        >
                          <CardHeader className="bg-muted/30 p-2 flex-none">
                            <CardTitle className="text-base">{widget.title}</CardTitle>
                            {widget.description && (
                              <CardDescription className="text-xs">{widget.description}</CardDescription>
                            )}
                          </CardHeader>
                          <CardContent className="p-4 flex-1 min-h-0">
                            <div className="w-full h-full">
                              {renderWidgetContent(widget)}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </ScrollableSection>
                )}

                {/* User Added Widgets Section */}
                {userWidgets.length > 0 && (
                  <ScrollableSection 
                    title="Custom Visualizations" 
                    description="Your custom charts and visualizations"
                  >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {userWidgets.map(widget => (
                    <Card 
                      key={widget.id}
                      className={cn(
                            "overflow-hidden flex flex-col",
                            widget.size === 'large' && "md:col-span-2 min-h-[600px]",
                            widget.size === 'medium' && "min-h-[400px]",
                            widget.size === 'small' && "md:col-span-1 min-h-[300px]",
                        editingWidget?.id === widget.id && "ring-2 ring-dashboardly-primary"
                      )}
                    >
                          <CardHeader className="bg-muted/30 p-3 flex flex-row justify-between items-center flex-none">
                        <div>
                          <CardTitle className="text-base">{widget.title}</CardTitle>
                          {widget.description && (
                            <CardDescription className="text-xs">{widget.description}</CardDescription>
                          )}
                        </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditWidget(widget)}
                              >
                                <Pencil className="h-4 w-4" />
                            </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteWidget(widget.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                      </CardHeader>
                          <CardContent className="p-4 flex-1 flex flex-col min-h-0 h-full">
                        <div className="w-full h-full">
                          {renderWidgetContent(widget)}
                        </div>
                      </CardContent>
                    </Card>
                      ))}
              </div>
                  </ScrollableSection>
                )}
              </div>
              
              {/* Chart Widget Controls Section */}
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
                        <BarChartIcon className="h-6 w-6" />
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
                          "flex flex-col h-24 gap-2 items-center justify-center opacity-50 cursor-not-allowed",
                          selectedChartType === 'kpi' && "border-dashboardly-primary bg-dashboardly-primary/5"
                        )}
                        onClick={() => setSelectedChartType('kpi')}
                        disabled
                      >
                        <Gauge className="h-6 w-6" />
                        <span className="text-xs">More types coming soon</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        className={cn(
                          "flex flex-col h-24 gap-2 items-center justify-center opacity-50 cursor-not-allowed",
                          selectedChartType === 'table' && "border-dashboardly-primary bg-dashboardly-primary/5"
                        )}
                        onClick={() => setSelectedChartType('table')}
                        disabled
                      >
                        <Table className="h-6 w-6" />
                        <span className="text-xs">More types coming soon</span>
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
              </div>
            </div>
          </>
        )}
      </div>
          
      {/* Edit Widget Dialog */}
      {editingWidget && (
        <Dialog open={!!editingWidget} onOpenChange={(open) => !open && setEditingWidget(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Widget</DialogTitle>
              <DialogDescription>
                {editingWidget.type === 'pie' || editingWidget.type === 'doughnut' 
                  ? 'Select a categorical feature to visualize its distribution'
                  : `Customize your ${editingWidget.type} visualization.`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {renderEditForm()}
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* Save Dashboard Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Dashboard</DialogTitle>
            <DialogDescription>Enter a name for your dashboard.</DialogDescription>
          </DialogHeader>
          <Input
            value={dashboardName}
            onChange={e => setDashboardName(e.target.value)}
            placeholder="Dashboard Name"
            className="mb-4"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowSaveDialog(false)} disabled={isSaving}>Cancel</Button>
            {dashboardId ? (
              <>
                <Button className="bg-dashboardly-primary text-white" onClick={handleUpdateDashboard} disabled={!dashboardName || isSaving}>
                  {isSaving ? 'Updating...' : 'Update Dashboard'}
                </Button>
                <Button variant="secondary" onClick={handleConfirmSave} disabled={!dashboardName || isSaving}>
                  {isSaving ? 'Saving...' : 'Save as New'}
                </Button>
              </>
            ) : (
              <Button className="bg-dashboardly-primary text-white" onClick={handleConfirmSave} disabled={!dashboardName || isSaving}>
                {isSaving ? 'Saving...' : 'Save Dashboard'}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KPIBuilder;
