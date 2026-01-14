export function extractContent(res) {
    const data = res?.data ?? res;

    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.content)) return data.content;

    return [];
}