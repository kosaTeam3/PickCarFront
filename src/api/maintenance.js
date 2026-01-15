import {api} from "./client";

// ✅ 정비 전체 목록 조회 (Page 응답)
// GET /api/manager/maint?page=0&size=20&sort=id,DESC&branchId=1&status=ONGOING&keyword=오일
export function getMaintenanceList(params) {
    return api("/api/manager/maint", { params });
}

export function getMaintenanceDetail(maintenanceId) {
    return api(`/api/manager/maint/${maintenanceId}`);
}

export function createMaintenance(vehicleId, payload) {
    return api(`/api/manager/vehicles/${vehicleId}/maintenance`, {
        method: "POST",
        body: payload,
    });
}

export function updateMaintenance(vehicleId, recordId, payload) {
    return api(`/api/manager/vehicles/${vehicleId}/maintenance/${recordId}`, {
        method: "PUT",
        body: payload,
    });
}

export function deleteMaintenance(vehicleId, recordId) {
    return api(`/api/manager/vehicles/${vehicleId}/maintenance/${recordId}`, {
        method: "DELETE",
    });
}
