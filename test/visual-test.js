const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => localStorage.clear());
  await page.goto('file://' + path.resolve('index.html'));
  await page.waitForSelector('#coverCanvas');
  const defaultLanguage = await page.evaluate(() => ({ lang: document.documentElement.lang, name: document.querySelector('.brand b').textContent, toggle: document.querySelector('#langToggle').textContent, developer: document.querySelector('[data-i18n="developer"]').textContent, project: document.querySelector('.credits a').href, manifest: document.querySelector('link[rel="manifest"]').getAttribute('href') }));
  await page.evaluate(() => {
    window.__saved = [];
    const writable = name => ({ write: async blob => window.__saved.push({ name, size: blob.size }), close: async () => {} });
    Object.defineProperty(window, 'showSaveFilePicker', { configurable: true, value: async options => ({ createWritable: async () => writable(options.suggestedName) }) });
    Object.defineProperty(window, 'showDirectoryPicker', { configurable: true, value: async () => ({
      name: '测试输出',
      queryPermission: async () => 'granted',
      getFileHandle: async name => ({ createWritable: async () => writable(name) }),
    }) });
  });

  await page.click('#sourceTab');
  await page.waitForSelector('.cm-editor');
  const editor = page.locator('.cm-content');
  await editor.click();
  await page.keyboard.press('Meta+A');
  await page.keyboard.insertText('{');
  await page.waitForTimeout(250);
  const invalid = {
    status: await page.locator('#sourceStatus').textContent(),
    applyDisabled: await page.locator('#applySource').isDisabled(),
  };

  const pasted = fs.readFileSync(path.resolve('test/gpt-layout.txt'), 'utf8');
  await page.keyboard.press('Meta+A');
  await page.keyboard.insertText(pasted);
  await page.waitForTimeout(250);
  const valid = {
    status: await page.locator('#sourceStatus').textContent(),
    applyDisabled: await page.locator('#applySource').isDisabled(),
  };
  await page.screenshot({ path: path.resolve('test/source-mode.png'), fullPage: true });
  await page.click('#applySource');
  const legacyCanvas = await page.evaluate(() => [document.querySelector('canvas').width, document.querySelector('canvas').height]);

  const jsLayout = fs.readFileSync(path.resolve('test/js-layout.txt'), 'utf8');
  await editor.click();
  await page.keyboard.press('Meta+A');
  await page.keyboard.insertText(jsLayout);
  await page.waitForTimeout(250);
  const jsValid = { status: await page.locator('#sourceStatus').textContent(), applyDisabled: await page.locator('#applySource').isDisabled() };
  await page.click('#applySource');
  const applied = await page.evaluate(() => ({
    canvas: [document.querySelector('canvas').width, document.querySelector('canvas').height],
    visualVisible: !document.querySelector('#visualMode').hidden,
    sourceVisible: !document.querySelector('#sourcePane').hidden,
    hasLayerList: Boolean(document.querySelector('.layer-list')),
  }));

  await page.click('#propertiesTab');
  const box = await page.locator('#coverCanvas').boundingBox();
  await page.mouse.click(box.x + box.width * 1190 / 1648, box.y + box.height * 151 / 928);
  const selected = await page.locator('[data-key="content"]').inputValue();
  const nidanaPosition = await page.locator('[data-key="x"], [data-key="y"]').evaluateAll(nodes => nodes.map(node => Number(node.value)));
  await page.mouse.click(box.x + 8, box.y + 8);
  const deselected = await page.locator('#selectionHint').textContent();

  await page.mouse.click(box.x + box.width * 1135 / 1648, box.y + box.height * 466 / 928);
  const mainLayer = { content: await page.locator('[data-key="content"]').inputValue(), position: await page.locator('[data-key="x"], [data-key="y"]').evaluateAll(nodes => nodes.map(node => Number(node.value))) };
  const sizeBefore = Number(await page.locator('[data-key="size"]').inputValue());
  const plusButton = page.locator('[data-size-step="2"]');
  const stepperBox = await plusButton.boundingBox();
  await plusButton.click();
  const sizeAfter = Number(await page.locator('[data-key="size"]').inputValue());
  await page.screenshot({ path: path.resolve('test/visual-zh.png'), fullPage: true });
  await page.click('#langToggle');
  const english = await page.evaluate(() => ({ lang: document.documentElement.lang, name: document.querySelector('.brand b').textContent, textTab: document.querySelector('#propertiesTab').textContent, addText: document.querySelector('#addText span').textContent, toggle: document.querySelector('#langToggle').textContent, developer: document.querySelector('[data-i18n="developer"]').textContent }));
  await page.screenshot({ path: path.resolve('test/visual-en.png'), fullPage: true });
  await page.click('#langToggle');
  const toolbar = await page.evaluate(() => ({ fits: document.querySelector('.topbar').scrollWidth <= document.querySelector('.topbar').clientWidth, labels: [...document.querySelectorAll('.top-actions > .toolbar-button')].map(button => button.textContent.trim()), heights: [...document.querySelectorAll('.top-actions > .toolbar-button')].map(button => button.getBoundingClientRect().height) }));
  await page.setViewportSize({ width: 900, height: 960 });
  const compactToolbarFits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth && [...document.querySelectorAll('.top-actions > .toolbar-button')].every(button => button.getBoundingClientRect().right <= window.innerWidth));
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.click('#settingsButton');
  const settingsLabels = await page.locator('.save-choice b').allTextContents();
  await page.locator('input[name="saveMode"][value="last"]').check();
  await page.click('#chooseSaveFolder');
  await page.waitForFunction(() => document.querySelector('#saveLocationStatus').textContent === '测试输出');
  const saveStatus = await page.locator('#saveLocationStatus').textContent();
  await page.screenshot({ path: path.resolve('test/settings-menu.png'), fullPage: true });
  await page.click('#settingsButton');
  await page.click('#saveLayout');
  await page.waitForFunction(() => window.__saved.length === 1, null, { timeout: 5000 });
  await page.click('#exportPng');
  await page.waitForTimeout(2500);
  const saved = await page.evaluate(() => window.__saved);
  const toast = await page.locator('#toast').textContent();
  await page.evaluate(async () => {
    const blob = await (await fetch('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEElEQVR42mNk+M9QzwAEYBxVSFvODQAAAABJRU5ErkJggg==')).blob();
    const transfer = new DataTransfer();
    transfer.items.add(new File([blob], 'dragged.png', { type: 'image/png' }));
    const stage = document.querySelector('#stage');
    stage.dispatchEvent(new DragEvent('dragenter', { bubbles: true, dataTransfer: transfer }));
    stage.dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer: transfer }));
  });
  await page.waitForFunction(() => document.querySelector('canvas').width === 2);
  const dragDropCanvas = await page.evaluate(() => [document.querySelector('canvas').width, document.querySelector('canvas').height]);
  const result = { defaultLanguage, invalid, valid, legacyCanvas, jsValid, applied, selected, nidanaPosition, mainLayer, deselected, toolbar, compactToolbarFits, settingsLabels, saveStatus, saved, toast, dragDropCanvas, stepperBox, sizeBefore, sizeAfter, english, errors };
  console.log(JSON.stringify(result, null, 2));
  if (defaultLanguage.lang !== 'zh-CN' || defaultLanguage.name !== 'AI海报文字快改' || defaultLanguage.developer !== '开发者：尚宸鸣' || defaultLanguage.manifest !== 'manifest.webmanifest' || !invalid.applyDisabled || valid.applyDisabled || legacyCanvas.join('x') !== '1672x941' || jsValid.applyDisabled || applied.canvas.join('x') !== '1648x928' || !applied.sourceVisible || applied.hasLayerList || selected !== 'Nidāna' || nidanaPosition.join('x') !== '1190x151' || mainLayer.content !== '早期佛教' || mainLayer.position.join('x') !== '1135x466' || deselected !== '点击文字选择' || !toolbar.fits || !compactToolbarFits || toolbar.heights.some(height => height > 36) || toolbar.labels.slice(0,5).join('|') !== '替换背景|导入排版|保存排版|导出 PNG|设置' || settingsLabels.join('|') !== '浏览器默认|上次使用|图片同文件夹' || saveStatus !== '测试输出' || saved.length !== 2 || dragDropCanvas.join('x') !== '2x2' || stepperBox.width < 40 || stepperBox.height < 40 || sizeAfter !== sizeBefore + 2 || english.lang !== 'en' || english.name !== 'AI Poster Text Editor' || english.textTab !== 'Text' || english.developer !== 'Developer: Vijjādassī Shang' || errors.length) process.exitCode = 1;
  await browser.close();
})();
