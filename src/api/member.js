import {api} from "./client";

export function getMemberList(params) {
    return api("/api/manager/members", {params});
}

export function getMemberDetail(memberId) {
    return api(`/api/manager/members/${memberId}`);
}

export function createMember(payload) {
    return api("/api/manager/members", {method: "POST", body: payload});
}

export function updateMember(memberId, payload) {
    return api(`/api/manager/members/${memberId}`, {method: "PUT", body: payload});
}

export function deleteMember(memberId) {
    return api(`/api/manager/members/${memberId}`, {method: "DELETE"});
}
