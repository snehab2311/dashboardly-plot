interface SearchResult {
  title: string;
  description: string;
  path: string;
  keywords: string[];
}

const searchData: SearchResult[] = [
  {
    title: 'EDA Generator',
    description: 'Upload and analyze your data with automated insights',
    path: '/eda',
    keywords: ['data', 'data cleaning', 'processing', 'EDA', 'analysis', 'explore', 'statistics', 'upload', 'csv', 'excel']
  },
  {
    title: 'KPI Dashboard Builder',
    description: 'Create interactive dashboards and visualizations',
    path: '/kpi-builder',
    keywords: ['dashboard', 'chart', 'visualization', 'line', 'bar', 'trend', 'kpi', 'graphs', 'metrics', 'plots']
  },
  {
    title: 'My Dashboards',
    description: 'View and manage your saved dashboards',
    path: '/my-dashboards',
    keywords: ['saved', 'share', 'save', 'my dashboards', 'history', 'recent', 'created']
  }
];

export const searchFeatures = (query: string): SearchResult[] => {
  if (!query) return [];
  
  const searchTerm = query.toLowerCase().trim();
  
  return searchData.filter(item => {
    // Check if search term matches title
    if (item.title.toLowerCase().includes(searchTerm)) return true;
    
    // Check if search term matches description
    if (item.description.toLowerCase().includes(searchTerm)) return true;
    
    // Check if search term matches any keywords
    return item.keywords.some(keyword => 
      keyword.toLowerCase().includes(searchTerm) || 
      searchTerm.includes(keyword.toLowerCase())
    );
  });
}; 