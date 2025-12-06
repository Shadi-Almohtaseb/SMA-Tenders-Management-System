import { useState } from 'react';
import type { TenderFormData } from '@/shared/types';
import Input from '@/components/shared-components/Input';
import Select from '@/components/shared-components/Select';
import Button from '@/components/shared-components/Button';
import Card from '@/components/shared-components/Card';

interface TenderFormProps {
  initialData?: TenderFormData;
  onSubmit: (data: TenderFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const TenderForm = ({ initialData, onSubmit, onCancel, loading = false }: TenderFormProps) => {
  const [formData, setFormData] = useState<TenderFormData>(initialData || {
    ownerEntity: '',
    openingDate: '',
    guaranteeAmount: 0,
    guaranteeExpiryDate: '',
    status: 'under_review',
    awardedCompany: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusOptions = [
    { value: 'under_review', label: 'قيد الدراسة' },
    { value: 'awarded', label: 'تم الترسية' },
    { value: 'not_awarded', label: 'لم يتم الترسية' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.ownerEntity.trim()) {
      newErrors.ownerEntity = 'الجهة المالكة مطلوبة';
    }

    if (!formData.openingDate) {
      newErrors.openingDate = 'تاريخ فتح العطاء مطلوب';
    }

    if (!formData.guaranteeAmount || formData.guaranteeAmount <= 0) {
      newErrors.guaranteeAmount = 'مبلغ الكفالة يجب أن يكون أكبر من صفر';
    }

    if (!formData.guaranteeExpiryDate) {
      newErrors.guaranteeExpiryDate = 'تاريخ انتهاء الكفالة مطلوب';
    }

    if (formData.guaranteeExpiryDate && formData.openingDate) {
      const openingDate = new Date(formData.openingDate);
      const expiryDate = new Date(formData.guaranteeExpiryDate);
      if (expiryDate <= openingDate) {
        newErrors.guaranteeExpiryDate = 'تاريخ انتهاء الكفالة يجب أن يكون بعد تاريخ فتح العطاء';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof TenderFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  return (
    <Card>
      <Card.Header>
        <h2 className="text-xl font-semibold text-gray-900">
          {initialData ? 'تعديل العطاء' : 'إضافة عطاء جديد'}
        </h2>
      </Card.Header>

      <form onSubmit={handleSubmit}>
        <Card.Content className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="الجهة المالكة *"
              value={formData.ownerEntity}
              onChange={(e) => handleChange('ownerEntity', e.target.value)}
              error={errors.ownerEntity}
              placeholder="مثال: بلدية الرياض"
            />

            <Select
              label="حالة العطاء *"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              options={statusOptions}
              error={errors.status}
            />

            <Input
              label="تاريخ فتح العطاء *"
              type="date"
              value={formData.openingDate}
              onChange={(e) => handleChange('openingDate', e.target.value)}
              error={errors.openingDate}
            />

            <Input
              label="تاريخ انتهاء الكفالة *"
              type="date"
              value={formData.guaranteeExpiryDate}
              onChange={(e) => handleChange('guaranteeExpiryDate', e.target.value)}
              error={errors.guaranteeExpiryDate}
            />

            <Input
              label="مبلغ الكفالة (ريال) *"
              type="number"
              value={formData.guaranteeAmount ? formData.guaranteeAmount.toString() : ''}
              onChange={(e) => handleChange('guaranteeAmount', Number(e.target.value))}
              error={errors.guaranteeAmount}
              placeholder="50000"
              min="0"
              step="1000"
            />

            <Input
              label="الشركة الفائزة"
              value={formData.awardedCompany || ''}
              onChange={(e) => handleChange('awardedCompany', e.target.value)}
              error={errors.awardedCompany}
              placeholder="اختياري - في حالة الترسية"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ملاحظات
            </label>
            <textarea
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="أي ملاحظات إضافية حول العطاء..."
            />
          </div>
        </Card.Content>

        <Card.Footer className="flex justify-end space-x-3 space-x-reverse">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            {initialData ? 'حفظ التعديلات' : 'إضافة العطاء'}
          </Button>
        </Card.Footer>
      </form>
    </Card>
  );
};

export default TenderForm;
