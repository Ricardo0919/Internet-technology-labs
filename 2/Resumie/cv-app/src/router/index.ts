import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import LookJobs from "../pages/LookJobs.vue";

// Centralized route map: keeps navigation consistent and makes it easy to scale
const router = createRouter({
    history: createWebHistory(),

    // Route-level configuration: name is used for stable navigation (router.push({ name }))
    // so links don’t break if paths change later.
    routes: [
        { path: "/", name: "home", component: Home },
        { path: "/look-jobs", name: "look-jobs", component: LookJobs },
    ],

    // UX: normalize scroll on navigation.
    // - If the route contains a hash (#section), smooth-scroll to that anchor.
    // - Otherwise, reset to top so users don’t land mid-page after route changes.
    scrollBehavior(to) {
        if (to.hash) return { el: to.hash, behavior: "smooth" };
        return { top: 0 };
    },
});

export default router;
