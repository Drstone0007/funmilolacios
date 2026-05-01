import React, { useRef, useEffect } from 'react';

export const RightPanel: React.FC<{ visionActive: boolean }> = ({ visionActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (visionActive && navigator.mediaDevices && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Camera error:", err));
    } else if (!visionActive && videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, [visionActive]);

  return (
    <aside className="w-[252px] shrink-0 border-l border-gold/20 bg-[#020508]/72 backdrop-blur-3xl flex flex-col overflow-y-auto">
      <div className="p-3 border-b border-gold/5">
        <div className="font-mono text-[8.5px] tracking-[0.28em] text-gold/35 uppercase mb-2">Vision Channel</div>
        <div className="w-full aspect-video bg-black/40 rounded-lg border border-gold/10 overflow-hidden relative flex items-center justify-center">
          <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${visionActive ? 'block' : 'hidden'}`} />
          {!visionActive && (
            <div className="text-center opacity-30">
              <div className="text-2xl">👁</div>
              <div className="font-mono text-[7.5px] tracking-[0.16em] mt-1">VISION OFFLINE</div>
            </div>
          )}
          <div className="absolute inset-0 border border-transparent rounded-lg bg-gradient-to-br from-gold/20 via-transparent to-cyan/20 animate-pulse pointer-events-none" />
        </div>
      </div>

      <div className="p-3 border-b border-gold/5">
        <div className="font-mono text-[8.5px] tracking-[0.28em] text-gold/35 uppercase mb-2">Architecture</div>
        <ArchNode icon="⬡" name="React Frontend" tag="GLASS · GOLD · v3" active />
        <ArchNode icon="⚡" name="Gemini Engine" tag="2.0 FLASH · STREAM" active />
        <ArchNode icon="🕸" name="Swarm Router" tag="6-AGENT MESH" active={false} />
        <ArchNode icon="🗄" name="Knowledge Base" tag="CIOS · VECTOR" active />
        <div className="mt-4 pt-3 border-t border-gold/10 overflow-hidden">
          <div className="font-mono text-[7px] text-gold/40 uppercase tracking-widest mb-1">Corporate Entity</div>
          <div className="font-serif text-[9px] font-bold text-white uppercase tracking-wider mb-2">FUMILOLA HOME FOR AGED</div>
          <div className="relative h-[20px] bg-black/20 rounded border border-gold/5 flex items-center overflow-hidden">
            <div className="ticker-scroll-fast font-mono text-[6px] text-cyan/60 uppercase whitespace-nowrap">
              [PROMO] NEURAL v4.0 PRE-ORDER OPEN · [NODE] HQ-LAGOS-07 ACTIVE · [SEC] CIOS ENCRYPTION VERIFIED · [ADS] INVEST IN GERIATRIC SWARMS ·
              &nbsp;&nbsp;&nbsp;
              [PROMO] NEURAL v4.0 PRE-ORDER OPEN · [NODE] HQ-LAGOS-07 ACTIVE · [SEC] CIOS ENCRYPTION VERIFIED · [ADS] INVEST IN GERIATRIC SWARMS ·
            </div>
          </div>
          <div className="mt-2 font-mono text-[7px] text-white/30 leading-relaxed uppercase">
            101 Neural Blvd, Suite 500<br />
            Lagos, Nigeria<br />
            fumilola.ai · HQ Node 07-A
          </div>
        </div>
      </div>

      <div className="p-3 mt-auto">
        <p className="font-mono text-[7.5px] text-white/15 leading-relaxed">
          NON-CLINICAL SIMULATION.<br />
          DEMONSTRATION ONLY.<br />
          AGENTIC SWARM v3.0.42
        </p>
      </div>
    </aside>
  );
};

const ArchNode: React.FC<{ icon: string; name: string; tag: string; active: boolean }> = ({ icon, name, tag, active }) => (
  <div className={`flex items-center gap-2 p-2 rounded-lg border border-gold/5 bg-white-[0.01] mb-1.5 transition-all ${active ? 'border-gold/25 bg-gold/5' : ''}`}>
    <span className="text-xs text-gold">{icon}</span>
    <div className="flex-1">
      <div className="text-[10px] text-white/65 font-medium">{name}</div>
      <div className="font-mono text-[7.5px] text-gold/30 tracking-[0.09em]">{tag}</div>
    </div>
    <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-cyan shadow-[0_0_5px_#00FFE0]' : 'bg-white/10'}`} />
  </div>
);
