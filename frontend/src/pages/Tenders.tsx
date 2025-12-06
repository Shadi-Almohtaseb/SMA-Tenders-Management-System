import { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import type { Tender } from '@/shared/types';
import TenderTable from '@/components/page-components/TenderTable';
import TenderCard from '@/components/page-components/TenderCard';
import Button from '@/components/shared-components/Button';
import Input from '@/components/shared-components/Input';
import Select from '@/components/shared-components/Select';

interface TendersProps {
  tenders: Tender[];
  onEditTender: (tender: Tender) => void;
  onDeleteTender: (tenderId: string) => void;
}

const Tenders = ({ tenders, onEditTender, onDeleteTender }: TendersProps) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_desc');

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'awarded', label: 'تم الترسية' },
    { value: 'under_review', label: 'قيد الدراسة' },
    { value: 'not_awarded', label: 'لم يتم الترسية' }
  ];

  const sortOptions = [
    { value: 'created_desc', label: 'الأحدث أولاً' },
    { value: 'created_asc', label: 'الأقدم أولاً' },
    { value: 'amount_desc', label: 'أعلى مبلغ' },
    { value: 'amount_asc', label: 'أقل مبلغ' },
    { value: 'expiry_asc', label: 'قرب انتهاء الكفالة' }
  ];

  const filteredAndSortedTenders = tenders
    .filter(tender => {
      // Search filter
      const matchesSearch = !searchQuery ||
        tender.ownerEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tender.awardedCompany?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tender.notes?.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || tender.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'created_asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'created_desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'amount_asc':
          return a.guaranteeAmount - b.guaranteeAmount;
        case 'amount_desc':
          return b.guaranteeAmount - a.guaranteeAmount;
        case 'expiry_asc':
          return new Date(a.guaranteeExpiryDate).getTime() - new Date(b.guaranteeExpiryDate).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">العطاءات</h1>
          <p className="text-gray-600">
            إدارة ومتابعة جميع العطاءات ({filteredAndSortedTenders.length} من {tenders.length})
          </p>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <Button
            variant={viewMode === 'table' ? 'primary' : 'outline'}
            size="sm"
            icon={<List className="w-4 h-4" />}
            onClick={() => setViewMode('table')}
          >
            جدول
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'primary' : 'outline'}
            size="sm"
            icon={<Grid className="w-4 h-4" />}
            onClick={() => setViewMode('cards')}
          >
            بطاقات
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث في العطاءات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>

          <Select
            placeholder="تصفية حسب الحالة"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
          />

          <Select
            placeholder="ترتيب حسب"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={sortOptions}
          />

          <Button
            variant="outline"
            icon={<Filter className="w-4 h-4" />}
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setSortBy('created_desc');
            }}
          >
            إعادة تعيين
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'table' ? (
        <TenderTable
          tenders={filteredAndSortedTenders}
          onEdit={onEditTender}
          onDelete={onDeleteTender}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTenders.map((tender) => (
            <TenderCard
              key={tender.id}
              tender={tender}
              onEdit={onEditTender}
              onDelete={onDeleteTender}
            />
          ))}
          {filteredAndSortedTenders.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">لا توجد عطاءات تطابق معايير البحث</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tenders;
