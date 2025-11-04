"use client";

import { format, differenceInDays } from "date-fns";
import { ar } from "date-fns/locale";
import { TrendingUp, DollarSign, FileText, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tender } from "@/types/tender";

interface StatisticsProps {
  tenders: Tender[];
}

export function Statistics({ tenders }: StatisticsProps) {
  const today = new Date();

  const stats = {
    total: tenders.length,
    awarded: tenders.filter((t) => t.status === "awarded").length,
    underReview: tenders.filter((t) => t.status === "under_review").length,
    notAwarded: tenders.filter((t) => t.status === "not_awarded").length,
    totalGuaranteeAmount: tenders.reduce(
      (sum, t) => sum + t.guaranteeAmount,
      0
    ),
    expiringSoon: tenders.filter((t) => {
      const daysUntilExpiry = differenceInDays(
        new Date(t.guaranteeExpiryDate),
        today
      );
      return daysUntilExpiry >= 0 && daysUntilExpiry <= 5;
    }).length,
    expired: tenders.filter((t) => {
      const daysUntilExpiry = differenceInDays(
        new Date(t.guaranteeExpiryDate),
        today
      );
      return daysUntilExpiry < 0;
    }).length,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    subtitle?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <h3 className="text-3xl font-bold">{value}</h3>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي العطاءات"
          value={stats.total}
          icon={FileText}
          color="bg-blue-500"
        />
        <StatCard
          title="تم الترسية"
          value={stats.awarded}
          icon={TrendingUp}
          color="bg-green-500"
        />
        <StatCard
          title="قيد الدراسة"
          value={stats.underReview}
          icon={FileText}
          color="bg-yellow-500"
        />
        <StatCard
          title="لم يتم الترسية"
          value={stats.notAwarded}
          icon={FileText}
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="إجمالي مبالغ الكفالات"
          value={formatCurrency(stats.totalGuaranteeAmount)}
          icon={DollarSign}
          color="bg-indigo-500"
          subtitle="مجموع جميع الكفالات"
        />
        <StatCard
          title="تنبيهات الكفالات"
          value={stats.expiringSoon}
          icon={AlertTriangle}
          color="bg-orange-500"
          subtitle={`${stats.expired} كفالة منتهية`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">تقرير تفصيلي</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">نسبة الترسية</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.total > 0
                    ? Math.round((stats.awarded / stats.total) * 100)
                    : 0}
                  %
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">نسبة عدم الترسية</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.total > 0
                    ? Math.round((stats.notAwarded / stats.total) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                ملخص الحالة الحالية
              </h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex justify-between">
                  <span>عطاءات نشطة (قيد الدراسة):</span>
                  <span className="font-semibold">{stats.underReview}</span>
                </li>
                <li className="flex justify-between">
                  <span>عطاءات مرساة:</span>
                  <span className="font-semibold">{stats.awarded}</span>
                </li>
                <li className="flex justify-between">
                  <span>عطاءات مرفوضة:</span>
                  <span className="font-semibold">{stats.notAwarded}</span>
                </li>
                <li className="flex justify-between border-t border-blue-300 pt-2">
                  <span>كفالات تنتهي خلال 5 أيام:</span>
                  <span className="font-semibold text-orange-600">
                    {stats.expiringSoon}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
