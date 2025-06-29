export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  salary?: string;
  description: string;
  requirements: string[];
  benefits?: string[];
  postedDate: string;
  applicationUrl?: string;
  featured?: boolean;
  tags: string[];
  companyLogo?: string;
}

export interface JobFilters {
  search?: string;
  location?: string;
  type?: string;
  salaryRange?: string;
  tags?: string[];
}