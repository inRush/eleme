
<template>
  <transition name="ratings">
    <div class="ratings" ref="ratings">
      <div class="ratings-content">
        <div class="overview">
          <div class="overview-left">
            <h1 class="score">{{seller.score}}</h1>
            <div class="title">综合评分</div>
            <div class="rank">高于周边商家{{seller.rankRate}}%</div>
          </div>
          <div class="overview-right">
            <div class="score-wrapper">
              <span class="title">服务态度</span>
              <star :size="36" :score="seller.serviceScore"></star>
              <span class="score">{{seller.serviceScore}}</span>
            </div>
            <div class="score-wrapper">
              <span class="title">商品评分</span>
              <star :size="36" :score="seller.foodScore"></star>
              <span class="score">{{seller.foodScore}}</span>
            </div>
            <div class="delivery-wrapper">
              <span class="title">送达时间</span>
              <span class="delivery">{{seller.deliveryTime}}分钟</span>
            </div>
          </div>
        </div>
        <split></split>
        <ratingselect @onPropsChange="ratingSelectChange" :select-type="selectType" :only-content="onlyContent" :ratings="ratings"></ratingselect>
        <div class="rating-wrapper">
          <ul>
            <transition name="rating" key="rating.username" v-for="rating in ratings" :key="rating.rateType">
              <li v-show="needShow(rating.rateType,rating.text)" class="rating-item">
                <div class="avatar">
                  <img width="28" height="28" :src="rating.avatar">
                </div>
                <div class="content">
                  <h1 class="name">{{rating.username}}</h1>
                  <div class="star-wrapper">
                    <star :size="24" :score="rating.score"></star>
                    <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
                  </div>
                  <p class="text">{{rating.text?rating.text:"该用户没有评价内容"}}</p>
                  <div class="recommend" v-show="rating.recommend && rating.recommend.length>0">
                    <span class="icon-thumb_up"></span>
                    <span class="item" v-for="item in rating.recommend" :key="item">{{item}}</span>
                  </div>
                  <div class="time">{{rating.rateTime | formatDate}}</div>
                </div>
              </li>
            </transition>
          </ul>
        </div>
      </div>
    </div>
  </transition>
</template>


<script>
import axios from 'axios';
import BScroll from 'better-scroll';
import star from 'components/star/star';
import split from 'components/split/split';
import ratingselect from 'components/ratingselect/ratingselect';
import formatDate from 'common/js/date';

/* eslint-disable no-unused-vars */
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;
const ERR_OK = 0;

export default {
  props: {
    seller: {
      type: Object,
    },
  },
  created() {
    axios.get('/api/ratings').then((response) => {
      const res = response.data;
      if (res.errno === ERR_OK) {
        this.ratings = res.data;
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.ratings, {
              click: true,
            });
          }
        });
      }
    });
  },
  data() {
    return {
      ratings: [],
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
    };
  },
  methods: {
    ratingSelectChange(propName, newVal, oldVal) {
      this[propName] = newVal;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    needShow(type, text) {
      if (this.onlyContent && !text) {
        return false;
      }
      if (this.selectType === ALL) {
        return true;
      }
      return type === this.selectType;
    },
  },
  filters: {
    formatDate(time) {
      const date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm');
    },
  },
  components: {
    star,
    split,
    ratingselect,
  },
};
</script>

<style lang="scss">
@import '../../common/scss/mixin.scss';

.ratings {
  position: absolute;
  top: 174px;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  transition: all .3s;
  opacity: 1;
  &.ratings-enter,
  &.ratings-leave-active {
    opacity: 0;
  }
  .overview {
    display: flex;
    padding: 18px 0;
    .overview-left {
      flex: 0 0 137px;
      width: 137px;
      border-right: 1px solid rgba(7, 17, 27, .1);
      text-align: center;
      @media only screen and (max-width: 320px) {
        flex: 0 0 120px;
        width: 120px;
      }
      padding: 6px 0;
      .score {
        margin-bottom: 6px;
        font-size: 24px;
        line-height: 28px;
        color: rgb(255, 153, 0);
      }
      .title {
        margin-bottom: 8px;
        font-size: 12px;
        line-height: 12px;
        color: rgb(7, 17, 27);
      }
      .rank {
        font-size: 10px;
        line-height: 10px;
        color: rgb(147, 153, 159);
      }
    }
    .overview-right {
      flex: 1;
      padding: 6px 0 6px 24px;
      @media only screen and (max-width: 320px) {
        padding-left: 6px;
      }
      @media only screen and (max-width: 375px) {
        padding-left: 10px;
      }
      .score-wrapper {
        margin-bottom: 8px;
        @media only screen and (max-width: 320px) {
          margin-bottom: 5px;
        }
        line-height: 18px;
        font-size: 0;
        .title {
          display: inline-block;
          line-height: 18px;
          vertical-align: top;
          font-size: 12px;
          color: rgb(7, 17, 27);
        }
        .star {
          display: inline-block;
          margin: 0 12px;
          @media only screen and (max-width: 320px) {
            margin: 0 5px;
          }
          vertical-align: top;
        }
        .score {
          display: inline-block;
          line-height: 18px;
          vertical-align: top;
          font-size: 12px;
          color: rgb(255, 153, 0);
        }
      }
      .delivery-wrapper {
        font-size: 0;
        .title {
          line-height: 18px;
          font-size: 12px;
          color: rgb(7, 17, 27);
        }
        .delivery {
          margin-left: 12px;
          font-size: 12px;
          color: rgb(147, 153, 159);
        }
      }
    }
  }
  .rating-wrapper {
    padding: 0 18px;
    .rating-item {
      display: flex;
      padding: 18px 0;
      @include border-1px(rgba(7, 17, 27, .1));
      transition: all .5s;
      opacity: 1;
      transform: translate3d(0, 0, 0);
      &.rating-enter,
      &.rating-leave-active {
        opacity: 0;
        transform: translate3d(50px, 0, 0);
      }
      .avatar {
        flex: 0 0 28px;
        margin-right: 12px;
        width: 28px;
        img {
          border-radius: 50%;
        }
      }
      .content {
        position: relative;
        flex: 1;
        .name {
          margin-bottom: 4px;
          line-height: 12px;
          font-size: 10px;
          color: rgb(7, 17, 27);
        }
        .star-wrapper {
          margin-bottom: 6px;
          font-size: 0;
          .star {
            display: inline-block;
            margin-right: 6px;
            vertical-align: top;
          }
          .delivery {
            display: inline-block;
            vertical-align: top;
            line-height: 12px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
        }
        .text {
          line-height: 18px;
          color: rgb(7, 17, 27);
          font-size: 12px;
          margin-bottom: 8px;
        }
        .recommend {
          font-size: 0;
          line-height: 16px;
          .icon-thumb_up,
          .item {
            display: inline-block;
            margin: 0 8px 4px 0;
            font-size: 9px;
          }
          .icon-thumb_up {
            color: rgb(0, 160, 220);
          }
          .item {
            padding: 0 6px;
            border: 1px solid rgba(7, 17, 27, .1);
            border-radius: 1px;
            color: rgb(147, 153, 159);
            background: #fff;
          }
        }
        .time {
          position: absolute;
          top: 0;
          right: 0;
          line-height: 12px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
      }
    }
  }
}
</style>

