import {Navigate, Route, Routes} from "react-router-dom";

import {ManagerLayout} from "@/layout/ManagerLayout";
import {ClientHome} from "@/pages/ClientHome";
import {NotFound} from "@/pages/NotFound";

import {VehicleList} from "@/features/vehicle";
import {MaintenanceManagement} from "@/features/maintenance";
import {OrganizationManagement} from "@/features/organization";
import {EmployeeManagement} from "@/features/employee";
import {MemberManagement} from "@/features/member";
import {Statistics} from "@/features/statistics";

export default function App() {
    return (
        <Routes>
            {/* Client */}
            <Route path="/" element={<ClientHome/>}/>

            {/* Manager */}
            <Route path="/manager" element={<ManagerLayout/>}>
                <Route index element={<Navigate to="vehicles" replace/>}/>

                <Route path="vehicles" element={<VehicleList/>}>
                    {/* 모달 라우트(경로 매칭용) */}
                    <Route path="new" element={<></>}/>
                    <Route path=":carId" element={<></>}/>
                </Route>

                <Route path="maintenance" element={<MaintenanceManagement/>}>
                    {/* 모달 라우트(경로 매칭용) */}
                    <Route path="new" element={<></>}/>
                    <Route path=":maintenanceId" element={<></>}/>
                </Route>

                <Route path="branches" element={<OrganizationManagement/>}>
                    {/* 모달 라우트(경로 매칭용) */}
                    <Route path="new" element={<></>}/>
                    <Route path=":branchId" element={<></>}/>
                </Route>

                <Route path="employees" element={<EmployeeManagement/>}/>

                <Route path="members" element={<MemberManagement/>}>
                    {/* 모달 라우트(경로 매칭용) */}
                    <Route path=":memberId" element={<></>}/>
                </Route>

                <Route path="statistics" element={<Statistics/>}/>
            </Route>

            <Route path="*" element={<NotFound/>}/>
        </Routes>
    );
}
