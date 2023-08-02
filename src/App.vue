<script setup lang="ts">
  import { useECharts } from "@/hooks/web/useEcharts";
  const divRef = ref<HTMLDivElement>();
  const { setOptions } = useECharts(divRef);
  setOptions({
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "dsadas"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: "line",
      },
    ],
  });
</script>

<template>
  <div class="h-screen bg-white w-screen flex items-center justify-center">
    <div class="text-center">
      <p class="text-lg text-black mx-auto">Hellow Web Cli</p>
      <div ref="divRef" class="w-[400px] h-[400px]"></div>
    </div>
  </div>
</template>

<style scoped></style>
