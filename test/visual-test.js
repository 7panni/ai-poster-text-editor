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
  await page.goto('file://' + path.resolve('index.html'));
  await page.waitForSelector('#coverCanvas');
  const defaultLanguage = await page.evaluate(() => ({ lang: document.documentElement.lang, name: document.querySelector('.brand b').textContent, toggle: document.querySelector('#langToggle').textContent, developer: document.querySelector('[data-i18n="developer"]').textContent, project: document.querySelector('.credits a').href, manifest: document.querySelector('link[rel="manifest"]').getAttribute('href') }));
  await page.evaluate(() => {
    window.__saved = [];
    const writable = name => ({ write: async blob => window.__saved.push({ name, size: blob.size }), close: async () => {} });
    Object.defineProperty(window, 'showSaveFilePicker', { configurable: true, value: async options => ({ createWritable: async () => writable(options.suggestedName) }) });
    Object.defineProperty(window, 'showDirectoryPicker', { configurable: true, value: async () => ({
      name: '测试输出',
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
  const applied = await page.evaluate(() => ({
    canvas: [document.querySelector('canvas').width, document.querySelector('canvas').height],
    visualVisible: !document.querySelector('#visualMode').hidden,
    sourceVisible: !document.querySelector('#sourcePane').hidden,
    hasLayerList: Boolean(document.querySelector('.layer-list')),
  }));

  const box = await page.locator('#coverCanvas').boundingBox();
  await page.mouse.click(box.x + box.width * 1153 / 1672, box.y + box.height * 131 / 941);
  const selected = await page.locator('[data-key="content"]').inputValue();
  await page.mouse.click(box.x + 8, box.y + 8);
  const deselected = await page.locator('#selectionHint').textContent();

  await page.mouse.click(box.x + box.width * 1153 / 1672, box.y + box.height * 131 / 941);
  const sizeBefore = Number(await page.locator('[data-key="size"]').inputValue());
  const plusButton = page.locator('[data-size-step="2"]');
  const stepperBox = await plusButton.boundingBox();
  await plusButton.click();
  const sizeAfter = Number(await page.locator('[data-key="size"]').inputValue());
  await page.screenshot({ path: path.resolve('docs/screenshot-zh.png'), fullPage: true });
  await page.click('#langToggle');
  const english = await page.evaluate(() => ({ lang: document.documentElement.lang, name: document.querySelector('.brand b').textContent, textTab: document.querySelector('#propertiesTab').textContent, addText: document.querySelector('#addText span').textContent, toggle: document.querySelector('#langToggle').textContent, developer: document.querySelector('[data-i18n="developer"]').textContent }));
  await page.screenshot({ path: path.resolve('docs/screenshot-en.png'), fullPage: true });
  await page.click('#saveLayout');
  await page.waitForFunction(() => window.__saved.length === 1, null, { timeout: 5000 });
  await page.click('#chooseOutputDir');
  const outputButton = await page.locator('#chooseOutputDir').textContent();
  await page.click('#exportPng');
  await page.waitForTimeout(2500);
  const saved = await page.evaluate(() => window.__saved);
  const toast = await page.locator('#toast').textContent();
  const result = { defaultLanguage, invalid, valid, applied, selected, deselected, outputButton, saved, toast, stepperBox, sizeBefore, sizeAfter, english, errors };
  console.log(JSON.stringify(result, null, 2));
  if (defaultLanguage.lang !== 'zh-CN' || defaultLanguage.name !== 'AI海报文字快改' || defaultLanguage.developer !== '开发者：尚宸鸣' || defaultLanguage.manifest !== 'manifest.webmanifest' || !invalid.applyDisabled || valid.applyDisabled || applied.canvas.join('x') !== '1672x941' || !applied.sourceVisible || applied.hasLayerList || selected !== 'Nidāna' || deselected !== '点击文字选择' || saved.length !== 2 || stepperBox.width < 40 || stepperBox.height < 40 || sizeAfter !== sizeBefore + 2 || english.lang !== 'en' || english.name !== 'AI Poster Text Editor' || english.textTab !== 'Text' || english.developer !== 'Developer: Chenming Shang' || errors.length) process.exitCode = 1;
  await browser.close();
})();
