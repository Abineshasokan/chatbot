export enum Sender {
  User = 'user',
  Bot = 'bot',
}

export interface ChartDataPoint {
  name: string;
  level?: number; // For single-state charts
  [state: string]: number | string; // For multi-state comparison charts
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  chartData?: ChartDataPoint[];
  comparisonStates?: string[];
  suggestions?: string[];
}
