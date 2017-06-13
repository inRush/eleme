<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span @click="select(2,$event)" class="block positive" :class="{'active':p_selectType === 2}">{{desc.all}}
        <span class="count">{{ratings.length}}</span>
      </span>
      <span @click="select(0,$event) " class="block positive" :class="{'active':p_selectType === 0}">{{desc.positive}}
        <span class="count">{{positives.length}}</span>
      </span>
      <span @click="select(1,$event)" class="block negative" :class="{'active':p_selectType === 1}">{{desc.negative}}
        <span class="count">{{negatives.length}}</span>
      </span>
    </div>
    <div @click="toggleContent" class="switch" :class="{'on':p_onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
import propsync from '../../common/js/propsync';

/* eslint-disable no-unused-vars */
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
  mixins: [propsync],
  props: {
    ratings: {
      type: Array,
      default() {
        return [];
      },
      propsync: false,
    },
    selectType: {
      type: Number,
      default: ALL,
    },
    onlyContent: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: Object,
      default() {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意',
        };
      },
      propsync: false,
    },
  },
  methods: {
    select(type, event) {
      if (!event._constructed) {
        return;
      }
      this.p_selectType = type;
    },
    toggleContent(event) {
      if (!event._constructed) {
        return;
      }
      this.p_onlyContent = !this.p_onlyContent;
    },
  },
  computed: {
    positives() {
      return this.ratings.filter((rating) => {
        const isPositive = rating.rateType === POSITIVE;
        return isPositive;
      });
    },
    negatives() {
      return this.ratings.filter((rating) => {
        const isNegatives = rating.rateType === NEGATIVE;
        return isNegatives;
      });
    },
  },
};
</script>

<style lang="scss">
@import "../../common/scss/mixin.scss";

.ratingselect {
  .rating-type {
    padding: 18px 0;
    margin: 0 18px;
    @include border-1px(rgba(7, 17, 27, .1));
    font-size: 0;
    .block {
      display: inline-block;
      padding: 8px 12px;
      margin-right: 8px;
      height: 16px;
      line-height: 16px;
      border-radius: 5px;
      font-size: 12px;
      color: rgb(77, 85, 93);
      &.active {
        color: #fff;
      }
      &.positive {
        background: rgba(0, 160, 220, .2);
        &.active {
          background: rgb(0, 160, 220);
        }
      }
      &.negative {
        background: rgba(77, 85, 93, .2);
        &.active {
          background: rgb(77, 85, 93);
        }
      }
      .count {
        font-size: 8px;
      }
    }
  }
  .switch {
    padding: 12px 18px;
    line-height: 24px;
    border-bottom: 1px solid rgba(7, 17, 27, .1);
    color: rgb(147, 153, 159);
    font-size: 0;
    &.on {
      .icon-check_circle {
        color: #00c850;
      }
    }
    .icon-check_circle {
      display: inline-block;
      vertical-align: top;
      margin-right: 4px;
      font-size: 24px;
    }
    .text {
      display: inline-block;
      vertical-align: top;
      font-size: 12px;
    }
  }
}
</style>
