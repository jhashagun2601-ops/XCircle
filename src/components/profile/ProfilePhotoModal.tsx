import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  Camera, 
  Upload, 
  X, 
  Check, 
  RotateCcw, 
  AlertCircle, 
  Image as ImageIcon, 
  ShieldCheck,
  Trash2 
} from 'lucide-react';

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfilePhotoModal: React.FC<ProfilePhotoModalProps> = ({ isOpen, onClose }) => {
  const { updateProfilePhoto, profile, user } = useAuth();
  const { updateCurrentUser, showToast } = useApp();

  const [mode, setMode] = useState<'camera' | 'upload'>('upload');
  
  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  // Upload state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  // Cleanup camera stream
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // When modal closes, stop camera
  const handleClose = () => {
    stopCameraStream();
    setCapturedPhoto(null);
    setUploadedPhoto(null);
    setCameraError(null);
    setUploadError(null);
    onClose();
  };

  // Switch to Camera Mode and initialize stream
  const startCamera = async () => {
    setCameraError(null);
    setCapturedPhoto(null);

    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraError('Camera access is not supported by your browser or environment. Please use the Upload option.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera error:', err);
      let msg = 'Could not access device camera. Please check camera permissions in your browser or switch to file upload.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera permission was denied. Please allow camera access in your browser settings or use the file upload option.';
      } else if (err.name === 'NotFoundError') {
        msg = 'No camera device detected on your hardware. Please use the upload option.';
      }
      setCameraError(msg);
      setCameraActive(false);
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const size = Math.min(video.videoWidth || 480, video.videoHeight || 480);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Center crop to square
    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;

    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedPhoto(dataUrl);
    stopCameraStream();
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  // Upload File handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB limit. Please choose a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedPhoto(result);
    };
    reader.onerror = () => {
      setUploadError('Could not read the selected image file.');
    };
    reader.readAsDataURL(file);
  };

  // Save selected photo
  const handleConfirmAndSave = async () => {
    const photoToSave = mode === 'camera' ? capturedPhoto : uploadedPhoto;
    if (!photoToSave) return;

    setIsSaving(true);
    try {
      await updateProfilePhoto(photoToSave);
      updateCurrentUser({ avatar: photoToSave });
      showToast('Profile photo updated successfully!');
      handleClose();
    } catch (err: any) {
      setUploadError(err.message || 'Failed to save profile photo.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const currentPreview = mode === 'camera' ? capturedPhoto : uploadedPhoto;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#142238] border border-[#242831] rounded-xl p-5 sm:p-6 max-w-md w-full shadow-2xl relative space-y-4">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 text-[#A7AFBC] hover:text-[#F5F6F8] rounded-lg border border-[#242831] bg-[#1B1E24] transition-colors"
          title="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#344B6B]/20 text-[#A7AFBC] text-[11px] font-mono uppercase tracking-wider mb-1.5 border border-[#344B6B]/30">
            <Camera className="w-3 h-3 text-[#344B6B]" />
            Profile Photography
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-display text-[#F5F6F8]">
            Update Profile Photo
          </h2>
          <p className="text-xs text-[#A7AFBC] mt-0.5">
            Capture a live picture using your camera or upload an image from your device.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#1B1E24] rounded-lg border border-[#242831]">
          <button
            type="button"
            onClick={() => {
              setMode('camera');
              startCamera();
            }}
            className={`py-2 px-3 rounded-md text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
              mode === 'camera'
                ? 'bg-[#344B6B] text-[#F5F6F8] shadow-sm'
                : 'text-[#A7AFBC] hover:text-[#F5F6F8]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Option 1: Take Photo</span>
          </button>

          <button
            type="button"
            onClick={() => {
              stopCameraStream();
              setMode('upload');
            }}
            className={`py-2 px-3 rounded-md text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
              mode === 'upload'
                ? 'bg-[#344B6B] text-[#F5F6F8] shadow-sm'
                : 'text-[#A7AFBC] hover:text-[#F5F6F8]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Option 2: Upload Photo</span>
          </button>
        </div>

        {/* Hidden Canvas for Frame Capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* =========================================================================
            OPTION 1: CAMERA CAPTURE
            ========================================================================= */}
        {mode === 'camera' && (
          <div className="space-y-3">
            {cameraError && (
              <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 space-y-2">
                <div className="flex items-center gap-2 font-medium text-rose-200">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Camera Notice</span>
                </div>
                <p className="text-[11px] leading-relaxed">{cameraError}</p>
                <button
                  type="button"
                  onClick={() => setMode('upload')}
                  className="px-3 py-1.5 rounded-md bg-[#242831] hover:bg-[#344B6B]/40 text-[#F5F6F8] text-xs font-medium border border-[#344B6B]/40 transition-colors"
                >
                  Switch to Upload Photo
                </button>
              </div>
            )}

            {!capturedPhoto ? (
              <div className="relative aspect-square max-h-72 mx-auto rounded-xl overflow-hidden bg-[#1B1E24] border border-[#242831] flex items-center justify-center">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  autoPlay
                  className="w-full h-full object-cover"
                />
                {!cameraActive && !cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-xs text-[#A7AFBC] p-4 text-center">
                    <Camera className="w-8 h-8 text-[#344B6B] animate-pulse" />
                    <span>Connecting camera feed...</span>
                  </div>
                )}
                {cameraActive && (
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                    <button
                      type="button"
                      onClick={handleCapturePhoto}
                      className="px-4 py-2 rounded-full bg-[#344B6B] hover:bg-[#3d587c] text-white text-xs font-semibold shadow-xl border border-white/20 flex items-center gap-2 transition-transform active:scale-95"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Capture Photo</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative aspect-square max-h-72 mx-auto rounded-xl overflow-hidden bg-[#1B1E24] border border-[#242831]">
                  <img
                    src={capturedPhoto}
                    alt="Captured portrait preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-[#101827]/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                    Preview Ready
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="px-3.5 py-2 rounded-lg bg-[#1B1E24] text-[#A7AFBC] hover:text-[#F5F6F8] border border-[#242831] text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAndSave}
                    disabled={isSaving}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-lg"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Saving...' : 'Confirm & Save Photo'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            OPTION 2: UPLOAD PHOTO
            ========================================================================= */}
        {mode === 'upload' && (
          <div className="space-y-3">
            {uploadError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed text-[11px]">{uploadError}</div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {!uploadedPhoto ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square max-h-64 mx-auto rounded-xl border-2 border-dashed border-[#242831] hover:border-[#344B6B] bg-[#1B1E24]/60 hover:bg-[#1B1E24] transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 p-6 text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#142238] border border-[#242831] flex items-center justify-center text-[#344B6B] group-hover:text-[#F5F6F8] transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#F5F6F8]">
                    Click to select a photo from your device
                  </p>
                  <p className="text-[11px] text-[#A7AFBC] mt-0.5 font-mono">
                    JPEG, PNG, WebP up to 5MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative aspect-square max-h-72 mx-auto rounded-xl overflow-hidden bg-[#1B1E24] border border-[#242831]">
                  <img
                    src={uploadedPhoto}
                    alt="Uploaded preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-[#101827]/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                    Preview Ready
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-lg bg-[#1B1E24] text-[#A7AFBC] hover:text-[#F5F6F8] border border-[#242831] text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Change File</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadedPhoto(null)}
                    className="p-2 rounded-lg bg-[#1B1E24] text-rose-400 hover:bg-rose-500/10 border border-[#242831] transition-colors"
                    title="Remove selected image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAndSave}
                    disabled={isSaving}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-lg"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Saving...' : 'Confirm & Save Photo'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Privacy Note */}
        <div className="pt-2 border-t border-[#242831] flex items-center justify-between text-[11px] text-[#A7AFBC]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#344B6B]" />
            <span>Persisted to verified alumni profile</span>
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="text-xs text-[#A7AFBC] hover:text-[#F5F6F8]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
