export interface SiteContentRow {
  SectionKey: string;
  Content: string;
}

export interface CustomSectionData {
  Id: number;
  Title: string;
  Subtitle?: string;
  LayoutType: string;
  BgStyle: string;
  ContentJson: string;
  OrderIndex: number;
  IsActive: boolean;
  PageKey?: string;
}

export interface StatData {
  Id: number;
  Label: string;
  Value: string;
  IconName?: string;
  OrderIndex: number;
}

export interface QuizOption {
  Id: number;
  QuestionId: number;
  OptionText: string;
  ResultType: string;
  OrderIndex?: number;
}

export interface QuizQuestionRow {
  Id: number;
  QuestionText: string;
  OrderIndex: number;
}

export interface QuizQuestion extends QuizQuestionRow {
  Options: QuizOption[];
}

export interface QuizResult {
  Id?: number;
  ResultKey: string;
  Title: string;
  Description: string;
  IconName: string;
  IndustryKey?: string | null;
}

export interface Industry {
  Id: number;
  IndustryKey: string;
  Title: string;
  Description?: string;
}

export interface QuizData {
  questions: QuizQuestion[];
  results: Record<string, QuizResult>;
  industries: Industry[];
  error?: string;
}
