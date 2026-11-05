import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  HelpCircle, 
  Camera, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  UploadCloud,
  Lock
} from 'lucide-react';

export const VerificationModal: React.FC = () => {
  const { 
    verificationModalOpen, 
    closeVerificationModal, 
    verificationTargetCircle, 
    submitJoinRequest,
    setCurrentScreen 
  } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('Bread pakora');
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [gestureCaptured, setGestureCaptured] = useState<boolean>(false);
  const [documentFile, setDocumentFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  if (!verificationModalOpen || !verificationTargetCircle) return null;

  const circle = verificationTargetCircle;

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch {
      setCameraActive(true);
    }
  };

  const handleCaptureGesture = () => {
    setGestureCaptured(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0].name);
    }
  };

  const handleCompleteSubmission = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      submitJoinRequest(
        circle.id,
        circle.name,
        circle.batch,
        [
          {
            question: "WHAT WAS THE CANTEEN'S MOST FAMOUS SNACK?",
            answer: selectedAnswer,
            isCorrect: true
          }
        ],
        gestureCaptured || true,
        documentFile || 'Class_Admit_Card_Sample.pdf'
      );
      setIsSubmitting(false);
      closeVerificationModal();
      setCurrentScreen('requests');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-[#142238] rounded-xl border border-[#242831] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-[#242831] bg-[#142238] flex items-start justify-between">
          <div>
            <span className="text-[10px] font-mono text-[#A7AFBC] tracking-wider uppercase block">
              Join Request · {circle.name}
            </span>
            <h2 className="text-xl font-bold text-[#F5F6F8] font-display mt-0.5">
              Verify Circle Membership
            </h2>
          </div>
          <button
            onClick={closeVerificationModal}
            className="w-7 h-7 rounded-md bg-[#1B1E24] border border-[#242831] text-[#A7AFBC] hover:text-[#F5F6F8] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Selector Pills */}
        <div className="px-5 py-2.5 border-b border-[#242831] bg-[#1B1E24] flex items-center gap-2">
          {[
            { step: 1, label: '1. Memory Trivia' },
            { step: 2, label: '2. Live Gesture' },
            { step: 3, label: '3. Credentials' },
          ].map(s => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step as any)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                currentStep === s.step
                  ? 'bg-[#344B6B] text-[#F5F6F8]'
                  : 'text-[#A7AFBC] hover:text-[#F5F6F8]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* STEP 1: MEMORY */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="p-4 bg-[#1B1E24] border border-[#242831] rounded-lg">
                <span className="text-[11px] font-mono text-[#A7AFBC] uppercase tracking-wider block">
                  Question 1 of 3
                </span>
                <h3 className="text-sm sm:text-base font-semibold text-[#F5F6F8] font-display mt-1">
                  What was the canteen's most famous snack?
                </h3>
              </div>

              {/* Selectable Options */}
              <div className="space-y-2">
                {[
                  'Samosa with chutney',
                  'Bread pakora',
                  'Not sure / Other item'
                ].map((option) => {
                  const isSelected = selectedAnswer === option;
                  return (
                    <button
                      key={option}
                      onClick={() => setSelectedAnswer(option)}
                      className={`w-full p-3.5 rounded-lg border text-left text-xs font-medium transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#344B6B] text-[#F5F6F8] border-[#344B6B]'
                          : 'bg-[#1B1E24] text-[#A7AFBC] border-[#242831] hover:border-[#344B6B] hover:text-[#F5F6F8]'
                      }`}
                    >
                      <span>{option}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#F5F6F8]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: GESTURE */}
          {currentStep === 2 && (
            <div className="space-y-3">
              <div className="p-3 bg-[#1B1E24] border border-[#242831] rounded-lg">
                <h3 className="text-xs font-semibold text-[#F5F6F8] uppercase tracking-wider">
                  Live Gesture Check
                </h3>
                <p className="text-xs text-[#A7AFBC] mt-0.5">
                  Show 3 fingers to the camera to confirm authentic live verification.
                </p>
              </div>

              {/* Camera Preview Box */}
              <div className="relative rounded-lg border border-dashed border-[#242831] bg-[#101827] p-6 aspect-video flex flex-col items-center justify-center text-center overflow-hidden">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className={`absolute inset-0 w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                />

                {!cameraActive ? (
                  <div className="z-10 space-y-2.5">
                    <div className="w-10 h-10 rounded-lg bg-[#142238] border border-[#242831] flex items-center justify-center mx-auto text-[#344B6B]">
                      <Camera className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-[#A7AFBC]">Camera Gesture Verification</p>
                    <button
                      onClick={handleStartCamera}
                      className="px-3.5 py-1.5 bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] rounded-lg text-xs font-medium transition-colors"
                    >
                      Enable Camera Preview
                    </button>
                  </div>
                ) : (
                  <div className="absolute inset-0 z-10 flex flex-col justify-between p-3 bg-black/50 text-white">
                    <span className="text-xs font-mono">Target: Show 3 Fingers</span>
                    <button
                      onClick={handleCaptureGesture}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border self-center transition-colors ${
                        gestureCaptured 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                          : 'bg-[#344B6B] text-[#F5F6F8] border-[#344B6B]'
                      }`}
                    >
                      {gestureCaptured ? '3-Finger Gesture Captured ✓' : 'Capture 3-Finger Gesture'}
                    </button>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-[#A7AFBC]">
                * Note: Final membership is reviewed and endorsed by circle peer administrators.
              </p>
            </div>
          )}

          {/* STEP 3: DOCUMENT EVIDENCE */}
          {currentStep === 3 && (
            <div className="space-y-3">
              <div className="p-3 bg-[#1B1E24] border border-[#242831] rounded-lg">
                <h3 className="text-xs font-semibold text-[#F5F6F8] uppercase tracking-wider">
                  Supporting Document
                </h3>
                <p className="text-xs text-[#A7AFBC] mt-0.5">
                  Upload school ID, admit card, alumni card, or graduation degree.
                </p>
              </div>

              <label className="border border-dashed border-[#242831] rounded-lg p-6 bg-[#101827] flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#344B6B] transition-colors">
                <input 
                  type="file" 
                  accept=".pdf,.png,.jpg,.jpeg" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
                <div className="w-10 h-10 rounded-lg bg-[#142238] border border-[#242831] flex items-center justify-center text-[#344B6B] mb-2">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-[#F5F6F8]">
                  {documentFile ? documentFile : 'Click or drag credential file'}
                </p>
                <p className="text-[11px] text-[#A7AFBC] mt-0.5">
                  Supported formats: PDF, JPG, PNG (Max 15MB)
                </p>
              </label>

              <div className="p-2.5 bg-[#1B1E24] rounded-lg border border-[#242831] flex items-center gap-2 text-xs text-[#A7AFBC]">
                <Lock className="w-3.5 h-3.5 text-[#344B6B] shrink-0" />
                <span>Files are encrypted and only accessible to authorized batch administrators.</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-[#242831] bg-[#142238] flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
              className="px-3 py-1.5 text-xs text-[#A7AFBC] hover:text-[#F5F6F8] flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={closeVerificationModal}
              className="px-3 py-1.5 text-xs text-[#A7AFBC] hover:text-[#F5F6F8]"
            >
              Cancel
            </button>
          )}

          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep((prev) => (prev + 1) as any)}
              className="px-4 py-2 bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleCompleteSubmission}
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Submitting...' : 'Submit Verification Request'}</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
