"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { getTenderStatusLabel, getTenderStatusColor } from "@/types/tender";
import { api } from "@/lib/api";
import { TenderForm } from "./tender-form";

interface Tender {
  id: number;
  ownerEntity: string;
  openingDate: string;
  guaranteeAmount: string;
  guaranteeExpiryDate: string;
  status: string;
  awardedCompany: string;
  notes: string;
}

interface TendersDashboardProps {
  tenders: Tender[];
  onUpdate: () => void;
}

export function TendersDashboard({ tenders, onUpdate }: TendersDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingTender, setEditingTender] = useState<Tender | null>(null);
  const [deletingTender, setDeletingTender] = useState<Tender | null>(null);

  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch =
      tender.ownerEntity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.awardedCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.notes.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || tender.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async () => {
    if (deletingTender) {
      try {
        await api.deleteTender(deletingTender.id);
        setDeletingTender(null);
        onUpdate();
      } catch (error) {
        console.error("Error deleting tender:", error);
        alert("حدث خطأ أثناء حذف العطاء");
      }
    }
  };

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 2,
    }).format(numAmount);
  };

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
          <CardTitle className="text-2xl">لوحة العطاءات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="البحث في العطاءات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="md:w-48"
            >
              <option value="all">جميع الحالات</option>
              <option value="awarded">تم الترسية</option>
              <option value="under_review">قيد الدراسة</option>
              <option value="not_awarded">لم يتم الترسية</option>
            </Select>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            عدد العطاءات: {filteredTenders.length} من {tenders.length}
          </div>

          {filteredTenders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">لا توجد عطاءات</p>
              <p className="text-sm mt-2">قم بإضافة عطاء جديد للبدء</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-right p-3 font-semibold">الجهة المالكة</th>
                    <th className="text-right p-3 font-semibold">تاريخ الفتح</th>
                    <th className="text-right p-3 font-semibold">مبلغ الكفالة</th>
                    <th className="text-right p-3 font-semibold">انتهاء الكفالة</th>
                    <th className="text-right p-3 font-semibold">الحالة</th>
                    <th className="text-right p-3 font-semibold">الشركة النازلة</th>
                    <th className="text-right p-3 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTenders.map((tender) => (
                    <tr
                      key={tender.id}
                      className={`border-b transition-colors ${getTenderStatusColor(
                        tender.status
                      )}`}
                    >
                      <td className="p-3 font-medium">{tender.ownerEntity}</td>
                      <td className="p-3 text-sm">{formatDate(tender.openingDate)}</td>
                      <td className="p-3 font-semibold text-sm">
                        {formatCurrency(tender.guaranteeAmount)}
                      </td>
                      <td className="p-3 text-sm">
                        {formatDate(tender.guaranteeExpiryDate)}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={
                            tender.status === "awarded"
                              ? "default"
                              : tender.status === "under_review"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {getTenderStatusLabel(tender.status)}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm">
                        {tender.awardedCompany || "-"}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingTender(tender)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeletingTender(tender)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!editingTender}
        onOpenChange={(open) => !open && setEditingTender(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {editingTender && (
            <TenderForm
              tender={editingTender}
              onSuccess={() => {
                setEditingTender(null);
                onUpdate();
              }}
              onCancel={() => setEditingTender(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deletingTender}
        onOpenChange={(open) => !open && setDeletingTender(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف عطاء "{deletingTender?.ownerEntity}"؟
              <br />
              لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingTender(null)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
