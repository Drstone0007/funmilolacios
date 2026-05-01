import React from 'react';
import { Agent, AgentStatus, RiskLevel } from '../types';
import { OriOrb } from './OriOrb';

interface SidebarProps {
  agents: Agent[];
  agentStatuses: Record<string, AgentStatus>;
  vitals: { neural: number; triage: number; swarm: number; latency: number };
  cases: { id: string; name: string; symptoms: string; risk: RiskLevel }[];
  activeCaseId: string;
  onCaseSelect: (caseId: string, symptoms: string) => void;
  oriState: { state: string; label: string };
  orbPh: number;
  swAct: number;
  satActive: boolean[];
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  agents, 
  agentStatuses, 
  vitals, 
  cases, 
  activeCaseId, 
  onCaseSelect,
  oriState,
  orbPh,
  swAct,
  satActive
}) => {
  return (
    <aside className="w-[240px] shrink-0 flex flex-col border-r border-gold/20 bg-[#020508]/72 backdrop-blur-3xl overflow-y-auto">
      <div className="p-3 border-b border-gold/5 border-solid">
        <div className="flex justify-center p-2 mb-1">
          <div className="relative inline-block">
            <OriOrb 
              analyzing={oriState.state === 'analyzing'} 
              speaking={oriState.state === 'speaking'} 
              orbPh={orbPh}
              swAct={swAct}
              satActive={satActive}
            />
            <div className="absolute -inset-2 rounded-full border border-gold/15 animate-[spin_6s_linear_infinite]" />
            <div className="absolute -inset-4 rounded-full border border-dashed border-cyan/10 animate-[spin_12s_linear_infinite_reverse]" />
          </div>
        </div>
        <div className="text-center font-mono text-[8.5px] tracking-[0.22em] text-gold/40 uppercase mt-2">
          ORI · {oriState.label}
        </div>
      </div>

      <div className="p-3 border-b border-gold/5">
        <div className="font-mono text-[8.5px] tracking-[0.28em] text-gold/35 uppercase mb-2">System Vitals</div>
        <VitalRow label="NEURAL" value={vitals.neural} color="linear-gradient(90deg,#FFB928,#00FFE0)" />
        <VitalRow label="TRIAGE" value={vitals.triage} color="linear-gradient(90deg,#00FFE0,#0080FF)" />
        <VitalRow label="SWARM" value={vitals.swarm} color="linear-gradient(90deg,#B060FF,#4080FF)" />
        <VitalRow label="LATENCY" value={vitals.latency} color="linear-gradient(90deg,#FF8C00,#FFB928)" isMS />
      </div>

      <div className="p-3 border-b border-gold/5 flex-grow overflow-y-auto">
        <div className="font-mono text-[8.5px] tracking-[0.28em] text-gold/35 uppercase mb-2">Swarm Agents</div>
        {agents.map(a => (
          <div key={a.id} className={`flex items-center gap-[9px] p-2 rounded-lg border border-white/5 bg-white-[0.01] mb-1.5 transition-all overflow-hidden relative ${agentStatuses[a.id] === 'running' ? 'border-gold/30 bg-gold/5' : ''}`}>
            {agentStatuses[a.id] === 'running' && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent animate-[agSw_1.3s_ease_infinite]" />
            )}
            <div className={`w-[26px] h-[26px] rounded-full shrink-0 flex items-center justify-center text-[11px] shadow-lg ${a.color === 'gold' ? 'bg-[radial-gradient(circle_at_38%_35%,#FFD060,#FF8C00)] shadow-gold/40' : a.color === 'cyan' ? 'bg-[radial-gradient(circle_at_38%_35%,#80FFF0,#00B090)] shadow-cyan/30' : a.color === 'purple' ? 'bg-[radial-gradient(circle_at_38%_35%,#D080FF,#7030C0)] shadow-purple/30' : a.color === 'blue' ? 'bg-[radial-gradient(circle_at_38%_35%,#80B0FF,#2050C0)] shadow-blue/30' : a.color === 'red' ? 'bg-[radial-gradient(circle_at_38%_35%,#FF8090,#C02030)] shadow-red/30' : 'bg-[radial-gradient(circle_at_38%_35%,#80FFB0,#00A050)] shadow-green/30'}`}>
              {a.icon}
            </div>
            <div className="flex-1 min-width-0">
              <div className="text-[10.5px] font-semibold text-white/75">{a.name}</div>
              <div className="font-mono text-[8px] text-white/25 tracking-[0.07em] uppercase">{a.role}</div>
              <div className={`font-mono text-[8px] mt-0.5 uppercase ${agentStatuses[a.id] === 'running' ? 'text-gold' : agentStatuses[a.id] === 'done' ? 'text-green' : 'text-white/15'}`}>
                {agentStatuses[a.id] === 'running' ? 'PROCESSING...' : agentStatuses[a.id] === 'done' ? 'COMPLETE ✓' : 'IDLE'}
              </div>
            </div>
            {agentStatuses[a.id] === 'running' && (
              <div className="w-[13px] h-[13px] rounded-full border-[1.5px] border-gold/15 border-t-gold animate-spin shrink-0" />
            )}
          </div>
        ))}
      </div>

      <div className="p-3 border-b border-gold/5 flex-grow overflow-y-auto">
        <div className="font-mono text-[8.5px] tracking-[0.28em] text-gold/35 uppercase mb-2">Case Queue</div>
        {cases.map(c => (
          <div 
            key={c.id} 
            onClick={() => onCaseSelect(c.id, c.symptoms)}
            className={`p-2.5 rounded-lg border border-white/5 bg-white-[0.01] mb-1.5 cursor-pointer transition-all hover:bg-gold/5 hover:border-gold/15 ${activeCaseId === c.id ? 'bg-gold/10 border-gold/25' : ''}`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="font-mono text-[8.5px] text-white/20">#{c.id}</span>
              <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold tracking-widest border border-solid ${c.risk === RiskLevel.HIGH ? 'bg-red/10 text-red border-red/25' : c.risk === RiskLevel.MEDIUM ? 'bg-gold/10 text-gold border-gold/25' : 'bg-cyan/10 text-cyan border-cyan/20'}`}>
                {c.risk}
              </span>
            </div>
            <div className="text-[10.5px] text-white/65 font-medium">{c.name}</div>
            <div className="font-mono text-[8.5px] text-white/20 mt-0.5 truncate">{c.symptoms.split('.')[0]}</div>
          </div>
        ))}
      </div>

      <div className="p-4 mt-auto border-t border-gold/10 bg-gold/[0.02]">
        <div className="font-serif text-[11px] font-bold text-white tracking-widest uppercase mb-1">
          FUMILOLA <span className="text-gold">HOME FOR AGED</span>
        </div>
        <div className="font-mono text-[7px] text-gold/40 tracking-[0.2em] uppercase leading-tight">
          FOR AGED · NEURAL SWARM<br />
          CIOS CORROBORATED OS v3.1
        </div>
      </div>
      
      <style>{`
        @keyframes agSw { 0% { transform: translateX(-100%) } 100% { transform: translateX(200%) } }
      `}</style>
    </aside>
  );
};

const VitalRow: React.FC<{ label: string; value: number; color: string; isMS?: boolean }> = ({ label, value, color, isMS }) => (
  <div className="flex items-center gap-2 mb-2">
    <div className="font-mono text-[8.5px] text-white/30 w-12">{label}</div>
    <div className="flex-1 h-[2px] bg-white/5 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${isMS ? (Math.min(value / 2, 100)) : value}%`, background: color }} />
    </div>
    <div className="font-mono text-[8.5px] text-gold/50 w-8 text-right">{isMS ? (value / 1000).toFixed(1) + 's' : value + '%'}</div>
  </div>
);
