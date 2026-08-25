# AI海报文字快改 / AI Poster Text Editor

[在线使用 / Live app](https://7panni.github.io/ai-poster-text-editor/)

一个本地优先、无需后端的双语编辑器，用来快速修改 AI 生成的海报或封面文字。背景图与文字图层分离：换标题、字号、颜色和位置时，不必重新生成整张图。

A local-first bilingual editor for quickly adjusting text on AI-generated posters and covers. It keeps the background image separate from editable text layers, so wording, size, color, and position can change without regenerating the artwork.

![AI海报文字快改界面](docs/screenshot-zh.png)

## 功能 / Features

- 直接点击、拖动画布文字；点击空白或按 `Esc` 取消选择。
- 大号字号减/加按钮、精确数值、颜色、字距、行高、对齐和坐标。
- 右侧直接粘贴或编辑 `layout.json`，支持 GPT 常见字段与 Markdown 围栏清理。
- 加载本地字体；导出原尺寸 PNG；保存并重新导入排版。
- 中文/English 一键切换，默认中文。
- 图片和字体仅在本地浏览器处理，不上传。

- Click and drag text directly on the canvas; click empty space or press `Esc` to clear selection.
- Large font-size decrement/increment buttons plus precise size, color, spacing, line height, alignment, and coordinates.
- Paste or edit `layout.json` beside the canvas; common GPT aliases and Markdown fences are accepted.
- Load local fonts, export full-resolution PNG, and save/reopen layouts.
- Chinese/English interface switch; Chinese is the default.
- Images and fonts stay in the local browser and are never uploaded.

## 使用 / Use

1. 下载仓库后直接打开 `index.html`。
2. 点“换背景”选择无文字背景图。
3. 导入 `layout.json`，或在右侧源码栏粘贴 AI 输出。
4. 点击画布文字并调整，最后保存排版或导出 PNG。

1. Download the repository and open `index.html`.
2. Choose a text-free background image.
3. Import `layout.json`, or paste AI output into the source panel.
4. Click text on the canvas, adjust it, then save the layout or export PNG.

## 安装方式 / Installation

### 1. 安装包 / Release package

从 [GitHub Releases](https://github.com/7panni/ai-poster-text-editor/releases) 下载最新 ZIP，解压后双击 `index.html`。ZIP 同时支持 Windows、macOS 和 Linux，不需要安装运行库。

Download the latest ZIP from [GitHub Releases](https://github.com/7panni/ai-poster-text-editor/releases), extract it, and open `index.html`. The same package works on Windows, macOS, and Linux with no runtime installation.

### 2. 安装为网页应用 / Install as a web app

打开[在线版](https://7panni.github.io/ai-poster-text-editor/)，在 Chrome 或 Edge 地址栏选择“安装应用”；Android 可选择“添加到主屏幕”，iPhone/iPad Safari 可通过分享菜单选择“添加到主屏幕”。安装后可以独立窗口运行，并缓存基础程序供离线使用。

Open the [live app](https://7panni.github.io/ai-poster-text-editor/). In Chrome or Edge, choose “Install app” from the address bar. On Android, use “Add to Home screen”; on iPhone or iPad Safari, use Share → “Add to Home Screen.” The installed PWA runs in its own window and caches the core app for offline use.

### 3. 命令行安装 / Command-line installation

```bash
git clone https://github.com/7panni/ai-poster-text-editor.git
cd ai-poster-text-editor
```

macOS：

```bash
open index.html
```

Windows PowerShell：

```powershell
Start-Process .\index.html
```

Linux：

```bash
xdg-open index.html
```

### 4. 让 AI 安装 / Ask an AI coding agent to install it

中文提示词：

```text
请把开源项目 https://github.com/7panni/ai-poster-text-editor 安装到我的电脑。先确认目标目录，再克隆仓库；不要修改项目源码，不要安装不必要的全局依赖。完成后打开 index.html，验证默认中文界面、图片画布和 layout.json 编辑器能正常显示。告诉我实际安装路径和启动方式。如果我只需要使用成品，不要运行 pnpm install；只有我要参与开发时才安装 Node.js 依赖并运行 pnpm install、pnpm run build、pnpm test。
```

English prompt:

```text
Install the open-source project https://github.com/7panni/ai-poster-text-editor on my computer. Confirm the destination folder before cloning the repository. Do not modify the source or install unnecessary global dependencies. Open index.html and verify that the default Chinese interface, image canvas, and layout.json editor all render correctly. Report the exact installation path and launch method. If I only need to use the finished app, do not run pnpm install; install Node.js dependencies and run pnpm install, pnpm run build, and pnpm test only when I want a development environment.
```

### 原生安装包状态 / Native installer status

当前提供跨平台 ZIP 和可安装 PWA；尚未提供 Windows `.exe`、macOS `.dmg` 或 Linux `.AppImage`。这些原生安装包需要后续增加 Tauri 桌面壳和三平台签名构建，不能由当前 HTML 文件直接冒充。

The project currently provides a cross-platform ZIP and an installable PWA. Native Windows `.exe`, macOS `.dmg`, and Linux `.AppImage` packages are not yet available; they require a future Tauri desktop shell plus platform-specific signed builds.

## 平台兼容 / Platform support

| 平台 / Platform | 状态 / Status | 说明 / Notes |
|---|---|---|
| Windows | 完整 / Full | 推荐 Chrome 或 Edge / Chrome or Edge recommended |
| macOS | 完整 / Full | Chrome、Edge 保存体验最好；Safari 使用下载回退 / Chrome and Edge provide the best save flow; Safari falls back to downloads |
| Linux | 完整 / Full | 推荐 Chromium、Chrome 或 Firefox / Chromium, Chrome, or Firefox recommended |
| Android | 基础可用 / Basic | 触控和下载可用，精确排版不如桌面 / Touch and download work; desktop is better for precise layout |
| iPhone/iPad | 基础可用 / Basic | Safari 文件夹写入受限，使用普通下载 / Safari cannot write to a chosen folder; standard downloads are used |

## 给 AI 的中文提示词

复制下面整段给支持图片生成的 AI。把方括号内容替换为你的需求。

```text
请为“AI海报文字快改”生成一套可编辑的海报资产。目标主题：[主题]；用途：[B站封面/播客封面/活动海报]；画布：[宽]×[高]；视觉方向：[风格、配色、主体、留白要求]；需要显示的文字：[逐条列出文字与层级]。

必须严格分离“背景图”和“文字图层”：

1. 先生成 background.png，尺寸必须与画布完全一致。背景图不得包含任何文字、字母、数字、标志、水印或看起来像文字的纹理。按文字布局预留清晰区域。
2. 再输出一个可直接粘贴到编辑器的 layout.json。不要在 JSON 数组内部插入 Markdown 围栏、解释或注释。
3. layout.json 必须使用以下结构：
{
  "canvas": { "width": 1600, "height": 900 },
  "texts": [
    {
      "id": "title",
      "content": "主标题",
      "x": 1120,
      "y": 390,
      "font": "Noto Serif SC",
      "size": 150,
      "weight": "700",
      "color": "#344022",
      "letter_spacing": 10,
      "line_height": 1.2,
      "align": "center",
      "visible": true
    }
  ]
}
4. x、y 使用画布像素坐标；y 是文字基线位置；align 只能是 left、center 或 right。所有文字必须位于画布内，不能相互遮挡。
5. 字体优先选择用户系统容易安装的字体。如果使用特殊字体，请列出字体名称和官方下载地址，但不要把字体烘焙进背景图。
6. 最后给出 design-notes.md，简短记录：画布尺寸、视觉方向、每层文字用途、字体依赖和建议导出文件名。

最终交付顺序必须是：background.png → layout.json → design-notes.md。生成后自行检查背景无文字、JSON 可解析、文字坐标不越界。
```

## English prompt for AI

Copy the complete prompt below into an AI with image-generation capability. Replace the bracketed fields.

```text
Create an editable poster asset set for “AI Poster Text Editor.” Topic: [topic]. Use: [video thumbnail / podcast cover / event poster]. Canvas: [width] × [height]. Visual direction: [style, palette, subject, and negative-space requirements]. Required text: [list every text layer and its hierarchy].

Strictly separate the background artwork from all text layers:

1. First generate background.png at the exact canvas dimensions. The background must contain no words, letters, numbers, logos, watermarks, or text-like marks. Reserve clear negative space for the planned typography.
2. Then output a layout.json that can be pasted directly into the editor. Do not insert Markdown fences, explanations, or comments inside the JSON array.
3. layout.json must follow this structure:
{
  "canvas": { "width": 1600, "height": 900 },
  "texts": [
    {
      "id": "title",
      "content": "Main title",
      "x": 1120,
      "y": 390,
      "font": "Noto Serif SC",
      "size": 150,
      "weight": "700",
      "color": "#344022",
      "letter_spacing": 10,
      "line_height": 1.2,
      "align": "center",
      "visible": true
    }
  ]
}
4. Use canvas pixel coordinates for x and y. The y value is the text baseline. align must be left, center, or right. Keep every text layer inside the canvas with no unintended overlap.
5. Prefer fonts that users can easily install. If a special font is required, list its name and official download URL, but never bake the text into the background image.
6. Finally provide design-notes.md with the canvas size, visual direction, purpose of each text layer, font dependencies, and recommended export filenames.

Deliver in this order: background.png → layout.json → design-notes.md. Before delivery, verify that the background contains no text, the JSON parses successfully, and all text coordinates stay inside the canvas.
```

## 开发 / Development

```bash
pnpm install
pnpm run build
pnpm test
```

运行时文件是 `index.html`、`vendor/source-editor.js` 和示例 `layout.json`。CodeMirror 已本地打包，运行时不依赖 CDN。

Runtime files are `index.html`, `vendor/source-editor.js`, and the sample `layout.json`. CodeMirror is bundled locally; the app does not require a CDN.

## License

[MIT](LICENSE). Third-party notices are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## 作者 / Credits

- 开发者 / Developer: 尚宸鸣 / Chenming Shang
- 使用 Codex 协助开发 / Developed with Codex assistance
- 项目 / Project: [github.com/7panni/ai-poster-text-editor](https://github.com/7panni/ai-poster-text-editor)
- 作者博客 / Author blog: [7panni.com](https://7panni.com)
