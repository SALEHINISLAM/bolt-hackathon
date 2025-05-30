"use client";

import React from 'react';
import { useStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectsForm() {
  const { cv, addProject, updateProject, removeProject } = useStore();
  const { projects } = cv;

  const handleChange = (id: string, field: string, value: string) => {
    updateProject(id, { [field]: value });
  };

  const handleTechnologiesChange = (id: string, value: string) => {
    // Convert comma-separated string to array
    const technologies = value.split(',').map(item => item.trim()).filter(Boolean);
    updateProject(id, { technologies });
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">
                  {project.name || `Project ${index + 1}`}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`name-${project.id}`}>Project Name</Label>
                  <Input
                    id={`name-${project.id}`}
                    value={project.name}
                    onChange={(e) => handleChange(project.id, 'name', e.target.value)}
                    placeholder="E-commerce Platform, Mobile App, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`description-${project.id}`}>Description</Label>
                  <Textarea
                    id={`description-${project.id}`}
                    value={project.description}
                    onChange={(e) => handleChange(project.id, 'description', e.target.value)}
                    placeholder="Describe the project, your role, and achievements..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${project.id}`}>Start Date (Optional)</Label>
                    <Input
                      id={`startDate-${project.id}`}
                      value={project.startDate || ''}
                      onChange={(e) => handleChange(project.id, 'startDate', e.target.value)}
                      placeholder="MM/YYYY"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`endDate-${project.id}`}>End Date (Optional)</Label>
                    <Input
                      id={`endDate-${project.id}`}
                      value={project.endDate || ''}
                      onChange={(e) => handleChange(project.id, 'endDate', e.target.value)}
                      placeholder="MM/YYYY or 'Ongoing'"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`url-${project.id}`}>Project URL (Optional)</Label>
                  <Input
                    id={`url-${project.id}`}
                    value={project.url || ''}
                    onChange={(e) => handleChange(project.id, 'url', e.target.value)}
                    placeholder="https://project-example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`technologies-${project.id}`}>Technologies Used (Optional)</Label>
                  <Input
                    id={`technologies-${project.id}`}
                    value={(project.technologies || []).join(', ')}
                    onChange={(e) => handleTechnologiesChange(project.id, e.target.value)}
                    placeholder="React, Node.js, AWS (comma separated)"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeProject(project.id)}
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
        onClick={addProject}
        className="w-full"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Project
      </Button>
    </div>
  );
}

export default ProjectsForm