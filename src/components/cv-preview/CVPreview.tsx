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

export function CVPreview() {
  const { cvData } = useStore();
  const cvRef = useRef<HTMLDivElement>(null);

  // Map template IDs to components
  const templates: Record<string, React.ComponentType<{ cv: typeof cvData }>> = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    minimalist: MinimalistTemplate,
    professional: ProfessionalTemplate,
    creative: CreativeTemplate,
  };

  // Get the selected template component, fallback to Modern
  const TemplateComponent = templates[cvData.design.template] || ModernTemplate;

  return (
    <div className="flex flex-col items-center h-full">
      <div className="bg-white shadow-lg border my-8">
        <div 
          ref={cvRef}
          className="relative bg-white overflow-hidden mx-auto"
          style={{ 
            width: '210mm',
            minHeight: '297mm',
            maxHeight: '297mm',
            fontFamily: cvData.design.font || 'Inter',
            fontSize: {
              small: '10pt',
              medium: '11pt',
              large: '12pt'
            }[cvData.design.fontSize || 'medium'],
            padding: {
              compact: '15mm',
              normal: '20mm',
              spacious: '25mm'
            }[cvData.design.spacing || 'normal'],
            lineHeight: '1.5',
            letterSpacing: '0.01em',
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact',
            pageBreakInside: 'avoid',
            pageBreakBefore: 'auto',
            pageBreakAfter: 'auto'
          }}
        >
          <TemplateComponent cv={cvData} />
        </div>
      </div>
      
      <div className="sticky bottom-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 rounded-lg shadow-lg">
        <PDFExport contentRef={cvRef} fileName={`${cvData.personalInfo.firstName}-${cvData.personalInfo.lastName}-CV`} />
      </div>
    </div>
  );
}

export default CVPreview