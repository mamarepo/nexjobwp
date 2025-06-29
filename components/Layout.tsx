import { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Briefcase, Search, Bookmark, Home } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ 
  children, 
  title = 'Job Board - Find Your Dream Job',
  description = 'Discover amazing job opportunities from top companies. Find your perfect role today.'
}: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center space-x-2">
                <Briefcase className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">JobBoard</span>
              </Link>

              <nav className="hidden md:flex items-center space-x-8">
                <Link href="/" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                <Link href="/jobs" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
                  <Search className="h-4 w-4" />
                  <span>Browse Jobs</span>
                </Link>
                <Link href="/bookmarks" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
                  <Bookmark className="h-4 w-4" />
                  <span>Bookmarks</span>
                </Link>
              </nav>

              <div className="flex items-center space-x-4">
                <button className="btn-secondary">Sign In</button>
                <button className="btn-primary">Post Job</button>
              </div>
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <Briefcase className="h-8 w-8 text-primary-600" />
                  <span className="text-xl font-bold text-gray-900">JobBoard</span>
                </div>
                <p className="text-gray-600 max-w-md">
                  Find your dream job with our comprehensive job board. Connect with top employers and discover opportunities that match your skills.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">For Job Seekers</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><Link href="/jobs" className="hover:text-primary-600 transition-colors">Browse Jobs</Link></li>
                  <li><Link href="/bookmarks" className="hover:text-primary-600 transition-colors">Saved Jobs</Link></li>
                  <li><Link href="/profile" className="hover:text-primary-600 transition-colors">Profile</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">For Employers</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><Link href="/post-job" className="hover:text-primary-600 transition-colors">Post a Job</Link></li>
                  <li><Link href="/pricing" className="hover:text-primary-600 transition-colors">Pricing</Link></li>
                  <li><Link href="/contact" className="hover:text-primary-600 transition-colors">Contact</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
              <p>&copy; 2024 JobBoard. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}