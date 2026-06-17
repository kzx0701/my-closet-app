# AGENTS.md

## 项目概览

家庭衣橱管理应用。前端使用 uni-app（Vue 3），后端使用 uniCloud-Aliyun。通过 HBuilderX IDE 开发，没有 npm 脚本、没有 Vite dev server、没有标准 CLI 工作流。

## 架构

### 前端分层（必须遵守）

```
pages/              → 页面组件，禁止直接访问数据库
common/services/    → 业务编排、路由、状态组装
common/api/modules/ → 接口调用封装（按领域拆分：family、closet、clothes）
common/api/clients/ → 底层云对象/数据库客户端封装
```

- 页面禁止直接调用 `uniCloud.database()` 或 `uniCloud.importObject()`
- 所有云调用统一经过 `common/api/modules/` → `common/api/clients/cloud-object.js`
- `common/services/` 负责鉴权判断、路由决策、状态组装
- `common/constants/` 存放预设选项（衣橱样式、颜色、衣物分类）

### 后端

使用云对象（不是传统云函数），位于 `uniCloud-aliyun/cloudfunctions/`：

- `family-co/index.obj.js` — 家庭 CRUD + 成员关系
- `closet-co/index.obj.js` — 衣橱 CRUD + 首页摘要
- `clothes-co/index.obj.js` — 衣物 CRUD（当前仅支持个人空间）

每个云对象通过 `_before()` 钩子使用 `uni-id-common` 做 token 校验，鉴权后的 uid 存储在 `this.authInfo.uid`。

### 数据库

共 5 张表，字段命名统一使用 **snake_case**（如 `scope_type`、`scope_owner_user_id`、`created_at`）。

- `uni-id-users` — uni-id-pages 官方用户表
- `families` — 家庭记录
- `family_members` — 用户-家庭成员关系（一个用户只能属于一个家庭）
- `closets` — 衣橱记录（支持 `personal` 和 `family` 两种作用域）
- `clothes` — 衣物记录（支持 `personal` 和 `family` 两种作用域）

Schema 定义文件：`uniCloud-aliyun/database/*.schema.json`

### 双作用域模型

每条衣橱和衣物记录都有 `scope_type` 字段（`personal` | `family`）。个人数据通过 `scope_owner_user_id` 隔离；家庭数据通过 `family_id` 隔离。权限校验在云对象中完成。

## 核心模式

### 登录流程

1. `uni-id-pages` 处理登录/注册 UI（自定义页面在 `pages/auth-login/` 和 `pages/auth-register/`）
2. `uni-id-co` 在服务端处理认证
3. 登录后，`pages/entry/index` 调用 `common/services/session-router.js` 中的 `resolveLaunchTarget()`
4. 路由决策：未登录 → 登录页；已加入家庭 → 首页；已跳过家庭引导 → 首页；其他 → 家庭引导页

### API 模块模式

```js
import { getCloudObject } from "@/common/api/clients/cloud-object.js";
const xxxCloudObject = getCloudObject("xxx-co");
export function someMethod(payload) {
  return xxxCloudObject.someMethod(payload);
}
```

`common/api/modules/` 中每个函数必须有 JSDoc 注释，说明用途、输入和返回值。

### 云对象鉴权模式

```js
async _before() {
  const token = this.getUniIdToken();
  // 通过 uni-id-common 校验，结果存入 this.authInfo
}
```

使用 `requireLogin(context)` 辅助函数提取 uid，未登录时抛出 `APP_UNAUTHORIZED`。

## 开发命令

本项目没有 CLI 命令。所有开发、构建、部署通过 HBuilderX 完成：

- **运行**：HBuilderX → 运行到浏览器 / 运行到手机 / 运行到小程序
- **构建**：HBuilderX → 发行 → App / H5 / 小程序
- **云函数部署**：HBuilderX → 右键 `uniCloud-aliyun` 文件夹 → 上传云对象
- **数据库初始化**：HBuilderX → uniCloud 控制台 → 导入 schema 文件

## 重要约束

- Vue 3（`manifest.json` 中 `"vueVersion": "3"`）
- 条件编译指令（`#ifdef VUE3` / `#ifndef VUE3`）在 `main.js` 中使用，其他地方也可能出现
- `uni_modules/` 包含 DCloud 官方插件，不要随意修改
- 本项目没有测试框架
- 本项目没有 CI/CD 流程
- `.editorconfig`：UTF-8、LF 换行、2 空格缩进
- `uni.scss` 提供全局 SCSS 变量（无需 import 即可使用）

## 禁止事项

- 禁止在页面组件中直接调用 `uniCloud.database()` 或 `uniCloud.importObject()`
- 禁止在页面 `.vue` 文件中编写业务逻辑 — 使用 `common/services/`
- 禁止创建新的用户表 — 使用 `uni-id-users`
- 禁止绕过云对象直接写数据库 — 权限校验在云对象中
- 禁止删除 `uni_modules/` 中的文件 — 它们是官方插件资源
- 禁止使用 camelCase 命名数据库字段 — 使用 snake_case
