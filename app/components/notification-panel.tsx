"use client"

import type React from "react"
import { useState } from "react"
import NotificationCard, { type NotificationCardProps } from "./notification-card"
import { Bell, CheckCheck } from "lucide-react"

export interface Notification extends Omit<NotificationCardProps, "onRead"> {
  id: string
}

interface NotificationPanelProps {
  notifications: Notification[]
  unreadCount: number
  onMarkAllAsRead: () => void
  onReadNotification: (id: string) => void
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  unreadCount,
  onMarkAllAsRead,
  onReadNotification,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all")

  const filteredNotifications = activeTab === "all" ? notifications : notifications.filter((n) => !n.read)

  return (
    <div className="w-80 sm:w-96 bg-white rounded-md shadow-lg overflow-hidden border border-gray-200">
      <div className="bg-[#2563EB] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          <h3 className="font-medium">Notifications</h3>
        </div>
        {unreadCount > 0 && (
          <button
            className="flex items-center text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
            onClick={onMarkAllAsRead}
          >
            <CheckCheck className="h-3 w-3 mr-1" />
            Mark all as read
          </button>
        )}
      </div>

      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-2 text-sm font-medium ${activeTab === "all" ? "text-[#2563EB] border-b-2 border-[#2563EB]" : "text-gray-500"}`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${activeTab === "unread" ? "text-[#2563EB] border-b-2 border-[#2563EB]" : "text-gray-500"}`}
          onClick={() => setActiveTab("unread")}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto divide-y divide-gray-100">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
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
            {activeTab === "unread" && notifications.length > 0 && (
              <button className="mt-2 text-sm text-[#2563EB]" onClick={() => setActiveTab("all")}>
                View all notifications
              </button>
            )}
          </div>
        )}
      </div>

      {filteredNotifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <button className="w-full text-center text-sm text-[#2563EB] hover:text-blue-700 py-1">
            View all in notification center
          </button>
        </div>
      )}
    </div>
  )
}

export default NotificationPanel
