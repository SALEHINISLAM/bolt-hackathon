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

    toast('Generating PDF', {
      description: "Your CV is being prepared for download..."
    });

    try {
      const element = contentRef.current;
      
      // Calculate dimensions
      const a4Width = 210; // mm
      const a4Height = 297; // mm
      const pixelsPerMm = 96 / 25.4; // Standard DPI / mm per inch
      const widthInPixels = a4Width * pixelsPerMm;
      const heightInPixels = a4Height * pixelsPerMm;

      // Create canvas with precise A4 dimensions
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: widthInPixels,
        height: heightInPixels,
        windowWidth: widthInPixels,
        windowHeight: heightInPixels,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.body.firstElementChild;
          if (clonedElement) {
            // Apply fixed dimensions to cloned element
            (clonedElement as HTMLElement).style.width = `${widthInPixels}px`;
            (clonedElement as HTMLElement).style.height = `${heightInPixels}px`;
            
            // Ensure proper icon rendering
            clonedElement.querySelectorAll('.inline-flex').forEach((el: Element) => {
              (el as HTMLElement).style.display = 'inline-flex';
              (el as HTMLElement).style.alignItems = 'center';
              (el as HTMLElement).style.justifyContent = 'center';
              (el as HTMLElement).style.gap = '0.5rem';
            });
            
            clonedElement.querySelectorAll('svg').forEach((svg: SVGElement) => {
              svg.style.display = 'inline-block';
              svg.style.verticalAlign = 'middle';
              svg.style.width = '16px';
              svg.style.height = '16px';
            });

            // Ensure text alignment is preserved
            clonedElement.querySelectorAll('.text-center').forEach((el: Element) => {
              (el as HTMLElement).style.textAlign = 'center';
            });
          }
        }
      });

      // Create PDF with exact A4 dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
        hotfixes: ['px_scaling']
      });

      // Add image to PDF with exact A4 dimensions
      pdf.addImage(
        canvas.toDataURL('image/png', 1.0),
        'PNG',
        0,
        0,
        210, // A4 width in mm
        297, // A4 height in mm
        undefined,
        'FAST'
      );
      
      pdf.save(`${fileName || 'cv'}.pdf`);
      
      toast('PDF Generated', {
        description: "Your CV has been downloaded successfully."
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast('Error', {
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button onClick={generatePDF} className="gap-2">
      <Download className="h-4 w-4" />
      Download PDF
    </Button>
  );
}