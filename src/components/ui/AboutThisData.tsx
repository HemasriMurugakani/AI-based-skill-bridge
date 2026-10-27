import React, { useState, useRef, useEffect } from 'react';
import { Info, X, ShieldCheck } from 'lucide-react';

export interface AboutThisDataProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export const AboutThisData: React.FC<AboutThisDataProps> = ({
  title = 'About this data',
  description,
  children,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`relative inline-flex items-center ${className}`} ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={title}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-poppins font-medium text-[#173B67] bg-[#EAF5FC] hover:bg-[#D9EFFB] border border-[#BAE6FD] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62B6E8]"
      >
        <Info className="w-3.5 h-3.5 text-[#62B6E8] shrink-0" />
        <span>{title}</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label={title}
          className="absolute z-50 top-full mt-2 right-0 sm:right-auto sm:left-0 w-80 max-w-[90vw] p-4 rounded-card bg-white border border-[#E2E8F0] shadow-soft text-left animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-1.5 text-xs font-bold font-poppins text-[#173B67]">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>{title}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-[#526174] hover:text-[#173B67] hover:bg-[#F1F5F9] cursor-pointer"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-xs text-[#526174] font-poppins leading-relaxed space-y-2">
            {description && <p>{description}</p>}
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
