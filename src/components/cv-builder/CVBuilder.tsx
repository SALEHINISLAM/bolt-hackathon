"use client";

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import CVEditor from '@/components/cv-editor/CVEditor';
import CVPreview from '@/components/cv-preview/CVPreview';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoveRight, Eye, EyeOff, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function CVBuilder() {
  const { isPreviewMode, togglePreviewMode } = useStore();
  const [activeTab, setActiveTab] = useState<string>('edit');
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevents hydration issues
  }

  const handleExport = () => {
    // This will be implemented with actual PDF export logic
    toast({
      title: "Export Started",
      description: "Your CV is being prepared for download...",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="md:hidden">
        <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="px-2 pb-20">
            <CVEditor />
          </TabsContent>
          <TabsContent value="preview" className="px-2 pb-20">
            <CVPreview />
          </TabsContent>
        </Tabs>
      </div>

      <div className="hidden md:flex flex-1 overflow-hidden">
        <motion.div 
          className="flex-1 overflow-y-auto p-4 border-r"
          animate={{
            width: isPreviewMode ? "0%" : "50%",
            opacity: isPreviewMode ? 0 : 1,
            display: isPreviewMode ? "none" : "block",
          }}
          transition={{ duration: 0.3 }}
        >
          <CVEditor />
        </motion.div>
        
        <motion.div 
          className="flex-1 overflow-y-auto p-4 bg-muted/20"
          animate={{
            width: isPreviewMode ? "100%" : "50%",
          }}
          transition={{ duration: 0.3 }}
        >
          <CVPreview />
        </motion.div>
      </div>

      <div className="fixed bottom-4 right-4 flex gap-2 z-10">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={togglePreviewMode}
          className="md:flex hidden rounded-full shadow-md"
        >
          {isPreviewMode ? <EyeOff size={18} /> : <Eye size={18} />}
        </Button>
        
        <Button 
          onClick={handleExport}
          className="rounded-full shadow-md gap-2"
        >
          <Download size={18} />
          <span className="hidden sm:inline">Export PDF</span>
        </Button>
      </div>
    </div>
  );
}