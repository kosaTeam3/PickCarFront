import { Navigate, Route, Routes } from "react-router-dom";

import { ManagerLayout } from "@/layout/ManagerLayout";
import { NotFound } from "@/pages/NotFound";

import { VehicleList } from "@/features/vehicle";
import { MaintenanceManagement } from "@/features/maintenance";
import { OrganizationManagement } from "@/features/organization";
import { EmployeeManagement } from "@/features/employee";
import { MemberManagement } from "@/features/member";
import { Statistics } from "@/features/statistics";

import {
  ClientAccident,
  ClientEntry,
  ClientLogin,
  ClientMenu,
  ClientMyPage,
  ClientRentMap,
  ClientRentTime,
  ClientRoot,
  ClientSignupEmail,
  ClientSignupLicense,
  ClientSignupPersonal,
} from "@/features/client/routes";

export default function App() {
  return (
    <Routes>
      {/* Client */}
      <Route path="/" element={<ClientRoot />}>
        <Route index element={<ClientEntry />} />

        <Route path="login" element={<ClientLogin />} />

        <Route path="signup/email" element={<ClientSignupEmail />} />
        <Route path="signup/personal" element={<ClientSignupPersonal />} />
        <Route path="signup/license" element={<ClientSignupLicense />} />

        <Route path="menu" element={<ClientMenu />} />

        <Route path="rent/time" element={<ClientRentTime />} />
        <Route path="rent/map" element={<ClientRentMap />} />

        <Route path="mypage" element={<ClientMyPage />} />
        <Route path="accident" element={<ClientAccident />} />
      </Route>

      {/* Manager */}
      <Route path="/manager" element={<ManagerLayout />}>
        <Route index element={<Navigate to="vehicles" replace />} />

        <Route path="vehicles" element={<VehicleList />}>
          {/* 모달 라우트(경로 매칭용) */}
          <Route path="new" element={<></>} />
          <Route path=":carId" element={<></>} />
        </Route>

        <Route path="maintenance" element={<MaintenanceManagement />}>
          {/* 모달 라우트(경로 매칭용) */}
          <Route path="new" element={<></>} />
          <Route path=":maintenanceId" element={<></>} />
        </Route>

        <Route path="branches" element={<OrganizationManagement />}>
          {/* 모달 라우트(경로 매칭용) */}
          <Route path="new" element={<></>} />
          <Route path=":branchId" element={<></>} />
        </Route>

        <Route path="employees" element={<EmployeeManagement />} />

        <Route path="members" element={<MemberManagement />}>
          {/* 모달 라우트(경로 매칭용) */}
          <Route path=":memberId" element={<></>} />
        </Route>

        <Route path="statistics" element={<Statistics />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
