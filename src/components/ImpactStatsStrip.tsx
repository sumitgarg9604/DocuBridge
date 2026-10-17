import React from 'react';
import { Globe2, Zap, ShieldCheck, ShieldAlert, Volume2 } from 'lucide-react';

const STATS = [
  { icon: Globe2, label: '12 Languages', color: 'text-blue-400' },
  { icon: Zap, label: '7-Agent Gemini Pipeline', color: 'text-amber-400' },
  { icon: ShieldCheck, label: 'Verhoeff + Arithmetic Fraud Checks', color: 'text-emerald-400' },
  { icon: ShieldAlert, label: 'Prompt-Injection Defense', color: 'text-rose-400' },
  { icon: Volume2, label: 'Native-Language Text-to-Speech', color: 'text-violet-400' },
];

export const ImpactStatsStrip: React.FC = () => {
  return (
    <div className="bg-slate-950 border-b border-slate-900 px-4 sm:px-6 py-1.5 overflow-x-auto">
      <div className="flex items-center gap-4 sm:gap-6 w-max sm:w-full sm:justify-center">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex items-center gap-1.5 shrink-0">
              <Icon className={`w-3 h-3 ${s.color}`} />
              <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
