<template>
  <transition name="seller">
    <div class="seller" ref="seller">
      <div class="seller-content">
        <div class="overview">
          <h1 class="title">{{seller.name}}</h1>
          <div class="desc border-1px">
            <star :size="36" :score="seller.score"></star>
            <span class="text">({{seller.ratingCount}})</span>
            <span class="text">月售{{seller.sellCount}}单</span>
          </div>
          <ul class="remark">
            <li class="block">
              <h2>起送价</h2>
              <div class="content">
                <span class="stress">{{seller.minPrice}}</span>元
              </div>
            </li>
            <li class="block">
              <h2>商家配送</h2>
              <div class="content">
                <span class="stress">{{seller.deliveryPrice}}</span>元
              </div>
            </li>
            <li class="block">
              <h2>平均配送时间</h2>
              <div class="content">
                <span class="stress">{{seller.deliveryTime}}</span>分钟
              </div>
            </li>
          </ul>
          <div class="favorite" @click="toggleFavorite">
            <span class="icon-favorite" :class="{'active':favorite}"></span>
            <span class="text">{{favoriteText}}</span>
          </div>
        </div>
        <split></split>
        <div class="bulletin">
          <h1 class="title">公告与活动</h1>
          <div class="content-wrapper border-1px">
            <p class="content">{{seller.bulletin}}</p>
          </div>
          <ul v-if="seller.supports" class="supports">
            <li class="support-item border-1px" v-for="(item ,index) in seller.supports">
              <span class="icon" :class="classMap[seller.supports[index].type]"></span>
              <span class="text">{{seller.supports[index].description}}</span>
            </li>
          </ul>
        </div>
        <split></split>
        <div class="pics">
          <h1 class="title">商家实景</h1>
          <div class="pic-wrapper" ref="picWrapper">
            <ul class="pic-list" ref="picList">
              <li class="pic-item" v-for="pic in seller.pics">
                <img :src="pic" width="120" height="90">
              </li>
            </ul>
          </div>
        </div>
        <div class="info">
          <h1 class="title border-1px">商家信息</h1>
          <ul>
            <li class="info-item border-1px" v-for="info in seller.infos">{{info}}</li>
          </ul>
        </div>
      </div>
    </div>
  </transition>
</template>


<script>
import BScroll from 'better-scroll';
import star from 'components/star/star';
import split from 'components/split/split';
import { saveToLocal, loadFromLocal } from 'common/js/store';

export default {
  props: {
    seller: {
      type: Object,
    },
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  },
  mounted() {
    this.$nextTick(() => {
      this._initScroll();
      this._initPicsScroll();
    });
  },
  data() {
    return {
      favorite: (() => {
        const favorite = loadFromLocal(this.seller.id, 'favorite', false);
        return favorite;
      })(),
    };
  },
  computed: {
    favoriteText() {
      return this.favorite ? '已收藏' : '收藏';
    },
  },
  watch: {
    seller() {
      // 在获取seller后,不能立刻初始化,scroll,因为可能页面还没有将seller的信息渲染上去,scroll不能计算正确的高度
      this.$nextTick(() => {
        this._initScroll();
        this._initPicsScroll();
      });
    },
  },
  methods: {
    _initScroll() {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.seller, {
          click: true,
        });
      } else {
        this.scroll.refresh();
      }
    },
    _initPicsScroll() {
      if (this.seller.pics) {
        const picWidth = 120;
        const margin = 6;
        const width = ((picWidth + margin) * this.seller.pics.length) - margin;
        this.$refs.picList.style.width = ''.concat(width).concat('px');
        this.$nextTick(() => {
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picWrapper, {
              scrollX: true,
              eventPassthrough: 'vertical',
            });
          } else {
            this.scroll.refresh();
          }
        });
      }
    },
    toggleFavorite(event) {
      if (!event._constructed) {
        return;
      }
      this.favorite = !this.favorite;
      saveToLocal(this.seller.id, 'favorite', this.favorite);
    },
  },
  components: {
    star,
    split,
  },
};
</script>

<style lang="scss">
@import '../../common/scss/mixin.scss';

.seller {
  position: absolute;
  top: 174px;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  transition: all .3s;
  opacity: 1;
  &.seller-enter,
  &.seller-leave-active {
    opacity: 0;
  }
  .overview {
    padding: 18px;
    position: relative;
    .title {
      margin-bottom: 8px;
      line-height: 14px;
      font-size: 14px;
      color: rgb(7, 17, 27);
    }
    .desc {
      padding-bottom: 18px;
      @include border-1px(rgba(7, 17, 27, .1));
      font-size: 0;
      .star {
        display: inline-block;
        margin-right: 8px;
        vertical-align: top
      }
      .text {
        display: inline-block;
        margin-right: 12px;
        vertical-align: top;
        line-height: 18px;
        font-size: 10px;
        color: rgb(77, 85, 93);
      }
    }
    .remark {
      display: flex;
      margin-top: 18px;
      .block {
        flex: 1;
        text-align: center;
        border-right: 1px solid rgba(7, 17, 27, .1);
        &:last-child {
          border: none;
        }
        h2 {
          margin-bottom: 4px;
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
        .content {
          line-height: 24px;
          font-size: 10px;
          color: rgb(7, 17, 27);
          .stress {
            font-size: 24px;
          }
        }
      }
    }
    .favorite {
      position: absolute;
      width: 50px;
      top: 18px;
      right: 8px;
      text-align: center;
      .icon-favorite {
        display: block;
        margin-bottom: 4px;
        line-height: 24px;
        font-size: 24px;
        color: #d4d6d9;
        transition: all .2s linear;
        &.active {
          color: rgb(240, 20, 20);
        }
      }
      .text {
        line-height: 10px;
        font-size: 10px;
        color: rgb(77, 85, 93);
      }
    }
  }
  .bulletin {
    padding: 18px 18px 0 18px;
    .title {
      margin-bottom: 8px;
      line-height: 14px;
      font-size: 14px;
      color: rgb(7, 17, 27);
    }
    .content-wrapper {
      padding: 0px 12px 16px 12px;
      @include border-1px(rgba(7, 17, 27, .1));
      .content {
        line-height: 24px;
        font-size: 12px;
        color: rgb(240, 20, 20);
      }
    }
    .supports {
      .support-item {
        padding: 16px 12px;
        font-size: 0;
        @include border-1px(rgba(7, 17, 27, .1));
        &:last-child {
          @include border-none();
        }
        .icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          vertical-align: top;
          margin-right: 6px;
          background-size: 16px 16px;
          background-repeat: no-repeat;
          &.decrease {
            @include bg-image('decrease_4');
          }
          &.discount {
            @include bg-image('discount_4');
          }
          &.guarantee {
            @include bg-image('guarantee_4');
          }
          &.invoice {
            @include bg-image('invoice_4');
          }
          &.special {
            @include bg-image('special_4');
          }
        }
        .text {
          line-height: 16px;
          font-size: 12px;
          color: rgb(7, 17, 27);
        }
      }
    }
  }
  .pics {
    padding: 18px;
    .title {
      margin-bottom: 12px;
      line-height: 14px;
      font-size: 14px;
      color: rgb(7, 17, 27);
    }
    .pic-wrapper {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      .pic-list {
        font-size: 0;
        .pic-item {
          display: inline-block;
          margin-right: 6px;
          width: 120px;
          height: 90px;
          &:last-child {
            margin: 0;
          }
        }
      }
    }
  }
  .info {
    padding: 18px 18px 0 18px;
    color: rgb(7, 17, 27);
    .title {
      padding-bottom: 12px;
      line-height: 14px;
      @include border-1px(rgba(7, 17, 27, .1));
      font-size: 14px;
    }
    .info-item {
      padding: 16px 12px;
      @include border-1px(rgba(7, 17, 27, .1));
      font-size: 12px;
      line-height: 16px;
      &:last-child {
        @include border-none();
      }
    }
  }
}
</style>

