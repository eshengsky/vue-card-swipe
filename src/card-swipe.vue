<template>
  <div class="card-swipe__wrapper" :class="wrapCls">
    <div class="card-swipe__cards" :class="{ draging }" :style="cardsStyle">
      <!-- 此处没有直接使用 <slot></slot>，而是根据插槽生成了一个数组 cards，原因如下：
      1. 传入的一系列卡片需要进行反转排序，以让第一张卡片能展示在最前面
      2. 需要将首张卡片移动到末尾，借助数组更容易实现-->
      <vnode v-for="(item, index) in cards" :vnode="item" :index="index" :key="`vnode-${index}`" />
    </div>
    <div
      class="card-swipe__indicators"
      v-if="showIndicators && count > 1"
      :style="{ right: indicatorRight }"
    >
      <i
        v-for="(item, index) in cards"
        :key="`indicator-${index}`"
        :class="{active: index + 1 === currentIndex}"
      ></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "card-swipe",
  components: {
    Vnode: {
      functional: true,
      render: (h, ctx) => {
        const vnode = ctx.props.vnode;

        // 由于每次切换卡片都会触发该函数，故 key 值最多只能生成一次
        if (vnode.key == null) {
          vnode.key = `card-swipe-key-${ctx.props.index + 1}`;
        }
        return vnode;
      }
    }
  },
  props: {
    // 卡片堆叠方向，left: 卡片向左堆叠；right: 卡片向右堆叠；center: 卡片左右堆叠
    stack: {
      type: String,
      default: "center"
    },

    // 最大拖动距离，小于该距离卡片恢复，大于该距离切到下张卡片
    maxDistance: {
      type: Number,
      default: 60
    },

    // 卡片宽高比
    ratio: {
      type: Number,
      default: 2
    },

    // 是否显示计数器
    showIndicators: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      cards: [],
      draging: false,
      currentIndex: 1,
      wrapCls: {
        left: this.stack === "left",
        right: this.stack === "right",
        center: this.stack === "center"
      }
    };
  },
  created() {
    // 根据传入的插槽内容，生成一个数组，后续进行动态渲染
    let vnodes = this.$slots.default;
    if (vnodes && vnodes.length) {
      // 过滤掉非法的插槽内容
      vnodes = vnodes.filter(
        vnode => vnode && vnode.tag && /card-swipe-item$/.test(vnode.tag)
      );

      // 反转vnode，这样最后一张卡片才能显示在最前面
      vnodes = vnodes.reverse();
      this.cards = vnodes;
    }
  },
  computed: {
    count() {
      return this.cards.length;
    },
    cardsWidth() {
      // 1张 -> 0
      // 2张 -> 6
      // >=3张 -> 9
      let num = 9;
      switch (this.count) {
        case 1:
          num = 0;
          break;
        case 2:
          num = 6;
          break;
        default:
          num = 9;
      }

      // 如果是center，则要留出双倍距离
      if (this.stack === "center") {
        num = num * 2;
      }
      return `calc(100% - ${num}px)`;
    },

    cardsPadding() {
      // 1张 -> 0
      // 2张 -> 6
      // >=3张 -> 9
      let num = 9;
      switch (this.count) {
        case 1:
          num = 0;
          break;
        case 2:
          num = 3;
          break;
        default:
          num = 4.5;
      }

      // 如果是center，则要留出双倍距离
      if (this.stack === "center") {
        num = num * 2;
      }
      return `calc(${(1 / this.ratio) * 100 + "%"} - ${num}px) `;
    },

    cardsStyle() {
      return {
        width: this.cardsWidth,
        paddingBottom: this.cardsPadding
      };
    },

    indicatorRight() {
      let num = 9;
      switch (this.count) {
        case 1:
          num = 0;
          break;
        case 2:
          num = 6;
          break;
        default:
          num = 9;
      }

      // 如果是left，首张卡片一定居右对齐，则right为0
      if (this.stack === "left") {
        num = 0;
      }
      return `${num}px`;
    }
  },
  methods: {
    onResume() {
      this.$emit("resume", this.currentIndex);
    },
    onChange(lastIndex) {
      this.$emit("change", lastIndex, this.currentIndex);
    }
  }
};
</script>
<style lang="postcss">
.card-swipe {
  &__wrapper {
    flex: 1;
    position: relative;
    display: flex;
  }
  &__wrapper.center {
    justify-content: center;
  }
  &__wrapper.left {
    justify-content: flex-end;
  }
  &__wrapper.right {
    justify-content: flex-start;
  }
  &__cards {
    position: relative;
    width: 100%;
  }
  &-item {
    position: absolute;
    transition: all 0.5s;
    height: 100%;
    width: 100%;
    user-select: none;
    cursor: move;
  }

  &__wrapper.center &-item:nth-last-child(2),
  &__wrapper.center .draging &-item:nth-last-child(3) {
    width: calc(100% + 12px);
    transform: translate(-6px, 0) scaleY(0.92);
    opacity: 0.5;
  }
  &__wrapper.center &-item:nth-last-child(3),
  &__wrapper.center .draging &-item:nth-last-child(4) {
    width: calc(100% + 18px);
    transform: translate(-9px, 0) scaleY(0.85);
    opacity: 0.3;
  }
  &__wrapper.center .draging &-item:nth-last-child(2) {
    width: 100%;
    transform: translate(0, 0) scaleY(1);
    opacity: 1;
  }

  &__wrapper.right &-item:nth-last-child(2),
  &__wrapper.right .draging &-item:nth-last-child(3) {
    transform: translate(6px, 0) scaleY(0.92);
    opacity: 0.5;
  }
  &__wrapper.right &-item:nth-last-child(3),
  &__wrapper.right .draging &-item:nth-last-child(4) {
    transform: translate(9px, 0) scaleY(0.82);
    opacity: 0.3;
  }
  &__wrapper.right .draging &-item:nth-last-child(2) {
    transform: translate(0, 0) scaleY(1);
    opacity: 1;
  }

  &__wrapper.left &-item:nth-last-child(2),
  &__wrapper.left .draging &-item:nth-last-child(3) {
    transform: translate(-6px, 0) scaleY(0.92);
    opacity: 0.5;
  }
  &__wrapper.left &-item:nth-last-child(3),
  &__wrapper.left .draging &-item:nth-last-child(4) {
    transform: translate(-9px, 0) scaleY(0.82);
    opacity: 0.3;
  }
  &__wrapper.left .draging &-item:nth-last-child(2) {
    transform: translate(0, 0) scaleY(1);
  }

  &__indicators {
    position: absolute;
    top: 0;
    margin-right: 8px;

    i {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      margin-right: 4px;
      display: inline-block;
      &.active {
        width: 12px;
        background: #ffffff;
        border-radius: 3px;
        border-radius: 3px;
      }
    }
  }
}
</style>
