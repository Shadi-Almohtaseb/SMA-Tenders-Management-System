import { Calendar, DollarSign, Building, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import type { Tender } from '@/shared/types';
import Card from '@/components/shared-components/Card';
import Badge from '@/components/shared-components/Badge';
import Button from '@/components/shared-components/Button';
import { formatDate, isExpiringSoon, getDaysUntilExpiry } from '@/utils/dateUtils';
import { formatCurrency, getStatusText } from '@/utils/formatters';

interface TenderCardProps {
  tender: Tender;
  onEdit?: (tender: Tender) => void;
  onDelete?: (tenderId: string) => void;
}

const TenderCard = ({ tender, onEdit, onDelete }: TenderCardProps) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'awarded': return 'success';
      case 'under_review': return 'warning';
      case 'not_awarded': return 'danger';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'awarded': return <CheckCircle className="w-4 h-4" />;
      case 'under_review': return <Clock className="w-4 h-4" />;
      case 'not_awarded': return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  const isExpiring = isExpiringSoon(tender.guaranteeExpiryDate);
  const daysLeft = getDaysUntilExpiry(tender.guaranteeExpiryDate);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <Card.Header className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Building className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">{tender.ownerEntity}</h3>
          </div>
          <Badge variant={getStatusVariant(tender.status)}>
            <div className="flex items-center space-x-1 space-x-reverse">
              {getStatusIcon(tender.status)}
              <span>{getStatusText(tender.status)}</span>
            </div>
          </Badge>
        </div>
      </Card.Header>

      <Card.Content className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>تاريخ الفتح: {formatDate(tender.openingDate)}</span>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span>مبلغ الكفالة: {formatCurrency(tender.guaranteeAmount)}</span>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">انتهاء الكفالة:</span>
            <div className="flex items-center space-x-2 space-x-reverse">
              {isExpiring && (
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              )}
              <span className={`text-sm font-medium ${isExpiring ? 'text-yellow-600' : 'text-gray-900'}`}>
                {formatDate(tender.guaranteeExpiryDate)}
              </span>
            </div>
          </div>
          {daysLeft >= 0 && (
            <p className={`text-xs mt-1 ${isExpiring ? 'text-yellow-600' : 'text-gray-500'}`}>
              {daysLeft === 0 ? 'تنتهي اليوم' : `باقي ${daysLeft} يوم`}
            </p>
          )}
        </div>

        {tender.awardedCompany && (
          <div className="bg-green-50 p-3 rounded-lg">
            <span className="text-sm font-medium text-green-800">
              الشركة الفائزة: {tender.awardedCompany}
            </span>
          </div>
        )}

        {tender.notes && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">{tender.notes}</p>
          </div>
        )}
      </Card.Content>

      <Card.Footer className="flex justify-between">
        <div className="text-xs text-gray-500">
          آخر تحديث: {formatDate(tender.updatedAt)}
        </div>
        <div className="flex space-x-2 space-x-reverse">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(tender)}
            >
              تعديل
            </Button>
          )}
          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(tender.id)}
            >
              حذف
            </Button>
          )}
        </div>
      </Card.Footer>
    </Card>
  );
};

export default TenderCard;
