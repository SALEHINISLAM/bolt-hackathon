"use client";

import React from 'react';
import { useStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SkillsForm() {
  const { cvData, addSkill, updateSkill, removeSkill } = useStore((state) => ({
    cvData: state.cvData,
    addSkill: state.addSkill,
    updateSkill: state.updateSkill,
    removeSkill: state.removeSkill,
  }));

  const skills = cvData?.skills || [];

  const handleNameChange = (id: string, value: string) => {
    updateSkill(id, { name: value });
  };

  const handleLevelChange = (id: string, value: string) => {
    updateSkill(id, { level: value as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' });
  };

  const handleCategoryChange = (id: string, value: string) => {
    updateSkill(id, { category: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {skills.map((skill) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardContent className="pt-4 pb-2">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`skill-${skill.id}`}>Skill</Label>
                      <Input
                        id={`skill-${skill.id}`}
                        value={skill.name}
                        onChange={(e) => handleNameChange(skill.id, e.target.value)}
                        placeholder="e.g., JavaScript, Project Management"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`level-${skill.id}`}>Proficiency Level</Label>
                      <Select
                        value={skill.level}
                        onValueChange={(value) => handleLevelChange(skill.id, value)}
                      >
                        <SelectTrigger id={`level-${skill.id}`}>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`category-${skill.id}`}>Category (Optional)</Label>
                      <Input
                        id={`category-${skill.id}`}
                        value={skill.category || ''}
                        onChange={(e) => handleCategoryChange(skill.id, e.target.value)}
                        placeholder="e.g., Technical, Soft Skills"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(skill.id)}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 px-2"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Button 
        variant="outline" 
        onClick={addSkill}
        className="w-full"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Skill
      </Button>
    </div>
  );
}