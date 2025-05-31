"use client";

import React from 'react';
import { useStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CertificationsForm() {
  const { cvData, addCertification, updateCertification, removeCertification } = useStore((state) => ({
    cvData: state.cvData,
    addCertification: state.addCertification,
    updateCertification: state.updateCertification,
    removeCertification: state.removeCertification
  }));

  const certifications = cvData?.certifications || [];

  const handleChange = (id: string, field: string, value: string | boolean) => {
    updateCertification(id, { [field]: value });
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {certifications.map((certification, index) => (
          <motion.div
            key={certification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">
                  {certification.name || `Certification ${index + 1}`}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`name-${certification.id}`}>Certification Name</Label>
                  <Input
                    id={`name-${certification.id}`}
                    value={certification.name}
                    onChange={(e) => handleChange(certification.id, 'name', e.target.value)}
                    placeholder="AWS Solutions Architect, PMP, etc."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`issuer-${certification.id}`}>Issuing Organization</Label>
                    <Input
                      id={`issuer-${certification.id}`}
                      value={certification.issuer}
                      onChange={(e) => handleChange(certification.id, 'issuer', e.target.value)}
                      placeholder="Amazon Web Services, PMI, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`date-${certification.id}`}>Date Obtained</Label>
                    <Input
                      id={`date-${certification.id}`}
                      value={certification.date}
                      onChange={(e) => handleChange(certification.id, 'date', e.target.value)}
                      placeholder="MM/YYYY"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`url-${certification.id}`}>Credential URL (Optional)</Label>
                  <Input
                    id={`url-${certification.id}`}
                    value={certification.url || ''}
                    onChange={(e) => handleChange(certification.id, 'url', e.target.value)}
                    placeholder="https://credential-verify.com/abc123"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id={`expires-${certification.id}`}
                    checked={certification.expires}
                    onCheckedChange={(checked) => handleChange(certification.id, 'expires', checked)}
                  />
                  <Label htmlFor={`expires-${certification.id}`}>Has Expiration Date</Label>
                </div>

                {certification.expires && (
                  <div className="space-y-2">
                    <Label htmlFor={`expiryDate-${certification.id}`}>Expiry Date</Label>
                    <Input
                      id={`expiryDate-${certification.id}`}
                      value={certification.expiryDate || ''}
                      onChange={(e) => handleChange(certification.id, 'expiryDate', e.target.value)}
                      placeholder="MM/YYYY"
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeCertification(certification.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      <Button 
        variant="outline" 
        onClick={addCertification}
        className="w-full"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Certification
      </Button>
    </div>
  );
}