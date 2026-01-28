import { api } from "./client";

export async function createPlayer(name: string): Promise<{ playerId: string } > {
    return api.request("/players", {
        method: "POST",
        body: JSON.stringify({ name }),
    });
}
