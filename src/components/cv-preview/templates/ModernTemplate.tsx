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
  Calendar,
  Award,
  Briefcase
} from 'lucide-react';

interface ModernTemplateProps {
  cv: CV;
}

export default function ModernTemplate({ cv }: ModernTemplateProps) {
  const { personalInfo, workExperience, education, skills, projects, certifications } = cv;
  const primaryColor = cv.design.color;
  
  return (
    <div className="w-full h-full flex flex-col p-8" style={{ color: '#333' }}>
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1" style={{ color: primaryColor }}>
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <h2 className="text-xl mb-4">{personalInfo.title}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
              {personalInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4\" style={{ color: primaryColor }} />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              
              {personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" style={{ color: primaryColor }} />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              
              {personalInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" style={{ color: primaryColor }} />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              
              {personalInfo.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" style={{ color: primaryColor }} />
                  <span>{personalInfo.website}</span>
                </div>
              )}
              
              {personalInfo.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" style={{ color: primaryColor }} />
                  <span>{personalInfo.linkedin}</span>
                </div>
              )}
              
              {personalInfo.github && (
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4" style={{ color: primaryColor }} />
                  <span>{personalInfo.github}</span>
                </div>
              )}
            </div>
          </div>
          
          {cv.design.showProfileImage && personalInfo.profileImage && (
            <div className="ml-4">
              <div 
                className="w-24 h-24 rounded-full overflow-hidden border-2"
                style={{ borderColor: primaryColor }}
              >
                <img 
                  src={personalInfo.profileImage} 
                  alt={`${personalInfo.firstName} ${personalInfo.lastName}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
        
        {personalInfo.summary && (
          <div className="mt-4">
            <p className="text-sm">{personalInfo.summary}</p>
          </div>
        )}
      </header>
      
      <hr className="my-4" style={{ borderColor: primaryColor }} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Work Experience */}
        {cv.sections.workExperience.visible && workExperience.length > 0 && (
          <section>
            <h3 
              className="text-lg font-bold mb-3 pb-1 border-b" 
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                <span>Work Experience</span>
              </div>
            </h3>
            
            <div className="space-y-4">
              {workExperience.map((job) => (
                <div key={job.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{job.position}</h4>
                      <h5 className="font-medium">{job.company}</h5>
                    </div>
                    <div className="text-right text-sm">
                      <div>{job.startDate} - {job.current ? 'Present' : job.endDate}</div>
                      {job.location && <div>{job.location}</div>}
                    </div>
                  </div>
                  <p className="text-sm mt-1">{job.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Education */}
        {cv.sections.education.visible && education.length > 0 && (
          <section>
            <h3 
              className="text-lg font-bold mb-3 pb-1 border-b" 
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                <span>Education</span>
              </div>
            </h3>
            
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{edu.degree} in {edu.field}</h4>
                      <h5 className="font-medium">{edu.institution}</h5>
                    </div>
                    <div className="text-right text-sm">
                      <div>{edu.startDate} - {edu.endDate}</div>
                      {edu.location && <div>{edu.location}</div>}
                      {edu.gpa && <div>GPA: {edu.gpa}</div>}
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-sm mt-1">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Skills */}
        {cv.sections.skills.visible && skills.length > 0 && (
          <section>
            <h3 
              className="text-lg font-bold mb-3 pb-1 border-b" 
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              <span>Skills</span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
              {skills.map((skill) => (
                <div key={skill.id} className="text-sm">
                  <span className="font-medium">{skill.name}</span>
                  {skill.level && (
                    <span className="text-muted-foreground ml-1">({skill.level})</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Projects */}
        {cv.sections.projects.visible && projects.length > 0 && (
          <section>
            <h3 
              className="text-lg font-bold mb-3 pb-1 border-b" 
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              <span>Projects</span>
            </h3>
            
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{project.name}</h4>
                      {project.url && (
                        <a href={project.url} className="text-sm" style={{ color: primaryColor }}>
                          {project.url}
                        </a>
                      )}
                    </div>
                    {(project.startDate || project.endDate) && (
                      <div className="text-right text-sm">
                        {project.startDate && project.endDate
                          ? `${project.startDate} - ${project.endDate}`
                          : project.startDate || project.endDate}
                      </div>
                    )}
                  </div>
                  <p className="text-sm mt-1">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Technologies: </span>
                      {project.technologies.join(', ')}
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
            <h3 
              className="text-lg font-bold mb-3 pb-1 border-b" 
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>Certifications</span>
              </div>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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