# 主题 Token 表

生成大屏时**所有色值必须取自所选主题的 token 表**，禁止自造颜色。
CSS 中以 CSS 自定义属性输出（`--bg-page` 等），ECharts option 中直接引用色值常量。

---

## 主题一：深色 BI 科技风（默认推荐）

**关键词**：深蓝底、青色高光、渐变发光、企业级驾驶舱。

### 背景

| Token | 色值 | 用途 |
|---|---|---|
| `--bg-page` | `#040d21` | 页面底色（可叠加径向渐变 `radial-gradient(ellipse at 50% 0%, #0a1f42 0%, #040d21 60%)`） |
| `--bg-panel-top` | `rgba(18, 64, 124, 0.34)` | 面板玻璃底渐变起点 |
| `--bg-panel-bottom` | `rgba(8, 26, 56, 0.52)` | 面板玻璃底渐变终点 |
| `--bg-card-top` | `rgba(6, 48, 98, 0.38)` | KPI 卡渐变顶 |
| `--bg-card-bottom` | `rgba(22, 50, 73, 0.42)` | KPI 卡渐变底 |
| `--bg-table-header` | `#063062` | 表格表头（或渐变 `#16487f → #0d2c55`） |
| `--bg-input` | `#083853` | 输入框/下拉框 |
| `--bg-filter-bar` | `#163249` | 筛选栏 |
| `--bg-flipper` | `rgba(0, 255, 255, 0.2)` | 数字翻牌器底 |
| `--bg-tooltip` | `rgba(6, 24, 52, 0.92)` | 图表 tooltip / 弹出层 |
| `--bg-row-stripe` | `rgba(13, 38, 73, 0.35)` | 表格斑马纹 |

### 主色与强调

| Token | 色值 | 用途 |
|---|---|---|
| `--color-primary` | `#076BD4` | 主题蓝：图标、标题装饰 |
| `--color-accent` | `#00fffc` | 科技青：边框、按钮描边、高亮数据 |
| `--color-border-blue` | `#00b8fc` | 侧边线 |
| `--color-progress` | `#00aaff` | 进度条前景 |
| `--color-bright` | `#1ccaff` | 标题渐变终点 |

### 语义色 · 涨跌（方向）

| Token | 色值 | 规则 |
|---|---|---|
| `--trend-up` | `#FF2C2C` | 数值 >0（红涨，中国习惯） |
| `--trend-down` | `#05DC00` | 数值 <0（绿跌） |
| `--trend-flat` | `#BFC7D5` | =0 持平；null → 显示"—"不着色 |

> 国际化场景可对调红绿（绿涨红跌），但**一屏内必须统一**，且需用户明确要求才切换。

### 语义色 · 排名（与涨跌解耦，禁止互用）

| Token | 色值 |
|---|---|
| `--rank-top1` | `#FFD700` 金 |
| `--rank-top2` | `#e37318` 橙 |
| `--rank-top3` | `#f5ba18` 黄 |
| `--rank-other` | `#409EFF` 蓝 |

### 语义色 · 数据类型（多系列图表配色顺序）

| Token | 色值 | 典型用途 |
|---|---|---|
| `--data-1` | `#00fffc` 青 | 第 1 系列 / 收入类 |
| `--data-2` | `#076BD4` 蓝 | 第 2 系列 / 同期对比 |
| `--data-3` | `#ff8c00` 橙 | 第 3 系列 / 利润类折线 |
| `--data-4` | `#ffe84d` 亮黄 | 第 4 系列 / 同期折线 |
| `--data-5` | `#0dffb7` 亮绿 | 第 5 系列 |
| `--data-6` | `#FF6B9D` 粉 | 第 6 系列 |

### 文字

| Token | 色值 | 用途 |
|---|---|---|
| `--text-title` | `#ffffff → #1ccaff` 渐变 | 页面主标题（`background-clip: text`） |
| `--text-body` | `rgba(255,255,255,0.7)` | 正文/数据 |
| `--text-strong` | `#ffffff` | 强调数值 |
| `--text-secondary` | `rgba(255,255,255,0.65)` | 次要信息 |
| `--text-dim` | `rgba(255,255,255,0.3)` | 英文副标题/水印 |
| `--text-table-head` | `#eaf6ff` | 表头（柔白蓝） |
| `--text-table-body` | `#cfe6ff` | 表格正文（淡蓝） |

### 边框与线

| Token | 色值 | 用途 |
|---|---|---|
| `--border-panel` | `rgba(0,255,252,0.34)` | 面板边框 |
| `--border-glow` | `rgba(0,255,252,0.08)` | 面板内发光（inset box-shadow） |
| `--border-table` | `#1a3d5c` | 表格行边框 |
| `--axis-line` | `rgba(255,255,255,0.18)` | 图表坐标轴 |
| `--split-line` | `rgba(255,255,255,0.10)` | 图表分隔线（dashed） |

### 面板标准样式（直接套用）

```css
.panel {
  background: linear-gradient(180deg, var(--bg-panel-top), var(--bg-panel-bottom));
  border: 1px solid var(--border-panel);
  border-radius: 6px;
  box-shadow: inset 0 0 12px var(--border-glow);
}
.panel-title {
  background: linear-gradient(90deg, rgba(7,107,212,0.4), transparent);
  border-left: 3px solid var(--color-accent);
  padding: 6px 12px;
  font-weight: 700;
  color: var(--text-strong);
}
```

---

## 主题二：浅色简约

**关键词**：白底、灰蓝分区、克制用色、报告风。适合投影/打印/白天办公室场景。

### 背景

| Token | 色值 | 用途 |
|---|---|---|
| `--bg-page` | `#f5f7fa` | 页面底色 |
| `--bg-panel-top` / `--bg-panel-bottom` | `#ffffff` / `#ffffff` | 面板（纯白，配阴影） |
| `--bg-card-top` / `--bg-card-bottom` | `#f8faff` / `#eef3fb` | KPI 卡 |
| `--bg-table-header` | `#eaf0f9` | 表头 |
| `--bg-input` | `#ffffff` | 输入框 |
| `--bg-tooltip` | `rgba(255,255,255,0.98)` | tooltip |
| `--bg-row-stripe` | `#f7f9fc` | 斑马纹 |

### 主色与强调

| Token | 色值 |
|---|---|
| `--color-primary` | `#2563eb` |
| `--color-accent` | `#0ea5e9` |
| `--color-bright` | `#38bdf8` |

### 语义色

| Token | 色值 |
|---|---|
| `--trend-up` | `#e02020`（红涨） |
| `--trend-down` | `#12a454`（绿跌） |
| `--trend-flat` | `#8a94a6` |
| `--rank-top1/2/3/other` | `#d4a017` / `#e37318` / `#c9a227` / `#2563eb` |
| `--data-1..6` | `#2563eb` `#0ea5e9` `#f59e0b` `#8b5cf6` `#10b981` `#ec4899` |

### 文字与线

| Token | 色值 |
|---|---|
| `--text-title` | `#1e293b` |
| `--text-body` | `#475569` |
| `--text-strong` | `#0f172a` |
| `--text-secondary` | `#94a3b8` |
| `--border-panel` | `#e2e8f0` |
| `--axis-line` | `#cbd5e1` |
| `--split-line` | `#e8edf3` |

面板样式：白底 + `box-shadow: 0 1px 4px rgba(15,23,42,0.08)` + 圆角 8px，无发光效果。

---

## 字体规范（两主题通用）

| 用途 | 字体 / 字号 / 字重 |
|---|---|
| 页面主标题 | 装饰性标题字体（优设标题黑/思源黑体 Heavy，无则 Microsoft YaHei bold）；32–64px；700 |
| KPI 大数字 | `DIN Alternate / Bebas Neue / Arial`（数字等宽观感）；28–36px；bold |
| 卡片标题 | 系统字体栈；16–18px；700 |
| 正文/表格 | `Helvetica Neue, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif`；12–14px；400–600 |
| 辅助信息 | 同正文；12px；400 |

## 数字格式（两主题通用）

- 金额/数量：千分位分隔（`1,234,567.89`），金额按万/亿缩放并标单位
- 百分比：2 位小数 + `%`，同比/环比带 `+`/`-` 号与涨跌色
- 空值：统一"—"，不着色不留白
