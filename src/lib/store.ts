import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CVData, Design, initialCVData } from '@/types/cv';

interface CVStore {
  cvData: CVData;
  activeSection: string | null;
  isPreviewMode: boolean;
  updatePersonalInfo: (data: Partial<CVData['personalInfo']>) => void;
  updateSection: (sectionKey: keyof CVData['sections'], data: { visible?: boolean; order?: number }) => void;
  addWorkExperience: () => void;
  updateWorkExperience: (id: string, data: Partial<CVData['workExperience'][0]>) => void;
  removeWorkExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<CVData['education'][0]>) => void;
  removeEducation: (id: string) => void;
  addSkill: () => void;
  updateSkill: (id: string, data: Partial<CVData['skills'][0]>) => void;
  removeSkill: (id: string) => void;
  addProject: () => void;
  updateProject: (id: string, data: Partial<CVData['projects'][0]>) => void;
  removeProject: (id: string) => void;
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<CVData['certifications'][0]>) => void;
  removeCertification: (id: string) => void;
  updateDesign: (design: Partial<Design>) => void;
  setActiveSection: (section: string | null) => void;
  togglePreviewMode: () => void;
  reset: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useStore = create<CVStore>()(
  persist(
    (set) => ({
      cvData: initialCVData,
      activeSection: null,
      isPreviewMode: false,
      updatePersonalInfo: (data) =>
        set((state) => ({
          cvData: { ...state.cvData, personalInfo: { ...state.cvData.personalInfo, ...data } },
        })),
      updateSection: (sectionKey, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            sections: {
              ...state.cvData.sections,
              [sectionKey]: { ...state.cvData.sections[sectionKey], ...data },
            },
          },
        })),
      addWorkExperience: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            workExperience: [
              ...state.cvData.workExperience,
              {
                id: generateId(),
                company: '',
                position: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: '',
                achievements: [],
              },
            ],
          },
        })),
      updateWorkExperience: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            workExperience: state.cvData.workExperience.map((exp) =>
              exp.id === id ? { ...exp, ...data } : exp
            ),
          },
        })),
      removeWorkExperience: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            workExperience: state.cvData.workExperience.filter((exp) => exp.id !== id),
          },
        })),
      addEducation: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            education: [
              ...state.cvData.education,
              {
                id: generateId(),
                institution: '',
                degree: '',
                field: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: '',
              },
            ],
          },
        })),
      updateEducation: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            education: state.cvData.education.map((edu) =>
              edu.id === id ? { ...edu, ...data } : edu
            ),
          },
        })),
      removeEducation: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            education: state.cvData.education.filter((edu) => edu.id !== id),
          },
        })),
      addSkill: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            skills: [
              ...state.cvData.skills,
              {
                id: generateId(),
                name: '',
                level: 'Beginner',
                category: '',
              },
            ],
          },
        })),
      updateSkill: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            skills: state.cvData.skills.map((skill) =>
              skill.id === id ? { ...skill, ...data } : skill
            ),
          },
        })),
      removeSkill: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            skills: state.cvData.skills.filter((skill) => skill.id !== id),
          },
        })),
      addProject: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            projects: [
              ...state.cvData.projects,
              {
                id: generateId(),
                name: '',
                description: '',
                startDate: '',
                endDate: '',
                current: false,
                technologies: [],
              },
            ],
          },
        })),
      updateProject: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            projects: state.cvData.projects.map((project) =>
              project.id === id ? { ...project, ...data } : project
            ),
          },
        })),
      removeProject: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            projects: state.cvData.projects.filter((project) => project.id !== id),
          },
        })),
      addCertification: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            certifications: [
              ...state.cvData.certifications,
              {
                id: generateId(),
                name: '',
                issuer: '',
                date: '',
                expires: false,
                expiryDate: '',
                url: '',
              },
            ],
          },
        })),
      updateCertification: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            certifications: state.cvData.certifications.map((cert) =>
              cert.id === id ? { ...cert, ...data } : cert
            ),
          },
        })),
      removeCertification: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            certifications: state.cvData.certifications.filter((cert) => cert.id !== id),
          },
        })),
      updateDesign: (design) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            design: { ...state.cvData.design, ...design },
          },
        })),
      setActiveSection: (section) => set({ activeSection: section }),
      togglePreviewMode: () => set((state) => ({ isPreviewMode: !state.isPreviewMode })),
      reset: () => set({ cvData: initialCVData }),
    }),
    {
      name: 'cv-builder-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return { cvData: initialCVData };
        }
        return persistedState as { cvData: CVData };
      },
    }
  )
);