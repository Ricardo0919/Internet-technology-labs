import { api } from "./client";

/*
  Creates a new player in the backend.
  This endpoint is called once during registration and returns
  a unique playerId used to identify the user in all subsequent requests.
*/
export async function createPlayer(name: string): Promise<{ playerId: string } > {
    return api.request("/players", {
        method: "POST",

        // Player name is sent in the request body as JSON
        body: JSON.stringify({ name }),
    });
}
