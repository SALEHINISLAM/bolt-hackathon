'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { TEMPLATES_LIST } from '@/types/cv';
import ModernTemplate from '@/components/cv-preview/templates/ModernTemplate';
import ClassicTemplate from '@/components/cv-preview/templates/ClassicTemplate';
import MinimalistTemplate from '@/components/cv-preview/templates/MinimalistTemplate';
import ProfessionalTemplate from '@/components/cv-preview/templates/ProfessionalTemplate';
import CreativeTemplate from '@/components/cv-preview/templates/CreativeTemplate';

interface TemplateSelectorProps {
  onClose: () => void;
}

const TemplateComponents = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimalist: MinimalistTemplate,
  professional: ProfessionalTemplate,
  creative: CreativeTemplate,
};

export function TemplateSelector({ onClose }: TemplateSelectorProps) {
  const updateDesign = useStore((state) => state.updateDesign);
  const activeTemplate = useStore((state) => state.cvData.design.template);

  const handleTemplateSelect = (templateId: string) => {
    updateDesign({ template: templateId });
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Choose Template</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES_LIST.map((template) => {
          const TemplateComponent = TemplateComponents[template.id as keyof typeof TemplateComponents];
          
          return (
            <motion.div
              key={template.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer overflow-hidden ${
                  activeTemplate === template.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className="aspect-[210/297] relative">
                  <div className="absolute inset-0 transform scale-[0.2] origin-top-left">
                    <div className="w-[500%] h-[500%] pointer-events-none">
                      <TemplateComponent cv={template.previewData} />
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t">
                  <p className="font-medium">{template.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}