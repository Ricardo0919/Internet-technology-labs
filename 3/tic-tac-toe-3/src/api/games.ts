import { api } from "./client";
import type { Game, GameMode } from "../types/ticTac";

export async function createGame(mode: GameMode) {
    return api.request<Game>("/games", {
        method: "POST",
        body: JSON.stringify({ mode }),
    });
}

export async function listWaitingPvpGames() {
    return api.request<{ games: Game[] }>("/games?mode=PVP&status=WAITING_FOR_PLAYER");
}

export async function joinGame(gameId: string) {
    return api.request<Game>(`/games/${gameId}/join`, { method: "POST" });
}

export async function getGame(gameId: string) {
    return api.request<Game>(`/games/${gameId}`);
}

export async function makeMove(gameId: string, row: number, col: number) {
    return api.request<Game>(`/games/${gameId}/moves`, {
        method: "POST",
        body: JSON.stringify({ row, col }),
    });
}
