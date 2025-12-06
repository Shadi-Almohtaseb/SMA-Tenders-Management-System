import z from "zod";

/**
 * Shared types for SMA Tenders Management System
 */

export const TenderStatusEnum = z.enum(['awarded', 'under_review', 'not_awarded']);

export const TenderSchema = z.object({
  id: z.string(),
  ownerEntity: z.string(),
  openingDate: z.string(),
  guaranteeAmount: z.number(),
  guaranteeExpiryDate: z.string(),
  status: TenderStatusEnum,
  awardedCompany: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Tender = z.infer<typeof TenderSchema>;
export type TenderStatus = z.infer<typeof TenderStatusEnum>;

export interface TenderFormData {
  ownerEntity: string;
  openingDate: string;
  guaranteeAmount: number;
  guaranteeExpiryDate: string;
  status: TenderStatus;
  awardedCompany?: string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  type: 'guarantee_expiry' | 'tender_awarded' | 'general';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  tenderId?: string;
}

export interface DashboardStats {
  totalTenders: number;
  awardedTenders: number;
  underReviewTenders: number;
  notAwardedTenders: number;
  totalGuaranteeAmount: number;
  expiringGuarantees: number;
}
