export const INDUSTRIES = [
  'finans',
  'vård',
  'retail',
  'offentlig sektor',
  'industri',
  'teknik',
  'övrigt'
] as const;

export type Industry = (typeof INDUSTRIES)[number];

export const SEVERITIES = ['kritisk', 'hög', 'medel', 'låg'] as const;

export type Severity = (typeof SEVERITIES)[number];

export interface ThreatItem {
  id: string;
  title: string;
  happened: string;
  severity: Severity;
  recommendation: string;
  source: string;
  relevanceByIndustry: Record<Industry, string>;
}

export interface DailyBriefing {
  id: string;
  date: string;
  generatedAt: string;
  title: string;
  summary: string;
  threats: ThreatItem[];
}

export interface Subscriber {
  email: string;
  industry: Industry;
  createdAt: string;
}
