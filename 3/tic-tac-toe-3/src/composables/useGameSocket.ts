import { onBeforeUnmount, ref } from "vue";
import type { Game } from "../types/ticTac";
import { API_BASE_URL } from "../api/client";

function toWsBase(httpBase: string) {
    // http://localhost:8080 -> ws://localhost:8080
    // https://... -> wss://...
    if (httpBase.startsWith("https://")) return httpBase.replace("https://", "wss://");
    if (httpBase.startsWith("http://")) return httpBase.replace("http://", "ws://");
    return httpBase;
}

export function useGameSocket(opts: {
    gameId: string;
    onGame: (g: Game) => void;
    onError?: (msg: string) => void;
}) {
    const isConnected = ref(false);
    const lastMessageAt = ref<number | null>(null);

    let ws: WebSocket | null = null;
    let reconnectTimer: number | null = null;
    let closedManually = false;

    function connect() {
        closedManually = false;

        const wsBase = toWsBase(API_BASE_URL);
        const url = `${wsBase}/ws/games/${opts.gameId}`;

        // Nota: browsers NO permiten custom headers en WebSocket.
        // Si el backend necesita playerId, normalmente lo resuelve por session/cookie
        // o el endpoint WS no requiere header.
        ws = new WebSocket(url);

        ws.onopen = () => {
            isConnected.value = true;
        };

        ws.onmessage = (ev) => {
            lastMessageAt.value = Date.now();

            try {
                const data = JSON.parse(ev.data);

                // Algunos WS mandan {type:"game", payload:{...}}
                const g = data?.payload ?? data;

                // Ajusta si backend usa gameId en vez de id
                if (g && !g.id && g.gameId) g.id = g.gameId;

                opts.onGame(g as Game);
            } catch (e: any) {
                opts.onError?.(`WS parse error: ${e?.message ?? String(e)}`);
            }
        };

        ws.onerror = () => {
            // no siempre trae detalle; lo manejamos con close
            opts.onError?.("WebSocket error");
        };

        ws.onclose = () => {
            isConnected.value = false;

            // Reconnect automático si no lo cerraste tú
            if (!closedManually) {
                if (reconnectTimer) window.clearTimeout(reconnectTimer);
                reconnectTimer = window.setTimeout(() => {
                    connect();
                }, 800);
            }
        };
    }

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

    // cleanup automático si lo usas dentro de un componente
    onBeforeUnmount(() => {
        disconnect();
    });

    return { connect, disconnect, isConnected, lastMessageAt };
}
