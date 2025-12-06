import { useState, useEffect } from 'react';
import type { Tender, TenderFormData } from '@/shared/types';
import { mockTenders } from '@/utils/mockData';

export const useTenders = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadTenders = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setTenders(mockTenders);
      setLoading(false);
    };

    loadTenders();
  }, []);

  const addTender = async (formData: TenderFormData): Promise<Tender> => {
    const newTender: Tender = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTenders(prev => [newTender, ...prev]);
    return newTender;
  };

  const updateTender = async (id: string, formData: TenderFormData): Promise<Tender> => {
    const updatedTender: Tender = {
      ...tenders.find(t => t.id === id)!,
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    setTenders(prev => prev.map(t => t.id === id ? updatedTender : t));
    return updatedTender;
  };

  const deleteTender = async (id: string): Promise<void> => {
    setTenders(prev => prev.filter(t => t.id !== id));
  };

  const getTenderById = (id: string): Tender | undefined => {
    return tenders.find(t => t.id === id);
  };

  const getTendersByStatus = (status: string): Tender[] => {
    return tenders.filter(t => t.status === status);
  };

  const searchTenders = (query: string): Tender[] => {
    const lowercaseQuery = query.toLowerCase();
    return tenders.filter(t =>
      t.ownerEntity.toLowerCase().includes(lowercaseQuery) ||
      t.awardedCompany?.toLowerCase().includes(lowercaseQuery) ||
      t.notes?.toLowerCase().includes(lowercaseQuery)
    );
  };

  return {
    tenders,
    loading,
    addTender,
    updateTender,
    deleteTender,
    getTenderById,
    getTendersByStatus,
    searchTenders,
  };
};
