import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CVData, Template, initialCVData } from '@/types/cv';

interface CVStore {
  cvData: CVData;
  activeTemplate: string;
  availableTemplates: Record<string, Template>;
  customization: {
    primaryColor: string;
    secondaryColor: string;
    font: string;
    spacing: 'compact' | 'normal' | 'spacious';
  };
  updatePersonalInfo: (data: any) => void;
  updateSection: (sectionKey: string, data: any) => void;
  addItemToSection: (sectionKey: string, item: any) => void;
  removeItemFromSection: (sectionKey: string, index: number) => void;
  updateItemInSection: (sectionKey: string, index: number, item: any) => void;
  reorderSection: (sectionKey: string, startIndex: number, endIndex: number) => void;
  setActiveTemplate: (templateId: string) => void;
  updateCustomization: (customization: Partial<CVStore['customization']>) => void;
  reset: () => void;
}

export const useStore = create<CVStore>()(
  persist(
    (set) => ({
      cvData: initialCVData,
      activeTemplate: 'modern',
      availableTemplates: {
        modern: {
          id: 'modern',
          name: 'Modern',
          thumbnail: '/templates/modern.png',
        },
        classic: {
          id: 'classic',
          name: 'Classic',
          thumbnail: '/templates/classic.png',
        },
        minimal: {
          id: 'minimal',
          name: 'Minimal',
          thumbnail: '/templates/minimal.png',
        },
        professional: {
          id: 'professional',
          name: 'Professional',
          thumbnail: '/templates/professional.png',
        },
        creative: {
          id: 'creative',
          name: 'Creative',
          thumbnail: '/templates/creative.png',
        },
        executive: {
          id: 'executive',
          name: 'Executive',
          thumbnail: '/templates/executive.png',
        },
        elegant: {
          id: 'elegant',
          name: 'Elegant',
          thumbnail: '/templates/elegant.png',
        },
        corporate: {
          id: 'corporate',
          name: 'Corporate',
          thumbnail: '/templates/corporate.png',
        },
        simple: {
          id: 'simple',
          name: 'Simple',
          thumbnail: '/templates/simple.png',
        },
        technical: {
          id: 'technical',
          name: 'Technical',
          thumbnail: '/templates/technical.png',
        },
      },
      customization: {
        primaryColor: '#2563eb', // Blue
        secondaryColor: '#4b5563', // Gray
        font: 'Inter',
        spacing: 'normal',
      },
      updatePersonalInfo: (data) =>
        set((state) => ({
          cvData: { ...state.cvData, personalInfo: { ...state.cvData.personalInfo, ...data } },
        })),
      updateSection: (sectionKey, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            [sectionKey]: data,
          },
        })),
      addItemToSection: (sectionKey, item) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            [sectionKey]: [...(state.cvData[sectionKey] || []), item],
          },
        })),
      removeItemFromSection: (sectionKey, index) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            [sectionKey]: state.cvData[sectionKey].filter((_, i) => i !== index),
          },
        })),
      updateItemInSection: (sectionKey, index, item) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            [sectionKey]: state.cvData[sectionKey].map((oldItem, i) =>
              i === index ? { ...oldItem, ...item } : oldItem
            ),
          },
        })),
      reorderSection: (sectionKey, startIndex, endIndex) =>
        set((state) => {
          const section = [...state.cvData[sectionKey]];
          const [removed] = section.splice(startIndex, 1);
          section.splice(endIndex, 0, removed);
          return {
            cvData: {
              ...state.cvData,
              [sectionKey]: section,
            },
          };
        }),
      setActiveTemplate: (templateId) =>
        set({ activeTemplate: templateId }),
      updateCustomization: (customization) =>
        set((state) => ({
          customization: { ...state.customization, ...customization },
        })),
      reset: () => set({ cvData: initialCVData }),
    }),
    {
      name: 'cv-builder-storage',
    }
  )
);