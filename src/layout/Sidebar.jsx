import { useState } from "react";
import { BarChart3, Building2, Car, ChevronDown, Users } from "lucide-react";
export function Sidebar({ activeMenu, onMenuChange }) {
  const [vehicleMenuOpen, setVehicleMenuOpen] = useState(true);
  const [organizationMenuOpen, setOrganizationMenuOpen] = useState(false);

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-6">
        <h1 className="text-blue-600">렌터카 관리 시스템</h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {/* 차량 관리 */}
          <li>
            <button
              onClick={() => setVehicleMenuOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"
              type="button"
            >
              <div className="flex items-center gap-3">
                <Car className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">차량 관리</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform ${
                  vehicleMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {vehicleMenuOpen && (
              <ul className="ml-8 mt-1 space-y-1">
                <li>
                  <button
                    onClick={() => onMenuChange("vehicle-list")}
                    className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                      activeMenu === "vehicle-list"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    type="button"
                  >
                    차량리스트
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onMenuChange("maintenance")}
                    className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                      activeMenu === "maintenance"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    type="button"
                  >
                    정비관리
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* 조직관리 */}
          <li>
            <button
              onClick={() => setOrganizationMenuOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"
              type="button"
            >
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">조직관리</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform ${
                  organizationMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {organizationMenuOpen && (
              <ul className="ml-8 mt-1 space-y-1">
                <li>
                  <button
                    onClick={() => onMenuChange("organization")}
                    className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                      activeMenu === "organization"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    type="button"
                  >
                    지점관리
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onMenuChange("employees")}
                    className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                      activeMenu === "employees"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    type="button"
                  >
                    직원관리
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* 회원관리 */}
          <li>
            <button
              onClick={() => onMenuChange("members")}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                activeMenu === "members"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              type="button"
            >
              <Users className="h-5 w-5" />
              <span>회원관리</span>
            </button>
          </li>

          {/* 통계 */}
          <li>
            <button
              onClick={() => onMenuChange("statistics")}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                activeMenu === "statistics"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              type="button"
            >
              <BarChart3 className="h-5 w-5" />
              <span>통계</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
