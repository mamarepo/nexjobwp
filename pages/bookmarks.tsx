import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import JobCard from '@/components/JobCard';
import { Job } from '@/types/job';
import { getJobs } from '@/lib/jobs';
import { Bookmark, Heart } from 'lucide-react';
import Link from 'next/link';

export default function BookmarksPage() {
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Job[]>([]);
  const [bookmarkIds, setBookmarkIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookmarkedJobs = async () => {
      try {
        const saved = localStorage.getItem('bookmarkedJobs');
        if (saved) {
          const bookmarkIds = JSON.parse(saved);
          setBookmarkIds(new Set(bookmarkIds));
          
          // Get all jobs and filter bookmarked ones
          const allJobs = await getJobs();
          const bookmarked = allJobs.filter(job => bookmarkIds.includes(job.id));
          setBookmarkedJobs(bookmarked);
        }
      } catch (error) {
        console.error('Error loading bookmarked jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookmarkedJobs();
  }, []);

  const handleBookmark = (jobId: string) => {
    const newBookmarkIds = new Set(bookmarkIds);
    if (newBookmarkIds.has(jobId)) {
      newBookmarkIds.delete(jobId);
      setBookmarkedJobs(prev => prev.filter(job => job.id !== jobId));
    } else {
      newBookmarkIds.add(jobId);
    }
    
    setBookmarkIds(newBookmarkIds);
    localStorage.setItem('bookmarkedJobs', JSON.stringify([...newBookmarkIds]));
  };

  if (loading) {
    return (
      <Layout title="Bookmarked Jobs - Job Board">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Bookmarked Jobs - Job Board"
      description="View and manage your saved job opportunities. Keep track of positions you're interested in."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <Bookmark className="h-6 w-6 text-primary-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Bookmarked Jobs
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            {bookmarkedJobs.length > 0 
              ? `You have ${bookmarkedJobs.length} saved job${bookmarkedJobs.length === 1 ? '' : 's'}`
              : 'No bookmarked jobs yet'
            }
          </p>
        </div>

        {/* Job Listings */}
        {bookmarkedJobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bookmarkedJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job}
                onBookmark={handleBookmark}
                isBookmarked={bookmarkIds.has(job.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No bookmarked jobs yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring job opportunities and bookmark the ones that interest you. 
              They'll appear here for easy access later.
            </p>
            <Link href="/jobs" className="btn-primary">
              Browse Jobs
            </Link>
          </div>
        )}

        {/* Tips Section */}
        {bookmarkedJobs.length > 0 && (
          <div className="mt-16 bg-primary-50 rounded-xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              💡 Pro Tips for Job Applications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
              <div>
                <h3 className="font-medium mb-2">Tailor Your Resume</h3>
                <p className="text-sm">
                  Customize your resume for each application to highlight relevant skills and experience.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Research the Company</h3>
                <p className="text-sm">
                  Learn about the company culture, values, and recent news before applying.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Follow Up</h3>
                <p className="text-sm">
                  Send a polite follow-up email 1-2 weeks after submitting your application.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Network</h3>
                <p className="text-sm">
                  Connect with current employees on LinkedIn to learn more about the role.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}