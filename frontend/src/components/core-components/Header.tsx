import { Bell, Plus, Search, Settings } from 'lucide-react';
import Button from '@/components/shared-components/Button';

interface HeaderProps {
  onAddTender: () => void;
  notificationCount?: number;
}

const Header = ({ onAddTender, notificationCount = 0 }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">
                عطاءات شركة سما
              </h1>
              <p className="text-sm text-gray-500">SMA Tenders Management</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="البحث في العطاءات..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <Button
              onClick={onAddTender}
              icon={<Plus className="w-4 h-4" />}
              size="sm"
            >
              إضافة عطاء
            </Button>

            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
