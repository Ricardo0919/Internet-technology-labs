import { createRouter, createWebHistory } from "vue-router";
import Register from "../pages/Register.vue";
import Mode from "../pages/Mode.vue";
import LobbyPvp from "../pages/LobbyPvp.vue";
import Game from "../pages/Game.vue";

function hasPlayer() {
    return Boolean(localStorage.getItem("playerId"));
}

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", redirect: () => (hasPlayer() ? "/mode" : "/register") },
        { path: "/register", component: Register },
        { path: "/mode", component: Mode },
        { path: "/lobby", component: LobbyPvp },
        { path: "/game/:gameId", component: Game, props: true },
    ],
});
