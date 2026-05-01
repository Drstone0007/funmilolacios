import React, { useState, useEffect, useCallback } from 'react';
import { BootSequence } from './components/BootSequence';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { RightPanel } from './components/RightPanel';
import { Background3D } from './components/Background3D';
import { Agent, AgentStatus, Message, RiskLevel } from './types';
import { streamGemini } from './services/gemini';

const INITIAL_AGENTS: Agent[] = [
  { id: 'triage', name: 'AXIOM', role: 'Geriatric Triage', icon: '⚕', color: 'gold', system: 'You are AXIOM — primary geriatric triage agent at Fumilola Home, corroborated with CIOS Health. Analyze symptoms for elderly patients, identifying atypical presentations (e.g. confusion as infection sign). Return: RISK: HIGH|MEDIUM|LOW, DIAG: concise diagnosis, REC: immediate action. Then 2-3 sentences of clinical reasoning. Non-clinical simulation.' },
  { id: 'diagnosis', name: 'LOGOS', role: 'Complex Comorbidities', icon: '🔬', color: 'cyan', system: 'You are LOGOS — geriatric diagnosis engine. Focus on geriatric syndromes: frailty, sarcopenia, and multi-morbidity interactions. List top 3 differentials with likelihood % and geriatric-specific features. Non-clinical simulation.' },
  { id: 'pharma', name: 'AURUM', role: 'Polypharmacy', icon: '💊', color: 'purple', system: 'You are AURUM — geriatric pharmacology agent. Screen for Beers Criteria risks and anticholinergic load. Suggest medication adjustments (not prescriptions) and dosing for reduced renal clearance. Always advise physician consultation. Non-clinical simulation.' },
  { id: 'escalation', name: 'ZEUS', role: 'Escalation/GOC', icon: '⚡', color: 'blue', system: 'You are ZEUS — escalation lead. Determine if condition requires hospital transfer or can be managed at Fumilola Home. Consider "Ceiling of Care" and advance directives. Be decisive on transport priority. Non-clinical simulation.' },
  { id: 'mental', name: 'PSYCHE', role: 'Dementia/Delirium', icon: '🧠', color: 'red', system: 'You are PSYCHE — geriatric mental health specialist. Identify the 3Ds: Delirium, Dementia, and Depression. Assess for acute cognitive change vs baseline. Suggest psychological support pathways. Non-clinical simulation.' },
  { id: 'records', name: 'MNEMO', role: 'Geriatric Record', icon: '📋', color: 'green', system: 'You are MNEMO — geriatric clinical records lead. Write a structured SOAP note emphasizing Functional Status, ADLs (Activities of Daily Living), and Baseline Cognition. Concise and clinical. Non-clinical simulation.' },
];

const INITIAL_CASES = [
  { id: 'F-102', name: 'Esther Benson, F 82', symptoms: 'Patient: Acute confusion (delirium) x 6h. T 37.2C (baseline 36.5C), HR 105. Recent history of UTI. Known mild cognitive impairment.', risk: RiskLevel.HIGH },
  { id: 'F-088', name: 'Olawale Adebayo, M 75', symptoms: 'Patient: Refusing solid food x 2 days. Fatigue and mild dyspnea. History of Heart Failure and hypertension. Normal vitals.', risk: RiskLevel.MEDIUM },
  { id: 'F-091', name: 'Grace Eniola, F 89', symptoms: 'Patient: Routine screening. Stable gait, no falls. Taking 12 medications. Slight apathy noted by staff.', risk: RiskLevel.LOW },
];

export default function App() {
  const [booted, setBooted] = useState(false);
  const handleBootComplete = useCallback(() => setBooted(true), []);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'assistant', content: '<strong>FUMILOLA HOME FOR AGED — NEURAL SWARM OS v3.1</strong><br><br>Welcome to the <strong>CIOS Corroborated Swarm Interface</strong>. This system orchestrates six specialized geriatric agents to provide high-fidelity triage, diagnostics, and clinical oversight for resident care.<br><br>Input resident symptoms, staff observations, or behavioral changes. Our neural backplane will process clinical intersections across polypharmacy, cognition, and acute escalation risk in parallel.', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isVisionActive, setIsVisionActive] = useState(false);
  const [isSwarmActive, setIsSwarmActive] = useState(true);
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentStatus>>(
    INITIAL_AGENTS.reduce((acc, a) => ({ ...acc, [a.id]: 'idle' }), {})
  );
  const [swarmFeed, setSwarmFeed] = useState<{ text: string; type: string }[]>([]);
  const [activeCaseId, setActiveCaseId] = useState('');
  const [oriState, setOriState] = useState({ state: '', label: 'STANDBY' });
  const [orbPh, setOrbPh] = useState(0);
  const [swAct, setSwAct] = useState(0);
  const [vitals, setVitals] = useState({ neural: 87, triage: 94, swarm: 82, latency: 1200 });

  useEffect(() => {
    const timer = setInterval(() => {
      setVitals(v => ({
        ...v,
        neural: Math.floor(Math.random() * 8 + 82),
        latency: 1100 + Math.floor(Math.random() * 200)
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleSend = useCallback(async () => {
    if (!inputValue.trim()) return;
    
    const userMsg: Message = { id: `user-${Date.now()}-${Math.random()}`, role: 'user', content: inputValue, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    const prompt = inputValue;
    setInputValue('');
    
    if (isSwarmActive) {
      setSwarmFeed([{ text: 'SWARM ORCHESTRATING', type: 'purple' }]);
      setOriState({ state: 'analyzing', label: 'ORCHESTRATING' });
      setSwAct(1);

      // 1. Triage Lead (AXIOM) Streams first
      const triageAgent = INITIAL_AGENTS[0];
      setAgentStatuses(prev => ({ ...prev, [triageAgent.id]: 'running' }));
      
      const streamId = 'stream-' + Date.now() + '-' + Math.random();
      setMessages(prev => [...prev, { id: streamId, role: 'assistant', content: '', agentName: triageAgent.name, agentColor: triageAgent.color, timestamp: new Date(), isStreaming: true }]);
      
      let fullTriage = '';
      try {
        fullTriage = await streamGemini(triageAgent.system, prompt, (chunk) => {
          setMessages(prev => prev.map(m => m.id === streamId ? { ...m, content: m.content + chunk } : m));
        });
        
        const rM = fullTriage.match(/RISK:\s*(HIGH|MEDIUM|LOW)/i);
        const dM = fullTriage.match(/DIAG:\s*(.+)/i);
        const recM = fullTriage.match(/REC:\s*(.+)/i);
        
        setMessages(prev => prev.map(m => m.id === streamId ? { 
          ...m, 
          isStreaming: false,
          riskInfo: rM && dM && recM ? { level: rM[1].toUpperCase() as RiskLevel, diag: dM[1].trim(), rec: recM[1].trim() } : undefined 
        } : m));
        setAgentStatuses(prev => ({ ...prev, [triageAgent.id]: 'done' }));
        
        // 2. Run other agents in parallel
        const otherAgents = INITIAL_AGENTS.slice(1);
        const agentPromises = otherAgents.map(async (agent) => {
          setAgentStatuses(prev => ({ ...prev, [agent.id]: 'running' }));
          setSwarmFeed(prev => [...prev, { text: `${agent.name} ACTIVE`, type: 'active' }]);
          
          try {
            const ctx = `Triage Summary: ${fullTriage.substring(0, 300)}`;
            const response = await streamGemini(agent.system + "\n\n" + ctx, prompt, () => {});
            
            setMessages(prev => [...prev, { 
              id: `${agent.id}-${Date.now()}-${Math.random()}`, 
              role: 'assistant', 
              content: response.replace(/\n/g, '<br>'), 
              agentName: agent.name, 
              agentColor: agent.color, 
              timestamp: new Date() 
            }]);
            setAgentStatuses(prev => ({ ...prev, [agent.id]: 'done' }));
            setSwarmFeed(prev => [...prev, { text: `${agent.name} DONE`, type: 'done' }]);
          } catch (e) {
            setAgentStatuses(prev => ({ ...prev, [agent.id]: 'error' }));
          }
        });

        await Promise.all(agentPromises);
        setSwAct(0);
        setOriState({ state: '', label: 'SYNTHESIS COMPLETE' });
        setSwarmFeed([{ text: 'ALL AGENTS COMPLETE', type: 'done' }]);
        setTimeout(() => setAgentStatuses(INITIAL_AGENTS.reduce((acc, a) => ({ ...acc, [a.id]: 'idle' }), {})), 3000);
      } catch (e) {
        setOriState({ state: '', label: 'ERROR' });
      }
    } else {
      // Single Ori response
      setOriState({ state: 'analyzing', label: 'ANALYZING' });
      const streamId = 'single-stream-' + Date.now() + '-' + Math.random();
      setMessages(prev => [...prev, { id: streamId, role: 'assistant', content: '', timestamp: new Date(), isStreaming: true }]);
      
      const sys = 'You are ORI — Fumilola Geriatric AI. Corroborated with CIOS Health. Return RISK: HIGH|MEDIUM|LOW, DIAG: ..., REC: ... then 3 detailed sentences focusing on elderly care quality. Non-clinical simulation.';
      try {
        const full = await streamGemini(sys, prompt, (chunk) => {
          setMessages(prev => prev.map(m => m.id === streamId ? { ...m, content: m.content + chunk } : m));
        });
        const rM = full.match(/RISK:\s*(HIGH|MEDIUM|LOW)/i);
        const dM = full.match(/DIAG:\s*(.+)/i);
        const recM = full.match(/REC:\s*(.+)/i);
        
        setMessages(prev => prev.map(m => m.id === streamId ? { 
          ...m, 
          isStreaming: false,
          riskInfo: rM && dM && recM ? { level: rM[1].toUpperCase() as RiskLevel, diag: dM[1].trim(), rec: recM[1].trim() } : undefined 
        } : m));
        setOriState({ state: '', label: 'STANDBY' });
      } catch (e) {
        setOriState({ state: '', label: 'ERROR' });
      }
    }
  }, [inputValue, isSwarmActive]);

  const onCaseSelect = (id: string, symptoms: string) => {
    setActiveCaseId(id);
    setInputValue(symptoms);
  };

  return (
    <div className="relative w-full h-screen bg-bg overflow-hidden flex flex-col font-sans">
      <Background3D />
      <div className="scanline" />
      <div className="scan-sweep" />
      
      {!booted && <BootSequence onComplete={handleBootComplete} />}

      {booted && (
        <>
          <Header 
            voiceActive={isVoiceActive} 
            visionActive={isVisionActive} 
            swarmActive={isSwarmActive} 
          />
          <div className="h-[22px] bg-gold/[0.04] border-b border-gold/15 overflow-hidden flex items-center relative z-40">
            <div className="ticker-scroll font-mono text-[8px] text-gold/70 uppercase tracking-[0.25em] font-medium">
              <span className="text-white/40">GLOBAL STATUS:</span> FUMILOLA HOME FOR AGED · <span className="text-cyan">CORPORATE HQ:</span> 101 NEURAL BLVD, SUITE 500, LAGOS · <span className="text-purple">TECH:</span> CIOS HEALTH SYSTEMS ARCHITECTURE ENABLED · <span className="text-gold">[ADS]</span> UPGRADE TO NEURAL SWARM v4.0 FOR REAL-TIME BIO-TELEMETRY SYNC · <span className="text-green">SUPPORT:</span> +234-800-NEURAL-FUMILOLA · <span className="text-white/40">EST. 2024</span> · NEURAL OS v3.1 ACTIVE · QUANTUM CLINICAL BACKPLANE · FUMILOLA QUALITY CARE GUARANTEED · 
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="text-white/40">GLOBAL STATUS:</span> FUMILOLA HOME FOR AGED · <span className="text-cyan">CORPORATE HQ:</span> 101 NEURAL BLVD, SUITE 500, LAGOS · <span className="text-purple">TECH:</span> CIOS HEALTH SYSTEMS ARCHITECTURE ENABLED · <span className="text-gold">[ADS]</span> UPGRADE TO NEURAL SWARM v4.0 FOR REAL-TIME BIO-TELEMETRY SYNC · <span className="text-green">SUPPORT:</span> +234-800-NEURAL-FUMILOLA · <span className="text-white/40">EST. 2024</span> · NEURAL OS v3.1 ACTIVE · QUANTUM CLINICAL BACKPLANE · FUMILOLA QUALITY CARE GUARANTEED
            </div>
          </div>
          <div className="flex-1 flex overflow-hidden">
            <Sidebar 
              agents={INITIAL_AGENTS}
              agentStatuses={agentStatuses}
              vitals={vitals}
              cases={INITIAL_CASES}
              activeCaseId={activeCaseId}
              onCaseSelect={onCaseSelect}
              oriState={oriState}
              orbPh={orbPh}
              swAct={swAct}
              satActive={INITIAL_AGENTS.map(a => agentStatuses[a.id] === 'running')}
            />
            <ChatArea 
              messages={messages}
              inputValue={inputValue}
              onInputChange={setInputValue}
              onSend={handleSend}
              onVoiceToggle={() => setIsVoiceActive(!isVoiceActive)}
              onVisionToggle={() => setIsVisionActive(!isVisionActive)}
              onSwarmToggle={() => setIsSwarmActive(!isSwarmActive)}
              isVoiceActive={isVoiceActive}
              isVisionActive={isVisionActive}
              isSwarmActive={isSwarmActive}
              swarmFeed={swarmFeed}
            />
            <RightPanel visionActive={isVisionActive} />
          </div>
        </>
      )}
    </div>
  );
}
