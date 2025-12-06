import { Edit, Trash2, AlertTriangle } from 'lucide-react';
import type { Tender } from '@/shared/types';
import Button from '@/components/shared-components/Button';
import Badge from '@/components/shared-components/Badge';
import { formatDate, isExpiringSoon } from '@/utils/dateUtils';
import { formatCurrency, getStatusText } from '@/utils/formatters';

interface TenderTableProps {
  tenders: Tender[];
  onEdit?: (tender: Tender) => void;
  onDelete?: (tenderId: string) => void;
}

const TenderTable = ({ tenders, onEdit, onDelete }: TenderTableProps) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'awarded': return 'success';
      case 'under_review': return 'warning';
      case 'not_awarded': return 'danger';
      default: return 'default';
    }
  };

  const getRowColor = (status: string) => {
    switch (status) {
      case 'awarded': return 'bg-green-50 hover:bg-green-100';
      case 'under_review': return 'bg-yellow-50 hover:bg-yellow-100';
      case 'not_awarded': return 'bg-red-50 hover:bg-red-100';
      default: return 'hover:bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الجهة المالكة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                تاريخ الفتح
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                مبلغ الكفالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                انتهاء الكفالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الشركة الفائزة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tenders.map((tender) => (
              <tr
                key={tender.id}
                className={`transition-colors ${getRowColor(tender.status)}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {tender.ownerEntity}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(tender.openingDate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatCurrency(tender.guaranteeAmount)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    {isExpiringSoon(tender.guaranteeExpiryDate) && (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    )}
                    <span className={`text-sm ${isExpiringSoon(tender.guaranteeExpiryDate) ? 'text-yellow-600 font-medium' : 'text-gray-900'}`}>
                      {formatDate(tender.guaranteeExpiryDate)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusVariant(tender.status)}>
                    {getStatusText(tender.status)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {tender.awardedCompany || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2 space-x-reverse">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Edit className="w-4 h-4" />}
                        onClick={() => onEdit(tender)}
                      >
                        تعديل
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 className="w-4 h-4" />}
                        onClick={() => onDelete(tender.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        حذف
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tenders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">لا توجد عطاءات للعرض</p>
        </div>
      )}
    </div>
  );
};

export default TenderTable;
