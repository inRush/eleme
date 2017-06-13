import Vue from 'vue';
import Router from 'vue-router';
import Goods from 'components/goods/goods';
import Ratings from 'components/ratings/ratings';
import Sellers from 'components/sellers/sellers';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/',
    redirect: '/goods',
  }, {
    path: '/goods',
    name: 'Goods',
    component: Goods,
  }, {
    path: '/rating',
    name: 'Rating',
    component: Ratings,
  }, {
    path: '/seller',
    name: 'Seller',
    component: Sellers,
  }],
  linkActiveClass: 'active', //设置选中后添加的class
});
