export interface Section {
  visible: boolean;
  order: number;
}

export interface Design {
  template: string;
  color: string;
  font: string;
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'spacious';
  showProfileImage: boolean;
}

export interface TemplateOption {
  id: string;
  name: string;
  description: string;
  previewData: CVData;
}

export const TEMPLATES_LIST: TemplateOption[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design',
    previewData: {
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        title: 'Senior Software Engineer',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        website: 'johndoe.dev',
        linkedin: 'linkedin.com/in/johndoe',
        github: 'github.com/johndoe',
        summary: 'Experienced software engineer with a passion for building scalable applications and leading development teams.',
      },
      workExperience: [
        {
          id: '1',
          company: 'Tech Corp',
          position: 'Senior Software Engineer',
          location: 'San Francisco, CA',
          startDate: '01/2020',
          endDate: 'Present',
          current: true,
          description: 'Led development of cloud-native applications using React and Node.js.',
          achievements: ['Improved system performance by 40%', 'Led team of 5 developers']
        }
      ],
      education: [
        {
          id: '1',
          institution: 'Stanford University',
          degree: 'Master of Science',
          field: 'Computer Science',
          location: 'Stanford, CA',
          startDate: '09/2017',
          endDate: '06/2019',
          current: false,
          description: 'Focus on Artificial Intelligence and Machine Learning',
          gpa: '3.9'
        }
      ],
      skills: [
        { id: '1', name: 'React', level: 'Expert', category: 'Frontend' },
        { id: '2', name: 'Node.js', level: 'Expert', category: 'Backend' },
        { id: '3', name: 'TypeScript', level: 'Advanced', category: 'Languages' }
      ],
      projects: [
        {
          id: '1',
          name: 'E-commerce Platform',
          description: 'Built a full-stack e-commerce platform with React, Node.js, and PostgreSQL',
          startDate: '03/2022',
          endDate: '12/2022',
          current: false,
          url: 'github.com/johndoe/ecommerce',
          technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis']
        }
      ],
      certifications: [
        {
          id: '1',
          name: 'AWS Solutions Architect',
          issuer: 'Amazon Web Services',
          date: '2023',
          expires: true,
          expiryDate: '2026',
          url: 'aws.amazon.com/certification'
        }
      ],
      languages: [],
      publications: [],
      awards: [],
      volunteering: [],
      references: [],
      hobbies: [],
      sections: {
        workExperience: { visible: true, order: 1 },
        education: { visible: true, order: 2 },
        skills: { visible: true, order: 3 },
        projects: { visible: true, order: 4 },
        certifications: { visible: true, order: 5 },
        languages: { visible: false, order: 6 },
        publications: { visible: false, order: 7 },
        awards: { visible: false, order: 8 },
        volunteering: { visible: false, order: 9 },
        references: { visible: false, order: 10 },
        hobbies: { visible: false, order: 11 },
      },
      design: {
        template: 'modern',
        color: '#2563eb',
        font: 'Inter',
        fontSize: 'medium',
        spacing: 'normal',
        showProfileImage: false,
      },
    }
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional and professional layout',
    previewData: {
      personalInfo: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        title: 'Marketing Manager',
        email: 'sarah.j@example.com',
        phone: '+1 (555) 987-6543',
        location: 'New York, NY',
        linkedin: 'linkedin.com/in/sarahj',
        summary: 'Results-driven marketing professional with 8+ years of experience in digital marketing and brand development.',
      },
      workExperience: [
        {
          id: '1',
          company: 'Global Marketing Inc.',
          position: 'Marketing Manager',
          location: 'New York, NY',
          startDate: '03/2019',
          endDate: 'Present',
          current: true,
          description: 'Leading digital marketing strategies and campaigns for Fortune 500 clients.',
          achievements: ['Increased client ROI by 150%', 'Managed $2M annual budget']
        }
      ],
      education: [
        {
          id: '1',
          institution: 'Columbia University',
          degree: 'Bachelor of Arts',
          field: 'Marketing',
          location: 'New York, NY',
          startDate: '09/2011',
          endDate: '05/2015',
          current: false,
          description: '',
          gpa: '3.8'
        }
      ],
      skills: [
        { id: '1', name: 'Digital Marketing', level: 'Expert', category: 'Marketing' },
        { id: '2', name: 'Brand Development', level: 'Expert', category: 'Marketing' },
        { id: '3', name: 'Social Media Strategy', level: 'Advanced', category: 'Marketing' }
      ],
      projects: [],
      certifications: [],
      languages: [],
      publications: [],
      awards: [],
      volunteering: [],
      references: [],
      hobbies: [],
      sections: {
        workExperience: { visible: true, order: 1 },
        education: { visible: true, order: 2 },
        skills: { visible: true, order: 3 },
        projects: { visible: false, order: 4 },
        certifications: { visible: false, order: 5 },
        languages: { visible: false, order: 6 },
        publications: { visible: false, order: 7 },
        awards: { visible: false, order: 8 },
        volunteering: { visible: false, order: 9 },
        references: { visible: false, order: 10 },
        hobbies: { visible: false, order: 11 },
      },
      design: {
        template: 'classic',
        color: '#2563eb',
        font: 'Inter',
        fontSize: 'medium',
        spacing: 'normal',
        showProfileImage: false,
      },
    }
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Simple and elegant design',
    previewData: {
      personalInfo: {
        firstName: 'Alex',
        lastName: 'Chen',
        title: 'UX Designer',
        email: 'alex.chen@example.com',
        phone: '+1 (555) 234-5678',
        location: 'Seattle, WA',
        website: 'alexchen.design',
        summary: 'Minimalist UX designer focused on creating clean, intuitive user experiences.',
      },
      workExperience: [
        {
          id: '1',
          company: 'Design Studio',
          position: 'Senior UX Designer',
          location: 'Seattle, WA',
          startDate: '06/2021',
          endDate: 'Present',
          current: true,
          description: 'Leading UX design for enterprise software products.',
          achievements: ['Redesigned core product increasing user engagement by 75%']
        }
      ],
      education: [
        {
          id: '1',
          institution: 'University of Washington',
          degree: 'Bachelor of Design',
          field: 'Interactive Design',
          location: 'Seattle, WA',
          startDate: '09/2016',
          endDate: '06/2020',
          current: false,
          description: 'Focus on Human-Computer Interaction',
          gpa: '3.7'
        }
      ],
      skills: [
        { id: '1', name: 'UI/UX Design', level: 'Expert', category: 'Design' },
        { id: '2', name: 'Figma', level: 'Expert', category: 'Tools' },
        { id: '3', name: 'User Research', level: 'Advanced', category: 'Research' }
      ],
      projects: [],
      certifications: [],
      languages: [],
      publications: [],
      awards: [],
      volunteering: [],
      references: [],
      hobbies: [],
      sections: {
        workExperience: { visible: true, order: 1 },
        education: { visible: true, order: 2 },
        skills: { visible: true, order: 3 },
        projects: { visible: false, order: 4 },
        certifications: { visible: false, order: 5 },
        languages: { visible: false, order: 6 },
        publications: { visible: false, order: 7 },
        awards: { visible: false, order: 8 },
        volunteering: { visible: false, order: 9 },
        references: { visible: false, order: 10 },
        hobbies: { visible: false, order: 11 },
      },
      design: {
        template: 'minimalist',
        color: '#2563eb',
        font: 'Inter',
        fontSize: 'medium',
        spacing: 'normal',
        showProfileImage: false,
      },
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Polished business style',
    previewData: {
      personalInfo: {
        firstName: 'Michael',
        lastName: 'Brown',
        title: 'Business Development Manager',
        email: 'michael.brown@example.com',
        phone: '+1 (555) 345-6789',
        location: 'Chicago, IL',
        linkedin: 'linkedin.com/in/michaelbrown',
        summary: 'Strategic business development professional with proven track record in growing enterprise accounts.',
      },
      workExperience: [
        {
          id: '1',
          company: 'Enterprise Solutions Inc.',
          position: 'Business Development Manager',
          location: 'Chicago, IL',
          startDate: '01/2019',
          endDate: 'Present',
          current: true,
          description: 'Leading business development and account growth strategies.',
          achievements: ['Exceeded sales targets by 200%', 'Developed key partnerships']
        }
      ],
      education: [
        {
          id: '1',
          institution: 'Northwestern University',
          degree: 'MBA',
          field: 'Business Administration',
          location: 'Chicago, IL',
          startDate: '09/2016',
          endDate: '05/2018',
          current: false,
          description: 'Concentration in Strategic Management',
          gpa: '3.8'
        }
      ],
      skills: [
        { id: '1', name: 'Business Strategy', level: 'Expert', category: 'Business' },
        { id: '2', name: 'Account Management', level: 'Expert', category: 'Sales' },
        { id: '3', name: 'Negotiations', level: 'Advanced', category: 'Business' }
      ],
      projects: [],
      certifications: [],
      languages: [],
      publications: [],
      awards: [],
      volunteering: [],
      references: [],
      hobbies: [],
      sections: {
        workExperience: { visible: true, order: 1 },
        education: { visible: true, order: 2 },
        skills: { visible: true, order: 3 },
        projects: { visible: false, order: 4 },
        certifications: { visible: false, order: 5 },
        languages: { visible: false, order: 6 },
        publications: { visible: false, order: 7 },
        awards: { visible: false, order: 8 },
        volunteering: { visible: false, order: 9 },
        references: { visible: false, order: 10 },
        hobbies: { visible: false, order: 11 },
      },
      design: {
        template: 'professional',
        color: '#2563eb',
        font: 'Inter',
        fontSize: 'medium',
        spacing: 'normal',
        showProfileImage: false,
      },
    }
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Unique and eye-catching layout',
    previewData: {
      personalInfo: {
        firstName: 'Emma',
        lastName: 'Wilson',
        title: 'Creative Director',
        email: 'emma.wilson@example.com',
        phone: '+1 (555) 456-7890',
        location: 'Los Angeles, CA',
        website: 'emmawilson.art',
        instagram: '@emmacreates',
        summary: 'Innovative creative director with a bold vision and expertise in brand storytelling.',
      },
      workExperience: [
        {
          id: '1',
          company: 'Creative Agency X',
          position: 'Creative Director',
          location: 'Los Angeles, CA',
          startDate: '03/2020',
          endDate: 'Present',
          current: true,
          description: 'Leading creative direction for major brand campaigns.',
          achievements: ['Won 3 industry awards', "Doubled agency's creative portfolio"]
        }
      ],
      education: [
        {
          id: '1',
          institution: 'Art Center College of Design',
          degree: 'Bachelor of Fine Arts',
          field: 'Graphic Design',
          location: 'Pasadena, CA',
          startDate: '09/2015',
          endDate: '06/2019',
          current: false,
          description: 'Focus on Digital Media',
          gpa: '3.9'
        }
      ],
      skills: [
        { id: '1', name: 'Creative Direction', level: 'Expert', category: 'Creative' },
        { id: '2', name: 'Brand Strategy', level: 'Expert', category: 'Strategy' },
        { id: '3', name: 'Visual Design', level: 'Advanced', category: 'Design' }
      ],
      projects: [],
      certifications: [],
      languages: [],
      publications: [],
      awards: [],
      volunteering: [],
      references: [],
      hobbies: [],
      sections: {
        workExperience: { visible: true, order: 1 },
        education: { visible: true, order: 2 },
        skills: { visible: true, order: 3 },
        projects: { visible: false, order: 4 },
        certifications: { visible: false, order: 5 },
        languages: { visible: false, order: 6 },
        publications: { visible: false, order: 7 },
        awards: { visible: false, order: 8 },
        volunteering: { visible: false, order: 9 },
        references: { visible: false, order: 10 },
        hobbies: { visible: false, order: 11 },
      },
      design: {
        template: 'creative',
        color: '#2563eb',
        font: 'Inter',
        fontSize: 'medium',
        spacing: 'normal',
        showProfileImage: false,
      },
    }
  }
];

export const TEMPLATES_MAP: Record<string, TemplateOption> = TEMPLATES_LIST.reduce(
  (acc, template) => ({ ...acc, [template.id]: template }),
  {}
);

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
  sections: {
    workExperience: Section;
    education: Section;
    skills: Section;
    projects: Section;
    certifications: Section;
    languages: Section;
    publications: Section;
    awards: Section;
    volunteering: Section;
    references: Section;
    hobbies: Section;
  };
  design: Design;
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
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category?: string;
}

export interface Project {
  id: string;
  name: string;
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
  expires: boolean;
  expiryDate?: string;
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
  sections: {
    workExperience: { visible: true, order: 1 },
    education: { visible: true, order: 2 },
    skills: { visible: true, order: 3 },
    projects: { visible: true, order: 4 },
    certifications: { visible: true, order: 5 },
    languages: { visible: false, order: 6 },
    publications: { visible: false, order: 7 },
    awards: { visible: false, order: 8 },
    volunteering: { visible: false, order: 9 },
    references: { visible: false, order: 10 },
    hobbies: { visible: false, order: 11 },
  },
  design: {
    template: 'modern',
    color: '#2563eb',
    font: 'Inter',
    fontSize: 'medium',
    spacing: 'normal',
    showProfileImage: false,
  },
};