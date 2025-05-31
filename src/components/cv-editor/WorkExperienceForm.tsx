"use client";

import React from 'react';
import { useStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WorkExperienceForm() {
  const { cvData, addWorkExperience, updateWorkExperience, removeWorkExperience } = useStore((state) => ({
    cvData: state.cvData,
    addWorkExperience: state.addWorkExperience,
    updateWorkExperience: state.updateWorkExperience,
    removeWorkExperience: state.removeWorkExperience,
  }));

  const workExperience = cvData?.workExperience || [];

  const handleChange = (id: string, field: string, value: string | boolean) => {
    updateWorkExperience(id, { [field]: value });
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {workExperience.map((experience, index) => (
          <motion.div
            key={experience.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">
                  {experience.company || `Experience ${index + 1}`}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`company-${experience.id}`}>Company</Label>
                    <Input
                      id={`company-${experience.id}`}
                      value={experience.company}
                      onChange={(e) => handleChange(experience.id, 'company', e.target.value)}
                      placeholder="Company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`position-${experience.id}`}>Position</Label>
                    <Input
                      id={`position-${experience.id}`}
                      value={experience.position}
                      onChange={(e) => handleChange(experience.id, 'position', e.target.value)}
                      placeholder="Job title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${experience.id}`}>Start Date</Label>
                    <Input
                      id={`startDate-${experience.id}`}
                      value={experience.startDate}
                      onChange={(e) => handleChange(experience.id, 'startDate', e.target.value)}
                      placeholder="MM/YYYY"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`endDate-${experience.id}`}>End Date</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`current-${experience.id}`}
                          checked={experience.current}
                          onCheckedChange={(checked) => handleChange(experience.id, 'current', checked)}
                        />
                        <Label htmlFor={`current-${experience.id}`} className="text-sm">
                          Current
                        </Label>
                      </div>
                    </div>
                    <Input
                      id={`endDate-${experience.id}`}
                      value={experience.endDate}
                      onChange={(e) => handleChange(experience.id, 'endDate', e.target.value)}
                      placeholder="MM/YYYY"
                      disabled={experience.current}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`location-${experience.id}`}>Location (Optional)</Label>
                  <Input
                    id={`location-${experience.id}`}
                    value={experience.location}
                    onChange={(e) => handleChange(experience.id, 'location', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`description-${experience.id}`}>Description</Label>
                  <Textarea
                    id={`description-${experience.id}`}
                    value={experience.description}
                    onChange={(e) => handleChange(experience.id, 'description', e.target.value)}
                    placeholder="Describe your responsibilities and achievements..."
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeWorkExperience(experience.id)}
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
        onClick={addWorkExperience}
        className="w-full"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Work Experience
      </Button>
    </div>
  );
}