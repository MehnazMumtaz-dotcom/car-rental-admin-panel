import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNotificationStore } from "../../store/notificationStore";

export default function NotificationDropdown({ anchorEl, onClose }) {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
  const panelRef = useRef(null);
  const [position, setPosition] = useState(null);
  useEffect(() => {
    const updatePosition = () => {
      if (!anchorEl?.current) return;
      const rect = anchorEl.current.getBoundingClientRect();
      const width = 320; 
      const gap = 8;

      const availableHeight = window.innerHeight - rect.bottom - gap - 16;

      setPosition({
        top: rect.bottom + gap,
        left: Math.max(8, rect.right - width),
        width,
        maxHeight: Math.min(384, availableHeight), 
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [anchorEl]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedBell = anchorEl?.current?.contains(e.target);
      const clickedPanel = panelRef.current?.contains(e.target);
      if (!clickedBell && !clickedPanel) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [anchorEl, onClose]);

  if (!position) return null;

  return createPortal(
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        width: position.width,
      }}
      className="bg-surface border border-borderColor rounded-xl shadow-card z-50 flex flex-col"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-borderColor shrink-0">
        <h3 className="font-semibold text-textPrimary text-sm">Notifications</h3>
        <button
          onClick={markAllAsRead}
          className="text-xs text-primary hover:underline"
        >
          Mark all as read
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="text-sm text-textSecondary text-center py-6">
          No notifications yet
        </p>
      ) : (
        <ul
          style={{
            maxHeight: position.maxHeight,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="overflow-y-auto [&::-webkit-scrollbar]:hidden"
        >
          {notifications.map((n) => (
            <li
              key={n.id}
              onClick={() => !n.read && markAsRead(n.id)}
              className={`px-4 py-3 border-b border-borderColor last:border-0 cursor-pointer ${
                n.read ? "bg-surface" : "bg-primary/5"
              }`}
            >
              <p className="text-sm font-medium text-textPrimary">{n.title}</p>
              <p className="text-xs text-textSecondary mt-0.5">{n.message}</p>
              <p className="text-[10px] text-textSecondary mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>,
    document.body
  );
}
