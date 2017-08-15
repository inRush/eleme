/*
 * @Author: hwj
 * @Date: 2017-05-08 19:28:35
 * @Last Modified by: hwj
 * @Last Modified time: 2017-06-15 22:31:31
 */

import Vue from 'vue';
import App from './App';
import router from './router';
import './common/scss/index.scss';

Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App,
  },
});
