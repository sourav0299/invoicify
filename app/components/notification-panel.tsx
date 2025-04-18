"use client"

import type React from "react"
import NotificationCard, { type NotificationCardProps } from "./notification-card"
import { Bell } from "lucide-react"

export interface Notification extends Omit<NotificationCardProps, "onRead"> {
  id: string
}

interface NotificationPanelProps {
  notifications: Notification[]
  unreadCount: number
  onMarkAllAsRead: () => void
  onReadNotification: (id: string) => void
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onReadNotification }) => {
  return (
    <div className="w-80 sm:w-96 bg-white rounded-md shadow-lg overflow-hidden border border-gray-200">
      <div className="bg-sidebar_green_button_background text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          <h3 className="font-medium">Notifications</h3>
        </div>
      </div>

      <div className="max-h-[60vh] overflow-y-auto divide-y divide-gray-100">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              type={notification.type}
              title={notification.title}
              description={notification.description}
              timestamp={notification.timestamp}
              read={notification.read}
              onRead={() => onReadNotification(notification.id)}
            />
          ))
        ) : (
          <div className="px-4 py-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No notifications to display</p>
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <button className="w-full text-center text-sm text-green-600 hover:text-green-700 py-1">
            View all in notification center
          </button>
        </div>
      )}
    </div>
  )
}

export default NotificationPanel
