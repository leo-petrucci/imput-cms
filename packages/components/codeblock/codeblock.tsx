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

interface CodeblockProps
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

const Codeblock = ({
  onLanguageChange,
  onValueChange,
  defaultValue,
  language,
  hideLanguageSelect = false,
  ...props
}: CodeblockProps) => {
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
    <div className="bg-[#1e1e1e] rounded p-2 textarea:caret-[#adbac7]">
      {!hideLanguageSelect && (
        <select
          className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-2"
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
          } catch {
            const highlighted = highlight(
              code,
              languages['plaintext'],
              'plaintext'
            )
            return highlighted
          }
        }}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
        }}
      />
    </div>
  )
}

export default Codeblock
