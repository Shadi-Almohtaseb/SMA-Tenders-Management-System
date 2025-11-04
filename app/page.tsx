"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { TenderForm } from "@/components/tender-form";
import { TendersDashboard } from "@/components/tenders-dashboard";
import { Notifications } from "@/components/notifications";
import { Statistics } from "@/components/statistics";
import { LoginForm } from "@/components/login-form";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

interface Tender {
  id: number;
  ownerEntity: string;
  openingDate: string;
  guaranteeAmount: string;
  guaranteeExpiryDate: string;
  status: string;
  awardedCompany: string;
  notes: string;
  createdAt: string;
}

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      const data = await api.getTenders();
      setTenders(data);
    } catch (error) {
      console.error("Error loading tenders:", error);
    }
  };

  if (!mounted) {
    return null;
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <TendersDashboard tenders={tenders} onUpdate={loadData} />
        )}
        
        {activeTab === "add" && (
          <TenderForm
            onSuccess={() => {
              loadData();
              setActiveTab("dashboard");
            }}
          />
        )}
        
        {activeTab === "notifications" && <Notifications tenders={tenders} />}
        
        {activeTab === "statistics" && <Statistics tenders={tenders} />}
      </main>
    </div>
  );
}
