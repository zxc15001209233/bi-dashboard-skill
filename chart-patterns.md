# ECharts 标准模板与动效规范

所有图表 option **从本文件模板修改**，禁止用 ECharts 默认配色/默认 tooltip。
色值引用 themes.md 所选主题 token；以下模板以深色 BI 主题示例，浅色主题替换对应 token 即可。

## 通用基座（每个图表都要有）

```js
// 深色玻璃 tooltip（全图表统一观感；浅色主题换 --bg-tooltip / 深色文字）
const DARK_TOOLTIP = {
  confine: true,
  backgroundColor: 'rgba(6,24,52,0.92)',
  borderColor: 'rgba(0,255,252,0.35)',
  borderWidth: 1,
  textStyle: { color: '#eaf6ff' },
  extraCssText: 'box-shadow:0 6px 20px rgba(0,0,0,.4);',
};

const AXIS = {
  axisLine: { lineStyle: { color: 'rgba(255,255,255,0.18)' } },
  axisLabel: { color: 'rgba(255,255,255,0.7)' },
  splitLine: { lineStyle: { color: 'rgba(255,255,255,0.10)', type: 'dashed' } },
};

const LEGEND = { textStyle: { color: 'rgba(255,255,255,0.7)' }, top: 0, itemWidth: 14, itemHeight: 8 };

// grid 必须 containLabel，防止标签溢出
const GRID = { left: 16, right: 20, top: 44, bottom: 8, containLabel: true };

// 垂直渐变柱（顶亮底暗）—— 柱状图质感关键
const barGradient = (top, bottom) => ({
  color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
    colorStops: [{ offset: 0, color: top }, { offset: 1, color: bottom }] },
  borderRadius: [3, 3, 0, 0],
});
```

## 模板 1：趋势折线图（单/多系列）

```js
{
  color: ['#00fffc', '#076BD4', '#ff8c00'],
  tooltip: { trigger: 'axis', ...DARK_TOOLTIP },
  legend: LEGEND,
  grid: GRID,
  xAxis: { type: 'category', data: months, ...AXIS, boundaryGap: false },
  yAxis: { type: 'value', ...AXIS },
  series: [{
    name: '营业额', type: 'line', smooth: true,
    symbol: 'circle', symbolSize: 6, connectNulls: false,
    lineStyle: { width: 2.5, shadowColor: 'rgba(0,255,252,0.5)', shadowBlur: 8 }, // 发光折线
    areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
      colorStops: [{ offset: 0, color: 'rgba(0,255,252,0.25)' }, { offset: 1, color: 'rgba(0,255,252,0)' }] } },
    data,
  }],
}
```

要点：主系列带 `shadowBlur` 发光 + 渐变面积；对比系列（同期）用 `type: 'dashed'` 虚线，不加面积。

## 模板 2：对比柱状图（含双轴柱线混合）

```js
{
  tooltip: { trigger: 'axis', ...DARK_TOOLTIP, valueFormatter: (v) => v == null ? '—' : `${v} 万元` },
  legend: LEGEND,
  grid: GRID,
  xAxis: { type: 'category', data: names, ...AXIS,
    axisLabel: { ...AXIS.axisLabel, interval: 0, width: 80, overflow: 'truncate' } }, // 长名截断
  yAxis: [
    { type: 'value', name: '万元', nameTextStyle: { color: 'rgba(255,255,255,0.7)' }, ...AXIS },
    { type: 'value', ...AXIS, splitLine: { show: false } }, // 双轴时右轴关分隔线
  ],
  series: [
    { name: '本期', type: 'bar', barMaxWidth: 22,
      itemStyle: barGradient('#5cfbff', 'rgba(0,255,252,0.15)'), data: cur },
    { name: '同期', type: 'bar', barMaxWidth: 22,
      itemStyle: barGradient('#2f8fe0', 'rgba(7,107,212,0.12)'), data: last },
    // 可选第三系列：比率折线挂右轴 yAxisIndex: 1
  ],
}
```

## 模板 3：占比环形图（不用默认饼图）

```js
{
  tooltip: { ...DARK_TOOLTIP, formatter: '{b}<br/>{c}（{d}%）' },
  legend: { ...LEGEND, orient: 'vertical', right: 8, top: 'middle' },
  series: [{
    type: 'pie', radius: ['55%', '75%'], center: ['38%', '52%'],
    itemStyle: { borderColor: '#040d21', borderWidth: 2 }, // 分块描边=页面底色
    label: { show: false },
    emphasis: { label: { show: true, color: '#fff', fontWeight: 700, formatter: '{b}\n{d}%' } },
    data: [{ name: '品类A', value: 3200 } /* ... 最多 6 项，多余合并为"其他" */],
  }],
}
```

## 模板 4：横向排行条（Top N）

```js
{
  tooltip: { ...DARK_TOOLTIP },
  grid: { left: 8, right: 44, top: 8, bottom: 8, containLabel: true },
  xAxis: { type: 'value', show: false },
  yAxis: { type: 'category', data: names.slice().reverse(), // 倒序让第一名在顶部
    axisLine: { show: false }, axisTick: { show: false },
    axisLabel: { color: '#cfe6ff', width: 90, overflow: 'truncate' } },
  series: [{
    type: 'bar', barWidth: 12,
    itemStyle: { borderRadius: 6, color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
      colorStops: [{ offset: 0, color: 'rgba(0,170,255,0.2)' }, { offset: 1, color: '#00aaff' }] } },
    label: { show: true, position: 'right', color: '#eaf6ff', formatter: (p) => p.value.toLocaleString() },
    showBackground: true, backgroundStyle: { color: 'rgba(84,200,243,0.15)', borderRadius: 6 },
    data: values.slice().reverse(),
  }],
}
```

排名前三名可用 `rankTop1/2/3` 色单独着色（`data` 传对象形式指定 `itemStyle`）。

## 模板 5：仪表盘/完成率

```js
{
  series: [{
    type: 'gauge', startAngle: 210, endAngle: -30, radius: '95%',
    progress: { show: true, width: 12, itemStyle: { color: {
      type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
      colorStops: [{ offset: 0, color: '#076BD4' }, { offset: 1, color: '#00fffc' }] } } },
    axisLine: { lineStyle: { width: 12, color: [[1, 'rgba(84,200,243,0.15)']] } },
    axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
    pointer: { show: false }, anchor: { show: false },
    detail: { valueAnimation: true, fontSize: 30, fontWeight: 700, color: '#00fffc',
      formatter: '{value}%', offsetCenter: [0, 0] },
    data: [{ value: 86.5 }],
  }],
}
```

## 模板 6：热力格（指标 × 维度矩阵）

用 `type: 'heatmap'` + `visualMap`（隐藏），色阶：正值向涨色渐变、负值向跌色渐变、绝对值越大越深；单元格加 1px 页面底色间隙。适合"多指标同比矩阵"。

## 动效规范

| 动效 | 实现 | 参数 |
|---|---|---|
| 数字滚动（CountUp） | KPI 数值从 0 滚到目标值；HTML 模式用 rAF 手写（~15 行），Vue 模式可用 rAF composable | 时长 1.2s，easeOut |
| 图表入场 | ECharts 自带 `animationDuration: 800, animationEasing: 'cubicOut'`；多图表错峰：按区块顺序延迟 0–400ms 初始化 | — |
| 排行/表格轮播 | 行数超出容器时自动向上滚动，`setInterval` + `scrollTop` 过渡，鼠标悬停暂停 | 每 3s 滚 1 行 |
| 面板边框微光 | 面板 `box-shadow` 呼吸：`@keyframes` 在 `rgba(0,255,252,0.1)` ↔ `0.25` 间缓变 | 周期 4s，**最多用于 1–2 个重点面板** |
| 折线扫光 | 可选：`series.markLine` 或 ECharts `animationDelay` 逐点入场 | 谨慎使用 |

**禁止项**：满屏粒子背景、元素闪烁（blink）、超过 3 种同屏并发动效、无限旋转装饰。动效克制才显专业。

## 通用要求

- 每个图表实例必须监听容器/窗口 resize 并调用 `chart.resize()`
- 数据为空时显示"暂无数据"占位（`graphic` 元素或空态 DOM），禁止空白画布
- 系列 ≤ 6 个；超出时合并"其他"或改用表格
- 坐标轴名称/单位必须标注（`yAxis.name` 或面板标题内标注）
