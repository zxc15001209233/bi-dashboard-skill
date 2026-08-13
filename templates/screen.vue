<script setup>
/**
 * 大屏页面骨架（Vue3 + ECharts + LESS）。生成时按此组织工程：
 *
 * src/
 * ├── styles/variables.less   ← 主题 token（LESS 变量，themes.md 对应表）
 * ├── config/colors.js        ← 语义色 JS 常量（ECharts 用，与 LESS 同源镜像）
 * ├── composables/useScreenAdapt.js  ← 整页缩放适配（本文件底部附实现）
 * ├── components/
 * │   ├── PanelBox.vue        ← 面板容器（标题条 + 玻璃底，样式见 themes.md）
 * │   ├── KpiCard.vue         ← KPI 翻牌卡（数字滚动 + 涨跌色）
 * │   └── charts/
 * │       ├── ChartCanvas.vue ← echarts 实例封装（init/setOption/resize/dispose）
 * │       └── xxxOption.js    ← 每图表一个 option 工厂纯函数（chart-patterns.md 模板）
 * ├── api/                    ← API 占位层：每函数配 mock 开关与字段映射注释
 * └── views/XxxScreen.vue     ← 本骨架
 *
 * 规则：组件不得写死色值，CSS 引 LESS 变量、ECharts 引 colors.js 常量。
 */
import { ref, onMounted } from 'vue'
import { useScreenAdapt } from '@/composables/useScreenAdapt.js'
// import PanelBox from '@/components/PanelBox.vue'
// import KpiCard from '@/components/KpiCard.vue'
// import ChartCanvas from '@/components/charts/ChartCanvas.vue'
// import { buildTrendOption } from '@/components/charts/trendOption.js'
// import { getOverview } from '@/api/xxx.js'  // API 占位：mock 开关内置

const { canvasStyle } = useScreenAdapt()
const loading = ref(false)

onMounted(async () => {
  // loading.value = true
  // const data = await getOverview({ range: '30d' })
  // loading.value = false
})
</script>

<template>
  <div class="screen-wrap">
    <div class="screen-canvas" :style="canvasStyle">
      <header class="topbar">
        <h1 class="title">XX 分析大屏</h1>
        <div class="filters"><!-- 时间筛选 --></div>
      </header>

      <main class="layout">
        <section class="col col-left">
          <!-- <KpiCard label="核心指标一" :value="52340" :yoy="12.3" :mom="-2.1" @click="..." /> -->
          <!-- <PanelBox title="次级图表"><ChartCanvas :option="leftOption" /></PanelBox> -->
        </section>
        <section class="col col-main">
          <!-- <PanelBox title="核心趋势"><ChartCanvas :option="mainOption" /></PanelBox> -->
        </section>
        <section class="col col-right">
          <!-- <PanelBox title="排行 Top10"><ChartCanvas :option="rankOption" /></PanelBox> -->
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped lang="less">
// 色值一律来自 variables.less（主题 token），禁止裸写
.screen-wrap {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: @bg-page;
}
.screen-canvas {
  display: flex;
  flex-direction: column;
  padding: 16px 24px;
  background: radial-gradient(ellipse at 50% 0%, @bg-page-glow 0%, @bg-page 60%);
}
.topbar {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title {
    font-size: 36px;
    font-weight: @fw-title;
    letter-spacing: 4px;
    background: linear-gradient(180deg, @text-title-start, @text-title-end);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
}
.layout {
  flex: 1;
  display: grid;
  grid-template-columns: 24% 1fr 24%; // 布局骨架见 layout-patterns.md
  gap: 14px;
  min-height: 0;
}
.col {
  display: grid;
  gap: 14px;
  min-height: 0;
}
</style>
