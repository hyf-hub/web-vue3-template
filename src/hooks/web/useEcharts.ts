import { Fn, tryOnUnmounted, useDebounceFn, useEventListener } from "@vueuse/core";
import type { EChartsOption } from "echarts";
import { init as echarstInit } from "echarts";
import type { Ref } from "vue";
import { nextTick, ref, unref } from "vue";
export function useECharts(
  elRef: Ref<HTMLDivElement | undefined>,
  theme: "light" | "dark" | "default" = "default",
) {
  let chartInstance: echarts.ECharts | null = null;
  let removeResizeFn: Fn;
  const cacheOptions = ref<EChartsOption>({});
  function resizeFn() {
    chartInstance?.resize({
      animation: {
        duration: 300,
        easing: "quadraticIn",
      },
    });
  }
  const resize = useDebounceFn(resizeFn, 200);
  function initCharts(t: string) {
    const el = unref(elRef);
    if (!el || !unref(elRef)) {
      return;
    }
    chartInstance = echarstInit(el, t);
    removeResizeFn = useEventListener(window, "resize", resize);
  }
  function setOptions(options: EChartsOption, clear = true) {
    cacheOptions.value = options;
    return new Promise((resolve) => {
      nextTick(() => {
        if (!chartInstance) {
          initCharts(theme);
          if (!chartInstance) return;
        }
        clear && chartInstance?.clear();
        chartInstance?.setOption(unref(cacheOptions.value));
        resolve(null);
      });
    });
  }
  function getInstance(): echarts.ECharts | null {
    if (!chartInstance) {
      initCharts(theme);
    }
    return chartInstance;
  }
  tryOnUnmounted(() => {
    if (!chartInstance) return;
    removeResizeFn();
    chartInstance.dispose();
    chartInstance = null;
  });
  return { initCharts, setOptions, getInstance, resize };
}
