import React from 'react'
import Editor from 'react-simple-code-editor'
import { languages, highlight } from 'prismjs'
import isFunction from 'lodash/isFunction'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-json'
import './prism-vsc-dark-plus.css'

export interface CodeblockProps
  extends Omit<
    React.ComponentProps<typeof Editor>,
    | 'padding'
    | 'style'
    | 'value'
    | 'highlight'
    | 'tabSize'
    | 'insertSpaces'
    | 'ignoreTabKey'
  > {
  defaultValue?: string
  language?: string
  hideLanguageSelect?: boolean
  onLanguageChange?: (language: string) => void
}

const Codeblock = React.forwardRef<Editor, CodeblockProps>(
  (
    {
      onLanguageChange,
      onValueChange,
      defaultValue,
      language,
      hideLanguageSelect = false,
      ...props
    }: CodeblockProps,
    ref
  ) => {
    const [state, setState] = React.useState(defaultValue || '')
    // Generate languages from loaded languages, but remove things that aren't config objects.
    const availableLang = Object.keys(languages)
      .map((l) => {
        if (!isFunction(languages[l])) {
          return l
        }
      })
      .filter(Boolean)
    const [lang, setLang] = React.useState(
      language || availableLang[0] || 'plain'
    )

    return (
      <div className="imp-bg-[#1e1e1e] imp-rounded imp-p-2 imp-textarea:caret-[#adbac7]">
        {!hideLanguageSelect && (
          <select
            className="imp-inline-flex imp-cursor-pointer imp-items-center imp-justify-center imp-whitespace-nowrap imp-rounded-md imp-text-xs imp-font-medium imp-ring-offset-background imp-transition-colors focus-visible:imp-outline-none focus-visible:imp-ring-2 focus-visible:imp-ring-ring focus-visible:imp-ring-offset-2 disabled:imp-pointer-events-none disabled:opacity-50 imp-bg-secondary imp-text-secondary-foreground hover:imp-bg-secondary/80 imp-px-2 imp-py-2"
            name="languages"
            id="language-select"
            defaultValue={language}
            onChange={(e) => {
              onLanguageChange?.(e.target.value)
              setLang(e.target.value)
            }}
          >
            {availableLang.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        )}
        <Editor
          ref={ref}
          onValueChange={(value) => {
            setState(value)
            onValueChange(value)
          }}
          value={state}
          {...props}
          preClassName="language-jsx"
          highlight={(code) => {
            // if language doesn't exist, default to plaintext
            try {
              const highlighted = highlight(code, languages[lang], lang)
              return highlighted
            } catch (err) {
              return code
            }
          }}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 14,
            caretColor: 'white',
          }}
        />
      </div>
    )
  }
)

export default Codeblock
