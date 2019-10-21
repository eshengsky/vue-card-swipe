<template>
  <div
    class="card-swipe-item"
    @touchstart="startHandler"
    @dragstart="startHandler"
    @touchmove="moveHandler"
    @drag="moveHandler"
    @touchend="endHandler"
    @dragend="endHandler"
    @dragover="dragoverHandler"
    @drop="dropHandler"
    draggable="true"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: "card-swipe-item",
  data() {
    return {
      touchStartX: 0,
      touchStartY: 0,
      touchDistance: 0
    };
  },
  computed: {
    maxDistance() {
      return this.$parent.maxDistance;
    },
    count() {
      return this.$parent.cards.length;
    },

    // 仅当多于一张卡片，且当前是首张卡片时才允许拖动
    enableDrag() {
      return (
        this.count > 1 &&
        this.$parent.cards[this.count - 1].key === this.$vnode.key
      );
    }
  },
  methods: {
    getDistance(x, y) {
      return Math.round(
        Math.sqrt(
          Math.pow(this.touchStartY - y, 2) + Math.pow(this.touchStartX - x, 2)
        )
      );
    },
    startHandler(event) {
      if (!this.enableDrag) {
        return;
      }
      let touch = event;
      if (event.type === "touchstart") {
        touch = event.targetTouches[0];
      }

      // 记录初始位置
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      this.$parent.draging = true;
      
      // 暂时禁用过渡效果，否则拖动过程会很不流畅
      const card = event.currentTarget;
      card.style.transition = "none";

      // 暂时设置高层级
      card.style.zIndex = 9999;
    },

    moveHandler(event) {
      if (this.$parent.draging) {
        // 阻止默认的滚动事件
        event.preventDefault();

        let touch = event;
        if (event.type === "touchmove") {
          touch = event.targetTouches[0];
        }
        this.touchDistance = this.getDistance(touch.clientX, touch.clientY);

        /**
         * 距离  透明度
         * 0     0.5
             10    0.55
            20    0.6
            50    0.75
            max(最大)   1
            x     0.5 / max * 距离 + 0.5
        */
        const newOpacity =
          this.touchDistance >= this.maxDistance
            ? 1
            : (0.5 / this.maxDistance) * this.touchDistance + 0.5;
        const newLeft = touch.clientX - this.touchStartX + "px";
        const newTop = touch.clientY - this.touchStartY + "px";
        const card = event.currentTarget;
        card.style.transform = `translate(${newLeft}, ${newTop})`;
        card.previousElementSibling.style.opacity = newOpacity;
      }
    },

    dragoverHandler(event) {
      event.preventDefault();
      return false;
    },

    dropHandler(event) {
      event.preventDefault();
      return false;
    },

    endHandler(event) {
      if (!this.enableDrag) {
        return;
      }
      const card = event.currentTarget;
      this.$parent.draging = false;
      if (this.touchDistance > this.maxDistance) {
        // 1,2,3,4  2,3,4,1  3,4,1,2
        this.$parent.cards.unshift(this.$parent.cards.pop());
        const currentIndex = this.$parent.currentIndex;
        const nextIndex = this.$parent.currentIndex + 1;
        this.$parent.currentIndex =
          nextIndex > this.$parent.cards.length ? 1 : nextIndex;
        this.$parent.onChange(currentIndex);
      } else if (this.touchDistance > 0) {
        // 允许拖动说明至少有2张卡片，故 previousElementSibling 一定存在
        card.previousElementSibling.style.opacity = 0.5;
        this.$parent.onResume();
      }

      // 将移动距离恢复为0，否则如果下次没有移动，将不会重新计算距离，则获取到的距离就是上次的错误的距离
      this.touchDistance = 0;

      setTimeout(() => {
        card.removeAttribute("style");
      }, 30);
    }
  }
};
</script>
