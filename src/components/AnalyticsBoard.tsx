import React, { useMemo } from 'react';
import { ApplicantCase } from '../types/docubridge';
import { Files, CheckCircle2, ShieldAlert, Globe2, Mic, FileCheck2 } from 'lucide-react';

interface AnalyticsBoardProps {
  cases: ApplicantCase[];
}

interface StatTileDef {
  label: string;
  value: number;
  icon: typeof Files;
  color: string;
  bg: string;
  ring: string;
}

export const AnalyticsBoard: React.FC<AnalyticsBoardProps> = ({ cases }) => {
  const stats = useMemo(() => {
    const totalApplications = cases.length;
    const completed = cases.filter((c) => c.status === 'Complete').length;
    const highRisk = cases.filter((c) => c.riskLevel === 'High').length;

    let documentsProcessed = 0;
    let fraudFlagsCaught = 0;
    cases.forEach((c) => {
      Object.values(c.documents).forEach((doc) => {
        if (!doc) return;
        documentsProcessed += 1;
        fraudFlagsCaught += doc.flags.filter((f) => f.severity === 'High').length;
      });
    });

    const languagesActive = new Set(cases.map((c) => c.primaryLanguage)).size;
    const voiceNotesProcessed = cases.reduce((sum, c) => sum + c.voiceNotes.length, 0);

    return {
      totalApplications,
      completed,
      highRisk,
      documentsProcessed,
      fraudFlagsCaught,
      languagesActive,
      voiceNotesProcessed,
    };
  }, [cases]);

  const tiles: StatTileDef[] = [
    {
      label: 'Total applications',
      value: stats.totalApplications,
      icon: Files,
      color: 'text-blue-400',
      bg: 'bg-blue-500/15',
      ring: 'ring-blue-500/30',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/15',
      ring: 'ring-emerald-500/30',
    },
    {
      label: 'High-risk cases',
      value: stats.highRisk,
      icon: ShieldAlert,
      color: 'text-rose-400',
      bg: 'bg-rose-500/15',
      ring: 'ring-rose-500/30',
    },
    {
      label: 'Documents processed',
      value: stats.documentsProcessed,
      icon: FileCheck2,
      color: 'text-blue-400',
      bg: 'bg-blue-500/15',
      ring: 'ring-blue-500/30',
    },
    {
      label: 'Fraud flags caught',
      value: stats.fraudFlagsCaught,
      icon: ShieldAlert,
      color: 'text-amber-400',
      bg: 'bg-amber-500/15',
      ring: 'ring-amber-500/30',
    },
    {
      label: 'Languages active',
      value: stats.languagesActive,
      icon: Globe2,
      color: 'text-blue-400',
      bg: 'bg-blue-500/15',
      ring: 'ring-blue-500/30',
    },
    {
      label: 'Voice notes processed',
      value: stats.voiceNotesProcessed,
      icon: Mic,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/15',
      ring: 'ring-emerald-500/30',
    },
  ];

  return (
    <div className="bg-slate-900/60 border-b border-slate-800 px-6 py-3">
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <div
              key={tile.label}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ring-1 ${tile.bg} ${tile.ring}`}>
                <Icon className={`w-4 h-4 ${tile.color}`} />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-semibold text-white leading-none">
                  {tile.value.toLocaleString('en-US')}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 leading-tight">{tile.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
