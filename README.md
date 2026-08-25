# 呃……

程序还有点瑕疵，也没封装多平台安装包，但博主token不够用了，这礼拜先不改了

# AI海报文字快改 / AI Poster Text Editor

[在线使用 / Live app](https://7panni.github.io/ai-poster-text-editor/)

很多人用 AI 生成海报或封面后，会发现图片里的文字有错字、乱码或排版问题。即使文字没有错，只想改一个词、调整字号、颜色或位置，也常常要反复生成半天，背景和构图还可能跟着变化。

AI 海报文字快改把背景图和文字排版分开：让 AI 生成一张无文字背景图，再提供 `layout.json`。把两者导入后，直接点击画布文字修改，最后导出原尺寸 PNG。整个过程在本地浏览器完成，图片和字体不会上传。

AI-generated posters often contain misspelled, garbled, or poorly positioned text. Even when the wording is correct, changing one phrase, font size, color, or position can require many slow regenerations—and may unexpectedly alter the artwork. AI Poster Text Editor separates the text-free background from a `layout.json`, so you can click and adjust text locally, then export a full-resolution PNG without regenerating the image.

![AI海报文字快改界面](docs/screenshot-zh.png)

## 使用 / Use

点“替换背景”选择无文字背景图，也可以把图片直接拖到画布上；再点“导入排版”，或在右侧 `layout.json` 页粘贴 AI 给出的代码。点击或拖动画布中的文字，在右侧改内容、字体、字号、字距、行高、颜色和位置；点击空白处或按 `Esc` 可取消选择。字号、字距、行高、X、Y 均可用 `− / ＋` 微调，按住 Shift 点击使用大步长。完成后可保存排版、导出 PNG，或点“全部导出”把 PNG 与 layout 保存到同一文件夹。

Choose a text-free image with “Replace background,” or drag an image directly onto the canvas. Import a layout or paste AI-generated code into the `layout.json` panel, adjust the text, then save the editable layout or export a PNG.

“保存排版”和“导出 PNG”各有独立下拉菜单，可另存或使用上次授权的文件夹；通过文件选择器打开的 layout 可由主按钮快速覆盖。“全部导出”会把 PNG 与 layout 写入同一文件夹。不支持文件夹权限的浏览器会回退为下载两个文件。网页无法自动读取普通上传图片的原文件夹。字体框会提示当前字体是否可用，特殊字体可通过“加载本地字体”临时加载。源码编辑器还会清理 Markdown 围栏和 HTML 空格实体，接受单独的文字对象片段；完整 layout（含 `canvas`）会替换全部文字，片段（缺少 `canvas`）按 `id` 合并：相同 `id` 更新、新 `id` 追加、其他图层保留。右侧面板底部提供危险色“清空全部文字”按钮，导入空 `texts` 数组会被拒绝。背景和排版会自动保存在本机 IndexedDB，刷新后恢复上次会话；设置里可“清除上次会话”，数据不会上传。

The Settings menu offers the browser download folder, the last-used folder, or the background image folder. Browsers do not reveal an uploaded file's real path, so “With background image” requires one folder confirmation. Chrome and Edge support direct folder writing; other browsers fall back to normal downloads. The source editor also cleans common AI artifacts such as Markdown fences and HTML space entities and accepts standalone text-object fragments. A full layout (with `canvas`) replaces all texts; a fragment (without `canvas`) merges by `id`: matching ids are updated, new ids are appended, other layers stay untouched. A danger-colored “Clear all texts” button sits at the bottom of the right panel, and importing an empty `texts` array is rejected. The background and layout are stored locally in IndexedDB so the last session is restored after a refresh; the settings menu offers “Clear last session”, and nothing is ever uploaded.

## 使用与安装 / Use and installation

最省事的方式是打开[在线版](https://7panni.github.io/ai-poster-text-editor/)。也可以从 [GitHub Releases](https://github.com/7panni/ai-poster-text-editor/releases) 下载 ZIP，解压后打开 `index.html`。Chrome 或 Edge 可把在线版安装为独立窗口的 PWA；Android 和 iPhone/iPad 也可“添加到主屏幕”。编辑功能可在 Windows、macOS、Linux 和手机浏览器运行，精细排版更适合桌面端。

Use the [live app](https://7panni.github.io/ai-poster-text-editor/), or download the ZIP from [GitHub Releases](https://github.com/7panni/ai-poster-text-editor/releases), extract it, and open `index.html`. Chrome and Edge can install the live version as a PWA; mobile browsers can add it to the home screen. Editing works on Windows, macOS, Linux, and phones, while precise layout is easier on desktop.

命令行安装 / Command-line installation:

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

让 AI 安装 / Ask an AI coding agent to install it:

中文提示词：

```text
请把开源项目 https://github.com/7panni/ai-poster-text-editor 安装到我的电脑。先确认目标目录，再克隆仓库；不要修改项目源码，不要安装不必要的全局依赖。完成后打开 index.html，验证默认中文界面、图片画布和 layout.json 编辑器能正常显示。告诉我实际安装路径和启动方式。如果我只需要使用成品，不要运行 pnpm install；只有我要参与开发时才安装 Node.js 依赖并运行 pnpm install、pnpm run build、pnpm test。
```

English prompt:

```text
Install the open-source project https://github.com/7panni/ai-poster-text-editor on my computer. Confirm the destination folder before cloning the repository. Do not modify the source or install unnecessary global dependencies. Open index.html and verify that the default Chinese interface, image canvas, and layout.json editor all render correctly. Report the exact installation path and launch method. If I only need to use the finished app, do not run pnpm install; install Node.js dependencies and run pnpm install, pnpm run build, and pnpm test only when I want a development environment.
```

### 原生安装包开发暂停 / Native installers paused

项目可以继续用 Tauri 封装 Windows `.exe`、macOS `.dmg` 和 Linux `.AppImage`，但这项开发目前暂停，现阶段只提供 ZIP 和 PWA。欢迎有空、有兴趣的开发者接手并提交 Pull Request。

The app can be wrapped with Tauri to produce Windows `.exe`, macOS `.dmg`, and Linux `.AppImage` installers, but that work is currently paused. The project presently ships as a ZIP and PWA. Contributors are welcome to pick up the native packaging work and submit a pull request.

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

## 后续开发计划（暂停）/ Roadmap (paused)

原生 Tauri 安装包仍处于暂停状态。保存与导出分裂菜单、快速覆盖排版及 PNG + layout 一键同目录导出已在本地版本完成，发布前仍需用户实机验收。

Save and export will become two clearly separated split buttons instead of sharing a global destination setting. `Save layout ▾` will manage the editable source: overwrite an imported writable file by default, or use Save As for a new or pasted layout. `Export ▾` will default to Save PNG As, with options for the background-image folder, the last-used folder, or exporting PNG and `layout.json` together. Browser path restrictions require file handles or one-time folder permission. This work is planned but currently paused and has not entered development.

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

- 开发者 / Developer: 尚宸鸣 / Vijjādassī Shang
- 使用 Codex & 牛来 协助开发 / Developed with assistance from Codex & 牛来
- 项目 / Project: [github.com/7panni/ai-poster-text-editor](https://github.com/7panni/ai-poster-text-editor)
- 作者博客 / Author blog: [7panni.com](https://7panni.com)
