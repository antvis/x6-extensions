# 变更日志

## 3.0.1 - 2025-12-01

### 修复

- 修复构建产物目录结构：移除 `lib/src` 与 `es/src`，编译产物仅包含模块文件及声明。

## 3.0.0 - 2025-11-27

### 重大变更

- 对齐 `@antv/x6@^3.x`，不兼容旧版 `x6@^2`。
- 要求 `@angular/core >= 14` 作为 peer 依赖。

### 新特性

- 在 X6 v3 下渲染 Angular 组件的视图实现与注册流程优化。

### 维护

- 构建与打包配置更新：Rollup 3、Vite 7。
- UMD 产物：`dist/x6-angular-shape.min.js`，全局名：`X6AngularShape`。
