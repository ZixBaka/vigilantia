import { create } from 'zustand';
import { School, Report } from '../types';

interface AppStore {
  schools: School[];
  reports: Report[];
  language: string;
  setSchools: (schools: School[]) => void;
  setReports: (reports: Report[]) => void;
  addReport: (report: Report) => void;
  setLanguage: (lang: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  schools: [],
  reports: [],
  language: 'ru',
  setSchools: (schools) => set({ schools }),
  setReports: (reports) => set({ reports }),
  addReport: (report) =>
    set((state) => ({ reports: [...state.reports, report] })),
  setLanguage: (language) => set({ language }),
}));
