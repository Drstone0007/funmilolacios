export enum RiskLevel {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  icon: string;
  color: string;
  system: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agentName?: string;
  agentColor?: string;
  riskInfo?: {
    level: RiskLevel;
    diag: string;
    rec: string;
  };
  timestamp: Date;
  isStreaming?: boolean;
}

export type AgentStatus = 'idle' | 'running' | 'done' | 'error';
