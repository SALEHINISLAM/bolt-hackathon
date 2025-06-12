'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Save, Plus, X, DollarSign, Award, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Image from 'next/image';

interface CoachProfile {
  _id: string;
  name: string;
  email: string;
  bio: string;
  expertise: string[];
  hourlyRate: number;
  experience: number;
  certifications: string[];
  languages: string[];
  image: string;
  rating: number;
}

interface ProfileFormProps {
  profile: CoachProfile;
  onSave?: (updatedProfile: Partial<CoachProfile>) => void;
  loading?: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onSave,
  loading = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: profile.bio,
    expertise: [...profile.expertise],
    hourlyRate: profile.hourlyRate,
    experience: profile.experience,
    certifications: [...profile.certifications],
    languages: [...profile.languages]
  });
  const [newExpertise, setNewExpertise] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const expertiseOptions = [
    'Technology', 'Finance', 'Marketing', 'Leadership', 'Sales',
    'Healthcare', 'Engineering', 'Product Management', 'Strategy',
    'Career Transition', 'Executive Coaching', 'Personal Branding'
  ];

  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Italian',
    'Portuguese', 'Mandarin', 'Japanese', 'Korean', 'Arabic'
  ];

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addExpertise = () => {
    if (newExpertise.trim() && !formData.expertise.includes(newExpertise.trim())) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }));
      setNewExpertise('');
    }
  };

  const removeExpertise = (expertise: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(e => e !== expertise)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (certification: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== certification)
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  const handleSave = async () => {
    // Validation
    if (!formData.bio.trim()) {
      toast.error('Bio is required');
      return;
    }

    if (formData.expertise.length === 0) {
      toast.error('At least one area of expertise is required');
      return;
    }

    if (formData.hourlyRate < 10 || formData.hourlyRate > 1000) {
      toast.error('Hourly rate must be between $10 and $1000');
      return;
    }

    if (formData.experience < 0 || formData.experience > 50) {
      toast.error('Experience must be between 0 and 50 years');
      return;
    }

    if (onSave) {
      await onSave(formData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      bio: profile.bio,
      expertise: [...profile.expertise],
      hourlyRate: profile.hourlyRate,
      experience: profile.experience,
      certifications: [...profile.certifications],
      languages: [...profile.languages]
    });
    setIsEditing(false);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-between">
          <div className="flex items-center">
            <User className="w-6 h-6 mr-2 text-blue-800" />
            Profile Information
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-blue-800 hover:bg-blue-900"
              size="sm"
            >
              Edit Profile
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Tell clients about your background and coaching approach..."
              />
            </div>

            {/* Hourly Rate and Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Hourly Rate ($)
                </label>
                <Input
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => handleInputChange('hourlyRate', parseInt(e.target.value) || 0)}
                  min="10"
                  max="1000"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <Input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                  min="0"
                  max="50"
                  className="w-full"
                />
              </div>
            </div>

            {/* Expertise */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Areas of Expertise
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.expertise.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 flex items-center space-x-1"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => removeExpertise(skill)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <select
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select expertise area...</option>
                  {expertiseOptions
                    .filter(option => !formData.expertise.includes(option))
                    .map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <Button
                  onClick={addExpertise}
                  disabled={!newExpertise}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Certifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Award className="w-4 h-4 inline mr-1" />
                Certifications
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.certifications.map((cert) => (
                  <Badge
                    key={cert}
                    variant="outline"
                    className="flex items-center space-x-1"
                  >
                    <span>{cert}</span>
                    <button
                      onClick={() => removeCertification(cert)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  placeholder="Add certification..."
                  className="flex-1"
                />
                <Button
                  onClick={addCertification}
                  disabled={!newCertification.trim()}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                Languages
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.languages.map((lang) => (
                  <Badge
                    key={lang}
                    variant="outline"
                    className="flex items-center space-x-1"
                  >
                    <span>{lang}</span>
                    <button
                      onClick={() => removeLanguage(lang)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <select
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select language...</option>
                  {languageOptions
                    .filter(option => !formData.languages.includes(option))
                    .map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <Button
                  onClick={addLanguage}
                  disabled={!newLanguage}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-800 hover:bg-blue-900"
                disabled={loading}
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Profile Overview */}
            <div className="flex items-start space-x-4">
              <Image
                src={profile.image}
                alt={profile.name}
                className="w-20 h-20 rounded-full object-cover"
                width={80}
                height={80}
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{profile.name}</h3>
                <p className="text-gray-600">{profile.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-medium">${profile.hourlyRate}/hour</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{profile.rating}</span>
                  </div>
                  <span className="text-gray-600">{profile.experience} years exp.</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Bio</h4>
              <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
            </div>

            {/* Expertise */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Areas of Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {profile.expertise.map((skill) => (
                  <Badge key={skill} className="bg-blue-100 text-blue-800">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Certifications */}
            {profile.certifications.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Award className="w-4 h-4 mr-1" />
                  Certifications
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.certifications.map((cert) => (
                    <Badge key={cert} variant="outline">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Globe className="w-4 h-4 mr-1" />
                Languages
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((lang) => (
                  <Badge key={lang} variant="outline">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileForm;