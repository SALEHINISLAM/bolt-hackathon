"use client";

import React from 'react';
import { CV } from '@/types/cv';

interface MinimalistTemplateProps {
  cv: CV;
}

export default function MinimalistTemplate({ cv }: MinimalistTemplateProps) {
  const { personalInfo, workExperience, education, skills, projects, certifications } = cv;
  const primaryColor = cv.design.color;
  
  return (
    <div className="w-full h-full p-8" style={{ color: '#333' }}>
      {/* Header - Super minimal */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: primaryColor }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <h2 className="text-lg font-normal mb-2">{personalInfo.title}</h2>
        
        <div className="text-sm space-x-4">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        
        <div className="text-sm space-x-4">
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
        </div>
      </header>
      
      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6">
          <p className="text-sm">{personalInfo.summary}</p>
        </section>
      )}
      
      {/* Horizontal Line */}
      <hr className="my-4" />
      
      {/* Main Content - Extra clean */}
      <div className="space-y-6">
        {/* Work Experience */}
        {cv.sections.workExperience.visible && workExperience.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold mb-3\" style={{ color: primaryColor }}>
              Experience
            </h3>
            
            <div className="space-y-4">
              {workExperience.map((job) => (
                <div key={job.id} className="grid grid-cols-[1fr_3fr] gap-4">
                  <div>
                    <p className="text-sm">
                      {job.startDate} — {job.current ? 'Present' : job.endDate}
                    </p>
                    <p className="text-sm">{job.location}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">{job.position}</h4>
                    <h5 className="text-sm mb-1">{job.company}</h5>
                    <p className="text-sm">{job.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Education */}
        {cv.sections.education.visible && education.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold mb-3" style={{ color: primaryColor }}>
              Education
            </h3>
            
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="grid grid-cols-[1fr_3fr] gap-4">
                  <div>
                    <p className="text-sm">
                      {edu.startDate} — {edu.endDate}
                    </p>
                    <p className="text-sm">{edu.location}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">{edu.degree} in {edu.field}</h4>
                    <h5 className="text-sm mb-1">{edu.institution}</h5>
                    {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
                    {edu.description && <p className="text-sm">{edu.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Skills */}
        {cv.sections.skills.visible && skills.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold mb-3" style={{ color: primaryColor }}>
              Skills
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill.id} className="text-sm">
                  {skill.name}{skills[skills.length - 1].id !== skill.id ? ',' : ''}
                </span>
              ))}
            </div>
          </section>
        )}
        
        {/* Projects */}
        {cv.sections.projects.visible && projects.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold mb-3" style={{ color: primaryColor }}>
              Projects
            </h3>
            
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="grid grid-cols-[1fr_3fr] gap-4">
                  <div>
                    {(project.startDate || project.endDate) && (
                      <p className="text-sm">
                        {project.startDate && project.endDate
                          ? `${project.startDate} — ${project.endDate}`
                          : project.startDate || project.endDate}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium">{project.name}</h4>
                    {project.url && (
                      <p className="text-sm mb-1">{project.url}</p>
                    )}
                    <p className="text-sm">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <p className="text-sm mt-1">
                        <span className="font-medium">Using: </span>
                        {project.technologies.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Certifications */}
        {cv.sections.certifications.visible && certifications.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold mb-3" style={{ color: primaryColor }}>
              Certifications
            </h3>
            
            <div className="space-y-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="grid grid-cols-[1fr_3fr] gap-4">
                  <div>
                    <p className="text-sm">
                      {cert.date}
                      {cert.expires && cert.expiryDate && ` - ${cert.expiryDate}`}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">{cert.name}</h4>
                    <p className="text-sm">{cert.issuer}</p>
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