import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { BarChart3, Building2, Car, ChevronDown, Users } from "lucide-react";

const subLinkClass = ({ isActive }) =>
  `w-full rounded-lg px-3 py-2 text-left transition-colors ${
    isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
  }`;

const mainLinkClass = ({ isActive }) =>
  `flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
    isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
  }`;

export function Sidebar() {
  const location = useLocation();

  const [vehicleMenuOpen, setVehicleMenuOpen] = useState(true);
  const [organizationMenuOpen, setOrganizationMenuOpen] = useState(false);

  // 현재 URL 기준으로 메뉴 자동 펼치기
  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith("/manager/vehicles") || path.startsWith("/manager/maintenance")) {
      setVehicleMenuOpen(true);
    }

    if (path.startsWith("/manager/branches") || path.startsWith("/manager/employees")) {
      setOrganizationMenuOpen(true);
    }
  }, [location.pathname]);

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-6">
        <NavLink to="/manager" className="text-blue-600">
          렌터카 관리 시스템
        </NavLink>
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
              <ul className="ml-8 mt-1 space-y-3">
                <li>
                  <NavLink to="/manager/vehicles" className={subLinkClass}>
                    차량리스트
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/manager/maintenance" className={subLinkClass}>
                    정비관리
                  </NavLink>
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
              <ul className="ml-8 mt-1 space-y-3">
                <li>
                  <NavLink to="/manager/branches" className={subLinkClass}>
                    지점관리
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/manager/employees" className={subLinkClass}>
                    직원관리
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* 회원관리 */}
          <li>
            <NavLink to="/manager/members" className={mainLinkClass}>
              <Users className="h-5 w-5" />
              <span>회원관리</span>
            </NavLink>
          </li>

          {/* 통계 */}
          <li>
            <NavLink to="/manager/statistics" className={mainLinkClass}>
              <BarChart3 className="h-5 w-5" />
              <span>통계</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
