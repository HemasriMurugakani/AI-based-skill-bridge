import React, { useState, useMemo } from 'react';
import { Calendar, Clock, Award, Sparkles, Flame, CheckCircle2 } from 'lucide-react';

export interface HeatmapDayRecord {
  date: string;
  dayOfWeek: number; // 0 (Sun) to 6 (Sat)
  weekIndex: number; // 0 to 15
  level: 0 | 1 | 2 | 3 | 4; // 5-level scale (0 = empty neutral)
  minutesSpent: number;
  xpEarned: number;
  taskTitle: string;
  proofType?: 'code' | 'photo_qc' | 'viva' | 'practice';
}

interface PracticeHeatmapProps {
  days?: HeatmapDayRecord[];
  streakDays?: number;
  isTamil?: boolean;
  onSelectDay?: (day: HeatmapDayRecord) => void;
  showCardWrapper?: boolean;
}

export const PracticeHeatmap: React.FC<PracticeHeatmapProps> = ({
  days,
  streakDays = 18,
  isTamil = false,
  onSelectDay,
  showCardWrapper = true,
}) => {
  const dayOfWeekLabels = isTamil
    ? ['ஞா', 'தி', 'செ', 'பு', 'வி', 'வெ', 'ச']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Default generation if days not provided
  const heatmapDays = useMemo(() => {
    if (days && days.length > 0) return days;
    
    // Generate realistic 16-week (112 days) dataset
    const generated: HeatmapDayRecord[] = [];
    const today = new Date();
    const totalDays = 112; // 16 weeks * 7 days

    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay();
      const weekIndex = Math.floor((totalDays - 1 - i) / 7);

      // Consistent practice in recent 35 days, with occasional rest days
      const isRecent = i <= 35;
      const isRestDay = isRecent ? i % 9 === 0 : i % 3 === 0;

      let level: 0 | 1 | 2 | 3 | 4 = 0;
      let minutesSpent = 0;
      let xpEarned = 0;
      let taskTitle = isTamil ? 'ஓய்வு நாள் / பயிற்சி பதிவு இல்லை' : 'Rest day / No deliberate practice recorded';
      let proofType: 'code' | 'photo_qc' | 'viva' | 'practice' | undefined = undefined;

      if (!isRestDay) {
        if (i % 8 === 0) {
          level = 4;
          minutesSpent = 80;
          xpEarned = 160;
          taskTitle = isTamil
            ? 'அணுகல்தன்மை சுயவிவரம் மற்றும் வாய்மொழி விளக்கம் (92%)'
            : 'Submitted Accessible Profile Page & Viva Voce (Score 92%)';
          proofType = 'code';
        } else if (i % 4 === 0) {
          level = 3;
          minutesSpent = 60;
          xpEarned = 100;
          taskTitle = isTamil
            ? 'DOM வணிக கூடை நிகழ்வு பரிமாற்ற சவால்'
            : 'Interactive DOM Shopping Cart with Event Delegation';
          proofType = 'code';
        } else if (i % 2 === 0) {
          level = 2;
          minutesSpent = 35;
          xpEarned = 50;
          taskTitle = isTamil
            ? 'நெகிழ்வான CSS வடிவமைப்பு & 320px திரை சோதனை'
            : 'Responsive CSS clamp() Fluid Layout & 320px Check';
          proofType = 'practice';
        } else {
          level = 1;
          minutesSpent = 15;
          xpEarned = 25;
          taskTitle = isTamil
            ? '15-நிமிட விசைப்பலகை வழிசெலுத்தல் பயிற்சி'
            : '15-min practice: Semantic HTML landmarks & WCAG skip-link';
          proofType = 'practice';
        }
      }

      generated.push({
        date: dateStr,
        dayOfWeek,
        weekIndex,
        level,
        minutesSpent,
        xpEarned,
        taskTitle,
        proofType,
      });
    }

    return generated;
  }, [days, isTamil]);

  const [selectedDay, setSelectedDay] = useState<HeatmapDayRecord | null>(
    heatmapDays[heatmapDays.length - 1] || null
  );
  const [hoveredDay, setHoveredDay] = useState<HeatmapDayRecord | null>(null);

  const handleCellClick = (day: HeatmapDayRecord) => {
    setSelectedDay(day);
    if (onSelectDay) onSelectDay(day);
  };

  // Color classes for 5-level scale (0 = empty neutral)
  const getCellColorClass = (level: number, isSelected: boolean) => {
    let base = 'bg-[#E2E8F0] dark:bg-slate-800 border-[#CBD5E1] dark:border-slate-700';
    if (level === 1) base = 'bg-[#BAE6FD] dark:bg-[#0369A1]/40 border-[#7DD3FC] dark:border-[#0284C7]';
    if (level === 2) base = 'bg-[#7DD3FC] dark:bg-[#0284C7]/60 border-[#38BDF8] dark:border-[#38BDF8]';
    if (level === 3) base = 'bg-[#62B6E8] dark:bg-[#0284C7] border-[#38BDF8] dark:border-[#62B6E8]';
    if (level === 4) base = 'bg-[#173B67] dark:bg-[#62B6E8] border-[#0F2035] dark:border-sky-300 shadow-soft';

    if (isSelected) {
      return `${base} ring-2 ring-[#F2B66D] ring-offset-1 z-10 scale-110`;
    }
    return base;
  };

  const totalActiveDays = heatmapDays.filter(d => d.level > 0).length;
  const totalMinutes = heatmapDays.reduce((acc, d) => acc + d.minutesSpent, 0);

  // Empty state check
  const isEmpty = heatmapDays.length === 0 || totalActiveDays === 0;

  const content = (
    <div className="space-y-4">
      {/* Top Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#62B6E8]" />
            <h3 className="text-sm sm:text-base font-bold text-[#173B67] dark:text-white">
              {isTamil ? '16-வார பயிற்சி & சான்றுகள் வரைபடம்' : '16-Week Practice & Proof Heatmap'}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF5FC] text-[#173B67] border border-[#BAE6FD]">
              7 × 16 Grid
            </span>
          </div>
          <p className="text-xs text-[#526174] dark:text-slate-400">
            {isTamil
              ? `${totalActiveDays} நாட்கள் பயிற்சி • மொத்தம் ${Math.round(totalMinutes / 60)} மணிநேரம்`
              : `${totalActiveDays} active days logged • ${Math.round(totalMinutes / 60)} deliberate practice hours`}
          </p>
        </div>

        {/* 5-Level Color Scale Legend */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#526174] bg-[#F8FAFC] dark:bg-slate-900 px-3 py-1 rounded-full border border-[#E2E8F0] dark:border-slate-800 shrink-0">
          <span className="text-[10px] mr-0.5">{isTamil ? 'ஓய்வு' : 'Rest'}</span>
          <span title="Level 0: Empty Neutral" className="w-[14px] h-[14px] rounded-xs bg-[#E2E8F0] dark:bg-slate-800 border border-[#CBD5E1] inline-block" />
          <span title="Level 1: 15m Light Practice" className="w-[14px] h-[14px] rounded-xs bg-[#BAE6FD] border border-[#7DD3FC] inline-block" />
          <span title="Level 2: 35m Challenge" className="w-[14px] h-[14px] rounded-xs bg-[#7DD3FC] border border-[#38BDF8] inline-block" />
          <span title="Level 3: 60m Multi-File" className="w-[14px] h-[14px] rounded-xs bg-[#62B6E8] border-[#38BDF8] inline-block" />
          <span title="Level 4: 80m Deep Proof & Viva" className="w-[14px] h-[14px] rounded-xs bg-[#173B67] border-[#0F2035] inline-block" />
          <span className="text-[10px] ml-0.5">{isTamil ? 'ஆழமான சான்று' : 'Deep Proof'}</span>
        </div>
      </div>

      {isEmpty ? (
        <div className="p-8 rounded-card bg-white dark:bg-[#0F2035] border border-dashed border-[#E2E8F0] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#EAF5FC] flex items-center justify-center mx-auto text-[#62B6E8]">
            <Flame className="w-6 h-6 text-[#F2B66D]" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#173B67] dark:text-white">
              {isTamil ? 'பயிற்சி பதிவுகள் இன்னும் இல்லை' : 'No deliberate practice recorded yet'}
            </h4>
            <p className="text-xs text-[#526174] dark:text-slate-400 max-w-sm mx-auto mt-1">
              {isTamil
                ? 'உங்கள் முதல் 15-நிமிட சவாலை முடித்து 16-வார வரைபடத்தை நிரப்பத் தொடங்குங்கள்.'
                : 'Complete your first 15-minute challenge or viva to begin filling your 16-week consistency grid.'}
            </p>
          </div>
        </div>
      ) : (
        /* Heatmap Scroll Container */
        <div className="overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
          <div className="min-w-max flex gap-2 pt-1 pb-1">
            {/* Day of Week Labels (7 Rows) */}
            <div className="flex flex-col justify-between py-0.5 text-[9px] font-semibold text-[#526174] w-6 text-right pr-1 select-none">
              {dayOfWeekLabels.map((day, idx) => (
                <div key={idx} className="h-[14px] flex items-center justify-end leading-none">
                  {idx % 2 === 1 ? day : ''}
                </div>
              ))}
            </div>

            {/* 16 Week Columns (Each has 7 Day Cells) */}
            <div className="flex gap-[3px]">
              {Array.from({ length: 16 }).map((_, weekIdx) => {
                const daysInWeek = heatmapDays.filter(d => d.weekIndex === weekIdx);

                return (
                  <div key={weekIdx} className="flex flex-col gap-[3px]">
                    {/* Week Header */}
                    <div className="text-[8px] text-center text-[#526174] font-mono leading-none pb-0.5">
                      W{weekIdx + 1}
                    </div>

                    {/* 7 Day Cells */}
                    {Array.from({ length: 7 }).map((_, dayOfWeekIdx) => {
                      const day = daysInWeek.find(d => d.dayOfWeek === dayOfWeekIdx);
                      if (!day) {
                        return (
                          <div
                            key={dayOfWeekIdx}
                            className="w-[14px] h-[14px] min-w-[14px] min-h-[14px] rounded-xs bg-[#E2E8F0]/40 dark:bg-slate-800/40"
                          />
                        );
                      }

                      const isSelected = selectedDay?.date === day.date;
                      const tooltipText = `${day.date}: ${day.minutesSpent} mins · ${day.taskTitle}`;

                      return (
                        <button
                          key={dayOfWeekIdx}
                          type="button"
                          onClick={() => handleCellClick(day)}
                          onMouseEnter={() => setHoveredDay(day)}
                          onMouseLeave={() => setHoveredDay(null)}
                          title={tooltipText}
                          aria-label={tooltipText}
                          className={`w-[14px] h-[14px] min-w-[14px] min-h-[14px] rounded-xs border transition-all duration-150 cursor-pointer focus:outline-none hover:scale-125 hover:z-20 ${getCellColorClass(
                            day.level,
                            isSelected
                          )}`}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Hover / Active Day Tooltip & Inspection Strip */}
      {(hoveredDay || selectedDay) && (
        <div className="p-3 sm:p-3.5 rounded-btn bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-soft">
          {(() => {
            const active = hoveredDay || selectedDay!;
            return (
              <>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex items-center gap-1 font-mono font-bold text-[#173B67] dark:text-[#62B6E8] text-xs">
                    <Clock className="w-3.5 h-3.5 text-[#62B6E8]" />
                    <span>{active.date}</span>
                  </div>
                  <span className="text-[#E2E8F0]">•</span>
                  <div className="truncate text-[#173B67] dark:text-white font-medium">
                    {active.taskTitle}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                    {active.minutesSpent} {isTamil ? 'நிமிடம்' : 'mins'}
                  </span>
                  {active.xpEarned > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
                      +{active.xpEarned} XP
                    </span>
                  )}
                  {active.proofType && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF5FC] text-[#173B67] border border-[#BAE6FD]">
                      ✓ {active.proofType === 'code' ? 'Code Proof' : active.proofType === 'viva' ? 'Oral Viva' : 'Practice'}
                    </span>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );

  if (!showCardWrapper) {
    return content;
  }

  return (
    <section className="p-5 sm:p-6 rounded-card bg-white dark:bg-[#0F2035] border border-[#E2E8F0] dark:border-slate-800 shadow-soft">
      {content}
    </section>
  );
};
