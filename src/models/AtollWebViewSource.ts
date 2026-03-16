import ts from 'typescript';
import type { AtollWidgetWebContentDescriptor } from './AtollLockScreenWidgetDescriptor';

export type AtollWebScriptLanguage = 'js' | 'ts';

export interface AtollWebScriptSource {
  code: string;
  language?: AtollWebScriptLanguage;
  module?: boolean;
}

export interface AtollWebDocumentSource {
  body: string;
  css?: string;
  script?: string | AtollWebScriptSource;
  head?: string;
  title?: string;
  viewport?: string;
  lang?: string;
}

export interface AtollWebContentFromSourceOptions
  extends Omit<AtollWidgetWebContentDescriptor, 'html'>,
    AtollWebDocumentSource {}

export interface AtollWebContentFromURLOptions
  extends Omit<AtollWidgetWebContentDescriptor, 'html' | 'allowLocalhostRequests'> {
  url: string;
  allowLocalhostRequests?: boolean;
}

function transpileIfNeeded(script: string | AtollWebScriptSource): string {
  if (typeof script === 'string') {
    return script;
  }

  if ((script.language ?? 'js') === 'js') {
    return script.code;
  }

  const transpiled = ts.transpileModule(script.code, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.None,
      removeComments: false,
      strict: false,
    },
  });

  return transpiled.outputText;
}

/**
 * Builds a full HTML document for Atoll web view rendering from structured source.
 */
export function buildWebViewHTML(source: AtollWebDocumentSource): string {
  const lang = source.lang ?? 'en';
  const title = source.title ?? 'Atoll Web View';
  const viewport = source.viewport ?? 'width=device-width, initial-scale=1.0';
  const css = source.css?.trim();
  const head = source.head?.trim();
  const script = source.script ? transpileIfNeeded(source.script).trim() : '';
  const isModule = typeof source.script === 'object' && !!source.script?.module;

  return [
    '<!doctype html>',
    `<html lang="${lang}">`,
    '<head>',
    `  <meta charset="utf-8"/>`,
    `  <meta name="viewport" content="${viewport}"/>`,
    `  <title>${title}</title>`,
    css ? `  <style>\n${css}\n  </style>` : '',
    head ? `  ${head}` : '',
    '</head>',
    '<body>',
    source.body,
    script
      ? (isModule
        ? `  <script type="module">\n${script}\n  </script>`
        : `  <script>\n${script}\n  </script>`)
      : '',
    '</body>',
    '</html>',
  ]
    .filter((line) => line.length > 0)
    .join('\n');
}

/**
 * Creates a widget web-view descriptor while generating HTML from source parts.
 */
export function createWebViewContentFromSource(
  options: AtollWebContentFromSourceOptions
): AtollWidgetWebContentDescriptor {
  return {
    html: buildWebViewHTML(options),
    preferredHeight: options.preferredHeight,
    isTransparent: options.isTransparent,
    allowLocalhostRequests: options.allowLocalhostRequests,
    backgroundColor: options.backgroundColor,
    maximumContentWidth: options.maximumContentWidth,
  };
}

function validateLocalhostURL(rawURL: string): URL {
  const url = new URL(rawURL);
  const isHTTP = url.protocol === 'http:' || url.protocol === 'https:';
  const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';

  if (!isHTTP || !isLocalhost) {
    throw new Error('Only http(s) localhost URLs are allowed for webview URL content.');
  }

  return url;
}

/**
 * Creates web-view content that navigates to a localhost URL.
 */
export function createWebViewContentFromURL(
  options: AtollWebContentFromURLOptions
): AtollWidgetWebContentDescriptor {
  const targetURL = validateLocalhostURL(options.url).toString();
  const html = buildWebViewHTML({
    title: 'Atoll Localhost Web View',
    body: '<div id="root">Loading localhost content...</div>',
    css: 'body{margin:0;background:transparent;color:white;font-family:-apple-system,system-ui,sans-serif}#root{padding:8px;opacity:.85;font-size:12px}',
    script: {
      language: 'js',
      code: `window.location.replace(${JSON.stringify(targetURL)});`,
    },
  });

  return {
    html,
    preferredHeight: options.preferredHeight,
    isTransparent: options.isTransparent,
    allowLocalhostRequests: options.allowLocalhostRequests ?? true,
    backgroundColor: options.backgroundColor,
    maximumContentWidth: options.maximumContentWidth,
  };
}
