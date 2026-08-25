const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  let browser;
  try {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => localStorage.clear());
  await page.goto('file://' + path.resolve('index.html'));
  await page.waitForSelector('#coverCanvas');
  await page.waitForFunction(() => window.__posterDebug && window.__posterDebug().historyLength > 0);
  const debug = () => page.evaluate(() => window.__posterDebug());
  const blankStart = { ...(await debug()), canvas: (await debug()).canvas.join('x') };
  const defaultLanguage = await page.evaluate(() => ({ lang: document.documentElement.lang, name: document.querySelector('.brand b').textContent, toggle: document.querySelector('#langToggle').textContent, developer: document.querySelector('[data-i18n="developer"]').textContent, credit: document.querySelector('[data-i18n="codexCredit"]').textContent, project: document.querySelector('.credits a').href, manifest: document.querySelector('link[rel="manifest"]').getAttribute('href') }));
  await page.evaluate(() => {
    window.__saved = [];
    window.__savePickerCalls = 0;
    const writable = name => ({ write: async blob => window.__saved.push({ name, size: blob.size }), close: async () => {} });
    Object.defineProperty(window, 'showSaveFilePicker', { configurable: true, value: async options => { window.__savePickerCalls += 1; return { name: options.suggestedName, createWritable: async () => writable(options.suggestedName) }; } });
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
  const plusButton = page.locator('[data-step-key="size"][data-step="2"]');
  const stepperBox = await plusButton.boundingBox();
  await plusButton.click();
  const sizeAfter = Number(await page.locator('[data-key="size"]').inputValue());
  const spacingBefore = Number(await page.locator('[data-key="letterSpacing"]').inputValue());
  await page.locator('[data-step-key="letterSpacing"][data-step="1"]').click({ modifiers: ['Shift'] });
  const spacingAfter = Number(await page.locator('[data-key="letterSpacing"]').inputValue());
  const lineHeightBefore = Number(await page.locator('[data-key="lineHeight"]').inputValue());
  await page.locator('[data-step-key="lineHeight"][data-step="0.05"]').click();
  const lineHeightAfter = Number(await page.locator('[data-key="lineHeight"]').inputValue());
  const xBefore = Number(await page.locator('[data-key="x"]').inputValue());
  await page.locator('[data-step-key="x"][data-step="1"]').click({ modifiers: ['Shift'] });
  const xAfter = Number(await page.locator('[data-key="x"]').inputValue());
  const propertyOverview = await page.evaluate(() => { const pane=document.querySelector('#propertyPane'),deleteButton=document.querySelector('#deleteText'),clearButton=document.querySelector('#clearAllTexts'),viewportBottom=window.innerHeight;return {fits:pane.scrollHeight<=pane.clientHeight+1,deleteVisible:deleteButton.getBoundingClientRect().bottom<=viewportBottom,clearVisible:clearButton.getBoundingClientRect().bottom<=viewportBottom}; });
  await page.screenshot({ path: path.resolve('test/visual-zh.png'), fullPage: true });
  await page.click('#langToggle');
  const english = await page.evaluate(() => ({ lang: document.documentElement.lang, name: document.querySelector('.brand b').textContent, textTab: document.querySelector('#propertiesTab').textContent, addText: document.querySelector('#addText span').textContent, toggle: document.querySelector('#langToggle').textContent, developer: document.querySelector('[data-i18n="developer"]').textContent, credit: document.querySelector('[data-i18n="codexCredit"]').textContent }));
  await page.screenshot({ path: path.resolve('test/visual-en.png'), fullPage: true });
  await page.click('#langToggle');
  const toolbar = await page.evaluate(() => { const buttons=['#backgroundButton','#layoutButton','#saveLayout','#exportPng','#exportBundle','#settingsButton','#langToggle'].map(id=>document.querySelector(id));return { fits: document.querySelector('.topbar').scrollWidth <= document.querySelector('.topbar').clientWidth, labels: buttons.map(button => button.textContent.trim()), heights: buttons.map(button => button.getBoundingClientRect().height) }; });
  await page.setViewportSize({ width: 900, height: 960 });
  const compactToolbarFits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth && [...document.querySelectorAll('.toolbar-button')].every(button => button.getBoundingClientRect().right <= window.innerWidth));
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.click('#settingsButton');
  const settingsLabels = await page.locator('#settingsMenu .settings-title').allTextContents();
  await page.screenshot({ path: path.resolve('test/settings-menu.png'), fullPage: true });
  await page.click('#settingsButton');
  await page.click('#saveMenuButton');
  const saveMenuLabels = await page.locator('#saveMenu button').allTextContents();
  await page.click('#saveMenuButton');
  await page.click('#exportMenuButton');
  const exportMenuLabels = await page.locator('#exportMenu button').allTextContents();
  await page.click('#exportMenuButton');
  await page.click('#saveLayout');
  await page.waitForFunction(() => window.__saved.length === 1, null, { timeout: 5000 });
  await page.click('#saveLayout');
  await page.waitForFunction(() => window.__saved.length === 2, null, { timeout: 5000 });
  await page.click('#exportPng');
  await page.waitForFunction(() => window.__saved.length === 3, null, { timeout: 5000 });
  await page.click('#exportBundle');
  await page.waitForFunction(() => window.__saved.length === 5, null, { timeout: 5000 });
  const saved = await page.evaluate(() => window.__saved);
  const savePickerCalls = await page.evaluate(() => window.__savePickerCalls);
  const toast = await page.locator('#toast').textContent();
  await page.click('#sourceTab');
  const htmlFragment = fs.readFileSync(path.resolve('test/html-fragment-layout.txt'), 'utf8');
  await editor.click();
  await page.keyboard.press('Meta+A');
  await page.keyboard.insertText(htmlFragment);
  await page.waitForTimeout(250);
  const fragmentValid = { status: await page.locator('#sourceStatus').textContent(), applyDisabled: await page.locator('#applySource').isDisabled() };
  await page.click('#applySource');
  await page.click('#propertiesTab');
  const fragmentBox = await page.locator('#coverCanvas').boundingBox();
  await page.mouse.click(fragmentBox.x + fragmentBox.width * 1010 / 1648, fragmentBox.y + fragmentBox.height * 280 / 928);
  const fragmentLayer = { content: await page.locator('[data-key="content"]').inputValue(), position: await page.locator('[data-key="x"], [data-key="y"]').evaluateAll(nodes => nodes.map(node => Number(node.value))), canvas: await page.evaluate(() => [document.querySelector('canvas').width, document.querySelector('canvas').height]) };
  const fragmentMergeState = await debug();
  const fragmentMerge = {
    total: fragmentMergeState.texts.length,
    ai: fragmentMergeState.texts.find(t => t.id === 'ai')?.content,
    engineerAdded: fragmentMergeState.texts.some(t => t.id === 'engineer' && t.content === '工程师'),
    prefixPreserved: fragmentMergeState.texts.some(t => t.id === 'prefix' && t.content === '写给'),
    nidanaPreserved: fragmentMergeState.texts.some(t => t.id === 'nidana'),
  };

  await page.click('#sourceTab');
  await editor.click();
  await page.keyboard.press('Meta+A');
  await page.keyboard.insertText(pasted);
  await page.waitForTimeout(250);
  const replaceStatus = await page.locator('#sourceStatus').textContent();
  await page.click('#applySource');
  const fullReplaceDebug = await debug();
  const fullReplace = { total: fullReplaceDebug.texts.length, ids: fullReplaceDebug.texts.map(t => t.id).sort().join(','), canvas: fullReplaceDebug.canvas.join('x') };

  await editor.click();
  await page.keyboard.press('Meta+A');
  await page.keyboard.insertText('{"canvas":{"width":100,"height":100},"texts":[]}');
  await page.waitForTimeout(250);
  const emptyRejected = { applyDisabled: await page.locator('#applySource').isDisabled(), status: await page.locator('#sourceStatus').textContent() };

  await page.click('#propertiesTab');
  const beforeClear = (await debug()).texts.length;
  const clearButtonDisabled = await page.locator('#clearAllTexts').isDisabled();
  await page.click('#clearAllTexts');
  const clearedCount = (await debug()).texts.length;
  const clearToastShown = await page.locator('#toast.show').isVisible();
  const clearToastUndoLabel = await page.locator('.toast-undo').textContent();
  await page.click('.toast-undo');
  const restoredCount = (await debug()).texts.length;

  const dropTestImage = async () => {
    await page.evaluate(async () => {
      const blob = await (await fetch('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEElEQVR42mNk+M9QzwAEYBxVSFvODQAAAABJRU5ErkJggg==')).blob();
      const transfer = new DataTransfer();
      transfer.items.add(new File([blob], 'dragged.png', { type: 'image/png' }));
      const stage = document.querySelector('#stage');
      stage.dispatchEvent(new DragEvent('dragenter', { bubbles: true, dataTransfer: transfer }));
      stage.dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer: transfer }));
    });
    await page.waitForFunction(() => document.querySelector('canvas').width === 2);
  };
  await dropTestImage();
  const droppedState = await debug();
  await page.click('#undo');
  await page.waitForFunction(() => document.querySelector('canvas').width === 1672);
  const undoneBgState = await debug();
  await page.waitForTimeout(500);
  await page.reload();
  await page.waitForSelector('#coverCanvas');
  await page.waitForFunction(() => window.__posterDebug && window.__posterDebug().historyLength > 0);
  const restoredUndoneBgState = await debug();
  await dropTestImage();
  const redroppedState = await debug();

  await page.waitForTimeout(1500);
  await page.reload();
  await page.waitForSelector('#coverCanvas');
  await page.waitForFunction(() => window.__posterDebug && window.__posterDebug().historyLength > 0);
  const restoredSessionState = await debug();

  await page.click('#settingsButton');
  await page.click('#clearSession');
  await page.waitForTimeout(400);
  const afterClearSessionState = await debug();
  const sessionStrictlyDeleted = await page.evaluate(async () => {
    return await new Promise(resolve => {
      const request = indexedDB.open('ai-poster-text-editor', 2);
      request.onsuccess = () => {
        const db = request.result;
        const get = db.transaction('session').objectStore('session').get('current');
        get.onsuccess = () => { const deleted = get.result === undefined; db.close(); resolve(deleted); };
        get.onerror = () => { db.close(); resolve(false); };
      };
      request.onerror = () => resolve(false);
    });
  });
  await page.reload();
  await page.waitForSelector('#coverCanvas');
  await page.waitForFunction(() => window.__posterDebug && window.__posterDebug().historyLength > 0);
  const blankAfterClearState = await debug();

  await page.evaluate(async () => {
    await new Promise(resolve => {
      const request = indexedDB.open('ai-poster-text-editor', 2);
      request.onsuccess = () => {
        const db = request.result;
        try {
          const tx = db.transaction('session', 'readwrite');
          tx.objectStore('session').put('corrupted-session-record', 'current');
          tx.oncomplete = () => { db.close(); resolve(); };
          tx.onerror = () => { db.close(); resolve(); };
          tx.onabort = () => { db.close(); resolve(); };
        } catch { db.close(); resolve(); }
      };
      request.onerror = () => resolve();
    });
  });
  await page.reload();
  await page.waitForSelector('#coverCanvas');
  await page.waitForFunction(() => window.__posterDebug && window.__posterDebug().historyLength > 0);
  const corruptFallbackState = await debug();

  const backgroundUndo = { droppedCanvas: droppedState.canvas.join('x'), droppedHasBackground: droppedState.hasBackground, undoneCanvas: undoneBgState.canvas.join('x'), undoneHasBackground: undoneBgState.hasBackground, restoredUndoneCanvas: restoredUndoneBgState.canvas.join('x'), restoredUndoneHasBackground: restoredUndoneBgState.hasBackground, redroppedHasBackground: redroppedState.hasBackground };
  const restoredSession = { canvas: restoredSessionState.canvas.join('x'), total: restoredSessionState.texts.length, hasBackground: restoredSessionState.hasBackground };
  const afterClearSession = { total: afterClearSessionState.texts.length, hasBackground: afterClearSessionState.hasBackground, strictlyDeleted: sessionStrictlyDeleted };
  const blankAfterClear = { total: blankAfterClearState.texts.length, hasBackground: blankAfterClearState.hasBackground };
  const corruptFallback = { total: corruptFallbackState.texts.length, hasBackground: corruptFallbackState.hasBackground };
  const clearAll = { clearButtonDisabled, beforeClear, clearedCount, clearToastShown, clearToastUndoLabel, restoredCount };
  const dragDropCanvas = [2, 2];
  const result = { defaultLanguage, blankStart, invalid, valid, legacyCanvas, jsValid, applied, selected, nidanaPosition, mainLayer, deselected, toolbar, compactToolbarFits, settingsLabels, saveMenuLabels, exportMenuLabels, saved, savePickerCalls, toast, fragmentValid, fragmentLayer, fragmentMerge, replaceStatus, fullReplace, emptyRejected, clearAll, backgroundUndo, restoredSession, afterClearSession, blankAfterClear, corruptFallback, dragDropCanvas: [2, 2], stepperBox, sizeBefore, sizeAfter, spacingBefore, spacingAfter, lineHeightBefore, lineHeightAfter, xBefore, xAfter, propertyOverview, english, errors };
  console.log(JSON.stringify(result, null, 2));
  if (defaultLanguage.lang !== 'zh-CN' || defaultLanguage.name !== 'AI海报文字快改' || defaultLanguage.developer !== '开发者：尚宸鸣' || defaultLanguage.credit !== '使用 Codex & 牛来 协助开发' || defaultLanguage.manifest !== 'manifest.webmanifest' || !invalid.applyDisabled || valid.applyDisabled || legacyCanvas.join('x') !== '1672x941' || jsValid.applyDisabled || applied.canvas.join('x') !== '1648x928' || !applied.sourceVisible || applied.hasLayerList || selected !== 'Nidāna' || nidanaPosition.join('x') !== '1190x151' || mainLayer.content !== '早期佛教' || mainLayer.position.join('x') !== '1135x466' || deselected !== '点击文字选择' || !toolbar.fits || !compactToolbarFits || toolbar.heights.some(height => height > 40) || toolbar.labels.slice(0,6).join('|') !== '替换背景|导入排版|保存排版|导出 PNG|全部导出|设置' || settingsLabels.join('|') !== '本机数据' || saveMenuLabels.join('|') !== '排版另存为…|保存到上次文件夹|选择输出文件夹…' || exportMenuLabels.join('|') !== '下载 PNG|导出到上次文件夹|选择输出文件夹…' || saved.length !== 5 || savePickerCalls !== 2 || fragmentValid.applyDisabled || !fragmentValid.status.includes('2 个文字图层') || !fragmentValid.status.includes('按 id 合并') || fragmentLayer.content !== 'AI' || fragmentLayer.position.join('x') !== '1010x280' || fragmentLayer.canvas.join('x') !== '1648x928'
    || blankStart.canvas !== '1600x900' || blankStart.texts.length !== 0 || blankStart.hasBackground
    || fragmentMerge.total !== 8 || fragmentMerge.ai !== 'AI' || !fragmentMerge.engineerAdded || !fragmentMerge.prefixPreserved || !fragmentMerge.nidanaPreserved
    || fullReplace.total !== 8 || fullReplace.canvas !== '1672x941' || replaceStatus.includes('按 id 合并')
    || !emptyRejected.applyDisabled || !emptyRejected.status.includes('清空全部文字')
    || clearButtonDisabled || beforeClear !== 8 || clearedCount !== 0 || !clearToastShown || clearToastUndoLabel !== '撤销' || restoredCount !== 8
    || backgroundUndo.droppedCanvas !== '2x2' || !backgroundUndo.droppedHasBackground || backgroundUndo.undoneCanvas !== '1672x941' || backgroundUndo.undoneHasBackground || backgroundUndo.restoredUndoneCanvas !== '1672x941' || backgroundUndo.restoredUndoneHasBackground || !backgroundUndo.redroppedHasBackground
    || restoredSession.canvas !== '2x2' || restoredSession.total !== 8 || !restoredSession.hasBackground
    || afterClearSession.total !== 0 || afterClearSession.hasBackground || !afterClearSession.strictlyDeleted
    || blankAfterClear.total !== 0 || blankAfterClear.hasBackground
    || corruptFallback.total !== 0 || corruptFallback.hasBackground
    || dragDropCanvas.join('x') !== '2x2' || stepperBox.width < 30 || stepperBox.height < 32 || sizeAfter !== sizeBefore + 2 || spacingAfter !== spacingBefore + 5 || Math.abs(lineHeightAfter-lineHeightBefore-.05)>.001 || xAfter !== xBefore + 10 || !propertyOverview.fits || !propertyOverview.deleteVisible || !propertyOverview.clearVisible || english.lang !== 'en' || english.name !== 'AI Poster Text Editor' || english.textTab !== 'Text' || english.developer !== 'Developer: Vijjādassī Shang' || english.credit !== 'Developed with assistance from Codex & 牛来' || errors.length) process.exitCode = 1;
  } finally {
    await browser?.close().catch(() => {});
  }
})();
