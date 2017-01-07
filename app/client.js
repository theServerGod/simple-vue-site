import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';

// Import styles {{{
import './app.css';
// }}}

// Import media assets {{{
import '!file-loader?name=img/logo.[ext]!./assets/logo.png'; // Load main site logo; need to explicitly override file-loader pattern
// }}}

// Import Vue app components {{{
import App from './App.vue';
import Home from './components/Home.page.vue';
import Terms from './components/Terms.page.vue';
// }}}

Vue.use(VueRouter);
Vue.use(VueResource);

// Define app router
const router = new VueRouter({
	routes: [
		{path: '/', component: Home},
		{path: '/tc', component: Terms},
		{path: '*', component: Home, beforeEnter: (to, from, next) => next('/')} // Handle all other routes; nav guard to always redirect to `/`
	],
	mode: 'history',
	linkActiveClass: 'active',
	scrollBehavior(to, from, savedPosition) {
		if (to.hash) return {selector: to.hash};
		if (savedPosition) return savedPosition;
		return {x: 0, y: 0}; // Default to scrolling to top of page
	}
});

// Instantiate Vue
new Vue({
	el: '#app',
	router,
	render: h => h(App)
});
