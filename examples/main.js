import Vue from 'vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';

import '@/styles/index.scss'; // global css

import App from './App.vue';

Vue.use(ElementUI);

/* 全局注册 */

/* 统一加载: prod */
// import CCEditor from '@chaincloud/cceditor'
// Vue.use(CCEditor)

/* 只加载CCTopology: prod */
// import { CCTopology } from '@chaincloud/cceditor'
// Vue.use(CCTopology)

/* 统一加载: dev */
// import CCEditor from '../packages/index'
// Vue.use(CCEditor)

/* 只加载CCTopology: dev */
// import { CCTopology } from '../packages/index';
// Vue.use(CCTopology);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
