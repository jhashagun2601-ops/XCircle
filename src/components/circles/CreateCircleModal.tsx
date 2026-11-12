import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CircleMajorCategory, Circle } from '../../types';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Globe, 
  GraduationCap, 
  Briefcase, 
  Building2, 
  Heart, 
  MapPin, 
  Plus, 
  Trash2, 
  Info, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

interface CreateCircleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_COVERS = [
  { label: 'Campus & Academic', url: '/src/assets/images/xcircle_community_campus_1793604164603.jpg' },
  { label: 'Classroom & Archives', url: '/src/assets/images/xcircle_memory_school_1793604165373.jpg' },
  { label: 'Colleagues & Work', url: '/src/assets/images/xcircle_tech_alumni_colleagues_1793605572315.jpg' },
  { label: 'Celebration & Hall', url: '/src/assets/images/xcircle_graduation_celebration_1793605572003.jpg' },
  { label: 'Collegiate Quad', url: '/src/assets/images/xcircle_st_xaviers_quad_1793605572018.jpg' },
  { label: 'Heritage Campus', url: '/src/assets/images/xcircle_campus_modern_school_1793605570820.jpg' },
];

const INTEREST_PRESETS = [
  'Books and Reading',
  'Gaming',
  'Music',
  'Sports',
  'Photography',
  'Art and Creativity',
  'Movies and Entertainment',
  'Technology',
  'Travel',
  'Entrepreneurship',
  'Philosophy',
  'Hiking & Trekking'
];

export const CreateCircleModal: React.FC<CreateCircleModalProps> = ({ isOpen, onClose }) => {
  const { createCircle, currentUser } = useApp();

  const [category, setCategory] = useState<CircleMajorCategory>('academic');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [batch, setBatch] = useState('');
  const [subtype, setSubtype] = useState('School');
  const [isPrivate, setIsPrivate] = useState(false);
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [showCustomCoverInput, setShowCustomCoverInput] = useState(false);

  // Academic specific
  const [institutionName, setInstitutionName] = useState('');
  const [academicYear, setAcademicYear] = useState(new Date().getFullYear().toString());

  // Employer specific
  const [companyName, setCompanyName] = useState('');
  const [companyInfo, setCompanyInfo] = useState('');
  const [departmentOrCohort, setDepartmentOrCohort] = useState('');
  const [workplaceDomain, setWorkplaceDomain] = useState('');

  // Location & Apartment specific
  const [locality, setLocality] = useState('');
  const [city, setCity] = useState('');
  const [societyName, setSocietyName] = useState('');

  // Interest specific
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Books and Reading']);
  const [customInterestInput, setCustomInterestInput] = useState('');

  // Guidelines
  const [guidelines, setGuidelines] = useState<string[]>([
    'Respect all members and keep discussions constructive',
    'No spam, unsolicited promotions or commercial pitches',
    'Preserve privacy: do not share private circle content externally'
  ]);
  const [newGuidelineInput, setNewGuidelineInput] = useState('');

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const addCustomInterest = () => {
    const trimmed = customInterestInput.trim();
    if (!trimmed) return;
    if (!selectedInterests.includes(trimmed)) {
      setSelectedInterests(prev => [...prev, trimmed]);
    }
    setCustomInterestInput('');
  };

  const addGuideline = () => {
    const trimmed = newGuidelineInput.trim();
    if (!trimmed) return;
    setGuidelines(prev => [...prev, trimmed]);
    setNewGuidelineInput('');
  };

  const removeGuideline = (index: number) => {
    setGuidelines(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!name.trim()) {
      setValidationError('Circle name is required.');
      return;
    }

    if (category === 'academic' && !institutionName.trim()) {
      setValidationError('Institution or School / College name is required for Academic circles.');
      return;
    }

    if (category === 'employer' && !companyName.trim()) {
      setValidationError('Company or Organisation name is required for Employer circles.');
      return;
    }

    if ((category === 'apartment_local' || category === 'location') && !locality.trim()) {
      setValidationError('Locality or Area is required for Location circles.');
      return;
    }

    if (category === 'interest' && selectedInterests.length === 0) {
      setValidationError('Please select or add at least one interest or hobby tag.');
      return;
    }

    setIsSubmitting(true);

    try {
      const activeCover = showCustomCoverInput && customCoverUrl.trim() ? customCoverUrl.trim() : coverImage;

      const circlePayload: Partial<Circle> = {
        name: name.trim(),
        description: description.trim() || 'A welcoming gathering place for shared connections and discussions.',
        category,
        subtype,
        isPrivate,
        coverImage: activeCover,
        batch: batch.trim() || (category === 'academic' ? `Class of ${academicYear}` : category === 'apartment_local' ? 'Residents Guild' : 'Community Cohort'),
        type: category === 'employer' ? 'company' : category === 'academic' ? 'school' : 'fellowship',
        guidelines: guidelines.length > 0 ? guidelines : undefined,
        
        // Academic
        institutionName: category === 'academic' ? institutionName.trim() : undefined,

        // Employer
        companyName: category === 'employer' ? companyName.trim() : undefined,
        companyInfo: category === 'employer' ? companyInfo.trim() : undefined,
        departmentOrCohort: category === 'employer' ? departmentOrCohort.trim() : undefined,
        workplaceDomain: category === 'employer' ? workplaceDomain.trim() : undefined,

        // Location & Apartment
        locality: (category === 'apartment_local' || category === 'location') ? locality.trim() : undefined,
        city: (category === 'apartment_local' || category === 'location') ? city.trim() : undefined,
        societyName: category === 'apartment_local' ? societyName.trim() : undefined,
        communityRules: (category === 'apartment_local' || category === 'location') ? guidelines : undefined,

        // Interest
        interests: category === 'interest' ? selectedInterests : undefined,
      };

      createCircle(circlePayload);
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setValidationError(err.message || 'Failed to create circle');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#142238] border border-[#242831] rounded-2xl max-w-2xl w-full shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#242831] bg-[#101827]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] flex items-center justify-center shrink-0">
              <Plus className="w-5 h-5 stroke-[2.75]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#F5F6F8] font-display">Create a New Circle</h2>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] font-semibold">
                  + Plus Option
                </span>
              </div>
              <p className="text-xs text-[#A7AFBC]">Fill in the required information to launch your community. You will be set as circle admin.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A7AFBC] hover:text-[#F5F6F8] rounded-lg hover:bg-[#1B1E24] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Validation Notice */}
          {validationError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{validationError}</span>
            </div>
          )}

          {/* STEP 1: CATEGORY SELECTOR */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A7AFBC] mb-2">
              Select Circle Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'academic', label: 'Academic', desc: 'School, College, Alumni', icon: GraduationCap },
                { id: 'employer', label: 'Employer', desc: 'Workplaces, Startups', icon: Briefcase },
                { id: 'apartment_local', label: 'Apartment', desc: 'Societies, Condos', icon: Building2 },
                { id: 'interest', label: 'Interest', desc: 'Books, Gaming, Tech', icon: Heart },
                { id: 'location', label: 'Location', desc: 'City Hub, Neighborhood', icon: MapPin },
              ].map(cat => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategory(cat.id as any);
                      if (cat.id === 'academic') setSubtype('School');
                      else if (cat.id === 'employer') setSubtype('Company');
                      else if (cat.id === 'apartment_local') setSubtype('Residential Society');
                      else if (cat.id === 'interest') setSubtype('Books & Reading');
                      else setSubtype('Neighborhood');
                    }}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-[#344B6B]/20 border-[#344B6B] text-[#F5F6F8] shadow-md ring-1 ring-[#344B6B]'
                        : 'bg-[#1B1E24] border-[#242831] text-[#A7AFBC] hover:border-[#344B6B]/40 hover:text-[#F5F6F8]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-[#344B6B]' : 'text-[#A7AFBC]'}`} />
                    <div>
                      <p className="text-xs font-semibold leading-tight">{cat.label}</p>
                      <p className="text-[10px] text-[#A7AFBC]/70 mt-0.5 line-clamp-1">{cat.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: PUBLIC VS PRIVATE PRIVACY TOGGLE */}
          <div className="bg-[#101827]/70 border border-[#242831] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {isPrivate ? (
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <Lock className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <Globe className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-[#F5F6F8]">
                    {isPrivate ? 'Private Circle (Invite / Approval Required)' : 'Public Circle (Open Discovery)'}
                  </h4>
                  <p className="text-[11px] text-[#A7AFBC]">
                    {isPrivate 
                      ? 'Discussions, members, and memories are hidden from non-members until approved.'
                      : 'Anyone in the verified directory can discover and explore batch conversations.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPrivate(prev => !prev)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isPrivate ? 'bg-amber-500' : 'bg-[#242831]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isPrivate ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {isPrivate && (
              <div className="mt-2 pt-2 border-t border-[#242831] flex items-start gap-2 text-[11px] text-amber-300/90">
                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>Security note: Private circles enforce membership gates on client views and require server-authoritative RLS when connecting live databases.</span>
              </div>
            )}
          </div>

          {/* STEP 3: BASIC CIRCLE DETAILS */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#A7AFBC] mb-1">
                Circle Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder={
                  category === 'academic' ? 'e.g. DPS Noida — Batch 2019' :
                  category === 'employer' ? 'e.g. Google India Engineering Alumni' :
                  category === 'apartment_local' ? 'e.g. Pavilion Greens Residents & Owners' :
                  category === 'interest' ? 'e.g. Sci-Fi & Speculative Fiction Book Club' :
                  'e.g. Indiranagar Morning Walkers & Heritage Club'
                }
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A7AFBC] mb-1">
                Description & Purpose
              </label>
              <textarea
                rows={2}
                placeholder="What brings this community together? What kind of stories and discussions happen here?"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B] resize-none transition-colors"
              />
            </div>
          </div>

          {/* STEP 4: DYNAMIC CATEGORY FIELDS */}
          
          {/* A. ACADEMIC SPECIFIC */}
          {category === 'academic' && (
            <div className="p-4 rounded-xl bg-[#1B1E24]/60 border border-[#242831] space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F5F6F8]">
                <GraduationCap className="w-4 h-4 text-[#344B6B]" />
                <span>Academic Institution Information</span>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#A7AFBC] mb-1">
                  Institution Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Delhi Public School Noida, St. Stephen's College, IIT Delhi"
                  value={institutionName}
                  onChange={e => setInstitutionName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#142238] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-[#A7AFBC] mb-1">Subtype</label>
                  <select
                    value={subtype}
                    onChange={e => setSubtype(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#142238] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
                  >
                    <option value="School">School</option>
                    <option value="College">College</option>
                    <option value="University">University</option>
                    <option value="Alumni Group">Alumni Group</option>
                    <option value="Coaching Institute">Coaching Institute</option>
                    <option value="Study Group">Study Group</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#A7AFBC] mb-1">Batch / Class</label>
                  <input
                    type="text"
                    placeholder="e.g. Class of 2019"
                    value={batch}
                    onChange={e => setBatch(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#142238] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#A7AFBC] mb-1">Graduation / Joining Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 2019"
                    value={academicYear}
                    onChange={e => setAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#142238] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* B. EMPLOYER SPECIFIC */}
          {category === 'employer' && (
            <div className="p-4 rounded-xl bg-[#1B1E24]/60 border border-[#242831] space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F5F6F8]">
                <Briefcase className="w-4 h-4 text-[#344B6B]" />
                <span>Workplace & Corporate Details</span>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#A7AFBC] mb-1">
                  Company / Organization Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Google India, McKinsey & Co, Razorpay, Swiggy"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#142238] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-[#A7AFBC] mb-1">Department or Cohort</label>
                  <input
                    type="text"
                    placeholder="e.g. Engineering, Product, Founding Team"
                    value={departmentOrCohort}
                    onChange={e => setDepartmentOrCohort(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#142238] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#A7AFBC] mb-1">Corporate Domain (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. google.com or mckinsey.com"
                    value={workplaceDomain}
                    onChange={e => setWorkplaceDomain(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#142238] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#A7AFBC] mb-1">Company Overview</label>
                <input
                  type="text"
                  placeholder="e.g. Global payments & financial infrastructure platform"
                  value={companyInfo}
                  onChange={e => setCompanyInfo(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#142238] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
                />
              </div>
            </div>
          )}

          {/* C. APARTMENT & LOCALITY SPECIFIC */}
          {(category === 'apartment_local' || category === 'location') && (
            <div className="p-4 rounded-xl bg-[#1B1E24]/60 border border-[#242831] space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F5F6F8]">
                <Building2 className="w-4 h-4 text-[#344B6B]" />
                <span>Locality & Neighborhood Information</span>
              </div>

              {category === 'apartment_local' && (
                <div>
                  <label className="block text-[11px] font-medium text-[#A7AFBC] mb-1">
                    Apartment / Society Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pavilion Greens, DLF Phase 5 Forum, Raheja Vistas"
                    value={societyName}
                    onChange={e => setSocietyName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#142238] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-[#A7AFBC] mb-1">
                    Locality / Area <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sector 137, Expressway Corridor"
                    value={locality}
                    onChange={e => setLocality(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#142238] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#A7AFBC] mb-1">City & State</label>
                  <input
                    type="text"
                    placeholder="e.g. Noida, UP or Bengaluru, KA"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#142238] border border-[#242831] text-[#F5F6F8] focus:outline-none focus:border-[#344B6B]"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Privacy First Principle:</strong> To protect residents, never input or share individual flat, floor, or tower numbers. Only neighborhood-level names are displayed.
                </span>
              </div>
            </div>
          )}

          {/* D. INTEREST SPECIFIC */}
          {category === 'interest' && (
            <div className="p-4 rounded-xl bg-[#1B1E24]/60 border border-[#242831] space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F5F6F8]">
                <Heart className="w-4 h-4 text-[#344B6B]" />
                <span>Select & Add Community Interests</span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {INTEREST_PRESETS.map(int => {
                  const isChecked = selectedInterests.includes(int);
                  return (
                    <button
                      key={int}
                      type="button"
                      onClick={() => toggleInterest(int)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-[#344B6B] border-[#344B6B] text-[#F5F6F8]'
                          : 'bg-[#142238] border-[#242831] text-[#A7AFBC] hover:text-[#F5F6F8]'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                      <span>{int}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add custom interest tag (e.g. Indie Game Dev, Film Noir)"
                  value={customInterestInput}
                  onChange={e => setCustomInterestInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomInterest();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-[#142238] border border-[#242831] text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                />
                <button
                  type="button"
                  onClick={addCustomInterest}
                  className="px-3 py-1.5 text-xs bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] rounded-lg font-medium transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: COVER IMAGE SELECTOR */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A7AFBC] mb-2">
              Circle Cover Image
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_COVERS.map((preset, idx) => {
                const isSelected = !showCustomCoverInput && coverImage === preset.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCoverImage(preset.url);
                      setShowCustomCoverInput(false);
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-video border transition-all ${
                      isSelected 
                        ? 'ring-2 ring-[#344B6B] border-transparent scale-102' 
                        : 'border-[#242831] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#344B6B]/40 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#A7AFBC]">
              <button
                type="button"
                onClick={() => setShowCustomCoverInput(prev => !prev)}
                className="text-[#344B6B] hover:underline flex items-center gap-1 font-medium"
              >
                <span>{showCustomCoverInput ? 'Use curated presets' : 'Or paste a custom image URL'}</span>
              </button>
            </div>

            {showCustomCoverInput && (
              <div className="mt-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={customCoverUrl}
                  onChange={e => setCustomCoverUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
                />
              </div>
            )}
          </div>

          {/* STEP 6: COMMUNITY GUIDELINES & RULES */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A7AFBC]">
              Community Guidelines & Rules
            </label>
            <div className="space-y-1.5">
              {guidelines.map((g, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#1B1E24] border border-[#242831] text-xs text-[#F5F6F8]">
                  <span className="truncate pr-2">• {g}</span>
                  <button
                    type="button"
                    onClick={() => removeGuideline(idx)}
                    className="text-[#A7AFBC] hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add another community rule..."
                value={newGuidelineInput}
                onChange={e => setNewGuidelineInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addGuideline();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-[#1B1E24] border border-[#242831] text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
              />
              <button
                type="button"
                onClick={addGuideline}
                className="px-3 py-1.5 text-xs bg-[#142238] border border-[#242831] hover:bg-[#1B1E24] text-[#F5F6F8] rounded-lg font-medium transition-colors"
              >
                Add Rule
              </button>
            </div>
          </div>

          {/* Creator Attribution Info */}
          <div className="p-3 rounded-xl bg-[#101827]/60 border border-[#242831] flex items-center gap-3 text-xs text-[#A7AFBC]">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-lg object-cover border border-[#242831]" />
            <div>
              <p className="text-xs font-semibold text-[#F5F6F8]">
                Creator: <span className="text-[#A7AFBC]">{currentUser.name} ({currentUser.handle})</span>
              </p>
              <p className="text-[10px] text-[#A7AFBC]">You will be automatically designated as the Circle Administrator.</p>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="pt-3 border-t border-[#242831] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-[#A7AFBC] hover:text-[#F5F6F8] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] text-xs font-semibold rounded-xl shadow-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Creating Circle...</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Publish Circle</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
