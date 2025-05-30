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
        <h1 className="text-2xl font-bold uppercase tracking-wider mb-1" style={{ color: primaryColor }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <h2 className="text-lg mb-3">{personalInfo.title}</h2>
        
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          
          {personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              <span>{personalInfo.website}</span>
            </div>
          )}
          
          {personalInfo.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="h-3 w-3" />
              <span>{personalInfo.linkedin}</span>
            </div>
          )}
          
          {personalInfo.github && (
            <div className="flex items-center gap-1">
              <Github className="h-3 w-3" />
              <span>{personalInfo.github}</span>
            </div>
          )}
        </div>
        
        {cv.design.showProfileImage && personalInfo.profileImage && (
          <div className="mt-4 flex justify-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
              <img 
                src={personalInfo.profileImage} 
                alt={`${personalInfo.firstName} ${personalInfo.lastName}`} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </header>
      
      {/* Horizontal Line */}
      <div className="w-full h-0.5 bg-gray-300 mb-6"></div>
      
      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6">
          <h3 className="text-lg font-bold uppercase tracking-wider mb-2 text-center" style={{ color: primaryColor }}>
            Professional Summary
          </h3>
          <p className="text-sm text-center">{personalInfo.summary}</p>
        </section>
      )}
      
      {/* Main Content */}
      <div className="space-y-6">
        {/* Work Experience */}
        {cv.sections.workExperience.visible && workExperience.length > 0 && (
          <section>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-3 text-center border-b pb-1\" style={{ color: primaryColor, borderColor: primaryColor }}>
              Work Experience
            </h3>
            
            <div className="space-y-4">
              {workExperience.map((job) => (
                <div key={job.id}>
                  <div className="text-center mb-1">
                    <h4 className="font-bold">{job.position}</h4>
                    <h5>{job.company}{job.location ? ` | ${job.location}` : ''}</h5>
                    <p className="text-sm italic">
                      {job.startDate} - {job.current ? 'Present' : job.endDate}
                    </p>
                  </div>
                  <p className="text-sm">{job.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Education */}
        {cv.sections.education.visible && education.length > 0 && (
          <section>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-3 text-center border-b pb-1" style={{ color: primaryColor, borderColor: primaryColor }}>
              Education
            </h3>
            
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="text-center mb-1">
                    <h4 className="font-bold">{edu.degree} in {edu.field}</h4>
                    <h5>{edu.institution}{edu.location ? ` | ${edu.location}` : ''}</h5>
                    <p className="text-sm italic">
                      {edu.startDate} - {edu.endDate}
                      {edu.gpa && ` | GPA: ${edu.gpa}`}
                    </p>
                  </div>
                  {edu.description && (
                    <p className="text-sm">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Skills */}
        {cv.sections.skills.visible && skills.length > 0 && (
          <section>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-3 text-center border-b pb-1" style={{ color: primaryColor, borderColor: primaryColor }}>
              Skills
            </h3>
            
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-center">
              {skills.map((skill) => (
                <div key={skill.id} className="px-3 py-1 border rounded-full text-sm" style={{ borderColor: primaryColor }}>
                  {skill.name}
                  {skill.level && ` (${skill.level})`}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Projects */}
        {cv.sections.projects.visible && projects.length > 0 && (
          <section>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-3 text-center border-b pb-1" style={{ color: primaryColor, borderColor: primaryColor }}>
              Projects
            </h3>
            
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id}>
                  <div className="text-center mb-1">
                    <h4 className="font-bold">{project.name}</h4>
                    {project.url && (
                      <a href={project.url} className="text-sm" style={{ color: primaryColor }}>
                        {project.url}
                      </a>
                    )}
                    {(project.startDate || project.endDate) && (
                      <p className="text-sm italic">
                        {project.startDate && project.endDate
                          ? `${project.startDate} - ${project.endDate}`
                          : project.startDate || project.endDate}
                      </p>
                    )}
                  </div>
                  <p className="text-sm">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <p className="text-sm mt-1 text-center">
                      <span className="font-medium">Technologies: </span>
                      {project.technologies.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Certifications */}
        {cv.sections.certifications.visible && certifications.length > 0 && (
          <section>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-3 text-center border-b pb-1" style={{ color: primaryColor, borderColor: primaryColor }}>
              Certifications
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              {certifications.map((cert) => (
                <div key={cert.id}>
                  <h4 className="font-bold">{cert.name}</h4>
                  <div className="text-sm">
                    <div>{cert.issuer}</div>
                    <div>Issued: {cert.date}</div>
                    {cert.expires && cert.expiryDate && (
                      <div>Expires: {cert.expiryDate}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}