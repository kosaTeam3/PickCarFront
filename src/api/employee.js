import { api } from "./client";

export function getEmployeeList(params) {
  return api("/api/manager/employees", { params });
}

export function getEmployeeDetail(employeeId) {
  return api(`/api/manager/employees/${employeeId}`);
}

export function createEmployee(payload) {
  return api("/api/manager/employees", { method: "POST", body: payload });
}

export function updateEmployee(employeeId, payload) {
  return api(`/api/manager/employees/${employeeId}`, { method: "PUT", body: payload });
}

export function deleteEmployee(employeeId) {
  return api(`/api/manager/employees/${employeeId}`, { method: "DELETE" });
}

export function toEmployeeUiModel(dto){
    return null
}
