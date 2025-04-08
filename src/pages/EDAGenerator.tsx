
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { 
  Upload, 
  FileSpreadsheet, 
  Database, 
  AlertCircle, 
  CheckCircle2, 
  BarChart4, 
  PieChart,
  BarChart,
  LineChart as LineChartIcon,
  Table,
  FileType2,
  Share2,
  Download,
  ArrowRight,
  Save
} from 'lucide-react';
import { BarChart as BarChartComponent, LineChart, PieChart as PieChartComponent } from '@/components/ui/chart';
import {
  Table as TableComponent,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const FileUploadCard = ({ onFileUpload }: { onFileUpload: (file: File) => void }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Data File</CardTitle>
        <CardDescription>Upload a CSV or Excel file to start analyzing your data.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div 
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-48 
              ${dragActive ? 'border-dashboardly-primary bg-dashboardly-primary/5' : 'border-muted hover:border-dashboardly-primary/50 hover:bg-muted/40'} 
              transition-all cursor-pointer`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">
              Drag & drop your file here, or <span className="text-dashboardly-primary">browse</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports CSV and Excel files (up to 10MB)
            </p>
            <Input 
              id="file-upload" 
              type="file" 
              className="hidden" 
              accept=".csv,.xlsx,.xls"
              onChange={handleChange} 
            />
          </div>
          
          {selectedFile && (
            <div className="mt-4">
              <div className="flex items-center justify-between bg-muted/40 rounded-md p-2">
                <div className="flex items-center">
                  <FileSpreadsheet className="h-6 w-6 text-muted-foreground mr-2" />
                  <div>
                    <p className="text-sm font-medium truncate w-40 md:w-auto">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="bg-dashboardly-primary hover:bg-dashboardly-dark text-white"
                >
                  Analyze Data
                </Button>
              </div>
            </div>
          )}
        </form>
        
        <div className="mt-6">
          <p className="text-sm font-medium mb-2">Or connect to a database</p>
          <Button variant="outline" className="w-full flex items-center justify-center">
            <Database className="h-4 w-4 mr-2" />
            Connect Database Source
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground border-t pt-4">
        <div>Max file size: 10MB</div>
        <div>Supported formats: .csv, .xls, .xlsx</div>
      </CardFooter>
    </Card>
  );
};

// Dummy data for demonstration
const dummySummaryStats = {
  numeric: [
    { column: 'Price', mean: 42.5, median: 40, std: 12.3, min: 10, max: 100, missing: 0 },
    { column: 'Quantity', mean: 15.7, median: 12, std: 8.5, min: 1, max: 50, missing: 2 },
    { column: 'Revenue', mean: 542.8, median: 480, std: 324.5, min: 50, max: 2500, missing: 0 },
  ],
  categorical: [
    { column: 'Category', unique: 5, top: 'Electronics', frequency: 45, missing: 0 },
    { column: 'Status', unique: 3, top: 'Completed', frequency: 78, missing: 5 },
    { column: 'Region', unique: 8, top: 'North', frequency: 32, missing: 0 },
  ],
  correlations: [
    { var1: 'Price', var2: 'Revenue', correlation: 0.85 },
    { var1: 'Quantity', var2: 'Revenue', correlation: 0.72 },
    { var1: 'Price', var2: 'Quantity', correlation: -0.15 },
  ],
};

// Chart data for visualization examples
const barChartData = {
  labels: ['Electronics', 'Clothing', 'Food', 'Books', 'Other'],
  datasets: [
    {
      label: 'Sales by Category',
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
    }
  ],
};

const lineChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Monthly Revenue',
      data: [12, 19, 3, 5, 2, 3],
      borderColor: 'rgb(139, 92, 246)',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      tension: 0.4,
      fill: true,
    }
  ],
};

const EDAGenerator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'analyzing' | 'results'>('upload');
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('summary');
  const { toast } = useToast();
  
  const handleFileUpload = (file: File) => {
    // Simulate file processing
    setCurrentStep('analyzing');
    
    // Simulate progress
    let progressVal = 0;
    const interval = setInterval(() => {
      progressVal += 10;
      setProgress(progressVal);
      
      if (progressVal >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentStep('results');
          toast({
            title: "Analysis Complete",
            description: "Your data has been successfully analyzed.",
          });
        }, 500);
      }
    }, 300);
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Exploratory Data Analysis</h1>
        <p className="text-muted-foreground">Upload your data to generate comprehensive insights and visualizations.</p>
      </div>
      
      {currentStep === 'upload' && (
        <FileUploadCard onFileUpload={handleFileUpload} />
      )}
      
      {currentStep === 'analyzing' && (
        <Card>
          <CardHeader>
            <CardTitle>Analyzing Your Data</CardTitle>
            <CardDescription>This may take a few moments depending on the size of your file.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={progress} className="h-2 w-full" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center bg-muted/30 rounded-md p-3">
                <div className="bg-dashboardly-primary/20 p-2 rounded-md mr-3">
                  <FileType2 className="h-5 w-5 text-dashboardly-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Data Validation</p>
                  <p className="text-xs text-muted-foreground">
                    {progress >= 30 ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Complete
                      </span>
                    ) : (
                      <span className="flex items-center text-orange-600">
                        <AlertCircle className="h-3 w-3 mr-1" /> In Progress
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center bg-muted/30 rounded-md p-3">
                <div className="bg-dashboardly-primary/20 p-2 rounded-md mr-3">
                  <Table className="h-5 w-5 text-dashboardly-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Data Profiling</p>
                  <p className="text-xs text-muted-foreground">
                    {progress >= 60 ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Complete
                      </span>
                    ) : progress >= 30 ? (
                      <span className="flex items-center text-orange-600">
                        <AlertCircle className="h-3 w-3 mr-1" /> In Progress
                      </span>
                    ) : (
                      <span className="flex items-center text-muted-foreground">
                        Pending
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center bg-muted/30 rounded-md p-3">
                <div className="bg-dashboardly-primary/20 p-2 rounded-md mr-3">
                  <BarChart4 className="h-5 w-5 text-dashboardly-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Visualization</p>
                  <p className="text-xs text-muted-foreground">
                    {progress >= 90 ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Complete
                      </span>
                    ) : progress >= 60 ? (
                      <span className="flex items-center text-orange-600">
                        <AlertCircle className="h-3 w-3 mr-1" /> In Progress
                      </span>
                    ) : (
                      <span className="flex items-center text-muted-foreground">
                        Pending
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {currentStep === 'results' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Analysis Results: Sales_Data_2023.csv</h2>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" className="flex items-center">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Link to="/kpi-builder">
                <Button className="bg-dashboardly-primary hover:bg-dashboardly-dark text-white flex items-center">
                  <BarChart4 className="h-4 w-4 mr-2" />
                  Create Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Overview</CardTitle>
              <CardDescription>Basic information about your dataset</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/30 rounded-md p-4">
                  <p className="text-sm text-muted-foreground">Rows</p>
                  <p className="text-2xl font-bold">1,245</p>
                </div>
                <div className="bg-muted/30 rounded-md p-4">
                  <p className="text-sm text-muted-foreground">Columns</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="bg-muted/30 rounded-md p-4">
                  <p className="text-sm text-muted-foreground">Missing Values</p>
                  <p className="text-2xl font-bold">24 (0.2%)</p>
                </div>
                <div className="bg-muted/30 rounded-md p-4">
                  <p className="text-sm text-muted-foreground">Duplicate Rows</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                
                <div className="bg-muted/30 rounded-md p-4">
                  <p className="text-sm text-muted-foreground">Numeric Columns</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <div className="bg-muted/30 rounded-md p-4">
                  <p className="text-sm text-muted-foreground">Categorical Columns</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
                <div className="bg-muted/30 rounded-md p-4">
                  <p className="text-sm text-muted-foreground">Date Columns</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <div className="bg-muted/30 rounded-md p-4">
                  <p className="text-sm text-muted-foreground">Other Columns</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full md:w-auto">
              <TabsTrigger value="summary">Summary Statistics</TabsTrigger>
              <TabsTrigger value="distribution">Distributions</TabsTrigger>
              <TabsTrigger value="correlation">Correlations</TabsTrigger>
              <TabsTrigger value="categorical">Categorical Analysis</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Numeric Columns</CardTitle>
                  <CardDescription>Summary statistics for numeric columns</CardDescription>
                </CardHeader>
                <CardContent>
                  <TableComponent>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Column</TableHead>
                        <TableHead>Mean</TableHead>
                        <TableHead>Median</TableHead>
                        <TableHead>Std Dev</TableHead>
                        <TableHead>Min</TableHead>
                        <TableHead>Max</TableHead>
                        <TableHead>Missing</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dummySummaryStats.numeric.map((stat) => (
                        <TableRow key={stat.column}>
                          <TableCell className="font-medium">{stat.column}</TableCell>
                          <TableCell>{stat.mean.toFixed(2)}</TableCell>
                          <TableCell>{stat.median}</TableCell>
                          <TableCell>{stat.std.toFixed(2)}</TableCell>
                          <TableCell>{stat.min}</TableCell>
                          <TableCell>{stat.max}</TableCell>
                          <TableCell>{stat.missing}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </TableComponent>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Categorical Columns</CardTitle>
                  <CardDescription>Summary statistics for categorical columns</CardDescription>
                </CardHeader>
                <CardContent>
                  <TableComponent>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Column</TableHead>
                        <TableHead>Unique Values</TableHead>
                        <TableHead>Most Common</TableHead>
                        <TableHead>Frequency (%)</TableHead>
                        <TableHead>Missing</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dummySummaryStats.categorical.map((stat) => (
                        <TableRow key={stat.column}>
                          <TableCell className="font-medium">{stat.column}</TableCell>
                          <TableCell>{stat.unique}</TableCell>
                          <TableCell>{stat.top}</TableCell>
                          <TableCell>{stat.frequency}%</TableCell>
                          <TableCell>{stat.missing}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </TableComponent>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="distribution" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Price Distribution</CardTitle>
                    <CardDescription>Distribution of price values</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BarChartComponent
                      data={barChartData}
                      className="chart-container"
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: { beginAtZero: true }
                        },
                        plugins: {
                          legend: { display: true }
                        }
                      }}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Quantity Distribution</CardTitle>
                    <CardDescription>Distribution of quantity values</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BarChartComponent
                      data={{
                        ...barChartData,
                        labels: ['0-5', '6-10', '11-15', '16-20', '21+'],
                        datasets: [{
                          ...barChartData.datasets[0],
                          label: 'Frequency',
                          data: [45, 32, 18, 7, 3],
                          backgroundColor: 'rgba(216, 180, 254, 0.8)',
                        }]
                      }}
                      className="chart-container"
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: { beginAtZero: true }
                        },
                        plugins: {
                          legend: { display: true }
                        }
                      }}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Distribution</CardTitle>
                    <CardDescription>Distribution of revenue values</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BarChartComponent
                      data={{
                        ...barChartData,
                        labels: ['0-500', '501-1000', '1001-1500', '1501-2000', '2000+'],
                        datasets: [{
                          ...barChartData.datasets[0],
                          label: 'Frequency',
                          data: [55, 25, 12, 5, 3],
                          backgroundColor: 'rgba(217, 70, 239, 0.8)',
                        }]
                      }}
                      className="chart-container"
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: { beginAtZero: true }
                        },
                        plugins: {
                          legend: { display: true }
                        }
                      }}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Trends</CardTitle>
                    <CardDescription>Revenue trends over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LineChart
                      data={lineChartData}
                      className="chart-container"
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: { beginAtZero: true }
                        },
                        plugins: {
                          legend: { display: true }
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="correlation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Correlation Matrix</CardTitle>
                  <CardDescription>Correlation between numeric variables</CardDescription>
                </CardHeader>
                <CardContent>
                  <TableComponent>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Variables</TableHead>
                        <TableHead>Correlation</TableHead>
                        <TableHead>Strength</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dummySummaryStats.correlations.map((corr) => (
                        <TableRow key={`${corr.var1}-${corr.var2}`}>
                          <TableCell className="font-medium">{corr.var1} - {corr.var2}</TableCell>
                          <TableCell>{corr.correlation.toFixed(2)}</TableCell>
                          <TableCell>
                            <span className={
                              Math.abs(corr.correlation) > 0.7 ? 'text-green-600' :
                              Math.abs(corr.correlation) > 0.3 ? 'text-amber-600' :
                              'text-red-600'
                            }>
                              {Math.abs(corr.correlation) > 0.7 ? 'Strong' :
                               Math.abs(corr.correlation) > 0.3 ? 'Moderate' :
                               'Weak'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </TableComponent>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Price vs. Revenue Scatter Plot</h4>
                      <div className="chart-container bg-muted/30 rounded-lg p-4">
                        {/* Placeholder for scatter plot */}
                        <div className="flex items-center justify-center h-48">
                          <p className="text-muted-foreground text-sm">Scatter plot visualization</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Quantity vs. Revenue Scatter Plot</h4>
                      <div className="chart-container bg-muted/30 rounded-lg p-4">
                        {/* Placeholder for scatter plot */}
                        <div className="flex items-center justify-center h-48">
                          <p className="text-muted-foreground text-sm">Scatter plot visualization</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="categorical" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales by Category</CardTitle>
                    <CardDescription>Distribution of sales across product categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BarChartComponent
                      data={barChartData}
                      className="chart-container"
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        scales: {
                          x: { beginAtZero: true }
                        },
                        plugins: {
                          legend: { display: false }
                        }
                      }}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Sales by Region</CardTitle>
                    <CardDescription>Distribution of sales across regions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PieChartComponent
                      data={pieChartData}
                      className="chart-container"
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right',
                          }
                        }
                      }}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Status Distribution</CardTitle>
                    <CardDescription>Distribution of order statuses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BarChartComponent
                      data={{
                        ...barChartData,
                        labels: ['Completed', 'Pending', 'Cancelled'],
                        datasets: [{
                          ...barChartData.datasets[0],
                          label: 'Count',
                          data: [78, 15, 7],
                          backgroundColor: 'rgba(139, 92, 246, 0.8)',
                        }]
                      }}
                      className="chart-container"
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: { beginAtZero: true }
                        },
                        plugins: {
                          legend: { display: false }
                        }
                      }}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Average Price by Category</CardTitle>
                    <CardDescription>Average price comparison across categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BarChartComponent
                      data={{
                        ...barChartData,
                        datasets: [{
                          ...barChartData.datasets[0],
                          label: 'Average Price',
                          data: [85, 45, 25, 35, 55],
                          backgroundColor: 'rgba(217, 70, 239, 0.8)',
                        }]
                      }}
                      className="chart-container"
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: { beginAtZero: true }
                        },
                        plugins: {
                          legend: { display: false }
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="insights" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                  <CardDescription>Important findings from your data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-dashboardly-primary/20 p-2 rounded-md mr-3">
                        <CheckCircle2 className="h-5 w-5 text-dashboardly-primary" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium">Electronics is the top performing category</h3>
                        <p className="text-sm text-muted-foreground">
                          The Electronics category generates 35% of total revenue, with an average order value 1.5x higher than other categories.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-dashboardly-primary/20 p-2 rounded-md mr-3">
                        <CheckCircle2 className="h-5 w-5 text-dashboardly-primary" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium">Strong correlation between price and revenue</h3>
                        <p className="text-sm text-muted-foreground">
                          There's a strong positive correlation (0.85) between price and revenue, suggesting that higher-priced items contribute more significantly to overall revenue.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-dashboardly-primary/20 p-2 rounded-md mr-3">
                        <CheckCircle2 className="h-5 w-5 text-dashboardly-primary" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium">North region leads in sales</h3>
                        <p className="text-sm text-muted-foreground">
                          The North region accounts for 32% of all sales, followed by West (25%) and East (15%).
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-dashboardly-primary/20 p-2 rounded-md mr-3">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium">7% of orders are cancelled</h3>
                        <p className="text-sm text-muted-foreground">
                          The cancellation rate is 7%, with Books category having the highest cancellation rate at 12%.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium mb-2">Recommendations</h3>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>Focus marketing efforts on the Electronics category to capitalize on high average order values.</li>
                      <li>Investigate reasons for high cancellation rates in the Books category.</li>
                      <li>Consider regional pricing strategies to optimize revenue across different regions.</li>
                      <li>Expand inventory for products showing strong price-revenue correlations.</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-dashboardly-primary hover:bg-dashboardly-dark text-white flex items-center justify-center"
                    onClick={() => {
                      toast({
                        title: "Dashboard Creation Started",
                        description: "Your EDA has been saved. Let's create a dashboard!",
                      });
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Analysis & Create Dashboard
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default EDAGenerator;
