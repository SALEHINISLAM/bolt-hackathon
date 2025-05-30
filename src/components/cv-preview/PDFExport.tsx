"use client";

import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PDFExportProps {
  contentRef: React.RefObject<HTMLDivElement>;
  fileName: string;
}

export default function PDFExport({ contentRef, fileName }: PDFExportProps) {
  const { toast } = useToast();

  const generatePDF = async () => {
    if (!contentRef.current) return;

    toast({
      title: "Generating PDF",
      description: "Your CV is being prepared for download...",
    });

    try {
      const element = contentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      
      // A4 dimensions: 210 x 297 mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Check if content spans multiple pages
      let position = 0;
      if (imgHeight > 297) {
        // Content exceeds one page, handle multi-page
        const pageHeight = 297;
        let heightLeft = imgHeight;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft > 0) {
          position = -pageHeight * (imgHeight / heightLeft);
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }
      
      pdf.save(`${fileName || 'cv'}.pdf`);
      
      toast({
        title: "PDF Generated",
        description: "Your CV has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <Button onClick={generatePDF} className="gap-2">
        <Download className="h-4 w-4" />
        Download PDF
      </Button>
    </div>
  );
}