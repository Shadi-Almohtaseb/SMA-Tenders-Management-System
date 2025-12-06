import type { Tender, NotificationItem, DashboardStats } from '@/shared/types';

export const mockTenders: Tender[] = [
  {
    id: '1',
    ownerEntity: 'بلدية الرياض',
    openingDate: '2024-01-15',
    guaranteeAmount: 50000,
    guaranteeExpiryDate: '2024-06-15',
    status: 'awarded',
    awardedCompany: 'شركة سما للتوريدات والمقاولات',
    notes: 'تم الترسية بنجاح - مشروع توريد معدات',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '2',
    ownerEntity: 'وزارة التعليم',
    openingDate: '2024-02-01',
    guaranteeAmount: 75000,
    guaranteeExpiryDate: '2024-12-01',
    status: 'under_review',
    notes: 'في انتظار نتائج التقييم الفني',
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-02-05T10:00:00Z',
  },
  {
    id: '3',
    ownerEntity: 'أمانة المنطقة الشرقية',
    openingDate: '2024-01-20',
    guaranteeAmount: 30000,
    guaranteeExpiryDate: '2024-11-15',
    status: 'not_awarded',
    awardedCompany: 'شركة أخرى',
    notes: 'لم يتم الترسية - السعر المقدم مرتفع',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-10T10:00:00Z',
  },
  {
    id: '4',
    ownerEntity: 'وزارة الصحة',
    openingDate: '2024-03-01',
    guaranteeAmount: 120000,
    guaranteeExpiryDate: '2024-12-31',
    status: 'under_review',
    notes: 'مشروع توريد أجهزة طبية',
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-03-05T10:00:00Z',
  },
  {
    id: '5',
    ownerEntity: 'بلدية جدة',
    openingDate: '2024-02-15',
    guaranteeAmount: 85000,
    guaranteeExpiryDate: '2024-11-30',
    status: 'awarded',
    awardedCompany: 'شركة سما للتوريدات والمقاولات',
    notes: 'مشروع إنشاء حدائق عامة',
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-02-25T10:00:00Z',
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'guarantee_expiry',
    title: 'تنبيه انتهاء كفالة',
    message: 'كفالة عطاء بلدية الرياض ستنتهي خلال 5 أيام',
    date: '2024-11-01T10:00:00Z',
    isRead: false,
    tenderId: '1'
  },
  {
    id: '2',
    type: 'tender_awarded',
    title: 'تم ترسية عطاء',
    message: 'تم ترسية عطاء بلدية جدة لصالح شركة سما',
    date: '2024-10-28T10:00:00Z',
    isRead: false,
    tenderId: '5'
  },
  {
    id: '3',
    type: 'general',
    title: 'تذكير',
    message: 'يوجد 3 عطاءات قيد المراجعة تحتاج متابعة',
    date: '2024-10-25T10:00:00Z',
    isRead: true
  }
];

export const mockStats: DashboardStats = {
  totalTenders: 5,
  awardedTenders: 2,
  underReviewTenders: 2,
  notAwardedTenders: 1,
  totalGuaranteeAmount: 360000,
  expiringGuarantees: 1
};
