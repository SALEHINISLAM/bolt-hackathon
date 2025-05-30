"use client";

import React, { useRef } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import dynamic from 'next/dynamic';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import MinimalistTemplate from './templates/MinimalistTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import CreativeTemplate from './templates/CreativeTemplate';

// Dynamic import to avoid SSR issues with PDF generation
const PDFExport = dynamic(() => import('./PDFExport'), {
  ssr: false,
  loading: () => <div>Loading PDF exporter...</div>
});

export default function CVPreview() {
  const { cv } = useStore();
  const cvRef = useRef<HTMLDivElement>(null);

  // Map template IDs to components
  const templates: Record<string, React.ComponentType<{ cv: typeof cv }>> = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    minimalist: MinimalistTemplate,
    professional: ProfessionalTemplate,
    creative: CreativeTemplate,
  };

  // Get the selected template component, fallback to Modern
  const TemplateComponent = templates[cv.design.template] || ModernTemplate;

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center mb-4">
        <div className="bg-white shadow-lg border">
          <div 
            className="w-[210mm] min-h-[297mm] mx-auto relative overflow-hidden bg-white"
            style={{ 
              fontFamily: cv.design.font || 'Inter',
              fontSize: {
                small: '0.9rem',
                medium: '1rem',
                large: '1.1rem'
              }[cv.design.fontSize || 'medium'],
            }}
            ref={cvRef}
          >
            <TemplateComponent cv={cv} />
          </div>
        </div>
      </div>
      
      <PDFExport contentRef={cvRef} fileName={`${cv.personalInfo.firstName}-${cv.personalInfo.lastName}-CV`} />
    </div>
  );
}

export { CVPreview }