import { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import EmptyState from '../../components/EmptyState';
import Spinner from '../../components/Spinner';
import {
  getNotifications,
  markRead,
  markAllRead,
  dismiss
} from '../../services/notificationService';

const Notifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setNotifications(n => n.map(notif => ({ ...notif, read: true })));
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markRead(id);
      setNotifications(n => n.map(notif => notif.id === id ? { ...notif, read: true } : notif));
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const handleDismiss = async (id) => {
    try {
      await dismiss(id);
      setNotifications(n => n.filter(notif => notif.id !== id));
    } catch (err) {
      console.error('Failed to dismiss notification:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Notifications</h1>
            <p className="text-dark-400 mt-1 font-semibold">
              {loading ? (
                'Loading notifications...'
              ) : unreadCount > 0 ? (
                <>{unreadCount} unread notifications</>
              ) : (
                'All caught up!'
              )}
            </p>
          </div>
          {!loading && unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              id="mark-all-read"
              className="text-sm text-primary-600 hover:text-primary-700 font-bold transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={BellOff}
            title="No notifications"
            message="You're all caught up! Notifications about your events will appear here."
          />
        ) : (
          <div className="space-y-3">
            {notifications.map(notif => {
              return (
                <div
                  key={notif.id}
                  id={`notif-${notif.id}`}
                  className={`card p-5 flex gap-4 transition-all bg-white border border-dark-200 shadow-sm ${
                    !notif.read ? 'border-l-4 border-l-primary-600' : 'opacity-70'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl border border-blue-100 bg-blue-50 flex items-center justify-center shrink-0">
                    <Bell size={18} className="text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-bold text-sm ${!notif.read ? 'text-dark-100' : 'text-dark-300'}`}>
                        {notif.title || 'Notification Update'}
                        {!notif.read && <span className="ml-2 w-2 h-2 bg-primary-600 rounded-full inline-block" />}
                      </p>
                      <button
                        onClick={() => handleDismiss(notif.id)}
                        className="text-dark-400 hover:text-primary-600 shrink-0 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <p className="text-dark-400 text-sm mt-1 leading-relaxed font-semibold">{notif.message}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-dark-500 font-semibold">{formatDate(notif.createdAt)}</span>
                      {!notif.read && (
                        <button
                          onClick={() => handleMarkRead(notif.id)}
                          className="text-xs text-primary-600 hover:text-primary-700 font-bold"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;