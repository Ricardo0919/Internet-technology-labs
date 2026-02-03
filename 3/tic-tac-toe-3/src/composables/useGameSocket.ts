import { onBeforeUnmount, ref } from "vue";
import type { Game } from "../types/ticTac";
import { API_BASE_URL } from "../api/client";

/*
  Translates the HTTP API base URL into a WebSocket-compatible base.
  This allows the same code to work with:
  - local development
  - Vite proxy setups (e.g. /api -> /ws)
  - http/https deployments
*/
function toWsBase(httpBase: string) {
    // When using a Vite proxy, HTTP requests go through /api
    // and WebSocket connections are exposed under /ws
    if (httpBase === "/api") return "/ws";
    
    if (httpBase.startsWith("https://")) return httpBase.replace("https://", "wss://");
    if (httpBase.startsWith("http://")) return httpBase.replace("http://", "ws://");
    
    return httpBase;
}

/*
  Composable responsible for managing a WebSocket connection
  for a specific game instance.
  It provides:
  - real-time game updates
  - automatic reconnect handling
  - graceful cleanup on component unmount
*/
export function useGameSocket(opts: {
    gameId: string;
    onGame: (g: Game) => void;
    onError?: (msg: string) => void;
}) {
    // Reactive connection state exposed to the UI
    const isConnected = ref(false);
    const lastMessageAt = ref<number | null>(null);

    let ws: WebSocket | null = null;
    let reconnectTimer: number | null = null;
    let closedManually = false;

    /*
        Establishes the WebSocket connection.
        If the connection closes unexpectedly, it will automatically retry.
    */
    function connect() {
        closedManually = false;

        const wsBase = toWsBase(API_BASE_URL);
        const url = `${wsBase}/ws/games/${opts.gameId}`;

        ws = new WebSocket(url);

        ws.onopen = () => {
            isConnected.value = true;
        };

        ws.onmessage = (ev) => {
            lastMessageAt.value = Date.now();

            try {
                const data = JSON.parse(ev.data);

                // Some messages wrap the game state inside a payload object
                const g = data?.payload ?? data;

                // Normalize backend responses (gameId vs id)
                if (g && !g.id && g.gameId) g.id = g.gameId;

                opts.onGame(g as Game);
            } catch (e: any) {
                opts.onError?.(`WS parse error: ${e?.message ?? String(e)}`);
            }
        };

        ws.onerror = () => {
            // Browser WebSocket errors usually lack detail,
            // so the close handler is used for reconnection logic
            opts.onError?.("WebSocket error");
        };

        ws.onclose = () => {
            isConnected.value = false;

            // Automatically reconnect unless the connection
            // was intentionally closed by the client
            if (!closedManually) {
                if (reconnectTimer) window.clearTimeout(reconnectTimer);
                reconnectTimer = window.setTimeout(() => {
                    connect();
                }, 800);
            }
        };
    }

    /*
        Closes the WebSocket connection and prevents
        automatic reconnection attempts.
    */
    function disconnect() {
        closedManually = true;
        if (reconnectTimer) window.clearTimeout(reconnectTimer);
        reconnectTimer = null;

        try {
            ws?.close();
        } catch {}
        ws = null;
        isConnected.value = false;
    }

    /*
        Ensure the WebSocket connection is properly closed
        when the hosting component is unmounted.
    */
    onBeforeUnmount(() => {
        disconnect();
    });

    return { connect, disconnect, isConnected, lastMessageAt };
}
