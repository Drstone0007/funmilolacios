import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const bootSeq = [
  { t: 200, c: 'text-white/40', x: 'FUMILOLA HOME · CIOS NEURAL OS v3.1' },
  { t: 260, c: 'text-white/40', x: 'GERIATRIC SWARM EDITION · AGED CARE PROTOCOLS' },
  { t: 520, c: 'text-white/40', x: '[ BIOS ] POST complete — all cores nominal' },
  { t: 820, c: 'text-cyan', x: '[ KERN ] Loading Neural Kernel 3.0...' },
  { t: 1100, c: 'text-gold', x: '[ OK   ] Memory 128GB ECC · Entropy seeded' },
  { t: 1380, c: 'text-gold', x: '[ OK   ] JWT auth · PostgreSQL 16 · 4 shards' },
  { t: 1650, c: 'text-cyan', x: '[ AI   ] Warming LLM Swarm Router...' },
  { t: 1920, c: 'text-gold', x: '[ OK   ] Gemini 2.0 endpoint verified' },
  { t: 2460, c: 'text-cyan', x: '[ SWRM ] Spawning geriatric specialist swarm...' },
  { t: 2720, c: 'text-purple', x: '[ AG1  ] AXIOM · Triage Lead — ONLINE' },
  { t: 2960, c: 'text-purple', x: '[ AG2  ] LOGOS · Diagnosis Engine — ONLINE' },
  { t: 3200, c: 'text-purple', x: '[ AG3  ] AURUM · Pharmacology — ONLINE' },
  { t: 3440, c: 'text-purple', x: '[ AG4  ] ZEUS · Escalation Protocol — ONLINE' },
  { t: 3680, c: 'text-purple', x: '[ AG5  ] PSYCHE · Mental Health — ONLINE' },
  { t: 3920, c: 'text-purple', x: '[ AG6  ] MNEMO · SOAP Records — ONLINE' },
  { t: 4180, c: 'text-gold', x: '[ OK   ] Swarm mesh connected · 6/6 agents' },
  { t: 4440, c: 'text-cyan', x: '[ ORI  ] Initializing consciousness layer...' },
  { t: 4700, c: 'text-gold', x: '[ OK   ] Ori substrate active — Ase granted' },
  { t: 4960, c: 'text-gold', x: '[ OK   ] Vision · Voice · Swarm — all live' },
  { t: 5200, c: 'text-white/40', x: '─────────────────────────────────────────' },
  { t: 5420, c: 'text-gold font-bold', x: '[ BOOT ] FUMILOLA HEALTH READY ✓' },
];

const bProg = [
  { p: 5, l: 'BIOS POST' },
  { p: 16, l: 'KERNEL' },
  { p: 30, l: 'MEMORY' },
  { p: 44, l: 'DATABASE' },
  { p: 57, l: 'LLM ROUTER' },
  { p: 70, l: 'SPAWNING AGENTS' },
  { p: 84, l: 'SWARM MESH' },
  { p: 93, l: 'ORI' },
  { p: 100, l: 'READY' }
];

export const BootSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [lines, setLines] = useState<{ c: string; x: string; id: number }[]>([]);
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState('INITIALIZING');

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    
    // Clear any existing lines to avoid duplicates on re-mount
    setLines([]);

    bootSeq.forEach((l, i) => {
      const t = setTimeout(() => {
        setLines((prev) => {
          if (prev.find(line => line.id === i)) return prev;
          return [...prev, { ...l, id: i }];
        });
        
        const progIdx = Math.min(Math.floor((i / bootSeq.length) * bProg.length), bProg.length - 1);
        setProgress(bProg[progIdx].p);
        setLabel(bProg[progIdx].l);

        if (i === bootSeq.length - 1) {
          const finishedT = setTimeout(() => {
            setProgress(100);
            setLabel('READY');
            const finalT = setTimeout(onComplete, 1000);
            timeouts.push(finalT);
          }, 800);
          timeouts.push(finishedT);
        }
      }, l.t);
      timeouts.push(t);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[200] bg-bg flex flex-col items-center justify-center p-6"
    >
      <div className="mb-6 text-center">
        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-[0.05em] text-white leading-none uppercase">
          FUMILOLA <span className="text-gold">HOME</span>
        </h1>
        <p className="font-mono text-[12px] tracking-[0.6em] text-gold/60 uppercase mt-4 font-medium">
          FOR AGED · NEURAL GERIATRIC SWARM
        </p>
      </div>

      <div className="relative w-[154px] h-[154px] my-6">
        <div className="absolute inset-0 rounded-full border-[1.5px] border-transparent bg-clip-padding" style={{
          background: 'linear-gradient(var(--bg), var(--bg)) padding-box, conic-gradient(#FFB928, #00FFE0, #B060FF, #FFB928) border-box',
          animation: 'spin 3s linear infinite'
        }} />
        <div className="absolute inset-[14px] rounded-full border border-dashed border-cyan/30 animate-[spin_5s_linear_infinite_reverse]" />
        <div className="absolute inset-[27px] rounded-full border border-purple/20 animate-[spin_8s_linear_infinite]" />
        <div className="absolute inset-[41px] rounded-full bg-[radial-gradient(circle_at_38%_32%,#FFD060,#FF6B00_50%,rgba(0,255,224,0.18))] shadow-[0_0_46px_rgba(255,185,40,0.72),0_0_92px_rgba(255,185,40,0.2)]" />
      </div>

      <div className="w-full max-w-[600px] h-64 bg-[#020508]/90 border border-gold/20 rounded-xl p-4 font-mono text-[11px] leading-[1.82] overflow-hidden">
        <div className="flex flex-col">
          {lines.map((line) => (
            <motion.div 
              key={line.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className={line.c}
            >
              {line.x}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-[600px] mt-4">
        <div className="flex justify-between font-mono text-[9px] text-gold/40 tracking-[0.2em] mb-1.5 uppercase">
          <span>{label}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-gold via-cyan to-purple shadow-[0_0_10px_rgba(255,185,40,0.48)]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );
};
