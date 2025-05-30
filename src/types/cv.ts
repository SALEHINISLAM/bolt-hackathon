export interface CVData {
  personalInfo: {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
    summary: string;
    profileImage?: string;
  };
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  publications: Publication[];
  awards: Award[];
  volunteering: Volunteering[];
  references: Reference[];
  hobbies: Hobby[];
  sectionOrder: string[];
  visibleSections: string[];
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
  category?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  current: boolean;
  url?: string;
  technologies: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  validUntil?: string;
  url?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Fluent' | 'Native';
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url?: string;
  description: string;
  authors: string[];
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface Volunteering {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Reference {
  id: string;
  name: string;
  company: string;
  position: string;
  email: string;
  phone?: string;
  relation: string;
}

export interface Hobby {
  id: string;
  name: string;
  description?: string;
}

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
}

export const initialCVData: CVData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    twitter: '',
    summary: '',
    profileImage: '',
  },
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  publications: [],
  awards: [],
  volunteering: [],
  references: [],
  hobbies: [],
  sectionOrder: [
    'workExperience',
    'education',
    'skills',
    'projects',
    'certifications',
    'languages',
    'publications',
    'awards',
    'volunteering',
    'references',
    'hobbies',
  ],
  visibleSections: [
    'workExperience',
    'education',
    'skills',
  ],
};