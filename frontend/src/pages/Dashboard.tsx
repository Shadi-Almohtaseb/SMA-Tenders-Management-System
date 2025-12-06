import { FileText, DollarSign, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import type { Tender } from '@/shared/types';
import StatsCard from '@/components/page-components/StatsCard';
import TenderCard from '@/components/page-components/TenderCard';
import Card from '@/components/shared-components/Card';
import { useDashboard } from '@/hooks/useDashboard';
import { formatCurrency } from '@/utils/formatters';

interface DashboardProps {
  tenders: Tender[];
  onEditTender: (tender: Tender) => void;
  onDeleteTender: (tenderId: string) => void;
}

const Dashboard = ({ tenders, onEditTender, onDeleteTender }: DashboardProps) => {
  const { stats, loading, getRecentTenders, getExpiringTenders } = useDashboard(tenders);

  const recentTenders = getRecentTenders(3);
  const expiringTenders = getExpiringTenders();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">لوحة التحكم</h1>
        <p className="text-gray-600">نظرة عامة على العطاءات والكفالات</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatsCard
          title="إجمالي العطاءات"
          value={stats.totalTenders}
          icon={FileText}
          color="blue"
        />
        <StatsCard
          title="تم الترسية"
          value={stats.awardedTenders}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="قيد الدراسة"
          value={stats.underReviewTenders}
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="لم يتم الترسية"
          value={stats.notAwardedTenders}
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="إجمالي الكفالات"
          value={formatCurrency(stats.totalGuaranteeAmount)}
          icon={DollarSign}
          color="purple"
          subtitle="ريال سعودي"
        />
        <StatsCard
          title="كفالات منتهية قريباً"
          value={stats.expiringGuarantees}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tenders */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">العطاءات الحديثة</h2>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
          </Card.Header>
          <Card.Content>
            {recentTenders.length > 0 ? (
              <div className="space-y-4">
                {recentTenders.map((tender) => (
                  <TenderCard
                    key={tender.id}
                    tender={tender}
                    onEdit={onEditTender}
                    onDelete={onDeleteTender}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">لا توجد عطاءات حديثة</p>
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Expiring Guarantees */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">كفالات منتهية قريباً</h2>
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
          </Card.Header>
          <Card.Content>
            {expiringTenders.length > 0 ? (
              <div className="space-y-4">
                {expiringTenders.map((tender) => (
                  <div key={tender.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-yellow-900">{tender.ownerEntity}</h3>
                        <p className="text-sm text-yellow-700">
                          مبلغ الكفالة: {formatCurrency(tender.guaranteeAmount)}
                        </p>
                      </div>
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
                <p className="text-gray-500">لا توجد كفالات منتهية قريباً</p>
              </div>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
