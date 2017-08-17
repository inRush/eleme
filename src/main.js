/*
 * @Author: hwj
 * @Date: 2017-05-08 19:28:35
 * @Last Modified by: inRush
 * @Last Modified time: 2017-08-17 18:07:10
 */

import Vue from 'vue';
import fastclick from 'fastclick';
import App from './App';
import router from './router';
import './common/scss/index.scss';

Vue.config.productionTip = false;
fastclick.attach(document.body);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App,
  },
});
