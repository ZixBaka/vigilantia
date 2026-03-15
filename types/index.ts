export interface SchoolPromise {
  id: string;
  labelKey: string; // i18n key
  category: 'sanitation' | 'safety' | 'education';
}

export interface School {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  coverPhotoUrl: string;
  promises: SchoolPromise[];
}

export type ReportStatus = 'done' | 'problem';

export interface Report {
  id?: string;
  schoolId: string;
  promiseId: string;
  status: ReportStatus;
  photoUrl: string;
  comment: string;
  timestamp: any;
  userId: string;
}

export type SchoolPinColor = 'green' | 'yellow' | 'red' | 'gray';

export type IssueCategory =
  | 'education'
  | 'healthcare'
  | 'transport'
  | 'ecology'
  | 'safety'
  | 'urban'
  | 'utilities'
  | 'water'
  | 'energy';

export type IssueStatus = 'open' | 'done' | 'problem';

export interface Issue {
  id?: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  photoUrl: string;
  lat: number;
  lng: number;
  createdBy: string;
  timestamp: any;
  upvotes: number;
  upvoters: string[];
}

export interface IssueComment {
  id?: string;
  text: string;
  userId: string;
  timestamp: any;
}

export interface SchoolStats {
  total: number;
  done: number;
  problems: number;
  satisfactionPct: number;
  color: SchoolPinColor;
}
