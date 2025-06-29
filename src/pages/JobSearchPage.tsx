import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, X, Loader2, AlertCircle } from 'lucide-react';
import { Job } from '../types/job';
import { wpService, FilterData } from '../services/wpService';
import { adminService } from '../services/adminService';
import JobCard from '../components/JobCard';
import JobSidebar from '../components/JobSidebar';
import SearchableSelect from '../components/SearchableSelect';

const JobSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterData, setFilterData] = useState<FilterData | null>(null);
  const [settings] = useState(adminService.getSettings());
  
  // Main search filters
  const [keyword, setKeyword] = useState(searchParams.get('search') || '');
  const [selectedProvince, setSelectedProvince] = useState(searchParams.get('location') || '');
  
  // Sidebar filters - now using arrays for multiple selections
  const [sidebarFilters, setSidebarFilters] = useState({
    cities: [] as string[],
    jobTypes: [] as string[],
    experiences: [] as string[],
    educations: [] as string[],
    industries: [] as string[],
    workPolicies: [] as string[],
    categories: [] as string[]
  });

  // Sort filter
  const [sortBy, setSortBy] = useState('newest');

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    loadInitialData();
    
    // Update document title and meta description
    document.title = settings.jobsTitle;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', settings.jobsDescription);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = settings.jobsDescription;
      document.head.appendChild(meta);
    }
  }, [settings]);

  // Watch for changes in keyword and selectedProvince to trigger auto-search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (keyword !== (searchParams.get('search') || '') || 
          selectedProvince !== (searchParams.get('location') || '')) {
        handleAutoSearch();
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [keyword, selectedProvince]);

  // Watch for sidebar filter changes to trigger immediate search
  useEffect(() => {
    if (filterData) { // Only trigger after initial load
      handleFilterSearch();
    }
  }, [sidebarFilters, sortBy]);

  const loadInitialData = async () => {
    try {
      setError(null);
      
      // Load filter data first
      const filters = await wpService.getFiltersData();
      setFilterData(filters);
      
      // Parse URL parameters for initial filters
      const urlCategories = searchParams.get('category');
      if (urlCategories) {
        setSidebarFilters(prev => ({
          ...prev,
          categories: [urlCategories]
        }));
      }
      
      // Load jobs with initial filters
      const initialFilters = {
        search: keyword,
        location: selectedProvince,
        categories: urlCategories ? [urlCategories] : [],
        sortBy: sortBy
      };
      
      const jobsData = await wpService.getJobs(initialFilters);
      setJobs(jobsData);
    } catch (err) {
      setError('Gagal memuat data pekerjaan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSearch = async () => {
    if (searching) return; // Prevent multiple simultaneous searches
    
    setSearching(true);
    try {
      setError(null);
      const filters = {
        search: keyword,
        location: selectedProvince,
        sortBy: sortBy,
        ...sidebarFilters
      };
      
      // Update URL
      const params = new URLSearchParams();
      if (keyword) params.set('search', keyword);
      if (selectedProvince) params.set('location', selectedProvince);
      navigate(`/lowongan-kerja?${params.toString()}`, { replace: true });
      
      const jobsData = await wpService.getJobs(filters);
      setJobs(jobsData);
    } catch (err) {
      setError('Gagal memuat data pekerjaan. Silakan coba lagi.');
    } finally {
      setSearching(false);
    }
  };

  const handleFilterSearch = async () => {
    if (searching) return; // Prevent multiple simultaneous searches
    
    setSearching(true);
    try {
      setError(null);
      const filters = {
        search: keyword,
        location: selectedProvince,
        sortBy: sortBy,
        ...sidebarFilters
      };
      
      const jobsData = await wpService.getJobs(filters);
      setJobs(jobsData);
    } catch (err) {
      setError('Gagal memuat data pekerjaan. Silakan coba lagi.');
    } finally {
      setSearching(false);
    }
  };

  const handleMainSearch = async () => {
    await handleAutoSearch();
  };

  const handleSidebarFilterChange = (newFilters: any) => {
    setSidebarFilters(newFilters);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  const handleJobClick = (job: Job) => {
    window.open(`/lowongan-kerja/${job.slug}`, '_blank');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleMainSearch();
    }
  };

  const clearAllFilters = () => {
    setKeyword('');
    setSelectedProvince('');
    setSidebarFilters({
      cities: [],
      jobTypes: [],
      experiences: [],
      educations: [],
      industries: [],
      workPolicies: [],
      categories: []
    });
    setSortBy('newest');
    navigate('/lowongan-kerja', { replace: true });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (keyword) count++;
    if (selectedProvince) count++;
    Object.values(sidebarFilters).forEach(filterArray => {
      count += filterArray.length;
    });
    return count;
  };

  const removeFilter = (filterType: string, value?: string) => {
    if (filterType === 'keyword') {
      setKeyword('');
    } else if (filterType === 'province') {
      setSelectedProvince('');
      // Also clear cities when province is cleared
      setSidebarFilters(prev => ({ ...prev, cities: [] }));
    } else if (value) {
      setSidebarFilters(prev => ({
        ...prev,
        [filterType]: prev[filterType as keyof typeof prev].filter(item => item !== value)
      }));
    }
  };

  const getProvinceOptions = () => {
    if (!filterData) return [];
    return Object.keys(filterData.nexjob_lokasi_provinsi).map(province => ({
      value: province,
      label: province
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat lowongan pekerjaan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Search */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Centered Search Form */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Keyword Search */}
              <div className="lg:col-span-5 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan skill, posisi, atau perusahaan..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900"
                />
              </div>

              {/* Province Select */}
              <div className="lg:col-span-4">
                <SearchableSelect
                  options={getProvinceOptions()}
                  value={selectedProvince}
                  onChange={setSelectedProvince}
                  placeholder="Semua Provinsi"
                />
              </div>

              {/* Search Button */}
              <div className="lg:col-span-3">
                <button
                  onClick={handleMainSearch}
                  disabled={searching}
                  className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {searching ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Cari
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mt-4 text-center">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium inline-flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter ({getActiveFiltersCount()})
            </button>
          </div>

          {/* Active Filters */}
          {getActiveFiltersCount() > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 items-center justify-center">
              <span className="text-sm text-gray-600">Filter aktif:</span>
              
              {keyword && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                  Keyword: {keyword}
                  <button
                    onClick={() => removeFilter('keyword')}
                    className="ml-2 hover:text-primary-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {selectedProvince && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                  Provinsi: {selectedProvince}
                  <button
                    onClick={() => removeFilter('province')}
                    className="ml-2 hover:text-primary-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {/* Sidebar filters */}
              {Object.entries(sidebarFilters).map(([filterType, values]) =>
                values.map((value) => (
                  <span key={`${filterType}-${value}`} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                    {value}
                    <button
                      onClick={() => removeFilter(filterType, value)}
                      className="ml-2 hover:text-primary-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              )}
              
              <button
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Hapus Semua Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters - Sticky */}
          <div className={`lg:col-span-1 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-32 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <JobSidebar
                filters={sidebarFilters}
                selectedProvince={selectedProvince}
                sortBy={sortBy}
                onFiltersChange={handleSidebarFilterChange}
                onSortChange={handleSortChange}
                isLoading={searching}
              />
            </div>
          </div>

          {/* Job Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {searching ? 'Mencari...' : `${jobs.length} Lowongan Ditemukan`}
                </h1>
                {keyword && (
                  <p className="text-gray-600">
                    Hasil pencarian untuk "<span className="font-medium">{keyword}</span>"
                  </p>
                )}
                {selectedProvince && (
                  <p className="text-gray-600">
                    di <span className="font-medium">{selectedProvince}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-800">{error}</span>
                </div>
              </div>
            )}

            {/* Job Grid */}
            {searching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job, index) => (
                  <div key={job.id} style={{ animationDelay: `${index * 0.1}s` }}>
                    <JobCard job={job} onClick={handleJobClick} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada lowongan ditemukan</h3>
                <p className="text-gray-600 mb-4">Coba ubah kriteria pencarian Anda</p>
                <button
                  onClick={clearAllFilters}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;