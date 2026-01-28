export type GameMode = "PVP" | "PVC";
export type GameStatus = "WAITING_FOR_PLAYER" | "IN_PROGRESS" | "FINISHED";
export type Mark = "X" | "O" | null;

export interface Game {
    id: string;
    mode: GameMode;
    status: GameStatus;
    board: Mark[][];
    currentTurn: "X" | "O";
    winner?: "X" | "O" | "DRAW" | null;

    xPlayerId?: string;
    oPlayerId?: string;
}
