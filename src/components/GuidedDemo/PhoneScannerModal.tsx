import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import {
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  X,
  Sparkles,
  Camera,
  Wifi,
  Battery,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PhoneScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  personaName: string;
  personaTamilName: string;
  personaAvatar: string;
  location: string;
  pathwayTitle: string;
  credentialId: string;
  verifyUrl: string;
}

export const PhoneScannerModal: React.FC<PhoneScannerModalProps> = ({
  isOpen,
  onClose,
  personaName,
  personaTamilName,
  personaAvatar,
  location,
  pathwayTitle,
  credentialId,
  verifyUrl
}) => {
  const { i18n } = useTranslation();
  const isTa = i18n.language === 'ta';
  const [scanState, setScanState] = useState<'aiming' | 'scanned' | 'loaded'>('aiming');

  useEffect(() => {
    if (!isOpen) {
      setScanState('aiming');
      return;
    }

    // Step 1: Aiming laser sweeps across QR code for 1.2s
    const scanTimer = setTimeout(() => {
      setScanState('scanned');

      // Trigger celebratory chime/confetti on phone scan
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.5 },
        colors: ['#173B67', '#62B6E8', '#F2B66D', '#FFFFFF']
      });

      // Step 2: Opens verified mobile credential card
      const loadTimer = setTimeout(() => {
        setScanState('loaded');
      }, 700);

      return () => clearTimeout(loadTimer);
    }, 1200);

    return () => clearTimeout(scanTimer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300">
      {/* Container with interactive simulated smartphone */}
      <div className="relative max-w-sm w-full bg-slate-900 text-white rounded-[44px] p-3.5 shadow-2xl border-4 border-slate-700 ring-8 ring-black/40 overflow-hidden">
        {/* Dynamic Island / Top Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 mr-2" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500/70" />
        </div>

        {/* Smartphone Screen Viewport */}
        <div className="relative bg-[#EAF5FC] text-slate-900 rounded-[34px] overflow-hidden min-h-[520px] flex flex-col font-sans">
          {/* Status Bar */}
          <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold text-slate-700 bg-white/70">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Camera Viewfinder Screen (Scan in progress) */}
          {scanState !== 'loaded' ? (
            <div className="flex-1 bg-black text-white flex flex-col items-center justify-between p-6 relative overflow-hidden">
              <div className="w-full text-center pt-8">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/40">
                  {isTa ? 'மொபைல் கேமரா ஸ்கேனர்' : 'Phone Camera Viewfinder'}
                </span>
                <h3 className="text-sm font-bold text-slate-200 mt-2">
                  {isTa ? 'திறன் கடவுச்சீட்டு QR குறியீட்டை நோக்கி கேமராவைக் காட்டவும்' : 'Point camera at Skill Passport QR'}
                </h3>
              </div>

              {/* Viewfinder Reticle Frame */}
              <div className="relative w-52 h-52 my-auto flex items-center justify-center">
                {/* 4 Corner Markers */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-amber-400 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-amber-400 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-amber-400 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-amber-400 rounded-br-lg" />

                {/* QR Code Graphic being scanned */}
                <div className="p-3 bg-white rounded-xl shadow-lg">
                  <QRCodeSVG value={verifyUrl} size={130} fgColor="#173B67" bgColor="#FFFFFF" />
                </div>

                {/* Moving Green Scanning Laser */}
                {scanState === 'aiming' && (
                  <div className="absolute left-2 right-2 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_15px_#22c55e] animate-pulse" />
                )}

                {scanState === 'scanned' && (
                  <div className="absolute inset-0 bg-green-500/20 backdrop-blur-xs flex items-center justify-center rounded-xl animate-in zoom-in-75 duration-200">
                    <div className="p-3 bg-green-600 text-white rounded-full shadow-lg">
                      <CheckCircle2 className="w-10 h-10 animate-bounce" />
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full text-center pb-4 text-xs text-slate-400">
                {scanState === 'aiming'
                  ? (isTa ? 'QR குறியீடு ஸ்கேன் செய்யப்படுகிறது...' : 'Scanning QR code...')
                  : (isTa ? 'QR சரிபார்க்கப்பட்டது! சான்றிதழ் திறக்கப்படுகிறது...' : 'QR Verified! Opening credential...')}
              </div>
            </div>
          ) : (
            /* Loaded Public Credential Card in Mobile Browser */
            <div className="flex-1 bg-[#F8FAFC] flex flex-col p-4 text-[#173B67] animate-in fade-in duration-300">
              {/* Mobile Browser Header */}
              <div className="p-2 rounded-btn bg-[#EAF5FC] border border-[#BAE6FD] text-[11px] text-[#526174] flex items-center justify-between mb-3">
                <span className="truncate font-mono">skillbridge.tn.gov.in/verify</span>
                <span className="text-[10px] text-[#065F46] font-bold">🔒 TLS 1.3</span>
              </div>

              {/* State Seal & Credential Badge */}
              <div className="text-center p-3 rounded-card bg-white border border-[#E2E8F0] shadow-soft mb-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAF5FC] border border-[#BAE6FD] text-[#173B67] text-[10px] font-bold uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#62B6E8]" />
                  <span>{isTa ? 'சரிபார்க்கப்பட்ட திறன் சான்றிதழ்' : 'Verified Skill Credential'}</span>
                </div>
                <h4 className="text-base font-bold text-[#173B67]">
                  {isTa ? (personaTamilName || personaName) : personaName}
                </h4>
                <div className="text-[10px] text-[#526174]">{location}</div>
              </div>

              {/* Verified Rubric Proof Highlights */}
              <div className="space-y-2 mb-3">
                <div className="p-2.5 rounded-btn bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#065F46]">{isTa ? 'பொறுப்புள்ள வடிவமைப்பு (320px)' : 'Responsive Layouts (320px)'}</div>
                    <div className="text-[10px] text-[#047857]">{isTa ? 'கிடைமட்ட உருளல் இல்லை என்பது சரிபார்க்கப்பட்டது' : 'Zero horizontal scroll verified'}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#10B981] text-white font-bold text-[11px]">
                    94%
                  </span>
                </div>

                <div className="p-2.5 rounded-btn bg-[#EAF5FC] border border-[#BAE6FD] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#173B67]">{isTa ? 'தமிழில் AI குரல் வாய்மொழி தேர்வு' : 'AI Voice Viva in Tamil'}</div>
                    <div className="text-[10px] text-[#526174]">{isTa ? 'நம்பகத்தன்மை: நிலையானது' : 'Authenticity: Consistent'}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#62B6E8] text-[#173B67] font-bold text-[11px]">
                    94%
                  </span>
                </div>

                <div className="p-2.5 rounded-btn bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#92400E]">{isTa ? 'வழிகாட்டி ஒப்புதல்' : 'Mentor Endorsement'}</div>
                    <div className="text-[10px] text-[#B45309]">{isTa ? 'கே. செந்தில் நாதன் (முதன்மை பொறியாளர்)' : 'K. Senthil Nathan (Senior Lead)'}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#F2B66D] text-[#173B67] font-bold text-[10px]">
                    {isTa ? 'கையொப்பமிடப்பட்டது' : 'Signed'}
                  </span>
                </div>
              </div>

              {/* Cryptographic Tamper-Proof Audit Footer */}
              <div className="mt-auto p-2.5 rounded-btn bg-[#EAF5FC] border border-[#BAE6FD] text-[10px] space-y-0.5 font-mono text-[#526174]">
                <div>{isTa ? 'தணிக்கை எண்:' : 'Audit ID:'} {credentialId}</div>
                <div className="truncate">Hash: 0x7a1e84df99c42b012481b</div>
                <div className="text-[#065F46] font-bold">{isTa ? '✓ 100% பாதுகாப்பாக சரிபார்க்கப்பட்டது' : '✓ 100% Cryptographically Verified'}</div>
              </div>
            </div>
          )}

          {/* Smartphone Bottom Home Bar */}
          <div className="py-2.5 flex justify-center bg-slate-900">
            <div className="w-28 h-1 bg-slate-500 rounded-full" />
          </div>
        </div>

        {/* Modal Dismiss / Continue Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Close scanner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
