## vue-card-swipe

A touch slider for vue.js, support sliding in any direction to switch cards, compatible with PC and mobile.

![preview](./preview.gif)

### Online Demo
[![Edit vue-card-swipe demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/vue-card-swipe-demo-jl77r?fontsize=14)

### Install

```bash
$ npm i --save @eshengsky/vue-card-swipe
```

### Import

#### using module

```javascript
// ES6 modules
import { CardSwipe, CardSwipeItem } from '@eshengsky/vue-card-swipe';

// or CommonJS
const { CardSwipe, CardSwipeItem } = require('@eshengsky/vue-card-swipe');
```

#### using script tag
```html
<script src="./node_modules/@eshengsky/vue-card-swipe/dist/vue-card-swipe.min.js"></script>
```

```javascript
const { CardSwipe, CardSwipeItem } = window.VueCardSwipe;
```

Then register the components:
```js
Vue.component('card-swipe', CardSwipe);
Vue.component('card-swipe-item', CardSwipeItem);
```

### Usage

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

### Props

| Property | Description | Type     | Default |
| ---- | ---- | -------- | ------ |
| stack  | Card stacking direction, `left`: stack to the left, `right`: stack to the right, `center`: stack left and right | `String` | center      |
| max-distance | The maximum drag distance, less than the distance card recovery, greater than the distance swipe to the next card, the unit `px` | `Number` | 60 |
| ratio | The aspect ratio of the first card | `Number` | 2 |
| show-indicators | Whether to show the indicators | `Boolean` | true |

### Event

| Event | Description | Params |
|-----------|-----------|-----------|
| resume | trigger when card recovery (Card drag distance is less than `max-distance`) | `index` Current card index, starting from `1` |
| change | trigger when swipe to the next card (Card drag distance is greater than `max-distance`) | `lastIndex` Previous card index, `index` Current card index, starting from `1` |

### Instance Property

#### currentIndex
Get the index of the current card, starting with `1`

```javascript
this.$refs.myCardSwipe.currentIndex;
```

### Build

```bash
$ npm run build
```

### Test

```bash
$ npm test
```

### License
MIT
