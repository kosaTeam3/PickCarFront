import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { VehicleList } from "./components/VehicleList";
import { MaintenanceManagement } from "./components/MaintenanceManagement";
import { OrganizationManagement } from "./components/OrganizationManagement";
import { EmployeeManagement } from "./components/EmployeeManagement";
import { MemberManagement } from "./components/MemberManagement";
import { Statistics } from "./components/Statistics";
import { NotificationPanel } from "./components/NotificationPanel";
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
