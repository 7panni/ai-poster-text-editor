# 第三方开源组件

本项目的离线源码编辑模式包含以下开源组件：

- [CodeMirror 6](https://github.com/codemirror/dev) — MIT License
- [CodeMirror JSON language support](https://github.com/codemirror/lang-json) — MIT License
- [CodeMirror lint support](https://github.com/codemirror/lint) — MIT License

构建与测试工具不进入运行时界面：

- [esbuild](https://github.com/evanw/esbuild) — MIT License
- [Playwright](https://github.com/microsoft/playwright) — Apache-2.0 License

## 选型记录

- CodeMirror：模块化、适合 JSON、打包后约 409KB，采用。
- Vanilla JSONEditor：树形编辑能力强，但当前 npm 包解包约 10MB、依赖较多，本版不采用。
- Monaco Editor：能力完整，但当前 npm 包解包约 98MB，对单用途离线工具过重，本版不采用。

版本以 `package.json` 与 `pnpm-lock.yaml` 为准。
