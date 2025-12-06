import { useState, useEffect } from 'react';
import type { DashboardStats, Tender } from '@/shared/types';
import { mockStats } from '@/utils/mockData';
import { isExpiringSoon } from '@/utils/dateUtils';

export const useDashboard = (tenders: Tender[]) => {
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Calculate real stats from tenders
    const calculateStats = () => {
      const totalTenders = tenders.length;
      const awardedTenders = tenders.filter(t => t.status === 'awarded').length;
      const underReviewTenders = tenders.filter(t => t.status === 'under_review').length;
      const notAwardedTenders = tenders.filter(t => t.status === 'not_awarded').length;
      const totalGuaranteeAmount = tenders.reduce((sum, t) => sum + t.guaranteeAmount, 0);
      const expiringGuarantees = tenders.filter(t => isExpiringSoon(t.guaranteeExpiryDate)).length;

      setStats({
        totalTenders,
        awardedTenders,
        underReviewTenders,
        notAwardedTenders,
        totalGuaranteeAmount,
        expiringGuarantees,
      });
      setLoading(false);
    };

    if (tenders.length > 0) {
      calculateStats();
    } else {
      // Use mock stats if no tenders
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStats(mockStats);
      setLoading(false);
    }
  }, [tenders]);

  const getRecentTenders = (limit: number = 5): Tender[] => {
    return [...tenders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  };

  const getExpiringTenders = (): Tender[] => {
    return tenders.filter(t => isExpiringSoon(t.guaranteeExpiryDate));
  };

  const getAwardedTendersThisMonth = (): Tender[] => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return tenders.filter(t => {
      const tenderDate = new Date(t.updatedAt);
      return t.status === 'awarded' &&
        tenderDate.getMonth() === currentMonth &&
        tenderDate.getFullYear() === currentYear;
    });
  };

  return {
    stats,
    loading,
    getRecentTenders,
    getExpiringTenders,
    getAwardedTendersThisMonth,
  };
};
