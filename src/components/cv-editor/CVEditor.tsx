"use client";

import React, { useMemo, useCallback } from 'react';
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
import CertificationsForm from './CertificationsForm';
import { motion } from 'framer-motion';

export function CVEditor() {
  const { cvData, setActiveSection, activeSection } = useStore(
    useCallback((state) => ({
      cvData: state.cvData,
      setActiveSection: state.setActiveSection,
      activeSection: state.activeSection
    }), [])
  );

  const handleSectionOpen = useCallback((section: string) => {
    setActiveSection(section);
  }, [setActiveSection]);

  const orderedSections = useMemo(() => {
    return Object.entries(cvData.sections)
      .sort(([, a], [, b]) => a.order - b.order)
      .filter(([, section]) => section.visible);
  }, [cvData.sections]);

  const renderSectionComponent = useCallback((sectionKey: string) => {
    switch (sectionKey) {
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
  }, []);

  const getSectionTitle = useCallback((section: string): string => {
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
  }, []);

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
          className="w-full space-y-4"
        >
          <AccordionItem value="personalInfo" className="border rounded-lg shadow-sm">
            <AccordionTrigger className="px-4 py-2">
              Personal Information
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-2">
              <PersonalInfoForm />
            </AccordionContent>
          </AccordionItem>

          {orderedSections.map(([sectionKey]) => (
            <AccordionItem 
              key={sectionKey} 
              value={sectionKey}
              className="border rounded-lg shadow-sm"
            >
              <AccordionTrigger className="px-4 py-2">
                {getSectionTitle(sectionKey)}
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-2">
                {renderSectionComponent(sectionKey)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  );
}

export default CVEditor;