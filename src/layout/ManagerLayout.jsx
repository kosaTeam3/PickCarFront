import { Outlet } from "react-router-dom";

import { Sidebar } from "@/layout/Sidebar";
import { NotificationPanel } from "@/layout/NotificationPanel";

export function ManagerLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      <NotificationPanel />
    </div>
  );
}
