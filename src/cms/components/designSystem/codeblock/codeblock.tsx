import React from 'react'
import Editor from 'react-simple-code-editor'
import { languages, highlight } from 'prismjs'
import { styled } from '../../../../../stitches.config'
import isFunction from 'lodash/isFunction'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-json'

const StyledCodeContainer = styled('div', {
  '$$color-fg-default': '#adbac7',
  '$$color-bg-code-block': '#2d333b',
  '$$color-bg-inline-code-block': 'rgb(99 110 123 / 40%)',
  '$$color-gray': '#768390',
  '$$color-red': '#f47067',
  '$$color-green': '#8ddb8c',
  '$$color-blue': '#96d0ff',
  '$$color-indigo': '#6cb6ff',
  '$$color-purple': '#dcbdfb',
  '$$color-brown': '#f69d50',

  background: '$$color-bg-code-block!important',
  padding: '$2',
  borderRadius: '$md',

  textarea: {
    caretColor: '$$color-fg-default',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    lineHeight: 1.5,
    tabSize: 2,
    hyphens: 'none',
    outline: 'none',
  },
  'code[class*="language-"],pre[class*="language-"]': {
    backgroundColor: '$$color-bg-code-block!important',
    textShadow: 'none',
    color: '$$color-fg-default',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    lineHeight: 1.5,
    tabSize: 2,
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    fontSize: '0.875rem',
    fontFamily:
      '"Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace',
    padding: '1em',
    margin: '0.5em 0',
    overflow: 'auto',
    borderRadius: '0.3em',
  },
  ':not(pre) > code[class*="language-"]': {
    fontSize: '1rem',
    backgroundColor: '$$color-bg-inline-code-block',
    padding: '0.2em 0.3em',
    borderRadius: '0.3em',
    whiteSpace: 'normal',
  },
  '@media (max-width: 700px)': {
    ':not(pre) > code[class*="language-"]': { fontSize: '0.875rem' },
  },
  '.token.comment, .token.prolog, .token.cdata': {
    color: '$$color-gray',
  },
  '.token.doctype, .token.punctuation, .token.entity': {
    color: '$$color-fg-default',
  },
  '.token.attr-name, .token.class-name, .token.boolean, .token.constant, .token.number, .token.atrule':
    {
      color: '$$color-blue',
    },
  '.token.keyword': { color: '$$color-indigo' },
  '.token.property, .token.tag, .token.symbol, .token.deleted, .token.important':
    {
      color: '$$color-green',
    },
  '.token.selector, .token.string, .token.char, .token.builtin, .token.inserted, .token.regex, .token.attr-value, .token.attr-value > .token.punctuation':
    {
      color: '$$color-blue',
    },
  '.token.variable, .token.operator, .token.function': {
    color: '$$color-indigo',
  },
  '.token.url': { color: '$$color-green' },
  '.token.attr-value > .token.punctuation.attr-equals, .token.special-attr > .token.attr-value > .token.value.css':
    {
      color: '$$color-fg-default',
    },
  '.language-css .token.selector': { color: '$$color-green' },
  '.language-css .token.property': { color: '$$color-blue' },
  '.language-css .token.important, .language-css .token.atrule .token.rule': {
    color: '$$color-red',
  },
  '.language-js .token.keyword, .language-javascript .token.keyword': {
    color: '$$color-red',
  },
  '.language-js .token.operator, .language-js .token.constant, .language-js .token.boolean, .language-js .token.number, .language-js .token.atrule, .language-javascript .token.operator, .language-javascript .token.constant, .language-javascript .token.boolean, .language-javascript .token.number, .language-javascript .token.atrule':
    {
      color: '$$color-blue',
    },
  '.language-js .token.function, .language-javascript .token.function': {
    color: '$$color-purple',
  },
  '.language-js .token.attr-name, .language-js .token.class-name, .language-js .token.function-variable, .language-javascript .token.attr-name, .language-javascript .token.class-name, .language-javascript .token.function-variable':
    {
      color: '$$color-brown',
    },
  '.language-jsx .token.keyword': { color: '$$color-red' },
  '.language-jsx .token.function': { color: '$$color-purple' },
  '.language-jsx .token.function-variable': { color: '$$color-brown' },
  '.language-jsx .token.punctuation': { color: '$$color-blue' },
  '.language-jsx .token.attr-name, .language-jsx .token.class-name': {
    color: '$$color-green',
  },
  '.language-jsx .token.string': { color: '$$color-indigo' },
  '.language-json .token.operator': { color: '$$color-fg-default' },
  '.language-json .token.null.keyword': { color: '$$color-blue' },
  '.language-yml .token.atrule, .language-yaml .token.atrule': {
    color: '$$color-green',
  },
  '.language-dockerfile .token.keyword': { color: '$$color-red' },
  '.language-dockerfile .token.function': { color: '$$color-purple' },
  '.language-dockerfile .token.punctuation': { color: '$$color-blue' },
  '.language-dockerfile .token.attr-name, .language-dockerfile .token.class-name':
    {
      color: '$$color-green',
    },
  '.language-dockerfile .token.string': { color: '$$color-indigo' },
  '.token.bold': { fontWeight: 'bold' },
  '.token.comment, .token.italic': { fontStyle: 'italic' },
  '.token.entity': { cursor: 'help' },
  '.token.namespace': { opacity: 0.8 },
})

//  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
const StyledSelect = styled('select', {
  background: '$gray-700',
  border: '1px solid $gray-600',
  color: 'white',
  fontSize: '$sm',
  borderRadius: '$lg',
  display: 'block',
  padding: '$1 $2',
  outline: 'none',
  marginBottom: 5,

  '&:focus': {
    boxShadow: '0 0 0 calc(2px) $gray-700, 0 0 0 calc(4px) $primary-500',
    // border: '1px solid $primary-500',
  },

  '&:placeholder': {
    color: '$gray-400',
  },
})

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
  const [lang, setLang] = React.useState(language || availableLang[0] || '')
  return (
    <StyledCodeContainer>
      {!hideLanguageSelect && (
        <StyledSelect
          name="languages"
          id="language-select"
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
        </StyledSelect>
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
          const highlighted = highlight(code, languages[lang], lang)
          return highlighted
        }}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
        }}
      />
    </StyledCodeContainer>
  )
}

export default Codeblock
