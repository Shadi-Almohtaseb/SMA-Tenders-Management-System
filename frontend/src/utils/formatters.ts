/**
 * Formatting utility functions
 */

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ar-SA').format(num);
};

export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'awarded': 'تم الترسية',
    'under_review': 'قيد الدراسة',
    'not_awarded': 'لم يتم الترسية'
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'awarded': 'bg-green-50 text-green-800 border-green-200',
    'under_review': 'bg-yellow-50 text-yellow-800 border-yellow-200',
    'not_awarded': 'bg-red-50 text-red-800 border-red-200'
  };
  return colorMap[status] || 'bg-gray-50 text-gray-800 border-gray-200';
};
