import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

// routerの使用を宣言
Vue.use(Router)

// 遅延ローディング
const Login = () => import (/* webpackChunkName: "Login" */ "./components/pages/LoginPage.vue");
const Stamp = () => import (/* webpackChunkName: "Stamp" */ "./components/pages/StampPage.vue");

// mainで使用するためexportする
export default new Router({
    // ↓URLの#を消す
    mode: "history",
    routes: [
        {
            path: "/login",
            component: Login,
            // beforeEnterはページが読み込まれる前に発動する関数(router版ライフサイクルフックのようなもの)
            beforeEnter(to, from, next){
                // idトークンを持っていたら打刻画面を見れるようにする
                // おそらく.vueファイルではないからthis.$storeが使えない そのため、storeをimportしている
                if (store.getters.idToken) {
                    next('/stamp')
                // idトークンを持っていなければログイン画面
                } else {
                    next()
                }
            }
        },
        {
            path: "/stamp",
            component: Stamp,
            beforeEnter(to, from, next) {
                if (store.getters.idToken) {
                    next()
                } else {
                    next('/login')
                }
            }
        }
    ]

})
