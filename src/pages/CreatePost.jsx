import isHotkey from 'is-hotkey'
import React, { useCallback, useMemo } from 'react'
import { Editor, Node, Transforms, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, Slate, useSlate, withReact } from 'slate-react'
import { Button, Icon, Toolbar } from './components'

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}
const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']
const CreatePost= () => {
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Toolbar>
        <MarkButton format="bold" icon="format_bold" />
        <MarkButton format="italic" icon="format_italic" />
        <MarkButton format="underline" icon="format_underlined" />
        <MarkButton format="code" icon="code" />
        <BlockButton format="heading-one" icon="looks_one" />
        <BlockButton format="heading-two" icon="looks_two" />
        <BlockButton format="block-quote" icon="format_quote" />
        <BlockButton format="numbered-list" icon="format_list_numbered" />
        <BlockButton format="bulleted-list" icon="format_list_bulleted" />
        <BlockButton format="left" icon="format_align_left" />
        <BlockButton format="center" icon="format_align_center" />
        <BlockButton format="right" icon="format_align_right" />
        <BlockButton format="justify" icon="format_align_justify" />
      </Toolbar>
      <Editable
        className="min-h-[300px] p-4 focus:outline-none prose prose-lg max-w-none" 
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={event => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event)) {
              event.preventDefault()
              const mark = HOTKEYS[hotkey]
              toggleMark(editor, mark)
            }
          }
        }}
      />
    </Slate>
  )
}
const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    isAlignType(format) ? 'align' : 'type'
  )
  const isList = isListType(format)
  Transforms.unwrapNodes(editor, {
    match: n => Node.isElement(n) && isListType(n.type) && !isAlignType(format),
    split: true,
  })
  let newProperties
  if (isAlignType(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
  }
  Transforms.setNodes(editor, newProperties)
  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}
const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)
  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}
const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false
  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => {
        if (Node.isElement(n)) {
          if (blockType === 'align' && isAlignElement(n)) {
            return n.align === format
          }
          return n.type === format
        }
        return false
      },
    })
  )
  return !!match
}
const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}
const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align }

  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4" style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case 'bulleted-list':
      return (
        // Added list-disc and padding so bullets are visible
        <ul className="list-disc pl-6 mb-4" style={style} {...attributes}>
          {children}
        </ul>
      )
    case 'numbered-list':
      return (
        // Added list-decimal and padding
        <ol className="list-decimal pl-6 mb-4" style={style} {...attributes}>
          {children}
        </ol>
      )
    case 'list-item':
      return (
        <li className="mb-1" style={style} {...attributes}>
          {children}
        </li>
      )
    case 'heading-one':
      return (
        // Added text size and weight
        <h1 className="text-4xl font-bold mb-4 mt-6" style={style} {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 className="text-2xl font-bold mb-3 mt-5" style={style} {...attributes}>
          {children}
        </h2>
      )
    default:
      return (
        <p className="mb-3 leading-relaxed" style={style} {...attributes}>
          {children}
        </p>
      )
  }
}
const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong className="font-bold">{children}</strong>
  }
  if (leaf.code) {
    children = <code className="bg-gray-100 text-red-500 font-mono px-1 rounded">{children}</code>
  }
  if (leaf.italic) {
    children = <em className="italic">{children}</em>
  }
  if (leaf.underline) {
    children = <u className="underline">{children}</u>
  }
  return <span {...attributes}>{children}</span>
}
const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        isAlignType(format) ? 'align' : 'type'
      )}
      onPointerDown={event => event.preventDefault()}
      onClick={() => toggleBlock(editor, format)}
      data-test-id={`block-button-${format}`}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}
const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onPointerDown={event => event.preventDefault()}
      onClick={() => toggleMark(editor, format)}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}
const isAlignType = format => {
  return TEXT_ALIGN_TYPES.includes(format)
}
const isListType = format => {
  return LIST_TYPES.includes(format)
}
const isAlignElement = element => {
  return 'align' in element
}
const initialValue = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable ' },
      { text: 'rich', bold: true },
      { text: ' text, ' },
      { text: 'much', italic: true },
      { text: ' better than a ' },
      { text: '<textarea>', code: true },
      { text: '!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: 'bold', bold: true },
      {
        text: ', or add a semantically rendered block quote in the middle of the page, like this:',
      },
    ],
  },
  {
    type: 'block-quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'paragraph',
    align: 'center',
    children: [{ text: 'Try it out for yourself!' }],
  },
]
export default CreatePost