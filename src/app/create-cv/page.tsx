'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { CVEditor } from '@/components/cv-editor/CVEditor';
import { CVPreview } from '@/components/cv-preview/CVPreview';
import { TemplateSelector } from '@/components/template-selector/TemplateSelector';
import { CustomizationPanel } from '@/components/customization/CustomizationPanel';
import { ExportButton } from '@/components/export/ExportButton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

export default function Home() {
  const { setTheme, theme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('editor');
  const [showTemplates, setShowTemplates] = useState<boolean>(false);
  const [showCustomization, setShowCustomization] = useState<boolean>(false);
  
  const activeTemplate = useStore((state) => state.activeTemplate);
  const templates = useStore((state) => state.availableTemplates);
  const selectedTemplate = templates[activeTemplate];

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b sticky top-0 z-10 bg-background">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="font-bold text-2xl text-primary"
            >
              CV Builder
            </motion.div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplates(!showTemplates)}
            >
              Templates
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomization(!showCustomization)}
            >
              Customize
            </Button>
            <ExportButton />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-6 px-4">
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <TemplateSelector onClose={() => setShowTemplates(false)} />
          </motion.div>
        )}

        {showCustomization && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <CustomizationPanel onClose={() => setShowCustomization(false)} />
          </motion.div>
        )}

        <div className="lg:hidden mb-6">
          <Tabs defaultValue="editor" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="editor" className="mt-6">
              <CVEditor />
            </TabsContent>
            <TabsContent value="preview" className="mt-6">
              <CVPreview />
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden lg:grid grid-cols-2 gap-6">
          <div className="col-span-1">
            <CVEditor />
          </div>
          <div className="col-span-1 sticky top-24 h-[calc(100vh-6rem)] overflow-auto">
            <CVPreview />
          </div>
        </div>
      </div>
    </main>
  );
}