import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Job } from '@/types/job';
import { getJobs, getJobById } from '@/lib/jobs';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building, 
  Calendar,
  ExternalLink,
  Bookmark,
  Share2,
  CheckCircle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface JobDetailProps {
  job: Job;
}

export default function JobDetail({ job }: JobDetailProps) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedJobs') || '[]');
    setIsBookmarked(bookmarks.includes(job.id));
  }, [job.id]);

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedJobs') || '[]');
    let newBookmarks;
    
    if (isBookmarked) {
      newBookmarks = bookmarks.filter((id: string) => id !== job.id);
    } else {
      newBookmarks = [...bookmarks, job.id];
    }
    
    localStorage.setItem('bookmarkedJobs', JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${job.title} at ${job.company}`,
          text: job.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (router.isFallback) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title={`${job.title} at ${job.company} - Job Board`}
      description={job.description}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
            <li>/</li>
            <li><Link href="/jobs" className="hover:text-primary-600">Jobs</Link></li>
            <li>/</li>
            <li className="text-gray-900">{job.title}</li>
          </ol>
        </nav>

        {/* Job Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start space-x-4 mb-6 lg:mb-0">
              {job.companyLogo && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={job.companyLogo}
                    alt={`${job.company} logo`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {job.title}
                </h1>
                <div className="flex items-center space-x-1 text-lg text-gray-700 mb-4">
                  <Building className="h-5 w-5" />
                  <span>{job.company}</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span className="capitalize">{job.type.replace('-', ' ')}</span>
                  </div>
                  {job.salary && (
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{job.salary}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleBookmark}
                className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  isBookmarked
                    ? 'bg-primary-50 border-primary-200 text-primary-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Bookmark className="h-4 w-4" />
                <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
              
              {job.applicationUrl ? (
                <a
                  href={job.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <button className="btn-primary">
                  Apply Now
                </button>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-3">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits & Perks</h2>
                <ul className="space-y-3">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Ready to Apply?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Don't miss out on this opportunity. Apply now and take the next step in your career.
              </p>
              {job.applicationUrl ? (
                <a
                  href={job.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <button className="btn-primary w-full">
                  Apply Now
                </button>
              )}
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">About {job.company}</h3>
              <div className="flex items-center space-x-3 mb-4">
                {job.companyLogo && (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={job.companyLogo}
                      alt={`${job.company} logo`}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-gray-900">{job.company}</h4>
                  <p className="text-sm text-gray-600">{job.location}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Learn more about {job.company} and explore other opportunities with this company.
              </p>
              <button className="btn-secondary w-full mt-4">
                View Company Profile
              </button>
            </div>

            {/* Similar Jobs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Similar Jobs</h3>
              <p className="text-gray-600 text-sm mb-4">
                Explore other opportunities that might interest you.
              </p>
              <Link href="/jobs" className="btn-secondary w-full">
                Browse Similar Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const jobs = await getJobs();
  const paths = jobs.map((job) => ({
    params: { id: job.id },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const job = await getJobById(params?.id as string);

  if (!job) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      job,
    },
    revalidate: 3600,
  };
};