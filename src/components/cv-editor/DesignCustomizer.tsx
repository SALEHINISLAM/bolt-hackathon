"use client";

import React from 'react';
import { useStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { TEMPLATES_LIST } from '@/types/cv';

const fontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans' },
  { value: 'Merriweather, serif', label: 'Merriweather' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' },
];

const colors = [
  { value: '#3B82F6', label: 'Blue' },
  { value: '#10B981', label: 'Green' },
  { value: '#6366F1', label: 'Indigo' },
  { value: '#EC4899', label: 'Pink' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#EF4444', label: 'Red' },
  { value: '#F59E0B', label: 'Amber' },
  { value: '#0F172A', label: 'Navy' },
];

interface DesignCustomizerProps {
  onClose?: () => void;
}

export default function DesignCustomizer({ onClose }: DesignCustomizerProps) {
  const { cvData, updateDesign } = useStore((state) => ({
    cvData: state.cvData,
    updateDesign: state.updateDesign,
  }));

  const design = cvData?.design || {
    template: 'modern',
    color: '#3B82F6',
    font: 'Inter',
    fontSize: 'medium',
    spacing: 'normal',
    showProfileImage: false,
  };

  const handleTemplateChange = (templateId: string) => {
    updateDesign({ template: templateId });
  };

  const handleColorChange = (color: string) => {
    updateDesign({ color });
  };

  const handleFontChange = (font: string) => {
    updateDesign({ font });
  };

  const handleFontSizeChange = (fontSize: 'small' | 'medium' | 'large') => {
    updateDesign({ fontSize });
  };

  const handleSpacingChange = (spacing: 'compact' | 'normal' | 'spacious') => {
    updateDesign({ spacing });
  };

  const handleProfileImageToggle = (showProfileImage: boolean) => {
    updateDesign({ showProfileImage });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="colors">Colors & Fonts</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {TEMPLATES_LIST.map((template) => (
              <div
                key={template.id}
                className="relative"
                onClick={() => handleTemplateChange(template.id)}
              >
                <div 
                  className={`
                    border-2 rounded-md overflow-hidden cursor-pointer transition-all
                    ${design.template === template.id ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'border-border hover:border-primary/50'}
                  `}
                >
                  <div className="aspect-[210/297] bg-card">
                    <div className={`w-full h-full p-3 flex flex-col ${
                      template.id === 'modern' ? 'divide-y' :
                      template.id === 'classic' ? 'items-center text-center' :
                      template.id === 'minimalist' ? 'gap-1' :
                      template.id === 'professional' ? 'border-l-4 border-primary' :
                      'gap-2'
                    }`}>
                      <div className="w-full h-1/6 bg-muted/40"></div>
                      <div className="w-full flex-1 flex flex-col gap-1 py-2">
                        <div className="w-full h-2 bg-muted/40 rounded"></div>
                        <div className="w-3/4 h-2 bg-muted/40 rounded"></div>
                        <div className="w-5/6 h-2 bg-muted/40 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-1 text-center text-sm">{template.name}</div>
                {design.template === template.id && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="colors" className="space-y-6 pt-4">
          <div className="space-y-4">
            <Label>Primary Color</Label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {colors.map((color) => (
                <div
                  key={color.value}
                  onClick={() => handleColorChange(color.value)}
                  className="relative cursor-pointer"
                >
                  <div 
                    className={`
                      h-10 rounded-md transition-all
                      ${design.color === color.value ? 'ring-2 ring-primary ring-opacity-70' : 'hover:ring-1 hover:ring-primary/30'}
                    `}
                    style={{ backgroundColor: color.value }}
                  ></div>
                  {design.color === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white rounded-full p-0.5">
                        <Check className="h-3 w-3 text-black" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="font-selector">Font</Label>
            <Select
              value={design.font}
              onValueChange={handleFontChange}
            >
              <SelectTrigger id="font-selector">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Font Size</Label>
            <RadioGroup
              value={design.fontSize}
              onValueChange={(value) => handleFontSizeChange(value as 'small' | 'medium' | 'large')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="fontSmall" />
                <Label htmlFor="fontSmall">Small</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="fontMedium" />
                <Label htmlFor="fontMedium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="fontLarge" />
                <Label htmlFor="fontLarge">Large</Label>
              </div>
            </RadioGroup>
          </div>
        </TabsContent>
        
        <TabsContent value="layout" className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label>Content Spacing</Label>
            <RadioGroup
              value={design.spacing}
              onValueChange={(value) => handleSpacingChange(value as 'compact' | 'normal' | 'spacious')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compact" id="spacingCompact" />
                <Label htmlFor="spacingCompact">Compact</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="spacingNormal" />
                <Label htmlFor="spacingNormal">Normal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="spacious" id="spacingSpacious" />
                <Label htmlFor="spacingSpacious">Spacious</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="show-profile-image"
              checked={design.showProfileImage}
              onCheckedChange={handleProfileImageToggle}
            />
            <Label htmlFor="show-profile-image">Show Profile Picture</Label>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}