"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TenderStatus } from "@/types/tender";
import { api } from "@/lib/api";

interface Tender {
  id: number;
  ownerEntity: string;
  openingDate: string;
  guaranteeAmount: string | number;
  guaranteeExpiryDate: string;
  status: string;
  awardedCompany: string;
  notes: string;
}

interface TenderFormProps {
  tender?: Tender;
  onSuccess: () => void;
  onCancel?: () => void;
}

export function TenderForm({ tender, onSuccess, onCancel }: TenderFormProps) {
  const [formData, setFormData] = useState({
    ownerEntity: tender?.ownerEntity || "",
    openingDate: tender?.openingDate || "",
    guaranteeAmount: tender?.guaranteeAmount ? parseFloat(tender.guaranteeAmount.toString()) : 0,
    guaranteeExpiryDate: tender?.guaranteeExpiryDate || "",
    status: (tender?.status || "under_review") as TenderStatus,
    awardedCompany: tender?.awardedCompany || "",
    notes: tender?.notes || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (tender) {
        await api.updateTender(tender.id, formData);
      } else {
        await api.createTender(formData);
      }
      
      onSuccess();
      
      if (!tender) {
        setFormData({
          ownerEntity: "",
          openingDate: "",
          guaranteeAmount: 0,
          guaranteeExpiryDate: "",
          status: "under_review",
          awardedCompany: "",
          notes: "",
        });
      }
    } catch (error) {
      console.error("Error saving tender:", error);
      alert("حدث خطأ أثناء حفظ العطاء");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          {tender ? "تعديل العطاء" : "إضافة عطاء جديد"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerEntity">الجهة المالكة *</Label>
              <Input
                id="ownerEntity"
                required
                value={formData.ownerEntity}
                onChange={(e) =>
                  setFormData({ ...formData, ownerEntity: e.target.value })
                }
                placeholder="مثال: وزارة الصحة"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="openingDate">تاريخ فتح العطاء *</Label>
              <Input
                id="openingDate"
                type="date"
                required
                value={formData.openingDate}
                onChange={(e) =>
                  setFormData({ ...formData, openingDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guaranteeAmount">مبلغ الكفالة (ريال) *</Label>
              <Input
                id="guaranteeAmount"
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.guaranteeAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    guaranteeAmount: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guaranteeExpiryDate">تاريخ انتهاء الكفالة *</Label>
              <Input
                id="guaranteeExpiryDate"
                type="date"
                required
                value={formData.guaranteeExpiryDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    guaranteeExpiryDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">حالة العطاء *</Label>
              <Select
                id="status"
                required
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as TenderStatus,
                  })
                }
              >
                <option value="under_review">قيد الدراسة</option>
                <option value="awarded">تم الترسية</option>
                <option value="not_awarded">لم يتم الترسية</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="awardedCompany">الشركة النازلة للعطاء</Label>
              <Input
                id="awardedCompany"
                value={formData.awardedCompany}
                onChange={(e) =>
                  setFormData({ ...formData, awardedCompany: e.target.value })
                }
                placeholder="اسم الشركة (اختياري)"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="أضف أي ملاحظات إضافية هنا..."
              rows={4}
            />
          </div>

          <div className="flex gap-3 justify-start">
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "جاري الحفظ..." : tender ? "حفظ التعديلات" : "إضافة العطاء"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" size="lg" onClick={onCancel} disabled={loading}>
                إلغاء
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
