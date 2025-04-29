import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchFeatures } from '@/utils/search';
import { useAuth } from '@/context/AuthContext';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      const searchResults = searchFeatures(searchQuery);
      setResults(searchResults);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleResultClick = (path: string) => {
    if (!user) {
      // Handle authentication requirement
      // You might want to show the auth modal here
      return;
    }
    setQuery('');
    setResults([]);
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-10 w-full rounded-md border border-gray-200 bg-white pl-10 pr-4 text-sm placeholder:text-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:placeholder:text-gray-400"
        />
      </div>
      
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full rounded-md border border-gray-200 bg-white py-1.5 shadow-lg dark:border-gray-800 dark:bg-gray-950">
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleResultClick(result.path)}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
            >
              <div>
                <div className="font-medium">{result.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{result.description}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 