import { useState } from 'react';
import Layout from '@/components/core-components/Layout';
import Dashboard from './Dashboard';
import Tenders from './Tenders';
import Notifications from './Notifications';
import Reports from './Reports';
import TenderForm from '@/components/page-components/TenderForm';
import { useTenders } from '@/hooks/useTenders';
import { useNotifications } from '@/hooks/useNotifications';
import type { Tender, TenderFormData } from '@/shared/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTenderForm, setShowTenderForm] = useState(false);
  const [editingTender, setEditingTender] = useState<Tender | null>(null);

  const {
    tenders,
    loading: tendersLoading,
    addTender,
    updateTender,
    deleteTender,
  } = useTenders();

  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
  } = useNotifications();

  const handleAddTender = () => {
    setEditingTender(null);
    setShowTenderForm(true);
    setActiveTab('add-tender');
  };

  const handleEditTender = (tender: Tender) => {
    setEditingTender(tender);
    setShowTenderForm(true);
    setActiveTab('add-tender');
  };

  const handleDeleteTender = async (tenderId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العطاء؟')) {
      await deleteTender(tenderId);
    }
  };

  const handleTenderFormSubmit = async (formData: TenderFormData) => {
    try {
      if (editingTender) {
        await updateTender(editingTender.id, formData);
      } else {
        await addTender(formData);
      }
      setShowTenderForm(false);
      setEditingTender(null);
      setActiveTab('tenders');
    } catch (error) {
      console.error('Error saving tender:', error);
    }
  };

  const handleTenderFormCancel = () => {
    setShowTenderForm(false);
    setEditingTender(null);
    setActiveTab(editingTender ? 'tenders' : 'dashboard');
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'add-tender') {
      handleAddTender();
    } else {
      setActiveTab(tab);
      setShowTenderForm(false);
      setEditingTender(null);
    }
  };

  const renderContent = () => {
    if (tendersLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (showTenderForm || activeTab === 'add-tender') {
      return (
        <TenderForm
          initialData={editingTender ? {
            ownerEntity: editingTender.ownerEntity,
            openingDate: editingTender.openingDate,
            guaranteeAmount: editingTender.guaranteeAmount,
            guaranteeExpiryDate: editingTender.guaranteeExpiryDate,
            status: editingTender.status,
            awardedCompany: editingTender.awardedCompany,
            notes: editingTender.notes,
          } : undefined}
          onSubmit={handleTenderFormSubmit}
          onCancel={handleTenderFormCancel}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            tenders={tenders}
            onEditTender={handleEditTender}
            onDeleteTender={handleDeleteTender}
          />
        );
      case 'tenders':
        return (
          <Tenders
            tenders={tenders}
            onEditTender={handleEditTender}
            onDeleteTender={handleDeleteTender}
          />
        );
      case 'notifications':
        return (
          <Notifications
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onDeleteNotification={deleteNotification}
          />
        );
      case 'reports':
        return <Reports tenders={tenders} />;
      case 'archive':
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">الأرشيف</h2>
            <p className="text-gray-600">سيتم إضافة هذه الميزة قريباً</p>
          </div>
        );
      default:
        return (
          <Dashboard
            tenders={tenders}
            onEditTender={handleEditTender}
            onDeleteTender={handleDeleteTender}
          />
        );
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onAddTender={handleAddTender}
      notificationCount={getUnreadCount()}
    >
      {renderContent()}
    </Layout>
  );
}
