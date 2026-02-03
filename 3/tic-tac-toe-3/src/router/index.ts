import { createRouter, createWebHistory } from "vue-router";
import Register from "../pages/Register.vue";
import Mode from "../pages/Mode.vue";
import LobbyPvp from "../pages/LobbyPvp.vue";
import Game from "../pages/Game.vue";

/*
  Checks whether a player has already been registered.
  The presence of 'playerId' in localStorage is used as a lightweight
  client-side session indicator.
*/
function hasPlayer() {
    return Boolean(localStorage.getItem("playerId"));
}

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        /*
            Entry point of the application.
            If a player is already registered, skip registration and go
            directly to the mode selection screen.
        */
        { path: "/", redirect: () => (hasPlayer() ? "/mode" : "/register") },
        
        // Player registration view
        { path: "/register", component: Register },
        
        // Game mode selection (PVP / PVC)
        { path: "/mode", component: Mode },
        
        // PVP lobby: create or join multiplayer games
        { path: "/lobby", component: LobbyPvp },
        
        // Game view: 'props: true' passes the dynamic route parameter (gameId) directly to the component, keeping it decoupled from the router API.
        { path: "/game/:gameId", component: Game, props: true },
    ],
});
