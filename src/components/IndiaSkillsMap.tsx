import React, { useState } from 'react';
import { Sparkles, MapPin, Award, CheckCircle2, Info } from 'lucide-react';

interface MapNode {
  id: string;
  name: string;
  nameTamil: string;
  x: number; // percentage in SVG viewBox
  y: number;
  liveProofs: number;
  activeLearners: number;
  topSkill: string;
  heritageCraft: string;
  heritageCraftTamil: string;
  heritageCategory: string;
  rubricAvg: number;
}

const mapNodes: MapNode[] = [
  {
    id: 'chennai',
    name: 'Chennai',
    nameTamil: 'சென்னை',
    x: 180,
    y: 200,
    liveProofs: 14200,
    activeLearners: 12450,
    topSkill: 'React & Semantic Accessibility',
    heritageCraft: 'Mylapore Silk Weaving & Bronze Sculpting',
    heritageCraftTamil: 'மயிலாப்பூர் பட்டு & வெண்கல சிற்பக்கலை',
    heritageCategory: 'Classical Metal & Silk',
    rubricAvg: 88
  },
  {
    id: 'kanchipuram',
    name: 'Kanchipuram',
    nameTamil: 'காஞ்சிபுரம்',
    x: 165,
    y: 215,
    liveProofs: 6840,
    activeLearners: 4200,
    topSkill: 'Jacquard Loom Drafting & Warp Sizing',
    heritageCraft: 'Kanchipuram Silk Saree Weaving (GI Tag)',
    heritageCraftTamil: 'காஞ்சிபுரம் பட்டுப் புடவை நெசவு',
    heritageCategory: 'Heritage Handloom',
    rubricAvg: 93
  },
  {
    id: 'salem',
    name: 'Salem',
    nameTamil: 'சேலம்',
    x: 125,
    y: 250,
    liveProofs: 8940,
    activeLearners: 4820,
    topSkill: 'Blouse Stitching & Solar Wiring',
    heritageCraft: 'Salem Venpattu Silk & Silver Anklet Craft',
    heritageCraftTamil: 'சேலம் வெண்பட்டு & வெள்ளி கொலுசு',
    heritageCategory: 'Textiles & Metallurgy',
    rubricAvg: 86
  },
  {
    id: 'coimbatore',
    name: 'Coimbatore',
    nameTamil: 'கோயம்புத்தூர்',
    x: 95,
    y: 285,
    liveProofs: 11800,
    activeLearners: 8920,
    topSkill: 'Industrial Machine Operation & Frontend',
    heritageCraft: 'Wet Grinder Engineering & Kovai Kora Cotton',
    heritageCraftTamil: 'கோவைக் கோரா பருத்தி & இயந்திரவியல்',
    heritageCategory: 'Light Engineering & Weaving',
    rubricAvg: 89
  },
  {
    id: 'tiruppur',
    name: 'Tiruppur',
    nameTamil: 'திருப்பூர்',
    x: 115,
    y: 290,
    liveProofs: 13400,
    activeLearners: 7430,
    topSkill: 'Pattern Cutting & Bias Neckline Piping',
    heritageCraft: 'Tiruppur Knitwear & Garment Construction',
    heritageCraftTamil: 'பின்னலாடை & ஆடை வடிவமைப்பு',
    heritageCategory: 'Apparel Craft',
    rubricAvg: 91
  },
  {
    id: 'trichy',
    name: 'Tiruchirappalli',
    nameTamil: 'திருச்சிராப்பள்ளி',
    x: 150,
    y: 280,
    liveProofs: 7600,
    activeLearners: 5910,
    topSkill: 'JavaScript DOM & MIS Reporting',
    heritageCraft: 'Manachanallur Handloom & Tanjore Painting',
    heritageCraftTamil: 'தஞ்சாவூர் ஓவியம் & கைத்தறி',
    heritageCategory: 'Classical Arts',
    rubricAvg: 87
  },
  {
    id: 'thanjavur',
    name: 'Thanjavur & Swamimalai',
    nameTamil: 'தஞ்சாவூர் & சுவாமிமலை',
    x: 175,
    y: 275,
    liveProofs: 5400,
    activeLearners: 3800,
    topSkill: 'Bronze Lost-Wax Casting & Wood Carving',
    heritageCraft: 'Swamimalai Bronze Icon & Thanjavur Art Plates',
    heritageCraftTamil: 'சுவாமிமலை வெண்கலச் சிலை & கலைத்தட்டு',
    heritageCategory: 'Master Artisan Craft',
    rubricAvg: 95
  },
  {
    id: 'madurai',
    name: 'Madurai',
    nameTamil: 'மதுரை',
    x: 135,
    y: 335,
    liveProofs: 9200,
    activeLearners: 6840,
    topSkill: 'Domestic Wiring & Katori Blouse Drafting',
    heritageCraft: 'Madurai Sungudi Tie-Dye & Brass Lamps',
    heritageCraftTamil: 'மதுரை சுங்குடிச் சேலை & பித்தளை விளக்கு',
    heritageCategory: 'Traditional Tie-Dye',
    rubricAvg: 90
  },
  {
    id: 'tirunelveli',
    name: 'Tirunelveli',
    nameTamil: 'திருநெல்வேலி',
    x: 120,
    y: 390,
    liveProofs: 4800,
    activeLearners: 3950,
    topSkill: 'Wind Substation Maintenance & Palmyra Weaving',
    heritageCraft: 'Pattamadai Korai Silk Grass Mat Weaving',
    heritageCraftTamil: 'பத்தமடை பாய் நெசவு (GI Tag)',
    heritageCategory: 'Eco-Fiber Craft',
    rubricAvg: 92
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru Corridor',
    nameTamil: 'பெங்களூரு வழித்தடம்',
    x: 110,
    y: 160,
    liveProofs: 8900,
    activeLearners: 7100,
    topSkill: 'Fullstack TypeScript & Cloud API',
    heritageCraft: 'Channapatna Lacquerware Woodcraft',
    heritageCraftTamil: 'சென்னபட்டணா மர பொம்மை கைவினை',
    heritageCategory: 'Turned Wood Craft',
    rubricAvg: 88
  }
];

export const IndiaSkillsMap: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [mapMode, setMapMode] = useState<'live' | 'heritage'>('live');
  const [activeNode, setActiveNode] = useState<MapNode>(mapNodes[2]); // Default Salem / Lakshmi context

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-parchment-50 dark:bg-night-card border border-warm-border/80 dark:border-night-border shadow-warm-md flex flex-col justify-between ${className}`}>
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-warm-border/60 dark:border-night-border/60">
        <div>
          <div className="text-[10px] font-bold tracking-wider text-warm-muted dark:text-night-muted uppercase">
            Interactive Province Map
          </div>
          <h3 className="text-sm font-bold font-heritage text-warm-ink dark:text-night-ink">
            {mapMode === 'live' ? 'Live Verified Proof Clusters' : 'Vocational Heritage & Craft Traditions'}
          </h3>
        </div>

        {/* Toggle Pill */}
        <div className="flex items-center p-0.5 rounded-full bg-parchment-200 dark:bg-night-100 border border-warm-border/80 text-xs font-semibold">
          <button
            onClick={() => setMapMode('live')}
            className={`px-2.5 py-1 rounded-full text-[11px] transition-all ${
              mapMode === 'live'
                ? 'bg-maroon-700 text-white shadow-xs'
                : 'text-warm-muted hover:text-warm-ink dark:hover:text-night-ink'
            }`}
          >
            Live proofs
          </button>
          <button
            onClick={() => setMapMode('heritage')}
            className={`px-2.5 py-1 rounded-full text-[11px] transition-all ${
              mapMode === 'heritage'
                ? 'bg-gold-600 text-white shadow-xs'
                : 'text-warm-muted hover:text-warm-ink dark:hover:text-night-ink'
            }`}
          >
            Heritage
          </button>
        </div>
      </div>

      {/* SVG Stylized Map Display */}
      <div className="relative my-3 flex items-center justify-center bg-parchment-100/50 dark:bg-night-100/40 rounded-xl p-2 overflow-hidden border border-warm-border/40 min-h-[290px]">
        {/* Kolam geometric background grid in map */}
        <div className="absolute inset-0 kolam-pattern-bg opacity-30 pointer-events-none" />

        <svg
          viewBox="30 110 210 320"
          className="w-full h-72 sm:h-80 drop-shadow-sm select-none"
        >
          {/* Faint Peninsula outline of Tamil Nadu & South India */}
          <path
            d="M 60 130 
               L 180 140 
               L 205 180 
               L 210 220 
               L 190 280 
               L 175 320 
               L 145 380 
               L 115 420 
               L 100 410 
               L 80 340 
               L 65 260 
               L 55 190 Z"
            fill="currentColor"
            className="text-parchment-200/90 dark:text-night-50/60"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />

          {/* District Boundary Guide Lines */}
          <path
            d="M 125 250 L 180 200 M 125 250 L 115 290 M 115 290 L 135 335 M 135 335 L 120 390 M 125 250 L 150 280 M 150 280 L 175 275"
            stroke="currentColor"
            strokeWidth="0.8"
            className="text-warm-border/70 dark:text-night-border/70"
            fill="none"
          />

          {/* Clustered Bubbles */}
          {mapNodes.map((node) => {
            const isSelected = activeNode.id === node.id;
            const bubbleSize = mapMode === 'live' 
              ? Math.max(8, Math.min(18, node.liveProofs / 900))
              : 12;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setActiveNode(node)}
                className="cursor-pointer group"
              >
                {/* Pulsing ring for active selection */}
                {isSelected && (
                  <circle
                    r={bubbleSize + 6}
                    fill="none"
                    stroke={mapMode === 'live' ? '#7A1A12' : '#B8761A'}
                    strokeWidth="1.5"
                    className="animate-ping opacity-60"
                  />
                )}

                {/* Outer cluster halo */}
                <circle
                  r={bubbleSize + 3}
                  fill={mapMode === 'live' ? '#8B1E14' : '#E8B23A'}
                  opacity={isSelected ? 0.35 : 0.18}
                  className="transition-all duration-200 group-hover:scale-125"
                />

                {/* Main Node Bubble */}
                <circle
                  r={bubbleSize}
                  fill={mapMode === 'live' ? '#7A1A12' : '#B8761A'}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  className="transition-transform duration-200 group-hover:scale-110 drop-shadow-xs"
                />

                {/* Center dot */}
                <circle
                  r={bubbleSize > 12 ? 3 : 1.5}
                  fill="#FFFFFF"
                />

                {/* City label text */}
                <text
                  y={bubbleSize + 11}
                  textAnchor="middle"
                  className={`text-[9px] font-bold select-none transition-colors ${
                    isSelected
                      ? 'fill-maroon-900 dark:fill-gold-300 font-extrabold'
                      : 'fill-warm-muted dark:fill-night-muted'
                  }`}
                >
                  {node.name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Node Inspection Tooltip Card */}
        <div className="absolute bottom-2 left-2 right-2 p-2.5 rounded-xl bg-white/95 dark:bg-night-card/95 backdrop-blur-md border border-warm-border dark:border-night-border shadow-warm-sm flex items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-warm-ink dark:text-night-ink">{activeNode.name}</span>
              <span className="font-tamil text-[11px] text-warm-muted">({activeNode.nameTamil})</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-gold-100 dark:bg-gold-950 text-gold-900 dark:text-gold-200 font-bold">
                Avg {activeNode.rubricAvg}%
              </span>
            </div>

            <div className="text-[11px] text-warm-muted dark:text-night-muted mt-0.5 line-clamp-1">
              {mapMode === 'live' ? (
                <>
                  <span className="font-semibold text-maroon-700 dark:text-gold-400">
                    {activeNode.liveProofs.toLocaleString()} verified proofs
                  </span>
                  {' '}• Top: {activeNode.topSkill}
                </>
              ) : (
                <>
                  <span className="font-semibold text-gold-700 dark:text-gold-300">
                    {activeNode.heritageCraft}
                  </span>
                  {' '}• {activeNode.heritageCategory}
                </>
              )}
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300">
              {activeNode.activeLearners.toLocaleString()} Learners
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
