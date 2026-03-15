import { useMemo } from 'react';
import { useAppStore } from '../lib/store';
import { School, SchoolPinColor, SchoolStats } from '../types';

interface GlobalStats {
  totalReports: number;
  doneCount: number;
  problemCount: number;
  satisfactionPct: number;
  verifiedSchoolCount: number;
  schoolStatsMap: Record<string, SchoolStats>;
}

export function useStats(schools: School[]): GlobalStats {
  const reports = useAppStore((s) => s.reports);

  return useMemo(() => {
    const totalReports = reports.length;
    const doneCount = reports.filter((r) => r.status === 'done').length;
    const problemCount = reports.filter((r) => r.status === 'problem').length;
    const satisfactionPct =
      totalReports === 0 ? 0 : Math.round((doneCount / totalReports) * 100);

    const schoolStatsMap: Record<string, SchoolStats> = {};
    for (const school of schools) {
      const schoolReports = reports.filter((r) => r.schoolId === school.id);
      const total = schoolReports.length;
      const done = schoolReports.filter((r) => r.status === 'done').length;
      const problems = schoolReports.filter((r) => r.status === 'problem').length;
      const pct = total === 0 ? 0 : Math.round((done / total) * 100);

      let color: SchoolPinColor = 'gray';
      if (total > 0) {
        if (problems > 0) color = 'red';
        else if (pct >= 80) color = 'green';
        else color = 'yellow';
      }

      schoolStatsMap[school.id] = { total, done, problems, satisfactionPct: pct, color };
    }

    const verifiedSchoolCount = Object.values(schoolStatsMap).filter(
      (s) => s.total > 0
    ).length;

    return {
      totalReports,
      doneCount,
      problemCount,
      satisfactionPct,
      verifiedSchoolCount,
      schoolStatsMap,
    };
  }, [reports, schools]);
}
