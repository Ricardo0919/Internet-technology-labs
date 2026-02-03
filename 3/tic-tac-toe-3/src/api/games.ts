import { api } from "./client";
import type { Game, GameMode } from "../types/ticTac";

/*
  Creates a new game instance.
  - PVP: waits for a second player to join
  - PVC: starts immediately against the computer
*/
export async function createGame(mode: GameMode) {
    return api.request<Game>("/games", {
        method: "POST",
        body: JSON.stringify({ mode }),
    });
}

/*
  Retrieves all PVP games that are waiting for a second player.
  Used to populate the PVP lobby.
*/
export async function listWaitingPvpGames() {
    return api.request<{ games: Game[] }>("/games?mode=PVP&status=WAITING_FOR_PLAYER");
}

/*
  Joins an existing PVP game.
  After a successful join, the game transitions to IN_PROGRESS.
*/
export async function joinGame(gameId: string) {
    return api.request<Game>(`/games/${gameId}/join`, { method: "POST" });
}

/*
  Fetches the current state of a game.
  Used for:
  - initial load
  - manual refresh
  - polling fallback when WebSocket is unavailable
*/
export async function getGame(gameId: string) {
    return api.request<Game>(`/games/${gameId}`);
}

/*
  Sends a move to the backend.
  The server validates the move and returns the updated game state.
*/
export async function makeMove(gameId: string, row: number, col: number) {
    return api.request<Game>(`/games/${gameId}/moves`, {
        method: "POST",
        body: JSON.stringify({ row, col }),
    });
}
