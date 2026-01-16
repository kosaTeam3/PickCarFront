// 1. 기본 설정 및 유틸리티 함수
const DEFAULT_HEADERS = {
    "Content-Type": "application/json",
};

function buildUrl(baseUrl, path, params) {
    const url = new URL(path, baseUrl || window.location.origin);

    if (params && typeof params === "object") {
        Object.entries(params).forEach(([k, v]) => {
            if (v === undefined || v === null) return;
            url.searchParams.set(k, String(v));
        });
    }

    if (!baseUrl) {
        const qs = url.searchParams.toString();
        return qs ? `${path}?${qs}` : path;
    }

    return url.toString();
}

// 2. 핵심 API 호출 함수 (도구)
export async function api(path, options = {}) {
    const {
        method = "GET",
        body,
        token,
        params,
        headers,
        signal,
    } = options;

    const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
    const url = buildUrl(baseUrl, path, params);

    const res = await fetch(url, {
        method,
        headers: {
            ...DEFAULT_HEADERS,
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
            ...(headers || {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        signal,
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        const error = new Error(`HTTP ${res.status} ${res.statusText} ${text}`);
        error.status = res.status;
        error.body = text;
        throw error;
    }

    if (res.status === 204) return undefined;

    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
        return await res.json();
    }

    return await res.text();
}

// 3. 회원 관리 서비스 로직 (사용처)
// 같은 파일 안에 있으므로 import 필요 없이 바로 api 함수를 사용합니다.
export const clientService = {
  getClients: () => 
    api("/api/manager/client"),
  
  searchClients: (keyword) => 
    api("/api/manager/client", { params: { keyword } }),
  
  getClientDetail: (clientId) => 
    api(`/api/manager/client/${clientId}`),
  
  getRentHistory: (clientId) => 
    api(`/api/manager/client/rent/${clientId}`),

  getAccidentHistory: (clientId) => 
    api(`/api/manager/client/accident/${clientId}`),
  
  addBlacklist: (clientId, data) => 
    api(`/api/manager/client/black/${clientId}`, {
      method: "POST",
      body: data
    }),
};