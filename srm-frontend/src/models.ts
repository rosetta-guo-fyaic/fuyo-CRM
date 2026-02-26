export interface CustomerSummary {
  id: string;
  name: string;
  localName: string;
  category: string;
  status: 'Strategic' | 'Core' | 'Backup' | 'Trial' | 'Lead' | 'Blacklisted';
  location: string;
  createDate: string; // Renamed from totalSpend
  healthScore: number; // Renamed from performanceScore
  healthStatus?: string; // e.g. "未触达", "待响应"
  tags: string[];
  logoText: string;
  // New fields for Potential Customers
  source?: string; // 来源渠道
  interactionFreq?: 'High' | 'Medium' | 'Low'; // 互动频率
  advantageLevel?: 'High' | 'Medium' | 'Low'; // 优势层级
  coreAdvantages?: string[]; // 具体优势
  potentialStage?: 'Uncontacted' | 'Contacted' | 'IntentConfirmed' | 'Negotiating' | 'Onboarding'; // 现有阶段
}
