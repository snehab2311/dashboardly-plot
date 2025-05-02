import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, LayoutDashboard, ArrowRight, PieChartIcon, ChartBar, LineChart, PieChart, Users, Zap, Lock, BarChart2, FileSpreadsheet, Clock, Sun, Moon, Share2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';
import { useTheme } from 'next-themes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Line } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { Tooltip as TooltipRoot, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string>('');
  const userGuideRef = React.useRef<HTMLDivElement>(null);

  const handleFeatureClick = (path: string) => (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setRedirectPath(path);
      setShowAuthModal(true);
    }
  };

  const handleUserGuideClick = () => {
    userGuideRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!user) {
    return (
      <div className="space-y-16 max-w-7xl mx-auto">
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          redirectPath={redirectPath}
        />

        {/* Add gradient background div */}
        <div className="fixed inset-0 bg-gradient-to-r from-[hsl(275,41.90%,44.50%)] via-[hsl(273,90%,20%)] to-[hsl(272,90%,15%)] -z-10" />

        {/* Hero Section */}
        <div className="relative min-h-[300px] overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
            style={{ 
              backgroundImage: 'url("/backgroundmain.jpg")',
              imageRendering: 'crisp-edges'
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1333]/80 via-[#1a1333]/60 to-transparent" />
          
          {/* Content Container */}
          <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="text-left space-y-8 backdrop-blur-none">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
                  Transform Your Data into Actionable Insights
                </h1>
                <p className="text-lg sm:text-xl text-white/90 max-w-2xl drop-shadow">
                  Your all-in-one platform for data analysis and visualization. Upload, analyze, and create beautiful dashboards in minutes.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/signup">
                    <Button size="lg" className="bg-[#F5F3FF] hover:bg-[#4C1D95]/90 text-[#1a1333] font-semibold">
                      Start exploring
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Right Column - Visual space */}
              <div className="relative hidden lg:block">
                <div className="relative">
                  {/* Subtle Highlights */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-12">
          <h2 className="text-3xl font-bold text-white text-center">Powerful Features at Your Fingertips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-dashboardly-primary/50 transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-dashboardly-primary/10 flex items-center justify-center mb-4">
                  <FileSpreadsheet className="h-6 w-6 text-dashboardly-primary" />
                </div>
                <CardTitle>EDA Generator</CardTitle>
                <CardDescription>Automated Data Analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Upload your data and get instant insights with our automated exploratory data analysis tool.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-dashboardly-accent/50 transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-dashboardly-accent/10 flex items-center justify-center mb-4">
                  <BarChart2 className="h-6 w-6 text-dashboardly-accent" />
                </div>
                <CardTitle>KPI Builder</CardTitle>
                <CardDescription>Interactive Dashboards</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Create stunning dashboards with our drag-and-drop interface and real-time data visualization.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-dashboardly-dark/50 transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-dashboardly-dark/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-dashboardly-dark" />
                </div>
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>Work Together</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Share dashboards with your team, collaborate in real-time, and make data-driven decisions together.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-white text-center">Why Choose Dashboardly?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4 p-6">
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                <Zap className="h-6 w-6 text-dashboardly-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white">Instant Analysis</h3>
              <p className="text-muted-foreground text-white">Get immediate insights from your data with automated analysis and visualization.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6">
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                <Users className="h-6 w-6 text-dashboardly-accent" />
              </div>
              <h3 className="text-xl text-white font-semibold">Team Collaboration</h3>
              <p className="text-muted-foreground text-white">Share dashboards with your team and collaborate in real-time.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6">
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                <Lock className="h-6 w-6 text-dashboardly-dark" />
              </div>
              <h3 className="text-xl text-white font-semibold">Secure & Private</h3>
              <p className="text-muted-foreground text-white">Your data is encrypted and secure. You have full control over who can access it.</p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="space-y-8 mt-16">
          <h2 className="text-3xl font-bold text-white text-center">What Our Customers Say About Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Enterprise Professional */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-dashboardly-primary/20 flex items-center justify-center overflow-hidden">
                  <img src="/Mindy Chen.png" alt="Mindy Chen" className="h-12 w-12 rounded-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black">Mindy Chen</h3>
                  <p className="text-sm text-black">Data Analytics Lead, TechCorp Global</p>
                </div>
              </div>
              <p className="text-black italic">
                "Dashboardly transformed how we handle data analytics. The automated insights save hours of manual analysis, and the visualization tools help us communicate findings effectively to stakeholders."
              </p>
            </div>

            {/* Freelancer */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-dashboardly-primary/20 flex items-center justify-center overflow-hidden">
                  <img src="/Gabriel P.png" alt="Gabriel P" className="h-12 w-12 rounded-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black">Gabriel P</h3>
                  <p className="text-sm text-black">Independent Data Consultant</p>
                </div>
              </div>
              <p className="text-black italic">
                "As a freelance analyst, Dashboardly is my go-to tool. It helps me deliver professional insights quickly, and my clients love the interactive dashboards. The automated EDA feature is a game-changer!"
              </p>
            </div>

            {/* Student */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-dashboardly-primary/20 flex items-center justify-center overflow-hidden">
                  <img src="/Emily Paris.png" alt="Emily Paris" className="h-12 w-12 rounded-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black">Emily Paris</h3>
                  <p className="text-sm text-black">Data Science Student, Stanford University</p>
                </div>
              </div>
              <p className="text-black italic">
                "Perfect for students! Dashboardly helped me understand complex datasets for my research projects. The intuitive interface and automated analysis features made it easy to create impressive visualizations."
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/90 rounded-lg shadow-lg" />
          <div className="relative px-6 py-16 sm:py-20 lg:px-8 text-center space-y-6">
            <h2 className="text-4xl font-bold text-[#1a1333]">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of data enthusiasts who are already using Dashboardly to make better decisions.
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-dashboardly-primary hover:bg-dashboardly-dark text-white">
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 space-y-6 pb-16">
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        redirectPath={redirectPath}
      />

      {/* Header with Theme Toggle */}
      <div className="flex justify-between items-center pt-1 mb-4">
        <h2 className="text-3xl font-bold text-[#7C3AED]">Start Your Data Journey</h2>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <TooltipRoot>
              <TooltipTrigger asChild>
                <button
                  aria-label="User Guide"
                  onClick={handleUserGuideClick}
                  className="rounded-md border border-input bg-background shadow-sm hover:bg-dashboardly-primary/10 focus:outline-none focus:ring-2 focus:ring-dashboardly-primary flex items-center justify-center"
                  style={{ height: 40, width: 40 }}
                >
                  <HelpCircle className="h-5 w-5 text-[#7C3AED]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                User Guide
              </TooltipContent>
            </TooltipRoot>
          </TooltipProvider>
          <TooltipProvider>
            <TooltipRoot>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      {theme === 'light' ? <Sun className="h-5 w-5 text-[#7C3AED]" /> : <Moon className="h-5 w-5" />}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme('light')}>
                      <Sun className="mr-2 h-4 w-4" />
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')}>
                      <Moon className="mr-2 h-4 w-4" />
                      Dark
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                Toggle Theme
              </TooltipContent>
            </TooltipRoot>
          </TooltipProvider>
        </div>
      </div>

      {/* Feature Cards for logged-in users */}
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Link to="/eda" onClick={handleFeatureClick('/eda')} className="group">
            <Card className="h-[250px] min-w-[360px] max-w-[350px] w-full transition-all duration-200 hover:shadow-lg border-2 hover:border-dashboardly-primary/50 flex flex-col justify-between">
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

          <Link to="/kpi-builder" onClick={handleFeatureClick('/kpi-builder')} className="group">
            <Card className="h-[250px] min-w-[360px] max-w-[350px] w-full transition-all duration-200 hover:shadow-lg border-2 hover:border-dashboardly-accent/50 flex flex-col justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg font-semibold text-dashboardly-accent group-hover:text-accent/80 transition-colors">
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  KPI Dashboard Builder
                </CardTitle>
                <CardDescription>Create interactive dashboards</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Build customized dashboards with charts, KPI cards, and filters to 
                  visualize your data effectively.
                </p>
                <div className="mt-4 flex justify-end">
                  <ArrowRight className="h-5 w-5 text-dashboardly-accent group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/my-dashboards" className="group">
            <Card className="h-[250px] min-w-[360px] max-w-[350px] w-full transition-all duration-200 hover:shadow-lg border-2 hover:border-dashboardly-primary/50 flex flex-col justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg font-semibold text-dashboardly-primary group-hover:text-dashboardly-dark transition-colors">
                  <Clock className="mr-2 h-5 w-5" />
                  My Dashboards
                </CardTitle>
                <CardDescription>View your saved dashboards</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Access your previously created dashboards, make changes, and share them with your team or clients.
                </p>
                <div className="mt-4 flex justify-end">
                  <ArrowRight className="h-5 w-5 text-dashboardly-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Offer Section */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-[#7C3AED]">What do we offer?</h2>
        
        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Monthly Uploads Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-dashboardly-accent">EDA</CardTitle>
              <CardDescription>Know you data and its insights</CardDescription>
            </CardHeader>
            <CardContent>
              <Line
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                  datasets: [{
                    label: 'Sales trend',
                    data: [65, 59, 80, 81, 56, 55, 40, 65, 75, 85, 90, 68],
                    fill: false,
                    borderColor: 'rgb(139, 92, 246)',
                    backgroundColor: 'rgba(139, 92, 246, 0.5)',
                    tension: 0.4
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top' as const
                    }
                  }
                }}
                height={200}
              />
            </CardContent>
          </Card>

          {/* Data Sources Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-dashboardly-primary">Dashboard Creation</CardTitle>
              <CardDescription>Region wise sales analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <Pie
                data={{
                  labels: ['North', 'South', 'East', 'West'],
                  datasets: [{
                    data: [40, 30, 15, 15],
                    backgroundColor: [
                      'rgba(139, 92, 246, 0.8)',
                      'rgba(199, 172, 255, 0.8)',
                      'rgba(236, 72, 153, 0.8)',
                      'rgba(67, 56, 202, 0.8)'
                    ],
                    borderWidth: 1
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right' as const,
                      labels: {
                        boxWidth: 15
                      }
                    }
                  }
                }}
                height={200}
              />
            </CardContent>
          </Card>

          {/* Data Points Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-dashboardly-accent">Complete Analysis</CardTitle>
              <CardDescription>View, Analyze, and Make decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <Bar
                data={{
                  labels: ['Dataset 1', 'Dataset 2', 'Dataset 3', 'Dataset 4', 'Dataset 5'],
                  datasets: [{
                    label: 'Data Points',
                    data: [12, 19, 3, 5, 2],
                    backgroundColor: 'rgba(199, 172, 255, 0.8)',
                    borderColor: 'rgba(139, 92, 246, 1)',
                    borderWidth: 1
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
                height={200}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Guide Section */}
      <div className="space-y-6" ref={userGuideRef}>
        <h2 className="text-3xl font-bold text-[#7C3AED]">User Guide</h2>
        
        {/* Slider Container */}
        <div className="relative">
          <div className="overflow-x-auto hide-scrollbar">
            <div className="inline-flex gap-6 pb-6">
              {/* Step 1: Data Upload */}
              <div className="w-[400px] flex-shrink-0 bg-[#352060] rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-purple-300 font-semibold">1</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">Upload Your Data</h3>
                    <p className="text-gray-200">Start your analysis by uploading your data files:</p>
                    <ul className="list-disc list-inside text-gray-200 space-y-1 ml-4">
                      <li>Support for CSV and Excel files</li>
                      <li>Automatic data type detection</li>
                      <li>Basic data overview</li>
                      <li>Preview your features before processing</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 2: EDA Generator */}
              <div className="w-[400px] flex-shrink-0 bg-[#352060] rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-purple-300 font-semibold">2</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">Explore with EDA Generator</h3>
                    <p className="text-gray-200">Get instant insights with automated analysis:</p>
                    <ul className="list-disc list-inside text-gray-200 space-y-1 ml-4">
                      <li>Statistical summaries and distributions</li>
                      <li>Correlation analysis and patterns</li>
                      <li>Automated visualization suggestions</li>
                      <li>Missing value insight</li>
                      <li>Generate PDF report</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 3: KPI Builder */}
              <div className="w-[400px] flex-shrink-0 bg-[#352060] rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-purple-300 font-semibold">3</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">Create with KPI Builder</h3>
                    <p className="text-gray-200">Build dashboards:</p>
                    <ul className="list-disc list-inside text-gray-200 space-y-1 ml-4">
                      <li>Interactive interface</li>
                      <li>Multiple chart types and visualizations</li>
                      <li>Default analysis for metrics</li>
                      <li>Option to add filters</li>
                      <li>Save your dashboard</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Additional Features */}
              <div className="w-[400px] flex-shrink-0 bg-[#352060] rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-purple-300 font-semibold">+</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">Additional Features</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-white font-medium">Data Security</h4>
                        <ul className="list-disc list-inside text-gray-200 space-y-1 ml-4">
                          <li>Encrypted data storage</li>
                          <li>Secure file handling</li>
                          <li>Access control</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-white font-medium">Collaboration</h4>
                        <ul className="list-disc list-inside text-gray-200 space-y-1 ml-4">
                          <li>Share dashboards</li>
                          <li>Team workspaces</li>
                          <li>Export capabilities</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Scrollbar */}
          <style>{`
            .hide-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: rgba(124, 58, 237, 0.5) transparent;
            }
            .hide-scrollbar::-webkit-scrollbar {
              height: 4px;
            }
            .hide-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .hide-scrollbar::-webkit-scrollbar-thumb {
              background-color: rgba(124, 58, 237, 0.5);
              border-radius: 20px;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
