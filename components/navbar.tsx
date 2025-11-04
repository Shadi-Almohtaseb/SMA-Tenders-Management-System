"use client";

import { Building2, FileText, Bell, BarChart3, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const { user, logout } = useAuth();

  const tabs = [
    { id: "dashboard", label: "لوحة العطاءات", icon: FileText },
    { id: "add", label: "إضافة عطاء", icon: Building2 },
    { id: "notifications", label: "التنبيهات", icon: Bell },
    { id: "statistics", label: "الإحصائيات", icon: BarChart3 },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                نظام إدارة عطاءات شركة سما
              </h1>
              <p className="text-xs text-gray-500">SMA Tenders Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              مرحباً، <span className="font-semibold">{user?.name}</span>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                    activeTab === tab.id
                      ? "border-primary text-primary bg-white"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
