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

export interface SchoolStats {
  total: number;
  done: number;
  problems: number;
  satisfactionPct: number;
  color: SchoolPinColor;
}
