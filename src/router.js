import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from './store'
import http from './utils/http.js'

const router = createRouter({
	history: createWebHistory(
		import.meta.env.BASE_URL), scrollBehavior(to, from, savedPosition) {
			return {
				top: 0
			} // always scroll to top
		},
	routes: [
		{ path: '/', component: () => import('@/views/index.vue') },

		// { path: '/register/:id', meta: { auth: false, keepAlive: true }, component: () => import('@/views/Register.vue') },
		// { path: '/change/person/:id', meta: { auth: false }, component: () => import('@/views/ChangePerson.vue') },
		// { path: '/change/company/:id', meta: { auth: false }, component: () => import('@/views/ChangeCompany.vue') },
		// { path: '/binding/:code/:token', meta: { auth: false, title: "慧分账", }, component: () => import('@/views/Binding.vue') },
	]
})

const handler = (to, from, next) => {
	let store = useStore();
	if (to.meta && (to.meta.sign || to.meta.auth)) {
		if (store.authed) {
			next();
		} else {
			next({
				path: '/login',
				query: { redirect: to.fullPath }
			})
		}
	} else {
		next();
	}
}


router.beforeEach((to, from, next) => {
	// http://192.168.1.243:8081?sign_id=16946
	// 如果链接里面有 sign_id 表示是从签约网站完成签约后跳回的链接， 这时要将 sign_id取出并存入 store，
	// 以达到免密登录的目的。取出 sign_id 后需要将链接中的 sign_id 删除，否则不能跳转到首页
	let store = useStore()
	if (window.location.search.startsWith('?sign_id=')) {
		let sign_id = window.location.search.substring(9)
		store.setSignId(sign_id)
		window.location.href = window.location.href.replace(`?sign_id=${sign_id}`, '')

		handler(to, from, next)
		return
	}

	if (store.launched) {
		handler(to, from, next)
	} else {
		//首次访问先launch返回再往下走
		let data = {};
		http.post('/launch', data, { loading: false, feedback: false }).then(res => {
			let ajax = res.data;
			store.launch(ajax.data);
			document.title = ajax.data.config.title;
			handler(to, from, next);
		}).catch(err => {
			handler(to, from, next);
		});
	}
});
router.afterEach((to, from) => {
	if (to.meta && to.meta.title) {
	}
})

export default router
