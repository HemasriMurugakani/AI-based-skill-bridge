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
    let base = 'bg-parchment-200 dark:bg-night-200 border-warm-border/50 dark:border-night-border/40';
    if (level === 1) base = 'bg-forest-200 dark:bg-forest-900/70 border-forest-300 dark:border-forest-800';
    if (level === 2) base = 'bg-forest-300 dark:bg-forest-700/80 border-forest-400 dark:border-forest-600';
    if (level === 3) base = 'bg-forest-500 dark:bg-forest-500 border-forest-600 dark:border-forest-400';
    if (level === 4) base = 'bg-forest-700 dark:bg-forest-400 border-forest-800 dark:border-forest-300 shadow-xs';

    if (isSelected) {
      return `${base} ring-2 ring-gold-500 ring-offset-1 z-10 scale-110`;
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
            <Calendar className="w-4 h-4 text-forest-600 dark:text-forest-400" />
            <h3 className="text-sm sm:text-base font-bold font-heritage text-warm-ink dark:text-night-ink">
              {isTamil ? '16-வார பயிற்சி & சான்றுகள் வரைபடம்' : '16-Week Practice & Proof Heatmap'}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 border border-forest-300 dark:border-forest-800">
              7 × 16 Grid
            </span>
          </div>
          <p className="text-xs text-warm-muted dark:text-night-muted">
            {isTamil
              ? `${totalActiveDays} நாட்கள் பயிற்சி • மொத்தம் ${Math.round(totalMinutes / 60)} மணிநேரம்`
              : `${totalActiveDays} active days logged • ${Math.round(totalMinutes / 60)} deliberate practice hours`}
          </p>
        </div>

        {/* 5-Level Color Scale Legend */}
        <div className="flex items-center gap-1.5 text-[11px] text-warm-muted dark:text-night-muted bg-white/70 dark:bg-night-100/70 px-3 py-1 rounded-full border border-warm-border/80 dark:border-night-border/80 shrink-0">
          <span className="text-[10px] mr-0.5">{isTamil ? 'ஓய்வு' : 'Rest'}</span>
          <span title="Level 0: Empty Neutral" className="w-[14px] h-[14px] rounded-xs bg-parchment-200 dark:bg-night-200 border border-warm-border/50 dark:border-night-border/40 inline-block" />
          <span title="Level 1: 15m Light Practice" className="w-[14px] h-[14px] rounded-xs bg-forest-200 dark:bg-forest-900/70 border border-forest-300 inline-block" />
          <span title="Level 2: 35m Challenge" className="w-[14px] h-[14px] rounded-xs bg-forest-300 dark:bg-forest-700/80 border border-forest-400 inline-block" />
          <span title="Level 3: 60m Multi-File" className="w-[14px] h-[14px] rounded-xs bg-forest-500 dark:bg-forest-500 border border-forest-600 inline-block" />
          <span title="Level 4: 80m Deep Proof & Viva" className="w-[14px] h-[14px] rounded-xs bg-forest-700 dark:bg-forest-400 border border-forest-800 inline-block" />
          <span className="text-[10px] ml-0.5">{isTamil ? 'ஆழமான சான்று' : 'Deep Proof'}</span>
        </div>
      </div>

      {isEmpty ? (
        <div className="p-8 rounded-2xl bg-white dark:bg-night-card border border-dashed border-warm-border text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-parchment-200 dark:bg-night-100 flex items-center justify-center mx-auto text-warm-muted">
            <Flame className="w-6 h-6 text-terracotta-500" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-warm-ink dark:text-night-ink">
              {isTamil ? 'பயிற்சி பதிவுகள் இன்னும் இல்லை' : 'No deliberate practice recorded yet'}
            </h4>
            <p className="text-xs text-warm-muted dark:text-night-muted max-w-sm mx-auto mt-1">
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
            <div className="flex flex-col justify-between py-0.5 text-[9px] font-semibold text-warm-muted dark:text-night-muted w-6 text-right pr-1 select-none">
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
                    <div className="text-[8px] text-center text-warm-muted/70 dark:text-night-muted/70 font-mono leading-none pb-0.5">
                      W{weekIdx + 1}
                    </div>

                    {/* 7 Day Cells */}
                    {Array.from({ length: 7 }).map((_, dayOfWeekIdx) => {
                      const day = daysInWeek.find(d => d.dayOfWeek === dayOfWeekIdx);
                      if (!day) {
                        return (
                          <div
                            key={dayOfWeekIdx}
                            className="w-[14px] h-[14px] min-w-[14px] min-h-[14px] rounded-xs bg-parchment-200/40 dark:bg-night-200/30"
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
        <div className="p-3 sm:p-3.5 rounded-xl bg-white/90 dark:bg-night-100/90 border border-warm-border/80 dark:border-night-border/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-warm-xs">
          {(() => {
            const active = hoveredDay || selectedDay!;
            return (
              <>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex items-center gap-1 font-mono font-bold text-maroon-800 dark:text-gold-300 text-xs">
                    <Clock className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
                    <span>{active.date}</span>
                  </div>
                  <span className="text-warm-border">•</span>
                  <div className="truncate text-warm-ink dark:text-night-ink font-medium">
                    {active.taskTitle}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-forest-100 dark:bg-forest-950/80 text-forest-800 dark:text-forest-300 border border-forest-300 dark:border-forest-800">
                    {active.minutesSpent} {isTamil ? 'நிமிடம்' : 'mins'}
                  </span>
                  {active.xpEarned > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-100 dark:bg-gold-950/80 text-gold-900 dark:text-gold-300 border border-gold-300 dark:border-gold-800">
                      +{active.xpEarned} XP
                    </span>
                  )}
                  {active.proofType && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-maroon-100 dark:bg-maroon-950/80 text-maroon-800 dark:text-gold-400 border border-maroon-200 dark:border-maroon-800">
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
    <section className="p-5 sm:p-6 rounded-card-lg bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-sm">
      {content}
    </section>
  );
};
