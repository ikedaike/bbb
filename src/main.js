import Vue from 'vue'
import App from './App.vue'
import store from './store';
import router from './router';

// bootstrap-vueからBootstrapVueをインポートする
import { BootstrapVue } from 'bootstrap-vue' 
// Bootstrap と BootstrapVueのCSSファイルをインポート（順序はBootstrap⇒BootstrapVue）
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// BootstrapVueをプロジェクト全体で利用できるようにする
Vue.use(BootstrapVue)

Vue.config.productionTip = false

new Vue({
  // ↓es6の書き方 store: storeと同意
  store,
  router,
  render: h => h(App),
}).$mount('#app')
