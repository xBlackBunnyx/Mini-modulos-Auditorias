import Home from "./components/Home/Home.vue";
import AuditDetails from "./components/Audit-Details/Audit-Details.vue";
import {createRouter, createWebHistory} from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {path:"/", component: Home},
        {path:"/audits/:id", name:'audit-detail', component:AuditDetails},
    ]
});

export default router;