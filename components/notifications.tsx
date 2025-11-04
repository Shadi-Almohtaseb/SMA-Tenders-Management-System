"use client";

import { differenceInDays } from "date-fns";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { AlertCircle, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tender } from "@/types/tender";

interface NotificationsProps {
  tenders: Tender[];
}

export function Notifications({ tenders }: NotificationsProps) {
  const today = new Date();
  
  const expiringGuarantees = tenders
    .map((tender) => ({
      ...tender,
      daysUntilExpiry: differenceInDays(
        new Date(tender.guaranteeExpiryDate),
        today
      ),
    }))
    .filter((tender) => tender.daysUntilExpiry >= 0 && tender.daysUntilExpiry <= 5)
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

  const recentlyAwarded = tenders
    .filter((tender) => tender.status === "awarded")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: ar });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <CardTitle className="text-xl">تنبيهات الكفالات المنتهية قريباً</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {expiringGuarantees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>لا توجد كفالات قريبة من الانتهاء</p>
              <p className="text-sm mt-1">جميع الكفالات في وضع آمن</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expiringGuarantees.map((tender) => (
                <div
                  key={tender.id}
                  className={`p-4 rounded-lg border-r-4 ${
                    tender.daysUntilExpiry === 0
                      ? "bg-red-50 border-red-500"
                      : tender.daysUntilExpiry <= 2
                      ? "bg-orange-50 border-orange-500"
                      : "bg-yellow-50 border-yellow-500"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {tender.ownerEntity}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        تنتهي الكفالة: {formatDate(tender.guaranteeExpiryDate)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        tender.daysUntilExpiry === 0
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {tender.daysUntilExpiry === 0
                        ? "تنتهي اليوم!"
                        : `${tender.daysUntilExpiry} ${
                            tender.daysUntilExpiry === 1 ? "يوم" : "أيام"
                          } متبقية`}
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>مبلغ الكفالة: {tender.guaranteeAmount.toLocaleString("ar-SA")} ريال</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">العطاءات المرساة مؤخراً</CardTitle>
        </CardHeader>
        <CardContent>
          {recentlyAwarded.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>لا توجد عطاءات مرساة حديثاً</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentlyAwarded.map((tender) => (
                <div
                  key={tender.id}
                  className="p-4 rounded-lg bg-green-50 border border-green-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {tender.ownerEntity}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        الشركة النازلة: {tender.awardedCompany || "غير محدد"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        تاريخ الفتح: {formatDate(tender.openingDate)}
                      </p>
                    </div>
                    <Badge>تم الترسية</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
