import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import LookJobs from "../pages/LookJobs.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", name: "home", component: Home },
        { path: "/look-jobs", name: "look-jobs", component: LookJobs },
    ],
    scrollBehavior(to) {
        if (to.hash) return { el: to.hash, behavior: "smooth" };
        return { top: 0 };
    },
});

export default router;
