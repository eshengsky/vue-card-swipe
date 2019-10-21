import { CardSwipe, CardSwipeItem } from '../';
import { triggerDrag } from './utils';
import { mount } from '@vue/test-utils';
import { render } from '@vue/server-test-utils'

function getComponent(cards = [1, 2, 3]) {
    return {
        template: `
    <card-swipe :stack="stack" :show-indicators="showIndicators" @resume="onResume" @change="onChange">
      <card-swipe-item v-for="(item, index) in cards" :key="index">
        <div>{{ item }}</div>
      </card-swipe-item>
    </card-swipe>
  `,
        components: {
            CardSwipe,
            CardSwipeItem
        },
        props: {
            stack: {
                type: String,
                default: 'center'
            },
            showIndicators: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                cards
            }
        },
        methods: {
            onResume(currentIndex) {
                console.log(currentIndex);
            },
            onChange(lastIndex, currentIndex) {
                console.log(lastIndex, currentIndex);
            }
        },
    }
}

test('测试卡片的切换和复位', () => {
    const wrapper = mount(getComponent());
    const getLastCard = () => {
        const cards = wrapper.findAll('.card-swipe-item');
        return cards.at(cards.length - 1);
    }

    // 滑动距离小于60px复位，大于60px切换

    // 当前第1张卡片，滑动59px，卡片复位
    expect(getLastCard().text()).toEqual('1');
    triggerDrag(getLastCard(), 59, 0);

    // 当前第1张卡片，滑动61px，切到第2张卡片
    expect(getLastCard().text()).toEqual('1');
    triggerDrag(getLastCard(), 61, 0);

    // 当前第2张卡片，滑动61px，切到第3张卡片
    expect(getLastCard().text()).toEqual('2');
    triggerDrag(getLastCard(), 61, 0);

    // 当前第3张卡片，滑动59px，卡片复位
    expect(getLastCard().text()).toEqual('3');
    triggerDrag(getLastCard(), 59, 0);

    // 当前第3张卡片，滑动61px，切到第1张卡片
    expect(getLastCard().text()).toEqual('3');
    triggerDrag(getLastCard(), 61, 0);

    // 当前第1张卡片
    expect(getLastCard().text()).toEqual('1');
});

describe('测试卡片样式', () => {
    const getCardStyle = async (cards, stack = 'center') => {
        const wrapper = await render(getComponent(cards), {
            propsData: {
                stack
            }
        });
        const el = wrapper.find('.card-swipe__cards');
        return {
            width: el.css('width'),
            paddingBottom: el.css('padding-bottom')
        }
    }
    test('卡片左右堆叠', () => {
        return Promise.all([
            // 1张卡片
            getCardStyle([1]).then(style => {
                expect(style.width).toBe('calc(100% - 0px)');
                expect(style.paddingBottom).toBe('calc(50% - 0px)');
            }),

            // 2张卡片
            getCardStyle([1, 2]).then(style => {
                expect(style.width).toBe('calc(100% - 12px)');
                expect(style.paddingBottom).toBe('calc(50% - 6px)');
            }),

            // >=3张卡片
            getCardStyle().then(style => {
                expect(style.width).toBe('calc(100% - 18px)');
                expect(style.paddingBottom).toBe('calc(50% - 9px)');
            })
        ]);

    });

    test('卡片向右堆叠', () => {
        return Promise.all([
            // 1张卡片
            getCardStyle([1], 'right').then(style => {
                expect(style.width).toBe('calc(100% - 0px)');
                expect(style.paddingBottom).toBe('calc(50% - 0px)');
            }),

            // 2张卡片
            getCardStyle([1, 2], 'right').then(style => {
                expect(style.width).toBe('calc(100% - 6px)');
                expect(style.paddingBottom).toBe('calc(50% - 3px)');
            }),

            // >=3张卡片
            getCardStyle([1, 2, 3], 'right').then(style => {
                expect(style.width).toBe('calc(100% - 9px)');
                expect(style.paddingBottom).toBe('calc(50% - 4.5px)');
            })
        ]);

    });

    test('卡片向左堆叠', () => {
        return Promise.all([
            // 1张卡片
            getCardStyle([1], 'left').then(style => {
                expect(style.width).toBe('calc(100% - 0px)');
                expect(style.paddingBottom).toBe('calc(50% - 0px)');
            }),

            // 2张卡片
            getCardStyle([1, 2], 'left').then(style => {
                expect(style.width).toBe('calc(100% - 6px)');
                expect(style.paddingBottom).toBe('calc(50% - 3px)');
            }),

            // >=3张卡片
            getCardStyle([1, 2, 3], 'left').then(style => {
                expect(style.width).toBe('calc(100% - 9px)');
                expect(style.paddingBottom).toBe('calc(50% - 4.5px)');
            })
        ]);
    });
});

describe('测试事件', () => {
    const wrapper = mount(getComponent());
    const getLastCard = () => {
        const cards = wrapper.findAll('.card-swipe-item');
        return cards.at(cards.length - 1);
    }
    let spy = jest.spyOn(console, "log");
    test('复位事件', () => {
        triggerDrag(getLastCard(), 59, 0);
        expect(spy).toBeCalledWith(1);
    });

    test('切换事件', () => {
        triggerDrag(getLastCard(), 61, 0);
        expect(spy).toBeCalledWith(1, 2);
    });
});

describe('测试计数器', () => {
    test('是否显示计数器', () => {
        const wrapper = mount(getComponent(), {
            propsData: {
                showIndicators: false
            }
        });
        expect(wrapper.find('.card-swipe__indicators').exists()).toBe(false);
    });
    test('计数器的切换', () => {
        const wrapper = mount(getComponent());
        const getLastCard = () => {
            const cards = wrapper.findAll('.card-swipe-item');
            return cards.at(cards.length - 1);
        }
        const getIndicators = () => {
            return wrapper.find('.card-swipe__indicators').findAll('i');
        }

        // 滑动距离小于60px复位，大于60px切换

        // 当前第1张卡片，滑动59px，卡片复位
        expect(getIndicators().at(0).classes()).toContain('active');
        triggerDrag(getLastCard(), 59, 0);

        // 当前第1张卡片，滑动61px，切到第2张卡片
        expect(getIndicators().at(0).classes()).toContain('active');
        triggerDrag(getLastCard(), 61, 0);

        // 当前第2张卡片，滑动61px，切到第3张卡片
        expect(getIndicators().at(1).classes()).toContain('active');
        triggerDrag(getLastCard(), 61, 0);

        // 当前第3张卡片，滑动59px，卡片复位
        expect(getIndicators().at(2).classes()).toContain('active');
        triggerDrag(getLastCard(), 59, 0);

        // 当前第3张卡片，滑动61px，切到第1张卡片
        expect(getIndicators().at(2).classes()).toContain('active');
        triggerDrag(getLastCard(), 61, 0);

        // 当前第1张卡片
        expect(getIndicators().at(0).classes()).toContain('active');
    })
});