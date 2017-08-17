<template>
  <div class="">
    <div class="shopcart">
      <div class="content">
        <div class="content-left" @click="toggleList">
          <!--购物车logo-->
          <div class="logo-wrapper" ref="logo">
            <div class="logo" :class="{'hightlight':totalCount > 0}">
              <i class="icon-shopping_cart" :class="{'hightlight':totalCount > 0}"></i>
            </div>
            <div class="num" v-show="totalCount > 0">{{totalCount>99?'99+':totalCount}}</div>
          </div>
          <div class="price" :class="{'hightlight':totalPrice > 0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
        <div class="ball-container">
          <transition name="drop" v-for="(ball,index) in balls" key="ball" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter" :key="index">
            <div v-show="ball.show" class="ball">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
        <transition name="fold">
          <div class="shopcart-list" v-show="listShow">
            <div class="list-header">
              <h1 class="title">购物车</h1>
              <span class="empty" @click="empty">清空</span>
            </div>
            <div class="list-content" ref="listContent">
              <ul>
                <li class="food" v-for="food in selectFoods" :key="food.name">
                  <span class="name">{{food.name}}</span>
                  <div class="price">
                    <span>￥{{food.price * food.count}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :event-hub="eventHub" :food="food"></cartcontrol>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script>
import cartcontrol from 'components/cartcontrol/cartcontrol';
import BScroll from 'better-scroll';
import animations from 'create-keyframe-animation';

export default {
  props: {
    // 选择到购物车的商品
    selectFoods: {
      type: Array,
      default() {
        return [];
      },
    },
    deliveryPrice: {
      type: Number,
      default: 0,
    },
    minPrice: {
      type: Number,
      default: 0,
    },
    eventHub: {
      type: Object,
    },
  },
  data() {
    return {
      balls: [{
        show: false,
      }, {
        show: false,
      }, {
        show: false,
      }, {
        show: false,
      }, {
        show: false,
      }],
      dropBalls: [],
      fold: true,
    };
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.selectFoods.forEach((food) => {
        total += food.price * food.count;
      }, this);
      return total;
    },
    totalCount() {
      let count = 0;
      this.selectFoods.forEach((food) => {
        count += food.count;
      });
      return count;
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}起送`;
      } else if (this.totalPrice < this.minPrice) {
        const diff = this.minPrice - this.totalPrice;
        return `还差￥${diff}起送`;
      }
      return '去结算';
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough';
      }
      return 'enough';
    },
    listShow() {
      if (!this.totalCount) {
        this.fold = true;
        return false;
      }
      const show = !this.fold;
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true,
            });
          } else {
            this.scroll.refresh();
          }
        });
      }
      return show;
    },
  },
  methods: {
    // 外部调用,传入点击的元素
    drop(el) {
      for (let i = 0; i < this.balls.length; i += 1) {
        const ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
          return;
        }
      }
    },
    beforeEnter(el) {
      let count = this.balls.length;
      while ((count -= 1) >= 0) {
        const ball = this.balls[count];
        if (ball.show) {
          // 获取点击元素的位置,ball.el在drop方法中设置
          const rect = ball.el.getBoundingClientRect();
          // 计算小球起始位置的x,y坐标
          const x = rect.left - 32;
          const y = -(window.innerHeight - rect.top - 32);

          // 设置小球的起始位置
          el.style.webkitTransform = `translate3D(0,${y}px,0)`;
          el.style.transform = `translate3D(0,${y}px,0)`;
          const inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = `translate3D(${x}px,0,0)`;
          inner.style.transform = `translate3D(${x}px,0,0)`;
        }
      }
    },
    enter(el, done) {
      /* eslint-disable no-unused-vars */
      const refresh = el.offsetHeight;// 触发浏览器重绘，offsetWidth、offsetTop等方法都可以触发
      el.style.display = ''; // 显示小球

      // 还原小球的位置
      el.style.webkitTransform = 'translate3D(0,0,0)';
      el.style.transform = 'translate3D(0,0,0)';
      const inner = el.getElementsByClassName('inner-hook')[0];
      inner.style.webkitTransform = 'translate3D(0,0,0)';
      inner.style.transform = 'translate3D(0,0,0)';
      el.addEventListener('transitionend', done);
    },
    afterEnter(el) {
      // 弹出下落小球数组中
      const ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false; // 设置小球的显示状态为flase
        el.style.display = 'none'; // 隐藏小球
      }
      // 创建购物车动画
      const animation = {
        0: {
          transform: 'scale(1)',
        },
        14.28: {
          transform: 'scale(0.8)',
        },
        28.57: {
          transform: 'scale(1.15)',
        },

        42.85: {
          transform: 'scale(0.92)',
        },

        57.14: {
          transform: 'scale(1.08)',
        },

        71.42: {
          transform: 'scale(0.99)',
        },

        85.71: {
          transform: 'scale(1.02)',
        },

        100: {
          transform: 'scale(1)',
        },
      };
      // 注册动画
      animations.registerAnimation({
        name: 'logoScale',
        animation,
        presets: {
          duration: 600,
          easing: 'ease-out',
        },
      });
      if (!this.$refs.logo.style.animation) {
        this.$refs.logo.style.animation = '';
      }
      // 开启动画
      animations.runAnimation(this.$refs.logo, 'logoScale', () => {
        animations.unregisterAnimation('logoScale');
        this.$refs.logo.style.animation = '';
      });
    },
    toggleList() {
      if (!this.totalCount) {
        return;
      }
      this.fold = !this.fold;
    },
    hideList() {
      this.fold = true;
    },
    empty() {
      this.selectFoods.forEach((food) => {
        food.count = 0;
      });
    },
    pay() {
      if (this.totalPrice < this.minPrice) {
        // return;
      }
      // window.alert(`支付${this.totalPrice}元`);
    },
  },
  components: {
    cartcontrol,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
@import "../../common/scss/mixin.scss";
// @import "../../common/scss/animation.scss";
.shopcart {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 50;
  width: 100%;
  height: 48px;
  background: #000;
  .content {
    display: flex;
    background: #141d27;
    font-size: 0;
    color: rgba(255, 255, 255, .4);
    .content-left {
      flex: 1;
      .logo-wrapper {
        display: inline-block;
        position: relative;
        top: -10px;
        margin: 0 12px;
        padding: 6px;
        width: 56px;
        height: 56px;
        box-sizing: border-box;
        vertical-align: top;
        border-radius: 50%;
        background: #141d27;
        .logo {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #2c363c;
          text-align: center;
          &.hightlight {
            background: rgb(0, 160, 220);
          }
          .icon-shopping_cart {
            line-height: 44px;
            font-size: 24px;
            color: #808589;
            &.hightlight {
              color: #fff
            }
          }
        }
        .num {
          position: absolute;
          padding: 1px 6px 0 6px;
          top: 0;
          right: 0;
          width: auto;
          height: 16px;
          line-height: 16px;
          text-align: center;
          border-radius: 16px;
          font-size: 9px;
          font-weight: 700;
          color: #fff;
          background: rgb(240, 20, 20);
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .4);
        }
      }
      .price {
        display: inline-block;
        vertical-align: top;
        line-height: 24px;
        margin-top: 12px;
        padding-right: 12px;
        box-sizing: border-box;
        border-right: 1px solid rgba(255, 255, 255, .1);
        font-size: 16px;
        font-weight: 700;
        color: rgba(255, 255, 255, .4);
        &.hightlight {
          color: #fff;
        }
      }
      .desc {
        display: inline-block;
        vertical-align: top;
        margin: 12px 0 0 12px;
        line-height: 24px;
        font-size: 12px;
      }
    }
    .content-right {
      flex: 0 0 105px;
      width: 105px;
      .pay {
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 12px;
        font-weight: 700;
        &.not-enough {
          background: #2c343a;
        }
        &.enough {
          background: #00b43c;
          color: #fff;
        }
      }
    }
  }
  .ball-container {
    .ball {
      position: fixed;
      left: 32px;
      bottom: 22px;
      z-index: 200;
      &.drop-enter,
      &.drop-enter-active {
        transition: all .4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
        .inner {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgb(0, 160, 220);
          transition: all .4s linear;
        }
      }
    }
  }
  .shopcart-list {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    transform: translate3d(0, -100%, 0);
    &.fold-enter-active,
    &.fold-leave-active {
      transition: all .5s;
    }
    &.fold-enter,
    &.fold-leave-active {
      transform: translate3d(0, 0, 0)
    }
    .list-header {
      height: 40px;
      line-height: 40px;
      padding: 0 18px;
      background: #f3f5f7;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      .title {
        float: left;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
      .empty {
        float: right;
        font-size: 12px;
        color: rgb(0, 160, 220);
      }
    }
    .list-content {
      padding: 0 18px;
      max-height: 217px;
      overflow: hidden;
      background: #fff;
      .food {
        position: relative;
        padding: 12px 0;
        box-sizing: border-box;
        @include border-1px(rgba(7, 17, 27, 0.1));
        .name {
          line-height: 24px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }
        .price {
          position: absolute;
          right: 90px;
          bottom: 12px;
          line-height: 24px;
          font-size: 14px;
          font-weight: 700;
          color: rgb(240, 20, 20);
        }
        .cartcontrol-wrapper {
          position: absolute;
          right: 0;
          bottom: 6px;
          color: rgb(7, 17, 27);
        }
      }
    }
  }
}

.list-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 40;
  backdrop-filter: blur(10px);
  transition: all .5s;
  opacity: 1;
  background: rgba(7, 17, 27, 0.6);
  &.fade-enter,
  &.fade-leave-active {
    opacity: 0;
    background: rgba(7, 17, 27, 0);
  }
}
</style>

