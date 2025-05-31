"use client";

import React from 'react';
import { CV } from '@/types/cv';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  Github,
} from 'lucide-react';

interface ClassicTemplateProps {
  cv: CV;
}

export default function ClassicTemplate({ cv }: ClassicTemplateProps) {
  const { personalInfo, workExperience, education, skills, projects, certifications } = cv;
  const primaryColor = cv.design.color;
  
  return (
    <div className="w-full h-full p-8" style={{ color: '#333' }}>
      {/* Header - Centered */}
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: primaryColor }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <h2 className="text-lg mb-3">{personalInfo.title}</h2>
        
        <div className="flex flex-col items-center gap-2">
          {personalInfo.email && (
            <div className="inline-flex items-center justify-center gap-2">
              <Mail className="h-4 w-4\" style={{ color: primaryColor }} />
              <span>{personalInfo.email}</span>
            </div>
          )}
          
          {personalInfo.phone && (
            <div className="inline-flex items-center justify-center gap-2">
              <Phone className="h-4 w-4" style={{ color: primaryColor }} />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          
          {personalInfo.location && (
            <div className="inline-flex items-center justify-center gap-2">
              <MapPin className="h-4 w-4" style={{ color: primaryColor }} />
              <span>{personalInfo.location}</span>
            </div>
          )}
          
          {personalInfo.website && (
            <div className="inline-flex items-center justify-center gap-2">
              <Globe className="h-4 w-4" style={{ color: primaryColor }} />
              <span>{personalInfo.website}</span>
            </div>
          )}
          
          {personalInfo.linkedin && (
            <div className="inline-flex items-center justify-center gap-2">
              <Linkedin className="h-4 w-4" style={{ color: primaryColor }} />
              <span>{personalInfo.linkedin}</span>
            </div>
          )}
          
          {personalInfo.github && (
            <div className="inline-flex items-center justify-center gap-2">
              <Github className="h-4 w-4" style={{ color: primaryColor }} />
              <span>{personalInfo.github}</span>
            </div>
          )}
        </div>
      </header>
      
      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6 text-center">
          <h3 className="text-lg font-bold mb-2" style={{ color: primaryColor }}>
            PROFESSIONAL SUMMARY
          </h3>
          <p>{personalInfo.summary}</p>
        </section>
      )}
      
      {/* Work Experience */}
      {cv.sections.workExperience.visible && workExperience.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-bold mb-4 text-center" style={{ color: primaryColor }}>
            WORK EXPERIENCE
          </h3>
          
          <div className="space-y-4">
            {workExperience.map((job) => (
              <div key={job.id} className="text-center">
                <h4 className="font-bold">{job.position}</h4>
                <h5>{job.company} | {job.location}</h5>
                <p className="italic">{job.startDate} - {job.current ? 'Present' : job.endDate}</p>
                <p className="mt-2">{job.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Education */}
      {cv.sections.education.visible && education.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-bold mb-4 text-center" style={{ color: primaryColor }}>
            EDUCATION
          </h3>
          
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="text-center">
                <h4 className="font-bold">{edu.degree} in {edu.field}</h4>
                <h5>{edu.institution} | {edu.location}</h5>
                <p className="italic">
                  {edu.startDate} - {edu.endDate}
                  {edu.gpa && ` | GPA: ${edu.gpa}`}
                </p>
                {edu.description && (
                  <p className="mt-2">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}