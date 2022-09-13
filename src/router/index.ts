import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Search from "../views/Search.vue";
import Profile from "../views/Profile.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Missing404 from "../views/404.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/search/:search?/:location?",
			name: "Search",
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: Search,
			// component: SoloSearch,
		},
		{
			path: "/profile/:uid?",
			name: "Profile",
			component: Profile,
		},
		{
			path: "/login",
			name: "Login",
			component: Login,
		},
		{
			path: "/register",
			name: "Register",
			component: Register,
		},
		{
			path: "/:pathMatch(.*)*",
			name: "404 Not Found",
			component: () => Missing404,
		},
	],
});

export default router;
