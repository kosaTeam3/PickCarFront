import { api } from "./client";

// 네 백엔드 엔드포인트에 맞춰서 수정
export function getVehicleList(params) {
  return api("/api/manager/vehicles", { params });
}

export function getVehicleDetail(vehicleId) {
  return api(`/api/manager/vehicles/${vehicleId}`);
}

export function createVehicle(payload) {
  return api("/api/manager/vehicles", { method: "POST", body: payload });
}

export function updateVehicle(vehicleId, payload) {
  return api(`/api/manager/vehicles/${vehicleId}`, { method: "PUT", body: payload });
}

export function deleteVehicle(vehicleId) {
  return api(`/api/manager/vehicles/${vehicleId}`, { method: "DELETE" });
}
