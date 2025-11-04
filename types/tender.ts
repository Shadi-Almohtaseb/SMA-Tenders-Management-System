export type TenderStatus = "awarded" | "under_review" | "not_awarded";

export interface Tender {
  id: string;
  ownerEntity: string;
  openingDate: string;
  guaranteeAmount: number;
  guaranteeExpiryDate: string;
  status: TenderStatus;
  awardedCompany: string;
  notes: string;
  createdAt: string;
}

export const getTenderStatusLabel = (status: TenderStatus): string => {
  const labels: Record<TenderStatus, string> = {
    awarded: "تم الترسية",
    under_review: "قيد الدراسة",
    not_awarded: "لم يتم الترسية",
  };
  return labels[status];
};

export const getTenderStatusColor = (status: TenderStatus): string => {
  const colors: Record<TenderStatus, string> = {
    awarded: "bg-green-50 hover:bg-green-100 border-r-4 border-green-500",
    under_review: "bg-yellow-50 hover:bg-yellow-100 border-r-4 border-yellow-500",
    not_awarded: "bg-red-50 hover:bg-red-100 border-r-4 border-red-500",
  };
  return colors[status];
};
