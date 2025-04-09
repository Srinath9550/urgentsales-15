import React, { useState, useEffect } from 'react';
import { Bell, X, Info, Tag, Gift, Settings } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Badge } from './badge';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'system' | 'promotion' | 'update' | 'property';
  isRead: boolean;
  createdAt: string;
  userId: number;
  linkTo?: string;
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');

  // Fetch notifications
  const { data: notifications = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/notifications'],
    queryFn: () => {
      if (!user) return Promise.resolve([]);
      return apiRequest({
        url: '/api/notifications',
        method: 'GET'
      })
        .then(res => res.json())
        .then(data => Array.isArray(data) ? data : []);
    },
    enabled: !!user,
  });

  const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

  // Read all notifications
  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      await apiRequest({
        url: '/api/notifications/read-all',
        method: 'POST'
      });
      refetch();
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  // Filter notifications based on active tab
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter((n: Notification) => n.type === activeTab);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.notification-center')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'promotion':
        return <Tag className="h-5 w-5 text-pink-500" />;
      case 'update':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'property':
        return <Gift className="h-5 w-5 text-amber-500" />;
      default:
        return <Settings className="h-5 w-5 text-gray-500" />;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString();
      }
    }
  };

  return (
    <div className="relative notification-center">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs min-w-[18px] h-[18px]"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 mt-2 w-80 sm:w-96 z-50 shadow-lg">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-medium text-lg">Notifications</h3>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="px-4 pt-2">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="update">Updates</TabsTrigger>
                <TabsTrigger value="promotion">Offers</TabsTrigger>
                <TabsTrigger value="property">Property</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value={activeTab} className="px-0 py-0">
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading notifications...</div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`
                        p-4 border-b last:border-0 hover:bg-gray-50 transition-colors duration-150 
                        ${notification.isRead ? 'opacity-75' : 'bg-blue-50/50'}
                      `}
                    >
                      <div className="flex">
                        <div className="mr-3 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <span className="text-xs text-gray-500">
                              {formatDate(notification.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{notification.message}</p>
                          
                          {notification.linkTo && (
                            <a 
                              href={notification.linkTo} 
                              className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block"
                            >
                              View details →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
}