import type { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddTender: () => void;
  notificationCount?: number;
}

const Layout = ({ children, activeTab, onTabChange, onAddTender, notificationCount }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header onAddTender={onAddTender} notificationCount={notificationCount} />
      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          notificationCount={notificationCount}
        />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
