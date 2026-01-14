import { api } from "./client";

export function getBranchList(params) {
  // params 예시: { page: 0, size: 20, sort: "name,asc" }
  return api("/api/manager/branches", { params });
}

export function getBranchDetail(branchId) {
  return api(`/api/manager/branches/${branchId}`);
}

export function createBranch(payload) {
  return api("/api/manager/branches", { method: "POST", body: payload });
}

export function updateBranch(branchId, payload) {
  return api(`/api/manager/branches/${branchId}`, { method: "PUT", body: payload });
}

export function deleteBranch(branchId) {
  return api(`/api/manager/branches/${branchId}`, { method: "DELETE" });
}

export function toBranchUiModel(dto) {
    return {
        id: dto.branchId,
        name: dto.branchName ?? "",
        phone: dto.branchPhoneNumber ?? "",
        address: dto.branchAddress ?? "",
        managerId: dto.managerId ?? null,
        managerName: dto.managerName ?? "-",
        employeeCount: dto.employeeCount ?? 0,
        vehicleCount: dto.carCount ?? 0,
    };
}