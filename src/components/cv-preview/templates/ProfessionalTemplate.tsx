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

interface ProfessionalTemplateProps {
  cv: CV;
}

export default function ProfessionalTemplate({ cv }: ProfessionalTemplateProps) {
  const { personalInfo, workExperience, education, skills, projects, certifications } = cv;
  const primaryColor = cv.design.color;
  
  return (
    <div className="w-full h-full flex flex-col" style={{ color: '#333' }}>
      {/* Header with colored background */}
      <header className="p-8" style={{ backgroundColor: primaryColor }}>
        <div className="flex items-center gap-6">
          {cv.design.showProfileImage && personalInfo.profileImage && (
            <div className="shrink-0">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white">
                <img 
                  src={personalInfo.profileImage} 
                  alt={`${personalInfo.firstName} ${personalInfo.lastName}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-1">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <h2 className="text-xl text-white/90 mb-3">{personalInfo.title}</h2>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-white/90">
              {personalInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              
              {personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              
              {personalInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              
              {personalInfo.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>{personalInfo.website}</span>
                </div>
              )}
              
              {personalInfo.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  <span>{personalInfo.linkedin}</span>
                </div>
              )}
              
              {personalInfo.github && (
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  <span>{personalInfo.github}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Summary */}
        {personalInfo.summary && (
          <section className="mb-6">
            <h3 className="text-lg font-bold mb-2 pl-4 border-l-4\" style={{ borderColor: primaryColor }}>
              Professional Summary
            </h3>
            <p className="text-sm">{personalInfo.summary}</p>
          </section>
        )}
        
        {/* Work Experience */}
        {cv.sections.workExperience.visible && workExperience.length > 0 && (
          <section className="mb-6">
            <h3 className="text-lg font-bold mb-4 pl-4 border-l-4" style={{ borderColor: primaryColor }}>
              Work Experience
            </h3>
            
            <div className="space-y-5">
              {workExperience.map((job) => (
                <div key={job.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{job.position}</h4>
                      <h5 className="font-medium">{job.company}</h5>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium">{job.startDate} - {job.current ? 'Present' : job.endDate}</div>
                      {job.location && <div>{job.location}</div>}
                    </div>
                  </div>
                  <p className="text-sm mt-2">{job.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Education */}
        {cv.sections.education.visible && education.length > 0 && (
          <section className="mb-6">
            <h3 className="text-lg font-bold mb-4 pl-4 border-l-4" style={{ borderColor: primaryColor }}>
              Education
            </h3>
            
            <div className="space-y-5">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{edu.degree} in {edu.field}</h4>
                      <h5 className="font-medium">{edu.institution}</h5>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium">{edu.startDate} - {edu.endDate}</div>
                      {edu.location && <div>{edu.location}</div>}
                    </div>
                  </div>
                  {edu.gpa && <div className="text-sm mt-1">GPA: {edu.gpa}</div>}
                  {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skills */}
          {cv.sections.skills.visible && skills.length > 0 && (
            <section>
              <h3 className="text-lg font-bold mb-4 pl-4 border-l-4\" style={{ borderColor: primaryColor }}>
                Skills
              </h3>
              
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center">
                    <div className="text-sm font-medium">{skill.name}</div>
                    {skill.level && (
                      <div className="ml-2 flex-1">
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              backgroundColor: primaryColor,
                              width: skill.level === 'Beginner' ? '25%' :
                                    skill.level === 'Intermediate' ? '50%' :
                                    skill.level === 'Advanced' ? '75%' : '100%'
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Certifications */}
          {cv.sections.certifications.visible && certifications.length > 0 && (
            <section>
              <h3 className="text-lg font-bold mb-4 pl-4 border-l-4" style={{ borderColor: primaryColor }}>
                Certifications
              </h3>
              
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <h4 className="font-medium">{cert.name}</h4>
                    <div className="text-sm">
                      <div>{cert.issuer} | {cert.date}</div>
                      {cert.expires && cert.expiryDate && (
                        <div className="text-xs">Expires: {cert.expiryDate}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        
        {/* Projects */}
        {cv.sections.projects.visible && projects.length > 0 && (
          <section className="mt-6">
            <h3 className="text-lg font-bold mb-4 pl-4 border-l-4" style={{ borderColor: primaryColor }}>
              Projects
            </h3>
            
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{project.name}</h4>
                    </div>
                    {(project.startDate || project.endDate) && (
                      <div className="text-right text-sm">
                        <div className="font-medium">
                          {project.startDate && project.endDate
                            ? `${project.startDate} - ${project.endDate}`
                            : project.startDate || project.endDate}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm mt-1">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}