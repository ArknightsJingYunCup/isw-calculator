# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 SolidJS 的 Web 应用，用于计算明日方舟集成战略模式（萨卡兹）的分数。应用支持多个赛季规则（jingyuncup2、jingyuncup4 等），通过复杂的计分逻辑帮助玩家计算其游戏表现得分。

## 技术栈

- **框架**: SolidJS 1.9.5
- **构建工具**: Vite 7.1.4
- **包管理器**: Bun (优先使用) / pnpm (作为备选)
- **UI 组件库**: @kobalte/core (从 SUID 迁移而来)
- **样式**: UnoCSS (使用 Tailwind 4 预设 + Primitives 预设 + Icons 预设)
- **类型**: TypeScript (strict mode)
- **开发工具**: solid-devtools, Nix (可选的开发环境)

## 常用命令

### 开发
```bash
bun install      # 安装依赖
bun run dev      # 启动开发服务器 (http://localhost:3000)
bun run start    # 同 bun run dev
```

### 构建和预览
```bash
bun run build    # 构建生产版本到 dist/ 目录
bun run serve    # 预览生产构建
```

### 测试
```bash
bun test         # 运行测试 (src/lib/index.test.ts)
```

## 项目架构

### 核心结构

```
src/
├── App.tsx              # 应用入口，渲染当前活跃的规则组件
├── index.tsx            # 挂载 SolidJS 应用
├── data/
│   └── sarkaz.ts        # 游戏数据定义（枚举、常量、分数映射）
├── lib/
│   ├── index.ts         # 核心逻辑：Modifier 类和字段类型定义
│   ├── utils.ts         # 工具函数（JSON 导入/导出、枚举辅助）
│   └── index.test.ts    # 单元测试
├── rules/
│   ├── jingyuncup2.tsx  # 第二赛季规则和 UI
│   └── jingyuncup4.tsx  # 第四赛季规则和 UI（当前活跃）
└── components/
    ├── AddBossRecordModal.tsx        # 添加领袖作战记录
    ├── AddEmergencyRecordModal.tsx   # 添加紧急作战记录
    └── AddHiddenRecordModal.tsx      # 添加隐藏作战记录
```

### 关键概念

1. **规则系统 (Rules)**:
   - 每个赛季有独立的规则文件 (`src/rules/jingyuncup*.tsx`)
   - 规则文件包含完整的 UI 和计分逻辑
   - 通过修改 `src/App.tsx` 切换活跃规则
   - 每个规则定义自己的枚举（如 LimitedOperator、EmergencyOperation 等）和计分映射

2. **数据结构 (Data)**:
   - `src/data/sarkaz.ts` 定义了通用的游戏数据结构
   - 包括关卡等级 (Level)、紧急作战 (EmergencyOperation)、隐藏作战 (HiddenOperation)、领袖作战 (BossOperation)、禁用干员 (BannedOperator) 等
   - 每个操作类型都有对应的 `Info` 对象定义其属性（关卡、基础分数、特殊条件分数等）

3. **状态管理**:
   - 使用 SolidJS 的 `createStore` 进行响应式状态管理
   - Store 结构包含：记录数组、计数器、收藏品状态、干员禁用状态等
   - 支持 JSON 导入/导出功能用于数据持久化

4. **组件模式**:
   - Modal 组件通过 Kobalte Dialog 实现
   - 使用 Accessor 模式传递响应式状态
   - 组件接收 `onClose` 和 `onAddRecord` 回调函数

5. **UnoCSS 集成**:
   - 使用 Tailwind 4 语法编写样式类
   - 通过 `@unocss/preset-icons` 集成 Iconify 图标 (mdi 图标集)
   - `unocss-preset-primitives` 提供 Kobalte 组件的基础样式

### 计分逻辑

计分系统非常复杂，涉及多个因素：
- 基础分数：来自完成的作战（紧急、隐藏、领袖）
- 修正系数：根据关卡等级、刷新次数、是否无漏、是否混乱模式等
- 额外加分：收藏品、分队选择、禁用干员、收集物品等
- 惩罚扣分：撤退次数、使用特定干员等

所有计分逻辑都在各自的规则文件中实现，使用响应式 Effect 自动更新总分。

## 部署

- 使用 GitHub Actions 自动部署到 GitHub Pages
- 工作流文件: `.github/workflows/deploy.yml`
- 触发条件: 推送到 `main` 分支或手动触发
- 构建产物: `dist/` 目录

## 开发注意事项

1. **添加新赛季规则**:
   - 在 `src/rules/` 创建新文件（如 `jingyuncup5.tsx`）
   - 定义该赛季特有的枚举和计分映射
   - 实现 Store 类型和响应式计分逻辑
   - 在 `src/App.tsx` 中切换到新规则组件

2. **修改现有规则**:
   - 核心逻辑在规则文件的 `createEffect` 中
   - 修改计分公式时需要仔细测试各种组合
   - 注意修正系数的应用顺序和精度

3. **样式开发**:
   - 使用 Tailwind 4 语法（通过 UnoCSS）
   - 响应式设计使用 `createMediaQuery` 检测屏幕尺寸
   - Kobalte 组件已有基础样式，可通过 class 覆盖

4. **类型安全**:
   - 项目启用 TypeScript strict mode
   - 枚举类型通过 `enumKeys` 和 `enumValues` 工具函数处理
   - 使用 `as` 进行类型断言时要谨慎

5. **Nix 开发环境** (可选):
   - 使用 `direnv allow` 自动加载 Nix 环境
   - flake.nix 定义了 bun 和 git-cliff 作为开发依赖

5. ark-ui 相关文档：
   - 参考 llms-ark-ui.txt 和 llms-ark-ui-solid.txt 作为 ark-ui 的文档