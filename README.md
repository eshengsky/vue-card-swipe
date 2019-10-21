## vue-card-swipe

卡片切换组件，通过滑动切换卡片，兼容 PC 端和移动端。

### Demo
[![Edit vue-card-swipe demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/vue-card-swipe-demo-jl77r?fontsize=14)

### 安装

```bash
$ npm i --save @eshengsky/vue-card-swipe
```

### 引入

#### 通过模块方式引入

```javascript
// ES6 modules 写法
import { CardSwipe, CardSwipeItem } from '@eshengsky/vue-card-swipe';

// CommonJS 写法
const { CardSwipe, CardSwipeItem } = require('@eshengsky/vue-card-swipe');
```

#### 通过script标签引入
```html
<script src="./node_modules/@eshengsky/vue-card-swipe/dist/vue-card-swipe.min.js"></script>
```

```javascript
const { CardSwipe, CardSwipeItem } = window.VueCardSwipe;
```

#### 注册组件
```js
Vue.component('card-swipe', CardSwipe);
Vue.component('card-swipe-item', CardSwipeItem);
```

### 使用

```html
<card-swipe>
  <card-swipe-item>
    <div style="background-image: linear-gradient(to right, #fe686c 0%, #fe3c71 100%)">1</div>
  </card-swipe-item>
  <card-swipe-item>
    <div style="background-image: linear-gradient(to right, #ffaa00 0%, #ff8800 100%);">2</div>
  </card-swipe-item>
  <card-swipe-item>
    <div style="background-image: linear-gradient(to right, #add0f8 0%, #5ca2f8 100%);">3</div>
  </card-swipe-item>
</card-swipe>
```

### 参数

| 参数 | 说明 | 类型     | 默认值 |
| ---- | ---- | -------- | ------ |
| stack  | 卡片堆叠方向，`left`: 卡片向左堆叠；`right`: 卡片向右堆叠；`center`: 同时向左右堆叠 | `String` | center      |
| max-distance | 最大拖动距离，小于该距离卡片恢复，大于该距离切到下张卡片，单位 `px` | `Number` | 60 |
| ratio | 首张卡片的宽高比 | `Number` | 2 |
| show-indicators | 是否显示计数器 | `Boolean` | true |

### 事件

| 事件名 | 说明 | 参数 |
|-----------|-----------|-----------|
| resume | 卡片拖动距离小于 `max-distance` 自动复位时触发 | `index` 当前卡片索引，从 1 开始 |
| change | 卡片拖动距离大于 `max-distance` 切换到下一张卡片时触发 | `lastIndex` 上一张卡片索引， `index` 当前卡片索引 |

### 实例属性

#### currentIndex
获取当前卡片的次序，从 `1` 开始

```javascript
this.$refs.cardSwipe.currentIndex;
```

### 构建

```bash
$ npm run build
```

### 测试

```bash
$ npm test
```

### 许可
MIT
