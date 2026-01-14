import {api} from "./client";

export function getMaintenanceList(vehicleId, params) {
    // 예: /api/manager/vehicles/{id}/maintenance
    return api(`/api/manager/vehicles/${vehicleId}/maintenance`, {params});
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
