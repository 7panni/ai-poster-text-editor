import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';
import { json } from '@codemirror/lang-json';
import { linter, lintGutter } from '@codemirror/lint';

function jsonLinter(view) {
  try {
    const raw = view.state.doc.toString();
    let cleaned = raw.replace(/^\s*```(?:json)?\s*$/gmi, '').replace(/\\_/g, '_').trim();
    const first = cleaned.indexOf('{');
    const last = cleaned.lastIndexOf('}');
    if (first > 0 || last < cleaned.length - 1) cleaned = first >= 0 && last > first ? cleaned.slice(first, last + 1) : cleaned;
    JSON.parse(cleaned);
    return [];
  } catch (error) {
    const message = String(error.message || 'JSON 格式错误');
    const match = message.match(/position\s+(\d+)/i);
    const pos = Math.min(Number(match?.[1] || 0), view.state.doc.length);
    return [{ from: pos, to: Math.min(pos + 1, view.state.doc.length), severity: 'error', message }];
  }
}

const theme = EditorView.theme({
  '&': { height: '100%', color: '#e9dfc3', backgroundColor: '#0d1512', fontSize: '14px' },
  '.cm-content': { fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", monospace', lineHeight: '1.65', padding: '18px 0' },
  '.cm-gutters': { backgroundColor: '#101a16', color: '#66776d', border: 'none', borderRight: '1px solid rgba(233,223,195,.1)' },
  '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: 'rgba(200,169,104,.075)' },
  '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': { backgroundColor: 'rgba(200,169,104,.25)' },
  '.cm-cursor': { borderLeftColor: '#efd18a' },
  '.cm-scroller': { overflow: 'auto' },
  '.cm-foldPlaceholder': { backgroundColor: '#293a31', border: 'none', color: '#c8b98d' },
  '.cm-lintRange-error': { backgroundImage: 'none', borderBottom: '2px wavy #d78770' },
}, { dark: true });

window.CoverSourceEditor = {
  create(host, { doc, onChange }) {
    let suppressChange = false;
    const view = new EditorView({
      doc,
      parent: host,
      extensions: [
        basicSetup,
        json(),
        lintGutter(),
        linter(jsonLinter, { delay: 150 }),
        theme,
        EditorView.lineWrapping,
        EditorView.updateListener.of(update => {
          if (update.docChanged && !suppressChange) onChange?.(update.state.doc.toString());
        }),
      ],
    });
    return {
      getValue: () => view.state.doc.toString(),
      setValue(value) {
        const current = view.state.doc.toString();
        if (current === value) return;
        suppressChange = true;
        view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } });
        suppressChange = false;
      },
      focus: () => view.focus(),
      destroy: () => view.destroy(),
    };
  },
};
