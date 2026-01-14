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
