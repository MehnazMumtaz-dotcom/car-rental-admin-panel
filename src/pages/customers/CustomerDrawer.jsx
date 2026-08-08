import React, { useState } from "react";
import { X } from "lucide-react";
const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
};

const bookingStatusStyles = {
  Upcoming: "text-primary",
  Ongoing: "text-green-600",
  Completed: "text-gray-500",
  Cancelled: "text-rose-600",
};

export default function CustomerDrawer({
  isOpen,
  customer,
  onClose,
  onStatusChange,
}) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!isOpen || !customer) return null;

  const statusStyles = {
    active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    suspended: "bg-amber-100 text-amber-700 border-amber-200",
    flagged: "bg-rose-100 text-rose-700 border-rose-200",
  };

  const bookingsList = customer.bookingsList || [];

  // Activity feed real data se derive ki jati hai — customer create hone ka
  // event, aur har booking create hone ka event, date ke hisab se sorted
  const activityFeed = [
    {
      label: "Account Created",
      date: customer.joined,
    },
    ...bookingsList.map((b) => ({
      label: `Booking #${b.id} Created (${b.vehicleName})`,
      date: b.createdAt,
    })),
  ]
    .filter((item) => item.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="fixed inset-0 z-50 flex bg-black/40">
      <div className="ml-auto w-full sm:w-[520px] lg:w-[440px] h-full bg-white shadow-2xl flex flex-col">
        <div className="flex justify-between p-4 sm:p-5 border-b bg-gray-50">

          <div className="min-w-0">

            <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
              {customer.name}
            </h2>

            <span
              className={`inline-flex mt-2 px-3 py-1 text-xs font-medium rounded-full border ${
                statusStyles[customer.status] ||
                "bg-gray-100 text-gray-600 border-gray-200"
              }`}
            >
              {customer.status}
            </span>
            <div className="mt-2">
              <select
                value={customer.status}
                onChange={(e) =>
                  onStatusChange?.(customer.id, e.target.value)
                }
                className="text-xs border rounded px-2 py-1 w-full sm:w-auto"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>

          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 sm:p-5 bg-gray-50">

          <div className="p-3 sm:p-4 bg-white border rounded-lg">
            <p className="text-xs text-gray-500">Total Bookings</p>
            <p className="text-base sm:text-lg font-semibold">
              {customer.totalBookings || 0}
            </p>
          </div>

          <div className="p-3 sm:p-4 bg-white border rounded-lg">
            <p className="text-xs text-gray-500">Total Spent</p>
            <p className="text-base sm:text-lg font-semibold">
             Rs {(customer.totalSpent || 0).toLocaleString()}
            </p>
          </div>

          <div className="p-3 sm:p-4 bg-white border rounded-lg">
            <p className="text-xs text-gray-500">Active Bookings</p>
            <p className="text-base sm:text-lg font-semibold">
              {customer.activeBookings || 0}
              </p>
          </div>

          <div className="p-3 sm:p-4 bg-white border rounded-lg">
            <p className="text-xs text-gray-500">Last Activity</p>
            <p className="text-sm font-semibold">
              {formatDate(customer.lastActivity)}
            </p>
          </div>

        </div>
        <div className="flex border-b text-sm">

          {["overview", "bookings", "activity"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 sm:py-3 font-medium capitalize ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}

        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-gray-50 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

          {activeTab === "overview" && (
            <div className="space-y-3">

              <div className="bg-white p-3 sm:p-4 rounded-lg border text-sm">
                <p><b>ID:</b> {customer.id}</p>
                <p><b>Phone:</b> {customer.phone}</p>
                <p><b>Email:</b> {customer.email}</p>
              </div>

              <div className="bg-white p-3 sm:p-4 rounded-lg border text-sm">
               <p><b>Total Bookings:</b> {customer.totalBookings || 0}</p>
               <p><b>Total Spent:</b> Rs {(customer.totalSpent || 0).toLocaleString()}</p>
                <p><b>Joined:</b> {formatDate(customer.joined)}</p>
              </div>

            </div>
          )}

          {activeTab === "bookings" && (
            <div className="space-y-3">

              {bookingsList.length === 0 && (
                <p className="text-center text-sm text-gray-500 py-6">
                  No bookings yet.
                </p>
              )}

              {bookingsList.map((b) => (
                <div
                  key={b.id}
                  className="bg-white p-3 sm:p-4 border rounded-lg text-sm"
                >
                  <p className="font-semibold">Booking #{b.id}</p>
                  <p className="text-gray-500">{b.vehicleName}</p>
                  <p className="text-gray-500">
                    {formatDate(b.startDate)} - {formatDate(b.endDate)}
                  </p>
                  <p className="text-gray-700 mt-1">
                    Rs {(b.totalPrice || 0).toLocaleString()}
                  </p>
                  <p
                    className={`font-medium ${
                      bookingStatusStyles[b.displayStatus] || "text-gray-500"
                    }`}
                  >
                    {b.displayStatus}
                  </p>
                </div>
              ))}

            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-3">

              {activityFeed.length === 0 && (
                <p className="text-center text-sm text-gray-500 py-6">
                  No activity yet.
                </p>
              )}

              {activityFeed.map((item, i) => (
                <div
                  key={i}
                  className="bg-white border-l-4 border-blue-500 p-3 text-sm"
                >
                  <p>{item.label}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(item.date)}
                  </p>
                </div>
              ))}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}