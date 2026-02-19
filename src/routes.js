import Home from "./components/Home/Home.vue";
import {createRouter, createWebHistory} from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {path:"/", component: Home}
    ]
});

export default router;