import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, PieChart } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Upload, LayoutDashboard, ArrowRight, BarChart2, LineChart as LineChartIcon, PieChartIcon, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  // Sample data for demonstration
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Projects Completed',
        data: [65, 59, 80, 81, 56, 55, 40, 54, 76, 88, 92, 67],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };
  
  const barChartData = {
    labels: ['Dataset 1', 'Dataset 2', 'Dataset 3', 'Dataset 4', 'Dataset 5'],
    datasets: [
      {
        label: 'Data Points',
        data: [12, 19, 3, 5, 2],
        backgroundColor: 'rgba(216, 180, 254, 0.8)',
      },
    ],
  };

  const pieChartData = {
    labels: ['CSV Files', 'Excel Files', 'JSON Data', 'Database Connections'],
    datasets: [
      {
        label: 'Data Sources',
        data: [12, 19, 3, 5],
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)',
          'rgba(216, 180, 254, 0.8)',
          'rgba(217, 70, 239, 0.8)',
          'rgba(76, 29, 149, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Dashboardly</h1>
          <p className="text-muted-foreground">Your all-in-one data analysis and visualization platform.</p>
        </div>
        <div className="flex space-x-2">
          <Link to="/eda">
            <Button className="bg-dashboardly-primary hover:bg-dashboardly-dark text-white">
              <Upload className="mr-2 h-4 w-4" />
              Upload Data
            </Button>
          </Link>
          <Link to="/kpi-builder">
            <Button className="bg-dashboardly-accent hover:bg-accent/80 text-white">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Create Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/eda" className="group">
          <Card className="h-full transition-all duration-200 hover:shadow-lg border-2 hover:border-dashboardly-primary/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg font-semibold text-dashboardly-primary group-hover:text-dashboardly-dark transition-colors">
                <Upload className="mr-2 h-5 w-5" />
                EDA Generator
              </CardTitle>
              <CardDescription>Upload and analyze your data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Upload CSV or Excel files to automatically generate exploratory data analysis with statistics, 
                visualizations, and insights.
              </p>
              <div className="mt-4 flex justify-end">
                <ArrowRight className="h-5 w-5 text-dashboardly-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/kpi-builder" className="group">
          <Card className="h-full transition-all duration-200 hover:shadow-lg border-2 hover:border-dashboardly-accent/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg font-semibold text-dashboardly-accent group-hover:text-accent/80 transition-colors">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                KPI Dashboard Builder
              </CardTitle>
              <CardDescription>Create interactive dashboards</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Build customized dashboards with drag-and-drop charts, KPI cards, and filters to 
                visualize your data effectively.
              </p>
              <div className="mt-4 flex justify-end">
                <ArrowRight className="h-5 w-5 text-dashboardly-accent group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/my-dashboards" className="group">
          <Card className="h-full transition-all duration-200 hover:shadow-lg border-2 hover:border-dashboardly-dark/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg font-semibold text-dashboardly-dark group-hover:text-dashboardly-dark/80 transition-colors">
                <PieChartIcon className="mr-2 h-5 w-5" />
                My Dashboards
              </CardTitle>
              <CardDescription>View your saved dashboards</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access your previously created dashboards, make changes, and share them with your team
                or clients.
              </p>
              <div className="mt-4 flex justify-end">
                <ArrowRight className="h-5 w-5 text-dashboardly-dark group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <h2 className="text-2xl font-bold tracking-tight mt-8">Recent Activity</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Uploads</CardTitle>
            <CardDescription>Number of data files uploaded per month</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart 
              data={lineChartData} 
              className="chart-container"
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Sources</CardTitle>
            <CardDescription>Types of data sources used</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart 
              data={pieChartData}
              className="chart-container"
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Points</CardTitle>
            <CardDescription>Number of data points per dataset</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={barChartData}
              className="chart-container"
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex flex-col gap-2 border-dashed border-2">
            <Plus className="h-6 w-6" />
            <span>New Dataset</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2 border-dashed border-2">
            <BarChart2 className="h-6 w-6" />
            <span>Bar Chart</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2 border-dashed border-2">
            <LineChartIcon className="h-6 w-6" />
            <span>Line Chart</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2 border-dashed border-2">
            <PieChartIcon className="h-6 w-6" />
            <span>Pie Chart</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
