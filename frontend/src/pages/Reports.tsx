import { BarChart3, PieChart, TrendingUp, Download, Calendar, DollarSign } from 'lucide-react';
import type { Tender } from '@/shared/types';
import Card from '@/components/shared-components/Card';
import Button from '@/components/shared-components/Button';
import Badge from '@/components/shared-components/Badge';
import { formatCurrency, getStatusText } from '@/utils/formatters';
import { formatDate, isExpired, isExpiringSoon } from '@/utils/dateUtils';

interface ReportsProps {
  tenders: Tender[];
}

const Reports = ({ tenders }: ReportsProps) => {
  // Calculate statistics
  const totalTenders = tenders.length;
  const awardedTenders = tenders.filter(t => t.status === 'awarded').length;
  const underReviewTenders = tenders.filter(t => t.status === 'under_review').length;
  const notAwardedTenders = tenders.filter(t => t.status === 'not_awarded').length;

  const totalGuaranteeAmount = tenders.reduce((sum, t) => sum + t.guaranteeAmount, 0);
  const awardedGuaranteeAmount = tenders
    .filter(t => t.status === 'awarded')
    .reduce((sum, t) => sum + t.guaranteeAmount, 0);

  const expiredGuarantees = tenders.filter(t => isExpired(t.guaranteeExpiryDate));
  const expiringGuarantees = tenders.filter(t => isExpiringSoon(t.guaranteeExpiryDate, 30));

  // Success rate
  const successRate = totalTenders > 0 ? ((awardedTenders / totalTenders) * 100).toFixed(1) : '0';

  // Top entities by tender count
  const entitiesCounts = tenders.reduce((acc, tender) => {
    acc[tender.ownerEntity] = (acc[tender.ownerEntity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topEntities = Object.entries(entitiesCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const handleExportReport = () => {
    // Simulate report export
    console.log('Exporting report...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">التقارير والإحصائيات</h1>
          <p className="text-gray-600">تحليل شامل لأداء العطاءات والكفالات</p>
        </div>

        <Button
          icon={<Download className="w-4 h-4" />}
          onClick={handleExportReport}
        >
          تصدير التقرير
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <Card.Content className="p-6 text-center">
            <BarChart3 className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">{totalTenders}</h3>
            <p className="text-sm text-gray-600">إجمالي العطاءات</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">{successRate}%</h3>
            <p className="text-sm text-gray-600">معدل نجاح الترسية</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-gray-900">{formatCurrency(totalGuaranteeAmount)}</h3>
            <p className="text-sm text-gray-600">إجمالي مبالغ الكفالات</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6 text-center">
            <Calendar className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">{expiringGuarantees.length}</h3>
            <p className="text-sm text-gray-600">كفالات تنتهي خلال 30 يوم</p>
          </Card.Content>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              توزيع العطاءات حسب الحالة
            </h2>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">{getStatusText('awarded')}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-sm font-medium">{awardedTenders}</span>
                  <Badge variant="success">{totalTenders > 0 ? ((awardedTenders / totalTenders) * 100).toFixed(0) : 0}%</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm">{getStatusText('under_review')}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-sm font-medium">{underReviewTenders}</span>
                  <Badge variant="warning">{totalTenders > 0 ? ((underReviewTenders / totalTenders) * 100).toFixed(0) : 0}%</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">{getStatusText('not_awarded')}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-sm font-medium">{notAwardedTenders}</span>
                  <Badge variant="danger">{totalTenders > 0 ? ((notAwardedTenders / totalTenders) * 100).toFixed(0) : 0}%</Badge>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Top Entities */}
        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              أكثر الجهات تعاملاً
            </h2>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3">
              {topEntities.map(([entity, count], index) => (
                <div key={entity} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                    <span className="text-sm">{entity}</span>
                  </div>
                  <Badge variant="info">{count} عطاء</Badge>
                </div>
              ))}
              {topEntities.length === 0 && (
                <p className="text-gray-500 text-center py-4">لا توجد بيانات</p>
              )}
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Guarantee Analysis */}
      <Card>
        <Card.Header>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            تحليل الكفالات
          </h2>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">إجمالي الكفالات</h3>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalGuaranteeAmount)}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800 mb-2">كفالات العطاءات المرساة</h3>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(awardedGuaranteeAmount)}</p>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-red-800 mb-2">كفالات منتهية</h3>
              <p className="text-2xl font-bold text-red-900">{expiredGuarantees.length}</p>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Expiring Guarantees Details */}
      {expiringGuarantees.length > 0 && (
        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              كفالات تنتهي قريباً (خلال 30 يوم)
            </h2>
          </Card.Header>
          <Card.Content>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الجهة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">مبلغ الكفالة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاريخ الانتهاء</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expiringGuarantees.map((tender) => (
                    <tr key={tender.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {tender.ownerEntity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(tender.guaranteeAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(tender.guaranteeExpiryDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={tender.status === 'awarded' ? 'success' : tender.status === 'under_review' ? 'warning' : 'danger'}>
                          {getStatusText(tender.status)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default Reports;
