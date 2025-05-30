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
  User,
  Briefcase,
  GraduationCap,
  Lightbulb,
  FolderKanban,
  Award
} from 'lucide-react';

interface CreativeTemplateProps {
  cv: CV;
}

export default function CreativeTemplate({ cv }: CreativeTemplateProps) {
  const { personalInfo, workExperience, education, skills, projects, certifications } = cv;
  const primaryColor = cv.design.color;
  
  return (
    <div className="w-full h-full grid grid-cols-3" style={{ color: '#333' }}>
      {/* Sidebar */}
      <div className="col-span-1 p-6" style={{ backgroundColor: `${primaryColor}10` }}>
        {/* Profile Section */}
        <div className="mb-8 flex flex-col items-center text-center">
          {cv.design.showProfileImage && personalInfo.profileImage ? (
            <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-2\" style={{ borderColor: primaryColor }}>
              <img 
                src={personalInfo.profileImage} 
                alt={`${personalInfo.firstName} ${personalInfo.lastName}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div 
              className="w-28 h-28 rounded-full mb-4 flex items-center justify-center"
              style={{ backgroundColor: primaryColor, color: 'white' }}
            >
              <User className="h-12 w-12" />
            </div>
          )}
          
          <h1 className="text-xl font-bold mb-1" style={{ color: primaryColor }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <h2 className="text-sm mb-2">{personalInfo.title}</h2>
        </div>
        
        {/* Contact Information */}
        <div className="mb-8 space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: primaryColor, borderColor: primaryColor }}>
            Contact
          </h3>
          
          {personalInfo.email && (
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
              <span className="truncate">{personalInfo.email}</span>
            </div>
          )}
          
          {personalInfo.phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          
          {personalInfo.location && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
              <span>{personalInfo.location}</span>
            </div>
          )}
          
          {personalInfo.website && (
            <div className="flex items-center gap-3 text-sm">
              <Globe className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
              <span className="truncate">{personalInfo.website}</span>
            </div>
          )}
          
          {personalInfo.linkedin && (
            <div className="flex items-center gap-3 text-sm">
              <Linkedin className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
              <span className="truncate">{personalInfo.linkedin}</span>
            </div>
          )}
          
          {personalInfo.github && (
            <div className="flex items-center gap-3 text-sm">
              <Github className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
              <span className="truncate">{personalInfo.github}</span>
            </div>
          )}
        </div>
        
        {/* Skills Section */}
        {cv.sections.skills.visible && skills.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: primaryColor, borderColor: primaryColor }}>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <span>Skills</span>
              </div>
            </h3>
            
            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{skill.name}</span>
                    {skill.level && <span>{skill.level}</span>}
                  </div>
                  {skill.level && (
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
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Certifications */}
        {cv.sections.certifications.visible && certifications.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: primaryColor, borderColor: primaryColor }}>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>Certifications</span>
              </div>
            </h3>
            
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div key={cert.id} className="text-sm">
                  <div className="font-medium">{cert.name}</div>
                  <div className="text-xs">
                    {cert.issuer} | {cert.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <div className="col-span-2 p-6">
        {/* Summary */}
        {personalInfo.summary && (
          <section className="mb-6">
            <h3 className="text-lg font-bold mb-3\" style={{ color: primaryColor }}>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>About Me</span>
              </div>
            </h3>
            <p className="text-sm">{personalInfo.summary}</p>
          </section>
        )}
        
        {/* Work Experience */}
        {cv.sections.workExperience.visible && workExperience.length > 0 && (
          <section className="mb-6">
            <h3 className="text-lg font-bold mb-3" style={{ color: primaryColor }}>
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                <span>Work Experience</span>
              </div>
            </h3>
            
            <div className="space-y-4">
              {workExperience.map((job) => (
                <div key={job.id} className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:h-2 before:w-2 before:rounded-full" style={{ 
                  borderLeft: '1px solid #e5e7eb',
                  marginLeft: '1px',
                  paddingBottom: '1rem',
                  '::before': { backgroundColor: primaryColor }
                }}>
                  <div>
                    <div className="font-bold">{job.position}</div>
                    <div className="text-sm">{job.company}</div>
                    <div className="text-sm text-gray-500">
                      {job.startDate} - {job.current ? 'Present' : job.endDate}
                      {job.location && ` | ${job.location}`}
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
            <h3 className="text-lg font-bold mb-3" style={{ color: primaryColor }}>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                <span>Education</span>
              </div>
            </h3>
            
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:h-2 before:w-2 before:rounded-full" style={{ 
                  borderLeft: '1px solid #e5e7eb',
                  marginLeft: '1px',
                  paddingBottom: '1rem',
                  '::before': { backgroundColor: primaryColor }
                }}>
                  <div>
                    <div className="font-bold">{edu.degree} in {edu.field}</div>
                    <div className="text-sm">{edu.institution}</div>
                    <div className="text-sm text-gray-500">
                      {edu.startDate} - {edu.endDate}
                      {edu.location && ` | ${edu.location}`}
                      {edu.gpa && ` | GPA: ${edu.gpa}`}
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-sm mt-2">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Projects */}
        {cv.sections.projects.visible && projects.length > 0 && (
          <section>
            <h3 className="text-lg font-bold mb-3" style={{ color: primaryColor }}>
              <div className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5" />
                <span>Projects</span>
              </div>
            </h3>
            
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="p-3 rounded-md" style={{ backgroundColor: `${primaryColor}08` }}>
                  <div className="flex justify-between">
                    <div className="font-bold">{project.name}</div>
                    {(project.startDate || project.endDate) && (
                      <div className="text-sm text-gray-500">
                        {project.startDate && project.endDate
                          ? `${project.startDate} - ${project.endDate}`
                          : project.startDate || project.endDate}
                      </div>
                    )}
                  </div>
                  
                  {project.url && (
                    <a 
                      href={project.url} 
                      className="text-sm block mb-1" 
                      style={{ color: primaryColor }}
                    >
                      {project.url}
                    </a>
                  )}
                  
                  <p className="text-sm">{project.description}</p>
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: primaryColor, color: 'white' }}
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