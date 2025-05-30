"use client";

import React from 'react';
import { useStore } from '@/lib/store';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import PersonalInfoForm from './PersonalInfoForm';
import WorkExperienceForm from './WorkExperienceForm';
import EducationForm from './EducationForm';
import SkillsForm from './SkillsForm';
import ProjectsForm from './ProjectsForm';
import CertificationsForm from './CretificationsForm';
import DesignCustomizer from './DesignCustomizer';
import { motion } from 'framer-motion';

export default function CVEditor() {
  const { cv, setActiveSection, activeSection } = useStore();

  const handleSectionOpen = (section: string) => {
    setActiveSection(section);
  };

  // Sort sections by their order
  const orderedSections = Object.entries(cv.sections)
    .sort(([, a], [, b]) => a.order - b.order);

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6">Build Your CV</h2>

        <Accordion 
          type="single" 
          collapsible 
          defaultValue="personalInfo"
          value={activeSection || undefined}
          onValueChange={handleSectionOpen}
          className="w-full"
        >
          <AccordionItem value="design" className="border rounded-lg mb-4 shadow-sm">
            <AccordionTrigger className="px-4 py-2">
              Design & Templates
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-2">
              <DesignCustomizer />
            </AccordionContent>
          </AccordionItem>

          {orderedSections.map(([sectionKey, sectionData]) => {
            if (!sectionData.visible && sectionKey !== 'personalInfo') return null;

            return (
              <AccordionItem 
                key={sectionKey} 
                value={sectionKey}
                className="border rounded-lg mb-4 shadow-sm"
              >
                <AccordionTrigger className="px-4 py-2">
                  {getSectionTitle(sectionKey)}
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-2">
                  {getSectionComponent(sectionKey)}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </motion.div>
    </div>
  );
}

function getSectionTitle(section: string): string {
  const titles: Record<string, string> = {
    personalInfo: 'Personal Information',
    workExperience: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    certifications: 'Certifications',
    languages: 'Languages',
    publications: 'Publications',
  };
  return titles[section] || section;
}

function getSectionComponent(section: string): React.ReactNode {
  switch (section) {
    case 'personalInfo':
      return <PersonalInfoForm />;
    case 'workExperience':
      return <WorkExperienceForm />;
    case 'education':
      return <EducationForm />;
    case 'skills':
      return <SkillsForm />;
    case 'projects':
      return <ProjectsForm />;
    case 'certifications':
      return <CertificationsForm />;
    default:
      return null;
  }
}

export default CVEditor