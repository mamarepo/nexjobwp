import { Job } from '@/types/job';

// Mock job data - in a real app, this would come from an API or database
export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'full-time',
    salary: '$120,000 - $160,000',
    description: 'We are looking for a Senior Frontend Developer to join our dynamic team. You will be responsible for building user-facing features using modern web technologies.',
    requirements: [
      '5+ years of experience with React',
      'Strong knowledge of TypeScript',
      'Experience with Next.js',
      'Understanding of modern CSS frameworks',
      'Experience with testing frameworks'
    ],
    benefits: [
      'Health insurance',
      'Dental and vision',
      '401k matching',
      'Flexible work hours',
      'Remote work options'
    ],
    postedDate: '2024-01-15',
    featured: true,
    tags: ['React', 'TypeScript', 'Next.js', 'Frontend'],
    companyLogo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'New York, NY',
    type: 'full-time',
    salary: '$100,000 - $140,000',
    description: 'Join our fast-growing startup as a Full Stack Engineer. You will work on both frontend and backend systems, helping to scale our platform.',
    requirements: [
      '3+ years of full-stack development',
      'Experience with Node.js and React',
      'Database design experience',
      'API development skills',
      'Cloud platform experience (AWS/GCP)'
    ],
    benefits: [
      'Equity package',
      'Health insurance',
      'Unlimited PTO',
      'Learning budget',
      'Gym membership'
    ],
    postedDate: '2024-01-14',
    featured: false,
    tags: ['Full Stack', 'Node.js', 'React', 'AWS'],
    companyLogo: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: '3',
    title: 'UX/UI Designer',
    company: 'Design Studio Pro',
    location: 'Remote',
    type: 'remote',
    salary: '$80,000 - $110,000',
    description: 'We are seeking a talented UX/UI Designer to create exceptional user experiences for our clients. You will work on diverse projects across various industries.',
    requirements: [
      '4+ years of UX/UI design experience',
      'Proficiency in Figma and Adobe Creative Suite',
      'Strong portfolio demonstrating design process',
      'Experience with user research and testing',
      'Understanding of frontend development principles'
    ],
    benefits: [
      'Fully remote',
      'Flexible schedule',
      'Health insurance',
      'Professional development budget',
      'Top-tier equipment'
    ],
    postedDate: '2024-01-13',
    featured: true,
    tags: ['UX', 'UI', 'Design', 'Figma', 'Remote'],
    companyLogo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'CloudTech Solutions',
    location: 'Austin, TX',
    type: 'full-time',
    salary: '$110,000 - $150,000',
    description: 'Looking for a DevOps Engineer to help build and maintain our cloud infrastructure. You will work with cutting-edge technologies to ensure scalability and reliability.',
    requirements: [
      '3+ years of DevOps experience',
      'Strong knowledge of AWS/Azure',
      'Experience with Docker and Kubernetes',
      'Infrastructure as Code (Terraform)',
      'CI/CD pipeline experience'
    ],
    benefits: [
      'Health insurance',
      'Stock options',
      '401k matching',
      'Conference attendance',
      'Home office stipend'
    ],
    postedDate: '2024-01-12',
    featured: false,
    tags: ['DevOps', 'AWS', 'Kubernetes', 'Docker', 'Terraform'],
    companyLogo: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  }
];

export async function getJobs(): Promise<Job[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockJobs;
}

export async function getJobById(id: string): Promise<Job | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockJobs.find(job => job.id === id) || null;
}

export async function getFeaturedJobs(): Promise<Job[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockJobs.filter(job => job.featured);
}