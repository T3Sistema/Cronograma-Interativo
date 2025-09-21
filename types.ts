export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
}

export interface MarketFact {
    point: string;
    description: string;
}

export interface PurchaseJourneyStage {
    stage: 'Reconhecimento' | 'Consideração' | 'Decisão' | 'Fidelização';
    description: string;
    touchpoints: string[];
}

export interface MarketAnalysis {
  marketOverview: {
    title: string;
    opportunities: MarketFact[];
    challenges: MarketFact[];
    trends: MarketFact[];
  };
  psychographicProfile: {
    title: string;
    values: MarketFact[];
    lifestyle: MarketFact[];
    pains: MarketFact[];
  };
  behavioralAnalysis: {
    title: string;
    purchaseJourney: PurchaseJourneyStage[];
  };
}


export type MarketAnalysisData = {
  status: 'loading' | 'success' | 'error';
  data?: MarketAnalysis;
  error?: string;
} | null;


export interface TrafficCampaign {
  platform: 'Meta Ads (Instagram/Facebook)' | 'Google Ads' | 'TikTok Ads' | 'LinkedIn Ads';
  objective: string;
  targetAudience: {
    description: string;
    location: string;
    age: string;
    interests: string[];
  };
  adCopySuggestion: string;
  keywords?: string[];
}

export interface WeeklyPlan {
  week: number;
  theme: string;
  holidays: string[];
  ideiasGuia: string[];
  trafficCampaign: TrafficCampaign;
}

export interface MonthlyPlan {
  month: string;
  weeks: WeeklyPlan[];
}

export type ScheduleData = {
  status: 'loading' | 'success' | 'error';
  data?: MonthlyPlan;
  holidays?: Holiday[];
  error?: string;
};

// A chave é o mês no formato YYYY-MM, ex: "2024-08"
export type Schedule = Map<string, ScheduleData>;

export interface BrazilianState {
    value: string;
    name: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  text: string;
}

export type HolidayContentIdea = {
    status: 'loading' | 'success' | 'error';
    data?: string[];
    error?: string;
}

export type HolidayIdeasCache = Map<string, HolidayContentIdea>;