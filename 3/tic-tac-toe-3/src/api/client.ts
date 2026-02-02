const BASE = (import.meta.env.VITE_API_BASE_URL as string) || "/api";
// /api sirve si usas proxy de Vite. Si no, pon el full URL en .env

function buildHeaders(extra?: HeadersInit): HeadersInit {
    const playerId = localStorage.getItem("playerId");
    return {
        "Content-Type": "application/json",
        ...(playerId ? { "X-Player-Id": playerId } : {}),
        ...(extra ?? {}),
    };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        ...options,
        headers: buildHeaders(options.headers),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `${res.status} ${res.statusText}`);
    }

    return res.json() as Promise<T>;
}

export const api = { request };
export const API_BASE_URL = BASE;
