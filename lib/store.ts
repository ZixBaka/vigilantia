import { create } from 'zustand';
import { School, Report, Issue } from '../types';

interface AppStore {
  schools: School[];
  reports: Report[];
  issues: Issue[];
  language: string;
  userId: string;
  setSchools: (schools: School[]) => void;
  setReports: (reports: Report[]) => void;
  addReport: (report: Report) => void;
  setIssues: (issues: Issue[]) => void;
  addIssue: (issue: Issue) => void;
  updateIssue: (id: string, patch: Partial<Issue>) => void;
  toggleUpvote: (issueId: string, userId: string) => void;
  setLanguage: (lang: string) => void;
  setUserId: (id: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  schools: [],
  reports: [],
  issues: [],
  language: 'ru',
  userId: '',
  setSchools: (schools) => set({ schools }),
  setReports: (reports) => set({ reports }),
  addReport: (report) =>
    set((state) => ({ reports: [...state.reports, report] })),
  setIssues: (issues) => set({ issues }),
  addIssue: (issue) =>
    set((state) => ({ issues: [...state.issues, issue] })),
  updateIssue: (id, patch) =>
    set((state) => ({
      issues: state.issues.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    })),
  toggleUpvote: (issueId, userId) =>
    set((state) => ({
      issues: state.issues.map((i) => {
        if (i.id !== issueId) return i;
        const upvoters = i.upvoters ?? [];
        const alreadyVoted = upvoters.includes(userId);
        return {
          ...i,
          upvotes: (i.upvotes ?? 0) + (alreadyVoted ? -1 : 1),
          upvoters: alreadyVoted
            ? upvoters.filter((u) => u !== userId)
            : [...upvoters, userId],
        };
      }),
    })),
  setLanguage: (language) => set({ language }),
  setUserId: (userId) => set({ userId }),
}));
