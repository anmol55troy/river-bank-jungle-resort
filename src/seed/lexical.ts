/** Minimal helpers to build Lexical rich text JSON for seeding. */

type LexicalNode = Record<string, unknown>

const text = (t: string): LexicalNode => ({
  type: 'text',
  text: t,
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

export const paragraph = (t: string): LexicalNode => ({
  type: 'paragraph',
  children: [text(t)],
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  version: 1,
})

export const heading = (t: string, tag: 'h2' | 'h3' = 'h2'): LexicalNode => ({
  type: 'heading',
  tag,
  children: [text(t)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

export const listItems = (items: string[]): LexicalNode => ({
  type: 'list',
  listType: 'bullet',
  start: 1,
  tag: 'ul',
  children: items.map((item, i) => ({
    type: 'listitem',
    checked: false,
    value: i + 1,
    children: [text(item)],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  })),
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const richText = (...nodes: LexicalNode[]): any => ({
  root: {
    type: 'root',
    children: nodes,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const paragraphs = (...texts: string[]): any => richText(...texts.map(paragraph))
