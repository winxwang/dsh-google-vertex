/**
 * dsh-google-vertex browser half: the plugin's configuration page on the
 * Plugins page, under the bundle's `google-vertex` row, and the Refresh control
 * that lives on it.
 *
 * The Gemini adapter on the host half discovers its catalog at runtime behind a
 * five-minute cache, so a model Google published a minute ago is invisible to
 * the model picker until that cache expires. This half has exactly one way to
 * reach the host process (a write to the `google-vertex` settings namespace
 * the host half registers), so the button writes the current time there. The
 * host's change hook drops both cached catalogs, and the settings commit also
 * makes the model picker re-read the catalog from the host. No restart, no
 * harness change.
 *
 * The page contract takes `summary` (the one-liner the page prints under the
 * row's module) and `page` (the controls); the page draws the title and the
 * crumb itself, so this half draws neither. `plugins.row.config` is keyed by
 * `<package name>#<row id>`, which is the key below.
 *
 * This file is plain JavaScript on purpose. The client module system serves a
 * package's `exports["./client"]` artifact as a lazy-CJS factory registered on
 * `window.__ModuleLoader__`, and that is the whole format: an out-of-tree
 * plugin can author it directly instead of reproducing the repository's tsdown
 * client preset. `react` is provided by the module system; nothing else is
 * required here.
 */

window.__ModuleLoader__.load({
  id: '@maci0/dsh-google-vertex',

  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })

    const React = require('react')

    /** Settings namespace shared with the host half. */
    const NAMESPACE = 'google-vertex'

    /** Locale namespace for this plugin's copy. */
    const LOCALE_NS = 'google-vertex'

    /** The Plugins-page slot this card occupies. */
    const SLOT = 'plugins.row.config'

    /**
     * The slot's key: the bundle's package name and the row id its patch
     * declares (`rowConfigKey` in the page's own contract). A deployment that
     * installs this package under another name shows no configure control,
     * which is the whole trace of a mismatch.
     */
    const ENTRY_KEY = '@maci0/dsh-google-vertex#google-vertex'

    /** Every class is `gv-`-prefixed: the sheet lands in the page's own document. */
    const CSS = [
      '.gv-page{display:flex;flex-direction:column;gap:10px}',
      '.gv-hint{font-size:12px;line-height:1.5;color:var(--dsw-alias-label-tertiary)}',
      '.gv-row{display:flex;align-items:center;flex-wrap:wrap;gap:10px}',
      '.gv-action{appearance:none;font:inherit;font-size:13px;line-height:1.5;padding:5px 14px;cursor:pointer;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-4);border:1px solid var(--dsw-alias-border-l2);border-radius:999px}',
      '.gv-action:disabled{cursor:default;opacity:.5}',
      '.gv-status{font-size:12px;line-height:1.5;color:var(--dsw-alias-label-tertiary)}',
      '.gv-error{font-size:12px;line-height:1.5;color:var(--dsw-alias-label-error)}',
      '.gv-float-root{position:fixed;right:22px;bottom:24px;z-index:10000;font-family:inherit;color:var(--dsw-alias-label-primary)}',
      '.gv-float-trigger{width:46px;height:46px;border-radius:50%;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);box-shadow:0 6px 24px #0003;font-weight:700;font-size:18px;cursor:pointer}',
      '.gv-float-panel{position:absolute;right:0;bottom:58px;width:min(360px,calc(100vw - 32px));max-height:min(78vh,720px);overflow:auto;border:1px solid var(--dsw-alias-border-l2);border-radius:16px;background:var(--dsw-alias-bg-layer-2);box-shadow:0 14px 48px #0004}',
      '.gv-float-head{display:flex;align-items:center;justify-content:space-between;padding:13px 16px;border-bottom:1px solid var(--dsw-alias-border-l2)}',
      '.gv-close{border:0;background:transparent;color:inherit;font-size:23px;cursor:pointer}',
      '.gv-float-body{display:flex;flex-direction:column;gap:10px;padding:14px}',
      '.gv-field{display:flex;flex-direction:column;gap:5px;font-size:12px;color:var(--dsw-alias-label-secondary)}',
      '.gv-input{box-sizing:border-box;width:100%;min-width:0;padding:8px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px}',
      '.gv-warning{margin:0;padding:8px 10px;border-radius:8px;background:var(--dsw-alias-bg-layer-3);font-size:11px;line-height:1.5;color:var(--dsw-alias-label-tertiary)}',
      '.gv-save{align-self:flex-start}',
    ].join('')

    // Appended while the factory materializes: the module system claims the tag
    // for this package and disposes it on unload. Guarded because the node unit
    // tests evaluate this file without a DOM.
    if (typeof document !== 'undefined') {
      const style = document.createElement('style')
      style.textContent = CSS
      document.head.append(style)
    }

    const en = {
      summary: 'Google-hosted Claude and Gemini models, discovered from Vertex at runtime.',
      refresh: 'Refresh models',
      hint: 'Re-reads the catalog from Vertex, then refreshes the model picker. No restart.',
      lastRefresh: 'Last manual refresh: {at}',
      never: 'No manual refresh yet.',
      refused: 'The Host refused the refresh. Try again.',
      readOnly: 'Settings are not persisted in this deployment, so this control cannot reach the host. Restart dsh web to re-discover.',
      manager: 'Google Vertex manager', close: 'Close', credentialPath: 'Service-account JSON path', project: 'Google Cloud project', location: 'Vertex region', claudeModel: 'Claude model', geminiModel: 'Gemini model', save: 'Save settings', saved: 'Settings saved. The plugin may remount to apply credential changes.', filePickerUnavailable: 'Native JSON file picker is not exposed to this plugin build. Enter the full local path; JSON import is unavailable here.', managerHint: 'The JSON file stays on this PC. Never paste its private_key into this panel.',
    }

    const zh = {
      summary: '由 Vertex 托管的 Claude 与 Gemini 模型，运行时动态发现。',
      refresh: '刷新模型',
      hint: '从 Vertex 重新读取模型目录，并刷新模型选择器。无需重启。',
      lastRefresh: '上次手动刷新：{at}',
      never: '尚未手动刷新。',
      refused: 'Host 拒绝了刷新，请重试。',
      readOnly: '此部署不持久化设置，该控件无法通知宿主进程。请重启 dsh web 以重新发现。',
      manager: 'Google Vertex 管理器', close: '关闭', credentialPath: '服务账号 JSON 文件路径', project: 'Google Cloud 项目 ID', location: 'Vertex 区域', claudeModel: 'Claude 模型', geminiModel: 'Gemini 模型', save: '保存配置', saved: '配置已保存。凭据变更可能需要插件重新加载后生效。', filePickerUnavailable: '当前插件接口未开放原生 JSON 文件选择器。请填写本机文件完整路径；JSON 导入暂不可用。', managerHint: 'JSON 文件保留在本机。不要将 private_key 粘贴到此面板。',
    }

    /**
     * Bind one scope to a React subscription.
     * @param scope - a scope bound to the google-vertex settings namespace.
     * @returns a hook reading that scope's current snapshot.
     */
    function useScope(scope) {
      const subscribe = (listener) => scope.subscribe(listener)
      const getSnapshot = () => scope.getSnapshot()
      return () => React.useSyncExternalStore(subscribe, getSnapshot)
    }

    /**
     * Read a snapshot's value. A namespace the deployment does not serve reports
     * no value, which the card renders as nothing at all.
     * @param snapshot - the settings scope snapshot.
     * @returns the stored value object, or `undefined` when unreadable.
     */
    function valueOf(snapshot) {
      if (snapshot.status !== 'ready') return undefined
      return snapshot.value !== null && typeof snapshot.value === 'object' ? snapshot.value : {}
    }

    /**
     * Build the card component over one bound settings scope.
     * @param scope - the scope bound to the google-vertex namespace.
     * @param t - translate function bound to this plugin's locale namespace.
     * @returns the component the page renders in either view.
     */
    function createCard(scope, t) {
      const useSettings = useScope(scope)

      return function GoogleVertexCard({ view }) {
        const snapshot = useSettings()
        const [error, setError] = React.useState(null)

        const value = valueOf(snapshot)
        // A namespace this deployment does not serve renders no trace of itself.
        if (value === undefined) return null
        if (view === 'summary') return t('summary')

        const refresh = () => {
          setError(null)
          new Promise((resolve) => { resolve(scope.set('revalidatedAt', new Date().toISOString())) }).then((accepted) => {
            if (accepted === false) setError(t('refused'))
          }).catch((cause) => {
            setError(cause instanceof Error ? cause.message : String(cause))
          })
        }

        const stamp = typeof value.revalidatedAt === 'string' && value.revalidatedAt.length > 0
          ? new Date(value.revalidatedAt)
          : undefined
        const last = stamp !== undefined && !Number.isNaN(stamp.getTime())
          ? t('lastRefresh', { at: stamp.toLocaleString() })
          : t('never')

        return React.createElement(
          'div',
          { className: 'gv-page' },
          React.createElement('p', { className: 'gv-hint' }, t('hint')),
          React.createElement(
            'div',
            { className: 'gv-row' },
            React.createElement(
              'button',
              {
                type: 'button',
                className: 'gv-action',
                disabled: !snapshot.writable,
                onClick: refresh,
              },
              t('refresh'),
            ),
            React.createElement(
              'span',
              { className: 'gv-status' },
              snapshot.writable ? last : t('readOnly'),
            ),
          ),
          error === null ? null : React.createElement('p', { className: 'gv-error' }, error),
        )
      }
    }


    /**
     * A frame-wide floating manager. It edits only the plugin's existing
     * settings namespace; credential import is deliberately not simulated:
     * this client build has no declared native file-picker RPC.
     */
    function createOverlay(scope, t) {
      const useSettings = useScope(scope)
      return function GoogleVertexOverlay() {
        const snapshot = useSettings()
        const value = valueOf(snapshot)
        const [open, setOpen] = React.useState(false)
        const [credential, setCredential] = React.useState('')
        const [project, setProject] = React.useState('')
        const [location, setLocation] = React.useState('global')
        const [claude, setClaude] = React.useState('claude-sonnet-4-6')
        const [gemini, setGemini] = React.useState('gemini-3.5-flash')
        const [status, setStatus] = React.useState('')
        const [error, setError] = React.useState('')

        React.useEffect ? React.useEffect(() => {
          if (value === undefined) return
          setCredential(value.serviceAccountFile || '')
          setProject(value.project || '')
          setLocation(value.location || 'global')
          setClaude(Array.isArray(value.models) && value.models[0] || 'claude-sonnet-4-6')
          setGemini(Array.isArray(value.geminiModels) && value.geminiModels[0] || 'gemini-3.5-flash')
        }, [snapshot.status, snapshot.value]) : null

        if (value === undefined) return null
        const save = async () => {
          setError('')
          setStatus('')
          try {
            const writes = [
              ['serviceAccountFile', credential.trim()],
              ['project', project.trim()],
              ['location', location.trim() || 'global'],
              ['models', [claude]],
              ['geminiModels', [gemini]],
            ]
            for (const [field, next] of writes) {
              if (field === 'serviceAccountFile' && !next) continue
              if (await scope.set(field, next) === false) throw new Error('Host refused to save ' + field)
            }
            setStatus(t('saved'))
          } catch (cause) {
            setError(cause instanceof Error ? cause.message : String(cause))
          }
        }

        const field = (label, valueNow, change, placeholder, type) => React.createElement(
          'label', { className: 'gv-field' },
          React.createElement('span', null, label),
          React.createElement('input', {
            className: 'gv-input', type: type || 'text', value: valueNow,
            placeholder: placeholder || '', onChange: event => change(event.target.value),
          }),
        )
        const select = (label, selected, change, options) => React.createElement(
          'label', { className: 'gv-field' },
          React.createElement('span', null, label),
          React.createElement('select', {
            className: 'gv-input', value: selected,
            onChange: event => change(event.target.value),
          }, ...options.map(item => React.createElement('option', { key: item.id, value: item.id }, item.name))),
        )
        const claudeOptions = [
          { id: 'claude-opus-4-6', name: 'Claude Opus 4.6' },
          { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6' },
          { id: 'claude-opus-4-5', name: 'Claude Opus 4.5' },
          { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5' },
          { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5' },
        ]
        const geminiOptions = [
          { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash' },
          { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro Preview' },
          { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash Preview' },
          { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
          { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
          { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash-Lite' },
        ]

        return React.createElement(
          'div', { className: 'gv-float-root' },
          React.createElement('button', {
            type: 'button', className: 'gv-float-trigger',
            title: t('manager'), 'aria-label': t('manager'),
            onClick: () => setOpen(!open),
          }, 'G'),
          open ? React.createElement(
            'section', { className: 'gv-float-panel', role: 'dialog', 'aria-label': t('manager') },
            React.createElement('header', { className: 'gv-float-head' },
              React.createElement('strong', null, t('manager')),
              React.createElement('button', { type: 'button', className: 'gv-close', onClick: () => setOpen(false), 'aria-label': t('close') }, '×'),
            ),
            React.createElement('div', { className: 'gv-float-body' },
              field(t('credentialPath'), credential, setCredential, 'D:\\GoogleCloud\\service-account.json'),
              React.createElement('p', { className: 'gv-warning' }, t('filePickerUnavailable')),
              field(t('project'), project, setProject, 'Google Cloud project ID'),
              field(t('location'), location, setLocation, 'global / us-central1'),
              select(t('claudeModel'), claude, setClaude, claudeOptions),
              select(t('geminiModel'), gemini, setGemini, geminiOptions),
              React.createElement('button', {
                type: 'button', className: 'gv-action gv-save',
                disabled: !snapshot.writable, onClick: save,
              }, t('save')),
              status ? React.createElement('p', { className: 'gv-status' }, status) : null,
              error ? React.createElement('p', { className: 'gv-error' }, error) : null,
              React.createElement('p', { className: 'gv-hint' }, t('managerHint')),
            ),
          ) : null,
        )
      }
    }

    /**
     * Mount the card: this plugin's row configuration on the Plugins page.
     * @param ctx - the browser plugin context.
     */
    function apply(ctx) {
      const t = ctx.locale.bind(LOCALE_NS)
      ctx.effect(
        () => ctx.locale.register(LOCALE_NS, { en, zh }),
        'dsh-google-vertex: locale dictionary',
      )

      const scope = ctx.configForms.get(NAMESPACE)
      const Card = createCard(scope, t)
      const Overlay = createOverlay(scope, t)

      // The page declares the slot; injecting waits for it to exist, so this
      // registration does not depend on plugin load order.
      ctx.slots.inject(SLOT, () => ctx.slots.register({
        name: SLOT,
        key: ENTRY_KEY,
        locale: LOCALE_NS,
      }, Card))

      ctx.slots.inject('shell.overlay', () => ctx.slots.register({
        name: 'shell.overlay',
        id: 'google-vertex-manager',
        locale: LOCALE_NS,
      }, Overlay))
    }

    exports.apply = apply
    exports.inject = ['slots', 'configForms', 'locale']
    return module.exports
  },
})
