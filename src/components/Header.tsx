import React from 'react';

export const Header: React.FC<{ voiceActive: boolean; visionActive: boolean; swarmActive: boolean }> = ({ 
  voiceActive, 
  visionActive, 
  swarmActive 
}) => {
  return (
    <header className="h-[49px] flex items-center px-[18px] gap-3 shrink-0 bg-gradient-to-r from-[#020508]/97 to-[#040a12]/93 border-b border-gold/20 z-50">
      <div>
        <div className="font-serif text-[15px] font-bold text-white tracking-[0.05em] uppercase">
          FUMILOLA <span className="text-gold">HOME</span>
        </div>
        <div className="font-mono text-[7px] text-gold/40 tracking-[0.25em] uppercase">
          FOR AGED · CIOS CORROBORATED SWARM
        </div>
      </div>
      
      <div className="ml-auto flex gap-[10px] items-center">
        <div className="flex items-center gap-[5px] font-mono text-[8px] tracking-[0.12em] text-white/30 uppercase">
          <div className="w-[5px] h-[5px] rounded-full bg-cyan shadow-[0_0_7px_#00FFE0]" />
          ORI
        </div>
        <div className="flex items-center gap-[5px] font-mono text-[8px] tracking-[0.12em] text-white/30 uppercase">
          <div className={`w-[5px] h-[5px] rounded-full shadow-[0_0_7px_#FFB928] ${voiceActive ? 'bg-gold' : 'bg-[#222]'}`} />
          VOICE
        </div>
        <div className="flex items-center gap-[5px] font-mono text-[8px] tracking-[0.12em] text-white/30 uppercase">
          <div className={`w-[5px] h-[5px] rounded-full shadow-[0_0_7px_#00FFE0] ${visionActive ? 'bg-cyan' : 'bg-[#222]'}`} />
          VISION
        </div>
        <div className="flex items-center gap-[5px] font-mono text-[8px] tracking-[0.12em] text-white/30 uppercase">
          <div className={`w-[5px] h-[5px] rounded-full shadow-[0_0_7px_#B060FF] ${swarmActive ? 'bg-purple' : 'bg-[#222]'}`} />
          SWARM
        </div>
      </div>

      <div className="flex gap-[5px] ml-[13px]">
        <div className="w-[7px] h-[7px] rounded-full bg-[#FF4560] shadow-[0_0_5px_#FF4560]" />
        <div className="w-[7px] h-[7px] rounded-full bg-[#FFB928] shadow-[0_0_5px_#FFB928]" />
        <div className="w-[7px] h-[7px] rounded-full bg-[#00FFE0] shadow-[0_0_5px_#00FFE0]" />
      </div>
    </header>
  );
};
