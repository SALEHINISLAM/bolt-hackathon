'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function ExportButton() {
  const handleExport = async () => {
    // TODO: Implement PDF export functionality
    console.log('Export functionality to be implemented');
  };

  return (
    <Button onClick={handleExport} size="sm">
      <Download className="mr-2 h-4 w-4" />
      Export PDF
    </Button>
  );
}