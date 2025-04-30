import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useLocation } from 'react-router-dom';
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
  Download,
  ArrowRight,
  Save,
  FileDown,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { BarChart as BarChartComponent, LineChart as LineChartComponent } from '@/components/ui/chart';
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
import FileUpload from '../components/FileUpload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useTheme } from 'next-themes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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

function calculateCorrelation(array1: number[], array2: number[]): number {
  if (array1.length !== array2.length || array1.length === 0) return 0;

  const mean1 = array1.reduce((a, b) => a + b, 0) / array1.length;
  const mean2 = array2.reduce((a, b) => a + b, 0) / array2.length;

  const variance1 = array1.reduce((a, b) => a + Math.pow(b - mean1, 2), 0);
  const variance2 = array2.reduce((a, b) => a + Math.pow(b - mean2, 2), 0);

  const covariance = array1.reduce((a, b, i) => a + (b - mean1) * (array2[i] - mean2), 0);

  return covariance / Math.sqrt(variance1 * variance2);
}

// PDF Constants
const PDF_MARGIN = 20;

interface NumericColumnStats {
  mean: number;
  median: number;
  std: number;
  min: number;
  max: number;
}

interface CategoricalColumnStats {
  uniqueValues: number;
  mostCommon: string;
  leastCommon: string;
}

interface DatasetInfo {
  total_rows: number;
  total_columns: number;
  numeric_columns: number;
  categorical_columns: number;
  date_columns: number;
  missing_values: number;
  duplicate_rows: number;
  missing_percentage: string;
}

interface FileData {
  numericColumns: Record<string, NumericColumnStats>;
  categoricalColumns: Record<string, CategoricalColumnStats>;
  raw_data: Record<string, any[]>;
  describe: {
    numeric?: Record<string, any>;
    categorical?: Record<string, any>;
  };
  dataset_info: DatasetInfo;
  insights: Array<{title: string; description: string}>;
  recommendations: string[];
  null_counts: Record<string, number>;
}

const EDAGenerator: React.FC = () => {
  const location = useLocation();
  const receivedFileData = location.state?.fileData || location.state?.analyzedData;
  const { theme, setTheme } = useTheme();
  
  const [currentStep, setCurrentStep] = useState<'upload' | 'analyzing' | 'results'>('upload');
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('summary');
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [selectedXVar, setSelectedXVar] = useState<string>('');
  const [selectedYVar, setSelectedYVar] = useState<string>('');
  const [selectedDistributionVars, setSelectedDistributionVars] = useState<string[]>([]);
  const { toast } = useToast();
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Initialize with received file data if available
  useEffect(() => {
    if (receivedFileData) {
      setFileData(receivedFileData);
      setCurrentStep('results');
      toast({
        title: "Data Loaded",
        description: "Your previous analysis has been restored.",
      });
    }
  }, [receivedFileData]);
  
  // Initialize selectedDistributionVars when fileData changes
  useEffect(() => {
    if (fileData?.describe) {
      const allNumericVars = Object.entries(fileData.describe)
        .filter(([_, stats]: [string, any]) => stats.mean !== undefined)
        .map(([column]) => column);
      setSelectedDistributionVars(allNumericVars);
    }
  }, [fileData]);

  const handleFileUpload = async (file: File) => {
    setFileName(file.name);
    setCurrentStep('analyzing');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      let progressVal = 0;
      const interval = setInterval(() => {
        progressVal += 10;
        setProgress(progressVal);
        if (progressVal >= 100) clearInterval(interval);
      }, 300);

      // Use environment variable for backend URL
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/upload-file/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server error:', errorData);
        throw new Error(`Failed to upload file: ${errorData}`);
      }

      const data = await response.json();
      setFileData(data);
      
      setTimeout(() => {
        setCurrentStep('results');
        toast({
          title: "Analysis Complete",
          description: "Your data has been successfully analyzed.",
        });
      }, 500);
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze the file";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setCurrentStep('upload');
    }
  };
  
  const createScatterData = (xVar: string, yVar: string) => {
    console.log('Creating scatter data for:', xVar, yVar);
    console.log('Full fileData:', fileData);
    
    if (!fileData?.raw_data) {
      console.log('No raw_data available in fileData');
      // Fallback to using describe data if raw_data is not available
      if (fileData?.describe?.[xVar] && fileData?.describe?.[yVar]) {
        const xData = Object.entries(fileData.describe[xVar])
          .filter(([key, val]) => !isNaN(Number(val)) && key !== 'count')
          .map(([_, val]) => Number(val));
        const yData = Object.entries(fileData.describe[yVar])
          .filter(([key, val]) => !isNaN(Number(val)) && key !== 'count')
          .map(([_, val]) => Number(val));
        
        console.log('Using describe data instead:', { xData, yData });
        
        const points = xData.map((x, i) => ({
          x: x,
          y: yData[i] || 0
        }));
        
        console.log('Generated points from describe:', points);
        return points;
      }
      return [];
    }

    try {
      const xValues = fileData.raw_data[xVar];
      const yValues = fileData.raw_data[yVar];
      
      console.log('Raw values:', {
        xVar,
        yVar,
        xValues: xValues?.slice(0, 5),
        yValues: yValues?.slice(0, 5),
        xLength: xValues?.length,
        yLength: yValues?.length
      });

      if (!xValues || !yValues || xValues.length !== yValues.length) {
        console.log('Invalid or mismatched data arrays');
        return [];
      }

      const points = xValues.map((x: any, index: number) => {
        const xNum = Number(x);
        const yNum = Number(yValues[index]);
        
        if (isNaN(xNum) || isNaN(yNum)) return null;
        
        return {
          x: xNum,
          y: yNum
        };
      }).filter((point: any) => point !== null);

      console.log('First few scatter points:', points.slice(0, 5));
      return points;
    } catch (error) {
      console.error('Error creating scatter data:', error);
      return [];
    }
  };

  // Function to add Summary Statistics directly to PDF
  const addSummaryStatistics = (pdf: jsPDF) => {
    try {
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yOffset = margin;

      // Add section title
      pdf.setFontSize(16);
      pdf.setTextColor(100, 0, 100);
      pdf.text('Summary Statistics', margin, yOffset);
      yOffset += 15;

      // Add numeric columns table
      if (Object.entries(fileData?.describe || {}).some(([_, stats]: [string, any]) => stats.mean !== undefined)) {
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Numeric Columns', margin, yOffset);
        yOffset += 10;

        // Define column widths for numeric table
        const numericHeaders = ['Column', 'Mean', 'Median', 'Std Dev', 'Min', 'Max', 'Missing'];
        const numericColWidths = [40, 25, 25, 25, 25, 25, 25];
        const rowHeight = 10;

        // Draw table header
        pdf.setFillColor(240, 240, 250);
        pdf.setDrawColor(200, 200, 220);
        pdf.rect(margin, yOffset, numericColWidths.reduce((a, b) => a + b, 0), rowHeight, 'FD');
        
        // Add header text
        pdf.setFont(undefined, 'bold');
        pdf.setFontSize(10);
        let xPos = margin;
        numericHeaders.forEach((header, index) => {
          pdf.text(header, xPos + 2, yOffset + 7);
          xPos += numericColWidths[index];
        });
        yOffset += rowHeight;

        // Add numeric data rows
        pdf.setFont(undefined, 'normal');
        Object.entries(fileData?.describe || {})
          .filter(([_, stats]: [string, any]) => stats.mean !== undefined)
          .forEach(([column, stats]: [string, any], index) => {
            if (yOffset + rowHeight > pageHeight - margin) {
              pdf.addPage();
              yOffset = margin;
            }

            // Draw row background
            pdf.setFillColor(index % 2 === 0 ? 250 : 245, 245, 250);
            pdf.rect(margin, yOffset, numericColWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');

            // Add cell borders
            xPos = margin;
            numericColWidths.forEach(width => {
              pdf.rect(xPos, yOffset, width, rowHeight, 'D');
              xPos += width;
            });

            // Add row data
            xPos = margin;
            const rowData = [
              column,
              stats.mean?.toFixed(2),
              stats['50%']?.toFixed(2),
              stats.std?.toFixed(2),
              stats.min?.toFixed(2),
              stats.max?.toFixed(2),
              fileData?.null_counts?.[column] || '0'
            ];

            rowData.forEach((value, i) => {
              pdf.text(String(value), xPos + 2, yOffset + 7);
              xPos += numericColWidths[i];
            });

            yOffset += rowHeight;
          });

        yOffset += 10;
      }

      // Add categorical columns table
      if (Object.entries(fileData?.describe || {}).some(([_, stats]: [string, any]) => stats.unique !== undefined)) {
        // Check if we need a new page
        if (yOffset > pageHeight - 100) {
              pdf.addPage();
          yOffset = margin;
        }

        pdf.setFontSize(14);
        pdf.text('Categorical Columns', margin, yOffset);
        yOffset += 10;

        // Define column widths for categorical table
        const categoricalHeaders = ['Column', 'Unique Values', 'Most Common', 'Missing'];
        const categoricalColWidths = [50, 35, 50, 25];
        const rowHeight = 10;

        // Draw table header
        pdf.setFillColor(240, 240, 250);
        pdf.rect(margin, yOffset, categoricalColWidths.reduce((a, b) => a + b, 0), rowHeight, 'FD');
        
        // Add header text
        pdf.setFont(undefined, 'bold');
        pdf.setFontSize(10);
        let xPos = margin;
        categoricalHeaders.forEach((header, index) => {
          pdf.text(header, xPos + 2, yOffset + 7);
          xPos += categoricalColWidths[index];
        });
        yOffset += rowHeight;

        // Add categorical data rows
        pdf.setFont(undefined, 'normal');
        Object.entries(fileData?.describe || {})
          .filter(([_, stats]: [string, any]) => stats.unique !== undefined)
          .forEach(([column, stats]: [string, any], index) => {
            if (yOffset + rowHeight > pageHeight - margin) {
              pdf.addPage();
              yOffset = margin;
            }

            // Draw row background
            pdf.setFillColor(index % 2 === 0 ? 250 : 245, 245, 250);
            pdf.rect(margin, yOffset, categoricalColWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');

            // Add cell borders
            xPos = margin;
            categoricalColWidths.forEach(width => {
              pdf.rect(xPos, yOffset, width, rowHeight, 'D');
              xPos += width;
            });

            // Add row data
            xPos = margin;
            const rowData = [
              column,
              stats.unique,
              stats.top,
              fileData?.null_counts?.[column] || '0'
            ];

            rowData.forEach((value, i) => {
              pdf.text(String(value), xPos + 2, yOffset + 7);
              xPos += categoricalColWidths[i];
            });

            yOffset += rowHeight;
          });
      }

      return true;
    } catch (error) {
      console.error('Error in addSummaryStatistics:', error);
      return false;
    }
  };

  // Add this function after addSummaryStatistics
  const addInsightsSection = (pdf: jsPDF) => {
    try {
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yOffset = margin;

      // Add section title
      pdf.setFontSize(16);
      pdf.setTextColor(100, 0, 100);
      pdf.text('Key Insights', margin, yOffset);
      yOffset += 15;

      // Reset text color for content
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);

      // Add insights
      if (fileData?.insights && fileData.insights.length > 0) {
        fileData.insights.forEach((insight: any, index: number) => {
          // Check if we need a new page
          if (yOffset > pageHeight - 60) {
          pdf.addPage();
            yOffset = margin;
          }

          // Add insight number
          pdf.setFont(undefined, 'bold');
          pdf.text(`Insight ${index + 1}:`, margin, yOffset);
          pdf.setFont(undefined, 'normal');
          
          // Add insight title
          yOffset += 7;
          const titleLines = pdf.splitTextToSize(insight.title, pageWidth - (2 * margin));
          pdf.text(titleLines, margin + 5, yOffset);
          yOffset += (titleLines.length * 7);

          // Add insight description
          if (insight.description) {
            yOffset += 5;
            const descLines = pdf.splitTextToSize(insight.description, pageWidth - (2 * margin));
            pdf.setFontSize(10);
            pdf.text(descLines, margin + 5, yOffset);
            pdf.setFontSize(12);
            yOffset += (descLines.length * 6) + 10;
          }
        });
      }

      // Add recommendations section
      if (fileData?.recommendations && fileData.recommendations.length > 0) {
        // Check if we need a new page
        if (yOffset > pageHeight - 100) {
          pdf.addPage();
          yOffset = margin;
        }

        yOffset += 10;
        pdf.setFont(undefined, 'bold');
        pdf.text('Recommendations:', margin, yOffset);
        pdf.setFont(undefined, 'normal');
        yOffset += 10;

        fileData.recommendations.forEach((recommendation: string, index: number) => {
          // Check if we need a new page
          if (yOffset > pageHeight - 40) {
            pdf.addPage();
            yOffset = margin;
          }

          const recLines = pdf.splitTextToSize(`${index + 1}. ${recommendation}`, pageWidth - (2 * margin));
          pdf.text(recLines, margin, yOffset);
          yOffset += (recLines.length * 7) + 5;
        });
      }

      return true;
    } catch (error) {
      console.error('Error in addInsightsSection:', error);
      return false;
    }
  };

  // Add this new function after addSummaryStatistics
  const addCorrelationMatrix = (pdf: jsPDF) => {
    try {
      const margin = 20;
      let yOffset = margin;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add section title
      pdf.setFontSize(16);
      pdf.setTextColor(100, 0, 100);
      pdf.text('Correlation Matrix', margin, yOffset);
      yOffset += 15;

      // Reset text color for content
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(8); // Smaller font size for better fit

      // Get numeric columns
      const numericColumns = Object.entries(fileData.describe)
        .filter(([_, stats]: [string, any]) => stats.mean !== undefined)
        .map(([column]) => column);

      if (numericColumns.length === 0) {
        pdf.text('No numeric columns available for correlation analysis.', margin, yOffset);
        return true;
      }

      // Calculate cell dimensions
      const maxCols = 8; // Maximum columns per page
      const cellWidth = Math.min(25, (pageWidth - 2 * margin) / (numericColumns.length + 1));
      const cellHeight = 10;
      
      // Function to draw a cell with background
      const drawCell = (x: number, y: number, text: string, fillColor?: [number, number, number, number]) => {
        if (fillColor) {
          pdf.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
          pdf.rect(x, y, cellWidth, cellHeight, 'F');
        }
        pdf.setFillColor(0, 0, 0);
        // Center text in cell
        const textWidth = pdf.getTextWidth(text);
        const xOffset = (cellWidth - textWidth) / 2;
        pdf.text(text, x + xOffset, y + 7);
      };

      // Process matrix in chunks if needed
      for (let startIdx = 0; startIdx < numericColumns.length; startIdx += maxCols) {
        if (startIdx > 0) {
          pdf.addPage();
          yOffset = margin;
          pdf.setFontSize(16);
          pdf.setTextColor(100, 0, 100);
          pdf.text('Correlation Matrix (continued)', margin, yOffset);
          yOffset += 15;
          pdf.setFontSize(8);
          pdf.setTextColor(0, 0, 0);
        }

        const endIdx = Math.min(startIdx + maxCols, numericColumns.length);
        const currentColumns = numericColumns.slice(startIdx, endIdx);

        // Draw column headers
        let xPos = margin + cellWidth; // First column is for row headers
        currentColumns.forEach(col => {
          drawCell(xPos, yOffset, col);
          xPos += cellWidth;
        });
        yOffset += cellHeight;

        // Draw rows
        numericColumns.forEach((row, i) => {
          if (yOffset + cellHeight > pageHeight - margin) {
            pdf.addPage();
            yOffset = margin;
          }

          // Draw row header
          drawCell(margin, yOffset, row);
          
          // Draw correlation values
          xPos = margin + cellWidth;
          currentColumns.forEach(col => {
            const correlation = calculateCorrelation(
              Object.values(fileData.describe[row]).filter(val => typeof val === 'number'),
              Object.values(fileData.describe[col]).filter(val => typeof val === 'number')
            );

            // Color based on correlation value
            let fillColor: [number, number, number, number] | undefined;
            if (correlation !== 0) {
              if (correlation > 0) {
                fillColor = [139, 92, 246, Math.abs(correlation)]; // Purple for positive
              } else {
                fillColor = [239, 68, 68, Math.abs(correlation)]; // Red for negative
              }
            }

            drawCell(xPos, yOffset, correlation.toFixed(2), fillColor);
            xPos += cellWidth;
          });
          yOffset += cellHeight;
        });

        // Add legend
        yOffset += 10;
        if (yOffset + 40 > pageHeight - margin) {
          pdf.addPage();
          yOffset = margin;
        }

        pdf.setFontSize(10);
        pdf.text('Legend:', margin, yOffset);
        yOffset += 10;

        // Draw legend boxes
        pdf.setFillColor(139, 92, 246);
        pdf.rect(margin, yOffset, 10, 10, 'F');
        pdf.text('Strong positive correlation (> 0.7)', margin + 15, yOffset + 7);
        yOffset += 15;

        pdf.setFillColor(239, 68, 68);
        pdf.rect(margin, yOffset, 10, 10, 'F');
        pdf.text('Strong negative correlation (< -0.7)', margin + 15, yOffset + 7);
      }

      return true;
    } catch (error) {
      console.error('Error in addCorrelationMatrix:', error);
      return false;
    }
  };

  // Modify handleExportPDF to include correlation matrix
  const handleExportPDF = async () => {
    if (!fileData) {
      console.log('No file data available, aborting export');
      return;
    }
    
    try {
      console.log('Starting PDF export process...');
      setIsExporting(true);
      toast({
        title: "Generating PDF",
        description: "Generating report with Data Overview, Summary Statistics, Correlation Matrix and Insights sections...",
      });

      // Create PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const margin = 20;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yOffset = margin;

      // Add title page
      console.log('Adding title page...');
      pdf.setFontSize(24);
      pdf.setTextColor(100, 0, 100);
      pdf.text('EDA Analysis Report', pageWidth / 2, yOffset, { align: 'center' });
      
      yOffset += 20;
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Dataset: ${fileName}`, margin, yOffset);
      yOffset += 10;
      pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, yOffset);

      // Add Data Overview section (no need to add page, continue on title page)
      yOffset = margin;
        console.log('Adding overview section...');
        try {
          // Add overview title
          pdf.setFontSize(16);
          pdf.setTextColor(100, 0, 100);
          pdf.text('Dataset Overview', margin, yOffset);
          yOffset += 15;
          
          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
          
          // Create overview data with null checks
          console.log('Processing overview data...');
          const overviewData = [
            ['Total Rows', fileData.dataset_info?.total_rows?.toString() || 'N/A'],
            ['Total Columns', fileData.dataset_info?.total_columns?.toString() || 'N/A'],
            ['Missing Values', fileData.dataset_info?.missing_values !== undefined ? 
              `${fileData.dataset_info.missing_values} (${fileData.dataset_info.missing_percentage || '0%'})` : 'N/A'],
            ['Duplicate Rows', fileData.dataset_info?.duplicate_rows?.toString() || 'N/A'],
            ['Numeric Columns', fileData.dataset_info?.numeric_columns?.toString() || 'N/A'],
            ['Categorical Columns', fileData.dataset_info?.categorical_columns?.toString() || 'N/A'],
            ['Date Columns', fileData.dataset_info?.date_columns?.toString() || 'N/A']
          ];

          console.log('Overview data:', overviewData);
          
          // Calculate dimensions
          const colWidth = (pageWidth - 2 * margin) / 2;
          const rowHeight = 10;
          const cellPadding = 3;
          
          // Add table header
          pdf.setFillColor(240, 240, 250);
          pdf.setDrawColor(200, 200, 220);
          pdf.rect(margin, yOffset, colWidth * 2, rowHeight, 'FD');
          pdf.setFont(undefined, 'bold');
          pdf.text('Dataset Statistics', margin + cellPadding, yOffset + 7);
          yOffset += rowHeight;
          
          // Add table rows
          pdf.setFont(undefined, 'normal');
          overviewData.forEach((row, index) => {
            console.log(`Adding row ${index}:`, row);
            
            if (yOffset + rowHeight > pageHeight - margin) {
              console.log('Adding new page for overview continuation');
              pdf.addPage();
              yOffset = margin;
            }
            
            // Add row background
            pdf.setFillColor(index % 2 === 0 ? 250 : 245, 245, 250);
            pdf.rect(margin, yOffset, colWidth * 2, rowHeight, 'F');
            
            // Add cell borders
            pdf.setDrawColor(220, 220, 230);
            pdf.rect(margin, yOffset, colWidth, rowHeight, 'D');
            pdf.rect(margin + colWidth, yOffset, colWidth, rowHeight, 'D');
            
            // Add text
            pdf.text(row[0], margin + cellPadding, yOffset + 7);
            pdf.text(row[1], margin + colWidth + cellPadding, yOffset + 7);
            
            yOffset += rowHeight;
          });
          
          // Add some spacing after the table
          yOffset += 10;
          console.log('Overview section completed');

        } catch (error) {
          console.error('Error adding overview section:', error);
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            fileData: JSON.stringify(fileData.dataset_info, null, 2)
          });
          toast({
            title: "Warning",
            description: "Could not add overview section completely. Some data might be missing.",
            variant: "destructive"
          });
      }

      // Add Summary Statistics section on new page
      pdf.addPage();
      const summarySuccess = addSummaryStatistics(pdf);
      if (!summarySuccess) {
              throw new Error('Failed to add summary statistics');
      }

      // Add Correlation Matrix on new page
      pdf.addPage();
      const correlationSuccess = addCorrelationMatrix(pdf);
      if (!correlationSuccess) {
        throw new Error('Failed to add correlation matrix');
      }

      // Add Insights section on new page
            pdf.addPage();
      const insightsSuccess = addInsightsSection(pdf);
      if (!insightsSuccess) {
        throw new Error('Failed to add insights');
      }

      // Add page numbers
      console.log('Adding page numbers...');
      const totalPages = pdf.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 30, pageHeight - margin);
      }

      // Save the PDF
      console.log('Saving PDF...');
      const filename = `eda_analysis_${fileName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);

      console.log('PDF generation completed successfully');
      toast({
        title: "PDF Generated",
        description: "Your EDA report has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      console.error('Full error details:', {
        message: error.message,
        stack: error.stack,
        fileData: fileData ? 'Present' : 'Missing'
      });
      toast({
        title: "Error",
        description: `Failed to generate PDF report: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
      setShowExportDialog(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#7C3AED] tracking-tight">Exploratory Data Analysis</h1>
          <p className="text-muted-foreground ">Upload your data to generate comprehensive insights and visualizations.</p>
        </div>
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
      </div>
      
      {currentStep === 'upload' && (
        <FileUpload onFileUpload={handleFileUpload} />
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
      
      {currentStep === 'results' && fileData && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Analysis Results: {fileName}</h2>
            <div className="flex space-x-2">
              <Button 
                className="bg-dashboardly-primary hover:bg-dashboardly-dark text-white flex items-center"
                onClick={() => setCurrentStep('upload')}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload New File
              </Button>
              <Button 
                className="bg-dashboardly-primary hover:bg-dashboardly-dark text-white flex items-center"
                onClick={() => setShowExportDialog(true)}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileDown className="h-4 w-4 mr-2" />
                    Export PDF
                  </>
                )}
              </Button>
              <Link to="/kpi-builder" state={{ analyzedData: fileData }}>
                <Button className="bg-dashboardly-primary hover:bg-dashboardly-dark text-white flex items-center">
                  <BarChart4 className="h-4 w-4 mr-2" />
                  Create Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Export Dialog */}
          <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Export PDF Report</DialogTitle>
                <DialogDescription>
                  Generating report with Data Overview, Summary Statistics, Correlation Matrix and Insights sections
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowExportDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleExportPDF} disabled={isExporting}>
                  {isExporting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileDown className="mr-2 h-4 w-4" />
                      Generate PDF
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Overview</CardTitle>
              <CardDescription>Basic information about your dataset</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/30 rounded-md p-4">
                  <p className="text-sm text-muted-foreground">Rows</p>
                  <p className="text-2xl font-bold">{fileData?.dataset_info?.total_rows || 0}</p>
                </div>
                <div className="bg-muted/30 rounded-md p-4">
                  <p className="text-sm text-muted-foreground">Columns</p>
                  <p className="text-2xl font-bold">{fileData?.dataset_info?.total_columns || 0}</p>
                </div>
                <div className="bg-muted/30 rounded-md p-4">
                  <p className="text-sm text-muted-foreground">Missing Values</p>
                  <p className="text-2xl font-bold">{fileData?.dataset_info?.missing_values || 0} ({fileData?.dataset_info?.missing_percentage || '0%'})</p>
                </div>
                <div className="bg-muted/30 rounded-md p-4">
                  <p className="text-sm text-muted-foreground">Duplicate Rows</p>
                  <p className="text-2xl font-bold">{fileData?.dataset_info?.duplicate_rows || 0}</p>
                </div>
                
                <div className="bg-muted/30 rounded-md p-4">
                  <p className="text-sm text-muted-foreground">Numeric Columns</p>
                  <p className="text-2xl font-bold">{fileData?.dataset_info?.numeric_columns || 0}</p>
                </div>
                <div className="bg-muted/30 rounded-md p-4">
                  <p className="text-sm text-muted-foreground">Categorical Columns</p>
                  <p className="text-2xl font-bold">{fileData?.dataset_info?.categorical_columns || 0}</p>
                </div>
                <div className="bg-muted/30 rounded-md p-4">
                  <p className="text-sm text-muted-foreground">Date Columns</p>
                  <p className="text-2xl font-bold">{fileData?.dataset_info?.date_columns || 0}</p>
                </div>
                <div className="bg-muted/30 rounded-md p-4">
                  <p className="text-sm text-muted-foreground">Other Columns</p>
                  <p className="text-2xl font-bold">{(fileData?.dataset_info?.total_columns || 0) - ((fileData?.dataset_info?.numeric_columns || 0) + (fileData?.dataset_info?.categorical_columns || 0) + (fileData?.dataset_info?.date_columns || 0))}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-4 md:grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="summary">Summary Statistics</TabsTrigger>
              <TabsTrigger value="distribution">Distributions</TabsTrigger>
              <TabsTrigger value="correlation">Correlation Analysis</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="space-y-4" id="summary-stats">
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
                      {Object.entries(fileData.describe).map(([column, stats]: [string, any]) => (
                        stats.mean !== undefined && (
                          <TableRow key={column}>
                            <TableCell className="font-medium">{column}</TableCell>
                            <TableCell>{stats.mean?.toFixed(2)}</TableCell>
                            <TableCell>{stats['50%']?.toFixed(2)}</TableCell>
                            <TableCell>{stats.std?.toFixed(2)}</TableCell>
                            <TableCell>{stats.min?.toFixed(2)}</TableCell>
                            <TableCell>{stats.max?.toFixed(2)}</TableCell>
                            <TableCell>{fileData.null_counts[column]}</TableCell>
                        </TableRow>
                        )
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
                        <TableHead>Missing</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(fileData.describe).map(([column, stats]: [string, any]) => (
                        stats.unique !== undefined && (
                          <TableRow key={column}>
                            <TableCell className="font-medium">{column}</TableCell>
                            <TableCell>{stats.unique}</TableCell>
                            <TableCell>{stats.top}</TableCell>
                            <TableCell>{fileData.null_counts[column]}</TableCell>
                        </TableRow>
                        )
                      ))}
                    </TableBody>
                  </TableComponent>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="distribution" className="space-y-4" id="distributions">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Variable Distribution</span>
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm">Select Target Variables:</Label>
                      <Select
                        onValueChange={(value) => {
                          if (value === 'all') {
                            const allNumericVars = Object.entries(fileData.describe)
                              .filter(([_, stats]: [string, any]) => stats.mean !== undefined)
                              .map(([column]) => column);
                            setSelectedDistributionVars(allNumericVars);
                          } else {
                            setSelectedDistributionVars([value]);
                          }
                        }}
                        defaultValue="all"
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select variables" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Show All Variables</SelectItem>
                          {Object.entries(fileData.describe)
                            .filter(([_, stats]: [string, any]) => stats.mean !== undefined)
                            .map(([column]) => (
                              <SelectItem key={column} value={column}>
                                {column}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardTitle>
                  <CardDescription>Distribution analysis of numeric variables</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Understanding Statistical Terms</CardTitle>
                  <CardDescription>Quick guide to interpret the distribution statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-2 bg-purple-50 p-3 rounded-lg">
                      <p className="font-medium text-purple-900">Central Tendency</p>
                      <div className="space-y-1 text-purple-800">
                        <p><span className="font-medium">Mean:</span> Average of all values</p>
                        <p><span className="font-medium">Median:</span> Middle value when data is ordered</p>
                      </div>
                    </div>
                    <div className="space-y-2 bg-purple-50 p-3 rounded-lg">
                      <p className="font-medium text-purple-900">Spread Measures</p>
                      <div className="space-y-1 text-purple-800">
                        <p><span className="font-medium">Std Dev:</span> Average distance from the mean</p>
                        <p><span className="font-medium">IQR:</span> Range between 25th and 75th percentiles</p>
                        <p><span className="font-medium">Range:</span> Difference between max and min values</p>
                      </div>
                    </div>
                    <div className="space-y-2 bg-purple-50 p-3 rounded-lg">
                      <p className="font-medium text-purple-900">Shape Indicators</p>
                      <div className="space-y-1 text-purple-800">
                        <p><span className="font-medium">Skewness:</span> Measure of asymmetry</p>
                        <ul className="list-disc list-inside pl-2 text-xs">
                          <li>Positive: tail extends right</li>
                          <li>Negative: tail extends left</li>
                          <li>Zero: symmetric distribution</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(fileData.describe)
                  .filter(([column, stats]: [string, any]) => {
                    const isNumeric = stats.mean !== undefined;
                    const isSelected = selectedDistributionVars.length === 0 || selectedDistributionVars.includes(column);
                    return isNumeric && isSelected;
                  })
                  .map(([column, stats]: [string, any]) => (
                    <Card key={column}>
                      <CardHeader>
                        <CardTitle>{column} Distribution</CardTitle>
                        <CardDescription>Distribution analysis of {column}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <BarChartComponent
                            data={{
                              labels: ['Min', 'Q1', 'Median', 'Q3', 'Max'],
                              datasets: [{
                                label: 'Value Distribution',
                                data: [
                                  stats.min,
                                  stats['25%'],
                                  stats['50%'],
                                  stats['75%'],
                                  stats.max
                                ],
                                backgroundColor: 'rgba(139, 92, 246, 0.8)',
                              }]
                            }}
                            className="chart-container h-[200px]"
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                y: { 
                                  beginAtZero: true,
                                  title: {
                                    display: true,
                                    text: 'Value',
                                    font: { size: 12, weight: 'bold' }
                                  }
                                },
                                x: {
                                  title: {
                                    display: true,
                                    text: 'Distribution Points',
                                    font: { size: 12, weight: 'bold' }
                                  }
                                }
                              },
                              plugins: {
                                legend: { display: true },
                                tooltip: {
                                  callbacks: {
                                    label: (context: any) => {
                                      return `Value: ${context.raw.toFixed(2)}`;
                                    }
                                  }
                                }
                              }
                            }}
                          />
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <p><span className="font-medium">Mean:</span> {stats.mean.toFixed(2)}</p>
                              <p><span className="font-medium">Median:</span> {stats['50%'].toFixed(2)}</p>
                              <p><span className="font-medium">Std Dev:</span> {stats.std.toFixed(2)}</p>
                            </div>
                            <div className="space-y-2">
                              <p><span className="font-medium">Skewness:</span> {((stats.mean - stats['50%']) / stats.std).toFixed(2)}</p>
                              <p><span className="font-medium">Range:</span> {(stats.max - stats.min).toFixed(2)}</p>
                              <p><span className="font-medium">IQR:</span> {(stats['75%'] - stats['25%']).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="correlation" className="space-y-4" id="correlation-analysis">
              <Card>
                <CardHeader>
                  <CardTitle>Correlation Visualization</CardTitle>
                  <CardDescription>Interactive visualization of relationships between numeric variables</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-1/2">
                        <Label>X-Axis Variable</Label>
                        <Select
                          value={selectedXVar}
                          onValueChange={(value) => {
                            setSelectedXVar(value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select variable" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(fileData.describe)
                              .filter(([_, stats]: [string, any]) => stats.mean !== undefined)
                              .map(([column]) => (
                                <SelectItem key={column} value={column}>
                                  {column}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-1/2">
                        <Label>Y-Axis Variable</Label>
                        <Select
                          value={selectedYVar}
                          onValueChange={(value) => {
                            setSelectedYVar(value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select variable" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(fileData.describe)
                              .filter(([_, stats]: [string, any]) => stats.mean !== undefined)
                              .map(([column]) => (
                                <SelectItem key={column} value={column}>
                                  {column}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="h-[250px] w-full">
                      <LineChartComponent
                        data={{
                          datasets: [{
                            label: selectedXVar && selectedYVar ? `${selectedXVar} vs ${selectedYVar}` : 'Scatter Plot',
                            data: selectedXVar && selectedYVar ? createScatterData(selectedXVar, selectedYVar) : [],
                            backgroundColor: 'rgba(139, 92, 246, 0.6)',
                            borderColor: 'rgba(139, 92, 246, 1)',
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            showLine: false,
                            type: 'scatter',
                            parsing: false,
                            normalized: true
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            x: {
                              type: 'linear',
                              position: 'bottom',
                              title: {
                                display: true,
                                text: selectedXVar || 'Select X-Axis Variable',
                                font: { size: 12, weight: 'bold' }
                              },
                              grid: {
                                display: true,
                                drawBorder: true,
                                drawOnChartArea: true
                              }
                            },
                            y: {
                              type: 'linear',
                              position: 'left',
                              title: {
                                display: true,
                                text: selectedYVar || 'Select Y-Axis Variable',
                                font: { size: 12, weight: 'bold' }
                              },
                              grid: {
                                display: true,
                                drawBorder: true,
                                drawOnChartArea: true
                              }
                            }
                          },
                          plugins: {
                            tooltip: {
                              enabled: true,
                              callbacks: {
                                label: (context: any) => {
                                  if (!context.raw) return '';
                                  return `${selectedXVar}: ${context.raw.x.toFixed(2)}, ${selectedYVar}: ${context.raw.y.toFixed(2)}`;
                                }
                              }
                            },
                            legend: {
                              display: true,
                              position: 'top'
                            }
                          },
                          animation: {
                            duration: 0
                          }
                        }}
                      />
                    </div>
                    {selectedXVar && selectedYVar && (
                      <div className="space-y-2">
                        <div className="text-sm text-center text-muted-foreground">
                          {(() => {
                            try {
                              const correlation = calculateCorrelation(
                                Object.values(fileData.describe[selectedXVar]).filter(val => typeof val === 'number'),
                                Object.values(fileData.describe[selectedYVar]).filter(val => typeof val === 'number')
                              );
                              return `Correlation coefficient: ${correlation.toFixed(3)}`;
                            } catch (error) {
                              console.error('Error calculating correlation:', error);
                              return 'Unable to calculate correlation';
                            }
                          })()}
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                          {(() => {
                            const correlation = calculateCorrelation(
                              Object.values(fileData.describe[selectedXVar]).filter(val => typeof val === 'number'),
                              Object.values(fileData.describe[selectedYVar]).filter(val => typeof val === 'number')
                            );
                            
                            const strength = Math.abs(correlation);
                            const direction = correlation > 0 ? 'positive' : 'negative';
                            
                            let relationshipType;
                            if (strength > 0.7) {
                              relationshipType = 'strong';
                            } else if (strength > 0.3) {
                              relationshipType = 'moderate';
                            } else {
                              relationshipType = 'weak';
                            }

                            // Get the statistics for outlier detection
                            const xStats = fileData.describe[selectedXVar];
                            const yStats = fileData.describe[selectedYVar];
                            
                            // Calculate z-scores for basic outlier detection
                            const xValues = Object.values(fileData.describe[selectedXVar]).filter(val => typeof val === 'number');
                            const yValues = Object.values(fileData.describe[selectedYVar]).filter(val => typeof val === 'number');
                            
                            const xOutliers = xValues.filter(x => Math.abs((x - xStats.mean) / xStats.std) > 2).length;
                            const yOutliers = yValues.filter(y => Math.abs((y - yStats.mean) / yStats.std) > 2).length;

                            return (
                              <div className="space-y-3">
                                <div>
                                  <p className="text-sm font-medium text-purple-900 mb-2">Correlation Analysis Report:</p>
                                  <div className="space-y-2 text-sm text-purple-700">
                                    <p>1. <span className="font-medium">Relationship Strength:</span><br />
                                       The correlation coefficient of {correlation.toFixed(3)} indicates a {relationshipType} {direction} relationship between {selectedXVar} and {selectedYVar}.
                                    </p>
                                    
                                    <p>2. <span className="font-medium">Practical Interpretation:</span><br />
                                       {correlation > 0.7 ? 
                                         `There is a strong positive association, meaning that higher values of ${selectedXVar} are very likely to correspond with higher values of ${selectedYVar}. This suggests these variables are closely linked and may influence each other significantly.` :
                                        correlation > 0.3 ?
                                         `There is a moderate positive relationship, indicating that higher values of ${selectedXVar} tend to correspond with higher values of ${selectedYVar}, though the relationship isn't as strong or consistent.` :
                                        correlation > -0.3 ?
                                         `There is little to no clear relationship between the variables, suggesting that changes in ${selectedXVar} don't consistently correspond to changes in ${selectedYVar}.` :
                                        correlation > -0.7 ?
                                         `There is a moderate negative relationship, indicating that higher values of ${selectedXVar} tend to correspond with lower values of ${selectedYVar}, though the relationship isn't as strong or consistent.` :
                                         `There is a strong negative association, meaning that higher values of ${selectedXVar} are very likely to correspond with lower values of ${selectedYVar}. This suggests an inverse relationship between these variables.`}
                                    </p>
                                    
                                    <p>3. <span className="font-medium">Potential Outliers:</span><br />
                                       {xOutliers > 0 || yOutliers > 0 ? 
                                         `Found ${xOutliers} potential outliers in ${selectedXVar} and ${yOutliers} in ${selectedYVar} (based on 2 standard deviations from mean). These outliers might be affecting the correlation strength and should be investigated further.` :
                                         `No significant outliers detected in either variable (based on 2 standard deviations from mean), suggesting the correlation coefficient is not heavily influenced by extreme values.`}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Correlation Matrix</CardTitle>
                  <CardDescription>Correlation coefficients between numeric variables</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 bg-purple-50 p-4 rounded-lg space-y-2">
                    <p className="text-sm text-purple-900 font-medium">Understanding Correlations:</p>
                    <div className="text-sm text-purple-800 space-y-1">
                      <p>• <span className="font-medium">Positive Correlation (0 to +1):</span> When one variable increases, the other tends to increase too (e.g., height and weight)</p>
                      <p>• <span className="font-medium">Negative Correlation (0 to -1):</span> When one variable increases, the other tends to decrease (e.g., price and demand)</p>
                      <p>• <span className="font-medium">Correlation Strength:</span></p>
                      <ul className="list-none pl-4 space-y-1">
                        <li><span className="text-green-600 font-medium">Strong (&gt; 0.7):</span> Very reliable relationship</li>
                        <li><span className="text-amber-600 font-medium">Moderate (0.3 - 0.7):</span> Moderate relationship</li>
                        <li><span className="text-red-600 font-medium">Weak (&lt; 0.3):</span> Weak or no clear relationship</li>
                      </ul>
                    </div>
                  </div>
                  <TableComponent>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Variable 1</TableHead>
                        <TableHead>Variable 2</TableHead>
                        <TableHead>Correlation</TableHead>
                        <TableHead>Strength</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(fileData.describe)
                        .filter(([_, stats]: [string, any]) => stats.mean !== undefined)
                        .flatMap((col1, i, arr) => 
                          arr.slice(i + 1).map(col2 => {
                            // Calculate correlation coefficient between col1 and col2
                            const correlation = calculateCorrelation(
                              Object.values(fileData.describe[col1[0]]).filter(val => typeof val === 'number'),
                              Object.values(fileData.describe[col2[0]]).filter(val => typeof val === 'number')
                            );
                            return {
                              var1: col1[0],
                              var2: col2[0],
                              correlation
                            };
                          })
                        )
                        .sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation)) // Sort by absolute correlation value
                        .map(corr => (
                          <TableRow key={`${corr.var1}-${corr.var2}`}>
                            <TableCell>{corr.var1}</TableCell>
                            <TableCell>{corr.var2}</TableCell>
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Correlation Heatmap</CardTitle>
                  <CardDescription>
                    Darker colors indicate stronger relationships between variables. 
                    Purple shows positive correlations (variables increase together), 
                    while red shows negative correlations (one increases as the other decreases).
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-[250px] w-full">
                    <LineChartComponent
                      data={{
                        labels: Object.entries(fileData.describe)
                          .filter(([_, stats]: [string, any]) => stats.mean !== undefined)
                          .map(([column]) => column),
                        datasets: Object.entries(fileData.describe)
                          .filter(([_, stats]: [string, any]) => stats.mean !== undefined)
                          .flatMap(([column], i, array) => 
                            array.map(([col2], j) => {
                              const correlation = calculateCorrelation(
                                Object.values(fileData.describe[column]).filter(val => typeof val === 'number'),
                                Object.values(fileData.describe[col2]).filter(val => typeof val === 'number')
                              );
                              return {
                                label: `${column} vs ${col2}`,
                                data: [{
                                  x: j,
                                  y: i,
                                  v: Number(correlation.toFixed(2))
                                }],
                                pointStyle: 'rect',
                                pointRadius: 25,
                                pointHoverRadius: 20,
                                backgroundColor: (context: any) => {
                                  const value = context.raw?.v || 0;
                                  if (Math.abs(value) === 1) return value > 0 ? 'rgba(139, 92, 246, 1)' : 'rgba(239, 68, 68, 1)';
                                  const alpha = Math.abs(value);
                                  return value > 0 
                                    ? `rgba(139, 92, 246, ${alpha})`
                                    : `rgba(239, 68, 68, ${alpha})`;
                                },
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                borderWidth: 1
                              };
                            })
                          )
                      }}
                      
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        layout: {
                          padding: {
                            left: 20,
                            right: 20,
                            top: 40,
                            bottom: -100
                          }
                        },
                        scales: {
                          x: {
                            type: 'linear',
                            position: 'bottom',
                            min: -0.5,
                            max: Object.keys(fileData.describe).filter(key => fileData.describe[key].mean !== undefined).length - 0.5,
                            title: {
                              display: true,
                              text: 'Compared Variables →',
                              font: {
                                weight: 'bold',
                                size: 12
                              },
                              padding: { top: 20 }
                            },
                            ticks: {
                              callback: (value) => {
                                const vars = Object.keys(fileData.describe).filter(key => fileData.describe[key].mean !== undefined);
                                return vars[value] || '';
                              },
                              font: {weight: 'bold',
                                size: 8 
                              },
                              padding: 10
                            },
                            grid: {
                              display: false
                            }
                          },
                          y: {
                            type: 'linear',
                            position: 'left',
                            reverse: true,
                            min: -0.5,
                            max: Object.keys(fileData.describe).filter(key => fileData.describe[key].mean !== undefined).length - 0.5,
                            offset: true,
                            title: {
                              display: true,
                              text: '← Base Variables',
                              font: {
                                weight: 'bold',
                                size: 14
                              },
                              padding: { top: 25 }
                            },
                            ticks: {
                              callback: (value) => {
                                const vars = Object.keys(fileData.describe)
                                  .filter(key => fileData.describe[key].mean !== undefined);
                                const index = Math.round(value);
                                return index >= 0 && index < vars.length ? vars[index] : '';
                              },
                              font: { 
                                size: 12,
                                weight: 'bold'
                              },
                              maxRotation: 0,
                              minRotation: 0,
                              padding: 20,
                              z: 1,
                              mirror: false,
                              align: 'end',
                              crossAlign: 'center',
                              display: true,
                              autoSkip: false,
                              major: {
                                enabled: true
                              },
                              count: Object.keys(fileData.describe)
                                .filter(key => fileData.describe[key].mean !== undefined).length
                            },
                            grid: {
                              display: false
                            }
                          }
                        },
                        plugins: {
                          tooltip: {
                            callbacks: {
                              label: (context: any) => {
                                const value = context.raw?.v;
                                const strength = Math.abs(value) > 0.7 ? 'Strong' :
                                              Math.abs(value) > 0.3 ? 'Moderate' : 'Weak';
                                const direction = value > 0 ? 'positive' : 'negative';
                                return [
                                  `Correlation: ${value.toFixed(2)}`,
                                  `Strength: ${strength} ${direction}`,
                                  `${context.dataset.label}`
                                ];
                              }
                            }
                          },
                          legend: {
                            display: false
                          }
                        }
                      }}
                    />
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg space-y-3">
                    <h4 className="font-medium text-purple-900">How to Read This Heatmap:</h4>
                    <div className="text-sm text-purple-800 space-y-2">
                      <p>• <span className="font-medium">Reading the Grid:</span> Each cell shows how two variables relate to each other. Find a variable on each axis to see their correlation.</p>
                      <p>• <span className="font-medium">Color Meaning:</span> Purple indicates positive correlation (variables increase together), while red shows negative correlation (one increases as the other decreases). Darker colors mean stronger relationships.</p>
                      <p>• <span className="font-medium">Values:</span> Range from -1 to +1: 
                        <span className="ml-1 px-1 bg-purple-100 rounded">+1 (perfect positive)</span>,
                        <span className="ml-1 px-1 bg-red-100 rounded">-1 (perfect negative)</span>,
                        <span className="ml-1 px-1 bg-gray-100 rounded">0 (no correlation)</span>
                      </p>
                      <p>• <span className="font-medium">Key Findings:</span> {(() => {
                        const correlations = Object.entries(fileData.describe)
                          .filter(([_, stats]: [string, any]) => stats.mean !== undefined)
                          .flatMap((col1, i, arr) => 
                            arr.slice(i + 1).map(col2 => {
                              const correlation = calculateCorrelation(
                                Object.values(fileData.describe[col1[0]]).filter(val => typeof val === 'number'),
                                Object.values(fileData.describe[col2[0]]).filter(val => typeof val === 'number')
                              );
                              return {
                                vars: [col1[0], col2[0]],
                                correlation: correlation
                              };
                            })
                          ).sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));

                        const strongestCorr = correlations[0];
                        const weakestCorr = correlations[correlations.length - 1];
                        
                        if (!strongestCorr) return "No significant correlations found.";
                        
                        return `Strongest relationship: ${strongestCorr.vars[0]} & ${strongestCorr.vars[1]} ` +
                               `(${strongestCorr.correlation > 0 ? 'positive' : 'negative'} correlation of ${Math.abs(strongestCorr.correlation).toFixed(2)}). ` +
                               `Weakest relationship: ${weakestCorr.vars[0]} & ${weakestCorr.vars[1]} ` +
                               `(correlation of ${weakestCorr.correlation.toFixed(2)}).`;
                      })()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="insights" className="space-y-4" id="insights">
              <Card>
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                  <CardDescription>Important findings from your data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {fileData.insights.map((insight: any, index: number) => (
                      <div key={index} className="flex items-start">
                      <div className="bg-dashboardly-primary/20 p-2 rounded-md mr-3">
                        <CheckCircle2 className="h-5 w-5 text-dashboardly-primary" />
                      </div>
                      <div>
                          <h3 className="text-base font-medium">{insight.title}</h3>
                        <p className="text-sm text-muted-foreground">
                            {insight.description}
                        </p>
                      </div>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium mb-2">Recommendations</h3>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      {fileData.recommendations.map((recommendation: string, index: number) => (
                        <li key={index}>{recommendation}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default EDAGenerator;

