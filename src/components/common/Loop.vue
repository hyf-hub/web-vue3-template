<template>
  <div class="outBox" ref="outBoxRef" v-if="!reFresh">
    <div class="textBox" ref="boxRef" @mouseenter="mouseenter" @mouseleave="mouseleave">
      <div v-for="item in list" :style="computeStyle" :key="item.id">
        <slot :row="item.value"></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  /**
   * @description 目前只做了 从右到左 从下到上 的播放方式
   * 在infinite模式下 start 只支持从右到左的滚动方式
   * 在infinite模式下 目前还存在着每次滚动完成都会导致闪烁的问题
   * 在从下到上的模式下 每一项占据整个父容器百分比的宽度
   * 从右到左的宽度则为元素自身宽度 与其他因素无关
   */
  import { cloneDeep } from "lodash-es";
  import {
    ref,
    computed,
    onBeforeUnmount,
    onMounted,
    nextTick,
    onDeactivated,
    onActivated,
  } from "vue";
  const props = withDefaults(
    defineProps<{
      loopList: string[];
      interval?: number;
      movePx?: number;
      gap?: string;
      waitTime?: number;
      isHoverStop?: boolean;
      start?: "start" | "center" | "end";
      infinite?: boolean;
      to?: "right" | "top";
      autoPlay?: boolean;
    }>(),
    {
      // 传递过来的字符串数组
      loopList: () => [],
      //播放速度
      interval: 30,
      // 每次移动的像素 太大会导致 "很卡" 的视觉效果
      movePx: 2,
      // 两个文本之间的间距
      gap: "10px",
      // 每次元素停留显示的时间
      waitTime: 500,
      // 是否鼠标放上去后停止移动
      isHoverStop: true,
      // 开始播放的位置 start | center | end
      start: "start",
      // 是否无限滚动
      infinite: true,
      to: "right",
      autoPlay: true,
    },
  );
  const { interval, movePx, gap, waitTime, isHoverStop, start, infinite } = props;
  const timer = ref<number>();
  const x = ref(0);
  const isScrolling = ref(props.autoPlay);
  const index = ref(0);
  const childWidth = ref(0);
  const reFresh = ref(false);
  const list = ref<
    {
      id: number;
      value: any;
    }[]
  >();
  const computeStyle = computed(() => {
    const styleObject =
      props.to === "right"
        ? {
            display: "inline-block",
            "padding-right": gap!,
          }
        : {
            display: "flex",
            "flex-direction": "column" as const,
            width: "100%",
            "padding-bottom": gap!,
          };
    return styleObject;
  });
  onBeforeUnmount(() => {
    clearInterval(timer.value);
  });
  onDeactivated(() => {
    isScrolling.value = false;
  });
  onActivated(() => {
    isScrolling.value = true;
  });
  onMounted(() => {
    initList();
    nextTick(() => {
      renderDom();
    });
  });
  const initList = () => {
    // 给每一项添加id值 优化性能
    list.value = cloneDeep(props.loopList).map((item, index) => ({ id: index, value: item }));
  };
  const outBoxRef = ref();
  const boxRef = ref();
  const renderDom = () => {
    // 获取外面盒子的Dom元素
    const outBox = outBoxRef.value;
    const propertys = {
      right: "offsetWidth",
      top: "offsetHeight",
    };
    const directions = {
      right: "translateX",
      top: "translateY",
    };
    const property = propertys[props.to];
    const direction = directions[props.to];
    // 获取里面面盒子的Dom元素
    const box = boxRef.value;
    const outWidth = outBox[property];
    if (!outWidth) return;
    // 设置起始播放的位置 父盒子的最右侧出现
    const startX = startWidth(outWidth);
    box.style.transform = `${direction}(${startX}px)`;
    x.value = startX;
    // 过滤掉没有宽/高的节点
    const effectiveNode = [...box.childNodes].filter((node) => node[property]);
    // 获取第一个子元素的宽度
    childWidth.value = effectiveNode[index.value][property];
    const childNodes = effectiveNode;
    const totalChildWidth = childNodes.reduce((pre, cur) => pre + cur[property], 0);
    // 获取子元素的总宽度
    timer.value = setInterval(() => {
      if (!isScrolling.value) return;
      if (!box) return;
      box.style.transform = `${direction}(${x.value}px)`;
      // 每次移动的距离
      x.value -= movePx;
      // 如果超出 则移动完毕
      if (-x.value >= totalChildWidth) {
        // 播放完之后就重新开始播放
        x.value = startX;
        index.value = 0;
        childWidth.value = childNodes[0][property];
        if (infinite) {
          isScrolling.value = false;
          setTimeout(() => {
            isScrolling.value = true;
          }, waitTime);
        }
        return;
      }
      // 如果过了第index个元素 开始等待
      if (-x.value >= childWidth.value && waitTime) {
        // 是否是首尾连接滚动
        index.value++;
        childWidth.value += childNodes[index.value][property];
        isScrolling.value = false;
        setTimeout(() => {
          isScrolling.value = true;
        }, waitTime);
        if (!infinite) return;
        // 如果是首位相接的方式播放
        // 不能直接移除数组的值 否则循环列表中的值也会改变

        // 获取当前数组索引的前一个
        const fristChild = list.value![Math.max(0, index.value - 1)];
        // 把该值追加到列表后面
        list.value!.push({ ...fristChild, id: index.value + props.loopList.length + 10 });
      }
    }, interval);
  };
  // 计算元素开始播放的位置
  const startWidth = (boxWidth: number) => {
    switch (start) {
      case "start":
        return 0;
      case "center":
        return boxWidth / 2;
      case "end":
        return boxWidth;
      default:
        return 0;
    }
  };
  /**
   * @descript 鼠标放上去触发
   */
  const mouseenter = () => {
    if (!isHoverStop) return;
    isScrolling.value = false;
  };
  /**
   * @descript 鼠标离开触发
   */
  const mouseleave = () => {
    if (!isHoverStop) return;
    isScrolling.value = true;
  };
</script>
<style lang="scss" scoped>
  .outBox {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    .textBox {
      position: absolute;
      top: 0;
      white-space: nowrap;
      width: 100%;
    }
  }
</style>
