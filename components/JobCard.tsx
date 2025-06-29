import Link from 'next/link';
import Image from 'next/image';
import { Job } from '@/types/job';
import { MapPin, Clock, DollarSign, Star, Bookmark } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onBookmark?: (jobId: string) => void;
  isBookmarked?: boolean;
}

export default function JobCard({ job, onBookmark, isBookmarked = false }: JobCardProps) {
  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmark?.(job.id);
  };

  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="card p-6 hover:border-primary-200 transition-all duration-200 group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
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
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {job.title}
              </h3>
              <p className="text-gray-600">{job.company}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {job.featured && (
              <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                <Star className="h-3 w-3" />
                <span>Featured</span>
              </div>
            )}
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full transition-colors ${
                isBookmarked 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              <Bookmark className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
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
        </div>

        <p className="text-gray-700 mb-4 line-clamp-2">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {job.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-primary-50 text-primary-700 px-2 py-1 rounded-md text-xs font-medium"
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 3 && (
            <span className="text-gray-500 text-xs">
              +{job.tags.length - 3} more
            </span>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Posted {new Date(job.postedDate).toLocaleDateString()}
          </span>
          <span className="text-primary-600 font-medium text-sm group-hover:text-primary-700">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}