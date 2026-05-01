import React, { useRef, useEffect } from 'react';
import { Message, RiskLevel } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ChatAreaProps {
  messages: Message[];
  inputValue: string;
  onInputChange: (val: string) => void;
  onSend: () => void;
  onVoiceToggle: () => void;
  onVisionToggle: () => void;
  onSwarmToggle: () => void;
  isVoiceActive: boolean;
  isVisionActive: boolean;
  isSwarmActive: boolean;
  swarmFeed: { text: string; type: string }[];
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  inputValue,
  onInputChange,
  onSend,
  onVoiceToggle,
  onVisionToggle,
  onSwarmToggle,
  isVoiceActive,
  isVisionActive,
  isSwarmActive,
  swarmFeed
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[#020508]/20 relative">
      {/* Bold Hero Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] overflow-hidden z-0">
        <div className="font-serif text-[11vw] font-bold text-gold whitespace-nowrap rotate-[-12deg] tracking-tighter uppercase select-none">
          FUMILOLA HOME
        </div>
      </div>

      <div className="px-[18px] py-[7px] bg-black/20 border-b border-gold/5 flex gap-[5px] overflow-x-auto shrink-0 min-h-[34px] items-center no-scrollbar relative z-10">
        {swarmFeed.map((f, i) => (
          <div key={i} className={`flex items-center gap-[5px] px-[9px] py-[3px] rounded-full font-mono text-[8px] tracking-[0.07em] whitespace-nowrap border animate-[chipIn_0.26s_ease] shrink-0 ${f.type === 'active' ? 'bg-gold/10 border-gold/20 text-gold' : f.type === 'purple' ? 'bg-purple/10 border-purple/20 text-purple' : f.type === 'done' ? 'bg-green/5 border-green/20 text-green' : 'bg-white/5 border-white/10 text-white/30'}`}>
            <span className={`w-1 h-1 rounded-full bg-current ${f.type === 'active' ? 'animate-spin border border-current bg-transparent h-1.5 w-1.5 border-t-transparent' : ''}`} />
            {f.text}
          </div>
        ))}
        {swarmFeed.length === 0 && (
          <div className="flex items-center gap-[5px] px-[9px] py-[3px] rounded-full font-mono text-[8px] tracking-[0.07em] whitespace-nowrap bg-white/5 border border-white/10 text-white/30">
            <span className="w-1 h-1 rounded-full bg-current" />
            SWARM IDLE · 6 AGENTS READY
          </div>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-[18px] py-4 flex flex-col gap-4 no-scrollbar relative z-10">
        <AnimatePresence>
          {messages.map((m) => (
            <motion.div 
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-[30px] h-[30px] rounded-full shrink-0 flex items-center justify-center text-[11px] ${m.role === 'user' ? 'bg-cyan/5 border border-cyan/20 text-cyan font-mono text-[10px]' : m.agentName ? 'bg-assistant' : 'bg-gradient-to-br from-gold to-[#FF6400]/60 shadow-[0_0_15px_rgba(255,185,40,0.36)] text-white'}`} style={m.agentName ? { background: `radial-gradient(circle at 38% 35%, var(--color-${m.agentColor}), #00000099)` } : {}}>
                {m.role === 'user' ? 'YOU' : m.agentName ? '🤖' : '⚕'}
              </div>
              <div className="max-w-[78%]">
                <div className={`p-3 rounded-xl leading-relaxed text-[12.5px] relative overflow-hidden backdrop-blur-xl ${m.role === 'user' ? 'bg-cyan/5 border border-cyan/15 text-white ml-auto rounded-tr-sm' : 'bg-white/5 border border-gold/20 text-white rounded-tl-sm'}`}>
                  {m.agentName && <div className="font-mono text-[8px] text-white/30 mb-1">⚕ {m.agentName} · FUMILOLA SPECIALIST</div>}
                  <div dangerouslySetInnerHTML={{ __html: m.content }} />
                  {m.riskInfo && <RiskCard riskInfo={m.riskInfo} />}
                  <div className="absolute top-0 left-[-100%] w-[36%] h-[1px] bg-gradient-to-r from-transparent via-gold/35 to-transparent animate-[sh_4.5s_ease_infinite]" />
                </div>
                <div className="font-mono text-[7.5px] text-white/15 mt-1 tracking-[0.07em]">
                  {m.agentName || (m.role === 'user' ? 'USER' : 'ORI SWARM')} · {m.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-3 px-4 border-t border-gold/20 bg-[#020508]/85 backdrop-blur-3xl shrink-0 relative z-20">
        <div className="flex gap-2 items-center">
          <button onClick={onVisionToggle} className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isVisionActive ? 'bg-gold/10 border border-gold/40 text-gold' : 'bg-gold/5 border border-gold/15 text-gold/60'}`}>📷</button>
          <button onClick={onVoiceToggle} className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isVoiceActive ? 'bg-cyan/20 border border-cyan/50 text-cyan animate-pulse' : 'bg-cyan/5 border border-cyan/20 text-cyan/60'}`}>🎤</button>
          <button onClick={onSwarmToggle} className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all text-xs ${isSwarmActive ? 'bg-purple/20 border border-purple/50 text-purple shadow-[0_0_11px_rgba(176,96,255,0.26)]' : 'bg-purple/5 border border-purple/20 text-purple/60'}`}>🕸</button>
          <input 
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
            placeholder="Describe symptoms or clinical query..."
            className="flex-1 bg-white/5 border border-gold/15 rounded-xl px-3.5 py-2.5 font-sans text-[13px] text-white outline-none focus:border-gold/40 transition-all placeholder:text-white/15 tracking-wide"
          />
          <button onClick={onSend} className="w-10 h-10 bg-gradient-to-br from-gold to-[#FF6400]/80 rounded-lg flex items-center justify-center shadow-lg hover:scale-105 transition-all text-white">➤</button>
        </div>
      </div>
      
      <style>{`
        @keyframes chipIn { from { opacity: 0; transform: scale(0.8) } to { opacity: 1; transform: scale(1) } }
        @keyframes sh { 0% { left: -100% } 100% { left: 200% } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </main>
  );
};

const RiskCard: React.FC<{ riskInfo: Message['riskInfo'] }> = ({ riskInfo }) => {
  if (!riskInfo) return null;
  const { level, diag, rec } = riskInfo;
  const colors = {
    [RiskLevel.HIGH]: 'from-red/10 to-gold/5 border-red/20 text-red',
    [RiskLevel.MEDIUM]: 'from-gold/10 to-orange-500/5 border-gold/25 text-gold',
    [RiskLevel.LOW]: 'from-cyan/5 to-cyan/2 border-cyan/20 text-cyan',
  };
  
  return (
    <div className={`mt-2 p-3 rounded-lg border bg-gradient-to-br ${colors[level]}`}>
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8.5px] font-bold tracking-[0.18em] uppercase border border-solid mb-2 ${level === RiskLevel.HIGH ? 'bg-red/15 border-red/30 animate-pulse' : level === RiskLevel.MEDIUM ? 'bg-gold/10 border-gold/30' : 'bg-cyan/10 border-cyan/25'}`}>
        <div className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
        {level} RISK — {level === RiskLevel.HIGH ? 'ESCALATE NOW' : level === RiskLevel.MEDIUM ? 'MONITOR' : 'ROUTINE'}
      </div>
      <div className="font-serif text-base text-white mb-1">{diag}</div>
      <div className="font-mono text-[9.5px] text-white/50 tracking-tight">{rec}</div>
    </div>
  );
};
