import { useState, useEffect, useMemo } from 'react';
import { GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import JobCard from '@/components/JobCard';
import SearchFilters from '@/components/SearchFilters';
import { Job, JobFilters } from '@/types/job';
import { getJobs } from '@/lib/jobs';
import { Filter } from 'lucide-react';

interface JobsPageProps {
  jobs: Job[];
}

export default function JobsPage({ jobs }: JobsPageProps) {
  const [filters, setFilters] = useState<JobFilters>({});
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Set<string>>(new Set());

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bookmarkedJobs');
    if (saved) {
      setBookmarkedJobs(new Set(JSON.parse(saved)));
    }
  }, []);

  // Filter jobs based on current filters
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          job.title.toLowerCase().includes(searchTerm) ||
          job.company.toLowerCase().includes(searchTerm) ||
          job.description.toLowerCase().includes(searchTerm) ||
          job.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        
        if (!matchesSearch) return false;
      }

      // Location filter
      if (filters.location) {
        const locationTerm = filters.location.toLowerCase();
        if (!job.location.toLowerCase().includes(locationTerm)) {
          return false;
        }
      }

      // Job type filter
      if (filters.type && filters.type !== job.type) {
        return false;
      }

      // Salary range filter
      if (filters.salaryRange && job.salary) {
        const [min, max] = filters.salaryRange.split('-').map(s => parseInt(s.replace('+', '')));
        const jobSalary = parseInt(job.salary.replace(/[^0-9]/g, ''));
        
        if (max) {
          if (jobSalary < min || jobSalary > max) return false;
        } else {
          if (jobSalary < min) return false;
        }
      }

      return true;
    });
  }, [jobs, filters]);

  const handleBookmark = (jobId: string) => {
    const newBookmarks = new Set(bookmarkedJobs);
    if (newBookmarks.has(jobId)) {
      newBookmarks.delete(jobId);
    } else {
      newBookmarks.add(jobId);
    }
    setBookmarkedJobs(newBookmarks);
    localStorage.setItem('bookmarkedJobs', JSON.stringify([...newBookmarks]));
  };

  return (
    <Layout 
      title="Browse Jobs - Job Board"
      description="Find your perfect job from thousands of opportunities. Filter by location, salary, job type and more."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse Jobs
          </h1>
          <p className="text-xl text-gray-600">
            Discover {jobs.length} amazing opportunities from top companies
          </p>
        </div>

        {/* Search and Filters */}
        <SearchFilters 
          filters={filters} 
          onFiltersChange={setFilters} 
        />

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </p>
          
          <div className="flex items-center space-x-4">
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option>Most Recent</option>
              <option>Salary: High to Low</option>
              <option>Salary: Low to High</option>
              <option>Company A-Z</option>
            </select>
          </div>
        </div>

        {/* Job Listings */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job}
                onBookmark={handleBookmark}
                isBookmarked={bookmarkedJobs.has(job.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters to find more opportunities.
            </p>
            <button 
              onClick={() => setFilters({})}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const jobs = await getJobs();

  return {
    props: {
      jobs,
    },
    revalidate: 3600, // Revalidate every hour
  };
};