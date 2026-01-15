import { useState } from "react";

import { Sidebar } from "@/layout/Sidebar";
import { NotificationPanel } from "@/layout/NotificationPanel";

import { VehicleList } from "@/features/vehicle";
import { MaintenanceManagement } from "@/features/maintenance";
import { OrganizationManagement } from "@/features/organization";
import { EmployeeManagement } from "@/features/employee";
import { MemberManagement } from "@/features/member";
import { Statistics } from "@/features/statistics";

export default function App() {
  const [activeMenu, setActiveMenu] = useState("vehicle-list");

  const renderContent = () => {
    switch (activeMenu) {
      case "vehicle-list":
        return <VehicleList />;
      case "maintenance":
        return <MaintenanceManagement />;
      case "organization":
        return <OrganizationManagement />;
      case "employees":
        return <EmployeeManagement />;
      case "members":
        return <MemberManagement />;
      case "statistics":
        return <Statistics />;
      default:
        return <VehicleList />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
      <NotificationPanel />
    </div>
  );
}
