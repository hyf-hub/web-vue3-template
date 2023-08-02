<template>
  <svg aria-hidden="true" class="svg-icon">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script lang="ts">
  import { defineComponent, computed } from "vue";

  export default defineComponent({
    name: "SvgIcon",
    props: {
      prefix: {
        type: String,
        default: "svg",
      },
      name: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        default: "#fff",
      },
    },
    setup(props) {
      const symbolId = computed(() => `#${props.prefix}-${props.name}`);
      return { symbolId };
    },
  });
</script>
<style lang="scss" scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    position: relative;
    fill: currentColor;
    vertical-align: -2px;
  }
</style>
