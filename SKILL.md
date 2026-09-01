---
name: bi-dashboard-generator
description: Use when the user asks to create or replicate a data visualization dashboard, BI cockpit, command center, monitoring wall, 数据看板, or large-screen看板; when they attach a dashboard screenshot or prototype to copy; when they mention 复刻 / 参考图 for a data screen; or when they provide a PRD or layout description for a data screen. If a document mixes dashboard and admin CRUD, only take the dashboard pages. Do not use for ordinary admin CRUD pages.
---

# 可视化大屏生成器

生成风格统一的数据可视化大屏。默认产出**单文件 HTML 原型**（浏览器直接打开），确认后可转 Vue3 工程。

有参考图时走**复刻模式**（结构同构，不承诺像素级材质），细则见 [replica-mode.md](replica-mode.md)。无参考图走**主题模式**（token + 模板默认脸）。

## 能力边界（生成前告知用户）

| 层次 | 主题模式 | 复刻模式 |
|---|---|---|
| 静态展示 | ✅ 按 token 与模板完整生成 | ⚠️ **结构同构**：布局、字号档、图表类型、色相、壳叠层、锚点数字跟图。ECharts geo/灯管/电路密度 **未覆盖**，不承诺像素级 |
| 页面交互 | ✅ HTML 内 mock 假交互 | ✅ 同左（点了什么跟确认单） |
| 真实数据对接 | ⚠️ 仅字段名 + mock 开关占位，不是接口契约 | ⚠️ 同左 |
| 工程化 | ⚠️ Vue 给骨架 | ⚠️ 同左；转 Vue 须与已复刻 HTML 1:1，禁止拉回玻璃脸 |

## 工作流程

```
Step 1 识别入口 → Step 2 输出方案确认单 → Step 3 确认主题与输出形式
→ Step 3.5 骨架预览（复杂/多页项目） → Step 4 生成 → Step 5 自检
→ Step 5.5 独立审核（HTML / Vue 均要） → Step 6 交付与迭代
```

### Step 1：识别需求入口（四选一，自动判断）

**入口① 一句话需求**（小白用户）：
用户只说了业务（如"做一个奶茶店销售大屏"）。此时**由 AI 代做专业决策**：根据业务推断指标 → 选布局骨架 → 配组件，然后用人话向用户描述方案。禁止反问用户"要什么布局/什么图表"这类专业问题。

业务判断本身也可能出错（尤其跨行业/混合业务描述），**方案确认单必须显性列出「业务识别 + 默认指标包」**（如"识别为医药经营分析类，默认指标：营收/利润/存货/动销品种/批文"），让用户先确认业务判断本身，而非只确认布局，避免指标包整体选错却在生成完才发现。

**入口② 布局描述**：用户明确写了分区与组件（"左边放 KPI，中间放趋势图…"）。直接解析映射到栅格骨架，缺失处才追问。

**入口③ 参考图/原型截图**：进入**复刻模式**。色值仍用主题 token（不抄原图 hex），几何与结构跟图。

**必须先完整执行 [replica-mode.md](replica-mode.md)**，再写确认单。禁止用主题默认脸「凑一版像大屏」。无参考图才走主题模式。

最低限度（细节以 replica-mode 为准）：

1. 从**本 Skill 根目录**（与 `SKILL.md` 同级，禁止写死 `~/.cursor/skills`）跑 `scripts/inspect-source.js` 鉴定源图。跑不了则用手核能读到的宽高/格式；仍读不到或聊天压缩件 / 宽 &lt; 1600 **停**，请用户把原生文件放进仓库。
2. 按 1920 原尺寸 clip **参考原图**（不要 clip 半成品 HTML）；壳图只铺外框，和内容截图不要混坐标系。
3. 顶栏/每卡形态写不出 → 停问。列宽只写大约占比，禁止声称已量准到 px。
4. 禁止套 `24% 1fr 24%` 或模板玻璃卡。
5. 图表 series 跟图选模板，禁止默认面积折线。
6. 写后同区块 `ref`/`proto` 截图并排；产品页不要 `?overlay=1`，review 不要扫像素脚本。

**入口④ 需求文档**（产品经理主路径）：解析文档提取「页面清单 → 每页区块 → 区块指标与图表类型 → 交互（弹窗/穿透/筛选）」，输出解析确认单。**文档未写明的项（如图表类型）必须列入"缺失项"并给出建议，禁止静默猜测后直接生成。**

- **图片优先于文字还原布局**：文档（docx/pptx 等）含嵌入截图时，必须提取原始图片（如解压 docx 读取 `word/media/*.png`）作为布局真相源——精确的区块排布、比例、视觉层级只有图片才有；文字仅用于提取指标口径、计算逻辑、交互说明。图片与文字描述冲突时，列入疑点清单问用户，不能只信一边静默选择。文档内嵌大屏截图按入口③ + replica-mode 处理。
- **疑点清单与缺失项并列，缺一不可**：疑点清单专门列文档内部的矛盾/重复/可疑错字（如同一指标在两处定义不同、明显笔误、图表类型前后不一致），而不仅是"文档没写"的缺失项。两类问题都必须在解析确认单中列出，禁止 AI 自行挑一种理解静默生成。
- **混合文档**：同一份材料里既有大屏/看板页、又有中后台或 CRUD 页时，本 Skill **只做大屏页**。其余章节交回 `requirements-to-dev`。用户只说「按这份文档开始」、未点明只要大屏时，先让 `requirements-to-dev` 判定范围，再接过大屏页。

### 与 requirements-to-dev 交接

交回 / 被委托时：先读对方 Skill 根目录的 `SKILL.md`（含该 `name` 与 `SKILL.md` 的目录）再动手。对方未安装则停，请用户安装或点名调用，禁止空口假装已按对方流程做完。

本 Skill 只出确认单、原型与对接占位。占位 = 字段名 + `USE_MOCK` 开关，**不是**路径 / 错误码 / DDL。若用户还要数据模型、接口契约或开发计划，交回 `requirements-to-dev`，不拆开发模块。

项目无总规则时，以确认单为写文件门禁（确认单未发出不得写）；不另设 `go`。项目已有总规则则跟项目的。

### Step 2：输出方案确认单

生成前必须先给用户看方案。**主题模式**可用下面格式；**复刻模式**必须改用 [replica-mode.md](replica-mode.md) 第 3 节检查表（源图像素、壳图有无、标题形态、每卡结构、series 类型、大约列宽）。即使用户先回 `go`，确认单未发出也不得开写。

```
【大屏方案确认单】（主题模式示例）
业务识别：医药经营分析类（默认指标包：营收/利润/存货/动销品种/批文）
标题：XX 分析大屏（1920×1080）
布局：三列式（布局详见 layout-patterns.md）
  ├─ 顶部：标题栏 + 时间筛选
  ├─ 左列：KPI 卡 ×4（今日营业额、订单数…）
  ├─ 中列：上-近30天营业额趋势（折线）；下-门店销量对比（柱状）
  └─ 右列：热销 Top10 排行 + 品类占比（饼图）
交互：点击 KPI → 明细弹窗（假数据）
缺失项：右下角区块文档未指明图表类型，建议饼图，是否可以？
疑点清单：「发货额环比」在文档 3.2 节与 3.5 节定义不同，采用哪个？
```

组件描述用人话（对照 layout-patterns.md 的组件清单人话列），不甩术语。业务识别行仅在需要推断业务或指标包时出现；疑点清单行仅在解析文档/图片发现内部矛盾时出现，无对应问题不必强行填充。多页/穿透项目、或用户对布局理解没把握时，确认单之后可先走 Step 3.5 骨架预览，再进入 Step 4 正式生成。

### Step 3：确认主题与输出形式

用对话选项确认（运行时若有 AskQuestion 一类工具也可用），**每项都有推荐默认值，用户全选默认也能得到完整大屏**：

1. 主题：深色 BI 科技风（推荐）/ 浅色简约 —— token 见 [themes.md](themes.md)
2. 输出形式：单文件 HTML 原型（推荐，双击即看）/ Vue3 + Element Plus + ECharts + LESS + Pinia（Vite 构建）工程代码
3. 分辨率基准：1920×1080（推荐）/ 其他

用户在需求中已表明的不重复问。复刻模式不把「像素级还原」设成可选项；生成前用能力边界表说清未覆盖项。

### Step 3.5：骨架预览（复杂/多页项目建议先做，可跳过）

对于多页穿透项目、或用户对布局理解没有十足把握时，先产出一版**无配色、无真实图表、无 mock 数据**的纯灰框占位页：每个区块只画边框 + 区块用途标签文字（如「KPI 卡 ×4」「趋势折线图」），几秒钟出结果，让用户先确认区域划分和比例，而非等最终版才发现理解偏了。灰框骨架的模板见 [layout-patterns.md](layout-patterns.md) 的「骨架预览模式」一节。

- 灰框骨架的网格/比例必须与最终版完全一致，仅去掉主题配色、图表渲染、mock 内容
- **复刻模式**的灰框比例必须来自确认单的大约占比，禁止用 24%/52%/24% 占位后再「正式生成时重排」
- 用户确认后再进入 Step 4，按同一套网格套用主题与内容，不重新排布
- 简单单页、或用户已给出精确布局描述时可跳过，直接进入 Step 4

### Step 4：生成

**HTML · 主题模式**（无参考图）：
- 基于 [templates/screen.html](templates/screen.html) 骨架生成**零依赖单文件**（ECharts 用 CDN）
- 布局骨架从 [layout-patterns.md](layout-patterns.md) 选取
- 图表 option 从 [chart-patterns.md](chart-patterns.md) 模板修改，含标准动效
- mock 按 [mock-data-rules.md](mock-data-rules.md)（量级真实、趋势有形状、行业名词）

**HTML · 复刻模式**（有参考图）：
- 只借 `#screen` 适配、`:root` token、弹窗/toast；**禁止**沿用模板 `.topbar / .panel / .kpi` 视觉
- 栅格按确认单大约占比写，禁止套 layout-patterns 默认 `24% 1fr 24%`，禁止声称已量准到 1px
- 按图选择或新写 chart option（柱+线 / 堆叠柱+线 / 地图见 chart-patterns 模板 7–9），禁止默认模板 1
- mock **照搬**图上组织名、账期、锚点数字（见 mock-data-rules 复刻例外）

两种模式共通：
- 交互用原生 JS + mock 假交互
- 多屏：逐屏独立 HTML，穿透用相对链接
- 交付 HTML **零本地依赖**；Playwright 脚本只放生成物旁 `review/`，不进 HTML

**Vue 模式**：
- 技术栈固定：**Vue3（Composition API）+ Element Plus + ECharts + LESS + Pinia，Vite 构建**；Element Plus 按需自动引入（unplugin-auto-import + unplugin-vue-components）
- 基于 [templates/screen.vue](templates/screen.vue) 组织工程。**主题模式**可用 PanelBox 玻璃底；**复刻/已有 HTML 原型**时组件必须 1:1 跟原型，禁止用玻璃 PanelBox 把脸拉回去
- 控件类 UI（下拉/日期选择/弹窗/表格分页）用 Element Plus；**深色主题必须用 token 覆盖其默认白底样式**
- 全局状态用 Pinia：时间上下文（statMonth 模式）、筛选联动、refreshToken
- 色值放 `variables.less` + `colors.js` 双 token；API 占位 + mock 开关 + 字段映射注释

**同时交付「设计说明清单」**（Markdown）：区块↔指标↔图表类型映射表、每个数字的 mock 口径、交互清单。供产品评审和开发对接。

### Step 5：生成后强制自检

逐项核对，不通过就修，修完再进入 5.5：

- [ ] 所有色值来自所选主题 token 表（无裸写 `#fff`、`red` 等自造色）
- [ ] 基准分辨率下无横向滚动条、无组件溢出
- [ ] 长文本（企业名/产品名）有 `text-overflow: ellipsis` 处理
- [ ] 图表 legend/tooltip 不遮挡数据，grid 设置 `containLabel: true`
- [ ] 数字有千分位；同比/环比带涨跌色与 +/- 号
- [ ] 空数据区块显示占位符"—"，不留空白
- [ ] mock 符合量级规则；复刻时图上专名与账期未被改写
- [ ] 动效克制；复刻时 KPI 形态跟图（翻牌不要强行 CountUp）
- [ ] 能跑无头浏览器则：基准分辨率 + 至少 2 个其他分辨率；无横滚、无溢出、弹窗在画布内、无 JS 报错——贴输出。跑不了则手开 HTML 核同样项，并在审核写「未跑无头」
- [ ] 有参考图：同区块并排 + 视觉差清单（每块一条可核对差或「未覆盖」）

Step 5 **不能代替 Step 5.5**。禁止把自检勾选复述成「已完成」。

### Step 5.5：独立审核（HTML / Vue 均必须，生成后立刻做）

对照确认单、参考图（若有）、硬性规则和 [review-checklist.md](review-checklist.md) **找不一致**，不是再打一遍 Step 5 的勾。

**产出（审核结论外置，禁止写入设计说明正文）**
- 目录：生成物**同级** `review/`
- 文件名：`{主文件名}-审核-YYYYMMDD.md`
- 正文：对照范围、P0/P1/P2、**区块视觉差清单**（有参考图必填）、证据、结论
- 有参考图时：无视觉差清单、或清单全写「已同构」→ 禁止写通过

**门禁**
- **结构 / 字号档 / 图表类型 / 锚点 / 换皮 / JS 报错**：P0/P1 当场修（能力边界「未覆盖」除外），已授权生成本次产物后不必再等一次 `go`
- **材质类 P2**（光晕、灯管、电路密度、ECharts 地图材质）：标「未覆盖」后 **停止改皮肤**，禁止靠打磨 P2 换「通过且无差」
- 用户说「不要再打磨 / 停 / 换模型」：禁止再改 CSS 与图表皮肤
- 有任意 **P0** 修不掉：禁止说「已完成 / 可以交付」
- 改完追加「复审」节；P0 仍在则不得声称完成
- 项目「无 go 不改文件」只约束尚未授权生成本次产物的阶段

清单分 HTML / Vue 两节；「转 Vue」时两节都要过。

### Step 6：交付与迭代

- **仅当** Step 5.5 无未清 P0，且该修的 P1 已复审（或仅剩已标明的能力边界「未覆盖」）才进入本步
- 告知打开方式（HTML 双击；Vue `npm i && npm run dev`）
- 用户口头改布局/指标：改后重新走 Step 5 + 5.5
- 用户叫停打磨：进入本步，不要再改观感
- 转 Vue：与 HTML 1:1，再走 Step 5.5 Vue 节
- 用户还要数据模型、接口契约或开发计划：交回 `requirements-to-dev`，本 Skill 停在原型与对接占位

## 硬性规则（任何模式必须遵守）

1. **色值只取自所选主题的 token 表**，禁止自造颜色、禁止 ECharts 默认配色
2. **深色主题禁止白底元素**（含 tooltip、弹窗、下拉），一律用主题面板色
3. 涨跌色与排名色**严格解耦**：涨跌只表方向（红涨绿跌可按主题配置），排名用金/橙/黄系，同一元素不得同时承担两种语义
4. 数值 `>0` 涨色、`<0` 跌色、`=0` 平色、`null` 显示"—"且不着色
5. 字体：标题可用装饰性字体（如优设标题黑），正文一律系统字体栈
6. 屏幕适配：整页 `transform: scale` **拉伸铺满**（默认，见 layout-patterns.md），禁止 rem 碎片化适配；仅用户明确要求"不能变形"时才改用等比留边
7. 图表必须 `resize` 响应窗口变化
8. 交付的 HTML **零本地依赖**（ECharts 走 CDN），双击可打开。审核用的 Playwright 脚本放 `review/`，不打进 HTML
9. 解析需求文档/参考图时，**图片的布局精度高于文字转译**；文档内部矛盾必须列入疑点清单，禁止静默选择
10. 多页/穿透类项目必须遵守 [mock-data-rules.md](mock-data-rules.md) 的「数据一致性引擎」
11. 有参考图时必须遵守 [replica-mode.md](replica-mode.md)：**结构同构，不承诺像素级**。禁止套主题默认脸、禁止把低清拉伸 gutter 当真实尺寸、禁止审核只写「已同构」
12. 本 Skill 只出确认单、原型与对接占位（字段名 + mock 开关）；不出路径 / 错误码 / DDL 全文、不拆开发模块。后续数据模型 / 接口契约 / 开发计划交回 `requirements-to-dev`。对方未安装则停，不要空口假装已交接。

## 参考文件

- [replica-mode.md](replica-mode.md) —— 复刻：鉴定源图、原图 clip、壳/内容分开、写后同区块并排
- [themes.md](themes.md) —— 主题 token 表（色彩/字体/字号，深色 BI + 浅色简约）
- [layout-patterns.md](layout-patterns.md) —— 布局骨架（**仅主题模式默认值**）、组件清单、屏幕适配
- [chart-patterns.md](chart-patterns.md) —— ECharts 模板（含柱+线 / 堆叠柱+线 / geo 地图）
- [mock-data-rules.md](mock-data-rules.md) —— mock 规则；复刻须照搬图上专名与账期
- [templates/screen.html](templates/screen.html) —— 主题模式 HTML 骨架（复刻禁用其脸）
- [templates/screen.vue](templates/screen.vue) —— Vue3 工程骨架
- [review-checklist.md](review-checklist.md) —— Step 5.5 审核清单
- [scripts/inspect-source.js](scripts/inspect-source.js) —— 鉴定参考图像素与格式（从本 Skill 根目录运行，不要写死编辑器路径）
