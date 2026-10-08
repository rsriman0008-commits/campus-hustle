'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, GraduationCap, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BackButton } from '@/components/ui/BackButton';
import { saveBasicProfileAction, saveAcademicProfileAction } from '@/features/auth/actions';

const PU_SCHOOLS = [
  { id: '10000000-0000-0000-0000-000000000001', name: 'School of Engineering & Technology' },
  { id: '10000000-0000-0000-0000-000000000002', name: 'School of Management' },
  { id: '10000000-0000-0000-0000-000000000003', name: 'School of Physical Chemical & Mathematical Sciences' },
  { id: '10000000-0000-0000-0000-000000000004', name: 'School of Life Sciences' },
  { id: '10000000-0000-0000-0000-000000000005', name: 'School of Social Sciences & International Studies' },
  { id: '10000000-0000-0000-0000-000000000006', name: 'School of Humanities' },
];

const PU_DEPARTMENTS: Record<string, { id: string; name: string }[]> = {
  '10000000-0000-0000-0000-000000000001': [
    { id: '20000000-0000-0000-0000-000000000001', name: 'Department of Computer Science' },
    { id: '20000000-0000-0000-0000-000000000002', name: 'Department of Information Technology' },
  ],
  '10000000-0000-0000-0000-000000000002': [
    { id: '20000000-0000-0000-0000-000000000003', name: 'Department of Management Studies' },
    { id: '20000000-0000-0000-0000-000000000004', name: 'Department of Commerce' },
  ],
  '10000000-0000-0000-0000-000000000003': [
    { id: '20000000-0000-0000-0000-000000000005', name: 'Department of Physics' },
    { id: '20000000-0000-0000-0000-000000000006', name: 'Department of Chemistry' },
  ],
};

const PU_PROGRAMMES: Record<string, { id: string; name: string }[]> = {
  '20000000-0000-0000-0000-000000000001': [
    { id: '30000000-0000-0000-0000-000000000001', name: 'M.Tech Computer Science & Engineering' },
    { id: '30000000-0000-0000-0000-000000000002', name: 'Master of Computer Applications (MCA)' },
    { id: '30000000-0000-0000-0000-000000000003', name: 'M.Sc Data Science & Analytics' },
  ],
  '20000000-0000-0000-0000-000000000003': [
    { id: '30000000-0000-0000-0000-000000000004', name: 'Master of Business Administration (MBA)' },
  ],
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1: Basic Profile State
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');

  // Step 2: Academic Profile State
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedProg, setSelectedProg] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState(1);
  const [gradYear, setGradYear] = useState(2026);

  const handleNext = async () => {
    setErrorMsg('');

    if (step === 1) {
      if (!displayName || displayName.trim().length < 2) {
        setErrorMsg('Display name must be at least 2 characters');
        return;
      }
      const res = await saveBasicProfileAction({ displayName, username: '', bio });
      if (res?.error) {
        console.warn('Saving basic profile status:', res.error);
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedSchool || !selectedDept || !selectedProg) {
        setErrorMsg('Please select your School, Department, and Course');
        return;
      }
      setIsSubmitting(true);
      const res = await saveAcademicProfileAction({
        schoolId: selectedSchool,
        departmentId: selectedDept,
        programmeId: selectedProg,
        yearOfStudy,
        expectedGraduationYear: gradYear,
      });
      if (res?.error) {
        console.warn('Saving academic profile status:', res.error);
      }
      setIsSubmitting(false);
      router.push('/');
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto py-6">
      <BackButton fallbackUrl="/login" />

      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Step Indicator Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div
            className={`w-9 h-9 rounded-xl font-bold text-sm flex items-center justify-center transition-colors ${
              step === 1
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {step === 1 ? 'Step 1: Basic Profile Details' : 'Step 2: Academic Details'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {step === 1
                ? 'Name & description'
                : 'School, course, dept, year of study & expected graduation'}
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Step {step} of 2
          </span>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* STEP 1: Basic Profile */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" /> Basic Details
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter how fellow Pondicherry University students will see you.
              </p>
            </div>

            <Input
              label="Full Name *"
              placeholder="e.g. Arjun Kumar"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Profile Description / Bio
              </label>
              <textarea
                rows={3}
                placeholder="Brief description of yourself, what you buy, sell, or offer..."
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 2: Academic Profile */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" /> Academic Details
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Required for Pondicherry University student verification.
              </p>
            </div>

            {/* School */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                School *
              </label>
              <select
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={selectedSchool}
                onChange={(e) => {
                  setSelectedSchool(e.target.value);
                  setSelectedDept('');
                  setSelectedProg('');
                }}
              >
                <option value="">Select School...</option>
                {PU_SCHOOLS.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Department *
              </label>
              <select
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                value={selectedDept}
                disabled={!selectedSchool}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setSelectedProg('');
                }}
              >
                <option value="">Select Department...</option>
                {(PU_DEPARTMENTS[selectedSchool] || [
                  { id: '20000000-0000-0000-0000-000000000001', name: 'Department of Computer Science' },
                  { id: '20000000-0000-0000-0000-000000000003', name: 'Department of Management Studies' },
                ]).map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Course / Programme */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Course / Programme *
              </label>
              <select
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                value={selectedProg}
                disabled={!selectedDept}
                onChange={(e) => setSelectedProg(e.target.value)}
              >
                <option value="">Select Course...</option>
                {(PU_PROGRAMMES[selectedDept] || [
                  { id: '30000000-0000-0000-0000-000000000001', name: 'M.Tech Computer Science & Engineering' },
                  { id: '30000000-0000-0000-0000-000000000002', name: 'Master of Computer Applications (MCA)' },
                ]).map((prog) => (
                  <option key={prog.id} value={prog.id}>
                    {prog.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year of study & Expected Graduation */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Year of Study *"
                type="number"
                min={1}
                max={6}
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(Number(e.target.value))}
              />
              <Input
                label="Expected Graduation *"
                type="number"
                min={2024}
                max={2032}
                value={gradYear}
                onChange={(e) => setGradYear(Number(e.target.value))}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Basic Info
            </Button>
          ) : <div />}

          <Button variant="primary" onClick={handleNext} isLoading={isSubmitting} className="gap-2">
            {step === 2 ? 'Save & Go to Marketplace' : 'Next: Academic Info'} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
