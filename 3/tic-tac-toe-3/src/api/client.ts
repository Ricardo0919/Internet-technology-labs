/*
  Base URL for all API requests.
  - When using Vite proxy in development, this defaults to "/api"
*/
const BASE = (import.meta.env.VITE_API_BASE_URL as string) || "/api";

/*
  Builds the default request headers.
  The playerId is sent on every request to identify the client
  without requiring an explicit authentication flow.
*/
function buildHeaders(extra?: HeadersInit): HeadersInit {
    const playerId = localStorage.getItem("playerId");
    return {
        "Content-Type": "application/json",

        // Backend uses this header to associate requests with a player
        ...(playerId ? { "X-Player-Id": playerId } : {}),

        // Allow callers to extend or override headers when needed
        ...(extra ?? {}),
    };
}

/*
  Centralized request helper for all REST API calls.
  Handles:
  - base URL resolution
  - header construction
  - error normalization
*/
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        ...options,
        headers: buildHeaders(options.headers),
    });

    // Convert non-2xx responses into readable errors
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `${res.status} ${res.statusText}`);
    }

    return res.json() as Promise<T>;
}

// Public API client exposed to the rest of the application.
export const api = { request };

// Exported for use in WebSocket URL derivation.
export const API_BASE_URL = BASE;
