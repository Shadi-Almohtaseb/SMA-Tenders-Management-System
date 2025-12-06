import { BarChart3, FileText, Home, Plus, Bell, Archive } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  notificationCount?: number;
}

const Sidebar = ({ activeTab, onTabChange, notificationCount = 0 }: SidebarProps) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'لوحة التحكم',
      icon: Home,
      count: undefined
    },
    {
      id: 'tenders',
      label: 'العطاءات',
      icon: FileText,
      count: undefined
    },
    {
      id: 'add-tender',
      label: 'إضافة عطاء',
      icon: Plus,
      count: undefined
    },
    {
      id: 'notifications',
      label: 'التنبيهات',
      icon: Bell,
      count: notificationCount
    },
    {
      id: 'reports',
      label: 'التقارير',
      icon: BarChart3,
      count: undefined
    },
    {
      id: 'archive',
      label: 'الأرشيف',
      icon: Archive,
      count: undefined
    }
  ];

  return (
    <div className="bg-white border-r border-gray-200 w-64 h-screen sticky top-16">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                w-full flex items-center justify-between px-4 py-3 text-right rounded-lg transition-colors
                ${isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center">
                  {item.count > 9 ? '9+' : item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
