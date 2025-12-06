import { Bell, CheckCircle, AlertTriangle, Info, Trash2, CheckCheck } from 'lucide-react';
import type { NotificationItem } from '@/shared/types';
import Card from '@/components/shared-components/Card';
import Button from '@/components/shared-components/Button';
import Badge from '@/components/shared-components/Badge';
import { formatDate } from '@/utils/dateUtils';

interface NotificationsProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
}

const Notifications = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification
}: NotificationsProps) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'guarantee_expiry':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'tender_awarded':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-gray-50 border-gray-200';

    switch (type) {
      case 'guarantee_expiry':
        return 'bg-yellow-50 border-yellow-200';
      case 'tender_awarded':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">التنبيهات</h1>
          <p className="text-gray-600">
            إدارة جميع التنبيهات والإشعارات ({unreadCount} غير مقروءة من {notifications.length})
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            icon={<CheckCheck className="w-4 h-4" />}
            onClick={onMarkAllAsRead}
          >
            تحديد الكل كمقروء
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <Card.Content className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تنبيهات</h3>
            <p className="text-gray-500">سيتم عرض التنبيهات والإشعارات هنا عند توفرها</p>
          </Card.Content>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all hover:shadow-md ${getNotificationColor(notification.type, notification.isRead)}`}
            >
              <Card.Content className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 space-x-reverse flex-1">
                    <div className="shrink-0 pt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 space-x-reverse mb-1">
                        <h3 className={`text-sm font-medium ${notification.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <Badge variant="info">جديد</Badge>
                        )}
                      </div>

                      <p className={`text-sm mb-2 ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>

                      <p className="text-xs text-gray-400">
                        {formatDate(notification.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 space-x-reverse">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkAsRead(notification.id)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        تحديد كمقروء
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 className="w-4 h-4" />}
                      onClick={() => onDeleteNotification(notification.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    />
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
