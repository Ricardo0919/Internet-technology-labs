/*
  Supported game modes.
  - PVP: Player vs Player
  - PVC: Player vs Computer
*/
export type GameMode = "PVP" | "PVC";

// Possible lifecycle states of a game.
export type GameStatus = "WAITING_FOR_PLAYER" | "IN_PROGRESS" | "FINISHED";

// Mark placed on the board. 'null' represents an empty cell after normalization.
export type Mark = "X" | "O" | null;

// Core game state as returned by the backend. This interface represents a snapshot of the game at any point in time.
export interface Game {
    id: string;
    mode: GameMode;
    status: GameStatus;
    board: Mark[][];
    currentTurn: "X" | "O";
    winner?: "X" | "O" | "DRAW" | null;
}
