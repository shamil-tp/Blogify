import isHotkey from 'is-hotkey'
import { useCallback, useMemo, useState, useEffect } from 'react'
import { Editor, Node, Transforms, createEditor, Path } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, Slate, useSlate, withReact, ReactEditor } from 'slate-react'
import api from '../api/axios'
import axios from 'axios'

// --- CONSTANTS ---
const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'Start writing your story here...' }],
  },
]

// --- SLATE PLUGINS ---
const withEmbeds = editor => {
  const { isVoid } = editor
  // Images and Videos are void elements: they have no editable text content inside them
  editor.isVoid = element => 
    ['image', 'video'].includes(element.type) ? true : isVoid(element)
  return editor
}

// --- LOCAL STYLED COMPONENTS ---
const ToolbarContainer = ({ children }) => (
  <div className="flex flex-wrap gap-1 items-center pb-4 mb-4 border-b border-slate-200 dark:border-slate-700/50 transition-colors duration-300">
    {children}
  </div>
)

const ToolbarButton = ({ active, children, ...props }) => (
  <button
    {...props}
    className={`
      p-2 rounded-md transition-all duration-200
      ${active 
        ? 'bg-slate-800 text-slate-50 dark:bg-slate-200 dark:text-slate-900 shadow-sm' 
        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-200 dark:hover:bg-slate-800'
      }
    `}
  >
    {children}
  </button>
)

const ToolbarIcon = ({ children }) => (
  <span className="material-icons-outlined text-[20px] leading-none">
    {children}
  </span>
)

// --- MAIN COMPONENT ---
const CreatePost = () => {
  const [value, setValue] = useState(initialValue)
  const [title, setTitle] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  // --- DARK MODE LOGIC ---
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  
  const editor = useMemo(() => withEmbeds(withHistory(withReact(createEditor()))), [])

  // --- UPLOAD & EMBED LOGIC ---
  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setIsUploading(true)
    const cloudName = "dqs9ysc7b" 
    const uploadPreset = "blog_uploads" 
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", uploadPreset)

    try {
      const res = await axios.post(url, formData, { withCredentials: false })
      let imageUrl = res.data.secure_url
      // Cloudinary Transformation: Optimize for web
      imageUrl = imageUrl.replace('/upload/', '/upload/w_1200,c_limit,q_auto,f_auto/')
      insertImage(editor, imageUrl)
    } catch (err) {
      console.error("Cloudinary upload error", err)
      alert("Upload failed.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async () => {
    try {
      await api.post("/api/blog/postblog", {
        title,
        content: value
      });
      alert("Blog published");
    } catch (error) {
      alert("Error saving post");
      console.log(error)
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-500 py-10 px-4 bg-slate-50 dark:bg-[#0f172a] font-['Inter',_sans-serif]">
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@700;800&display=swap');
          @import url('https://fonts.googleapis.com/icon?family=Material+Icons+Outlined');
          @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css");

        `}
      </style>

      <nav className="max-w-4xl mx-auto flex justify-between items-center mb-12">
        <h2 className="font-['Outfit',_sans-serif] text-xl font-bold tracking-tight text-slate-900 dark:text-indigo-500">
          New Story
        </h2>
        
        <div className="flex items-center gap-6">
           <button
            onClick={() => setIsDark(!isDark)}
            className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            {/* {isDark ? "Light" : "Dark"} */}
        {isDark ? <i className="bi bi-sun h3"></i> : <i className="bi bi-moon h3"></i>}

          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2 rounded bg-slate-900 dark:bg-slate-100 text-slate-50 dark:text-slate-900 text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-all active:scale-95"
          >
            Publish
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 transition-colors duration-500 overflow-hidden">
          
          <div className="p-8 sm:p-12 min-h-[80vh] dark:bg-slate-800">
            
            <input
              type="text"
              placeholder="Title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full mb-8 font-['Outfit',_sans-serif] text-lg md:text-5xl font-bold bg-transparent border-none focus:outline-none p-0 text-slate-700 placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-slate-300"
              autoFocus
            />

            <Slate editor={editor} initialValue={initialValue} onChange={setValue}>
              <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#1e293b]/95 backdrop-blur-sm transition-colors duration-500 rounded mb-5">
               <ToolbarContainer>
  {/* Basic Text Styles */}
  <MarkButton format="bold" icon="format_bold" />
  <MarkButton format="italic" icon="format_italic" />
  <MarkButton format="underline" icon="format_underlined" />
  <MarkButton format="code" icon="code" />
  
  <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>

  {/* Line Alignment Options */}
  <BlockButton format="left" icon="format_align_left" />
  <BlockButton format="center" icon="format_align_center" />
  <BlockButton format="right" icon="format_align_right" />
  <BlockButton format="justify" icon="format_align_justify" />

  <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>

  {/* Media Embeds */}
  <label className="cursor-pointer p-2 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
    <ToolbarIcon>{isUploading ? 'sync' : 'add_photo_alternate'}</ToolbarIcon>
    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
  </label>

  <ToolbarButton
    onPointerDown={e => e.preventDefault()}
    onClick={() => {
      const url = window.prompt('Enter YouTube/Video URL:')
      if (url) insertEmbed(editor, url)
    }}
  >
    <ToolbarIcon>smart_display</ToolbarIcon>
  </ToolbarButton>

  <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
  
  {/* Structural Blocks */}
  <BlockButton format="heading-one" icon="looks_one" />
  <BlockButton format="heading-two" icon="looks_two" />
  <BlockButton format="block-quote" icon="format_quote" />
  
  <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
  
  <BlockButton format="numbered-list" icon="format_list_numbered" />
  <BlockButton format="bulleted-list" icon="format_list_bulleted" />
</ToolbarContainer>
              </div>

              <Editable
                className="focus:outline-none min-h-[400px] text-lg leading-relaxed text-slate-800 dark:bg-slate-800 rounded-lg p-1"
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Tell your story..."
                spellCheck
                onKeyDown={event => {
                  for (const hotkey in HOTKEYS) {
                    if (isHotkey(hotkey, event)) {
                      event.preventDefault()
                      toggleMark(editor, HOTKEYS[hotkey])
                    }
                  }
                }}
              />
            </Slate>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- RENDERERS ---

const Element = (props) => {
  const { attributes, children, element } = props
  // This line extracts the 'align' property from the Slate node
  const style = { textAlign: element.align || 'left' } 

  switch (element.type) {
    case 'image':
      return <ImageElement {...props} />
    case 'video':
      return <VideoElement {...props} />
    case 'block-quote':
      return <blockquote style={style} className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 my-6 italic text-slate-500 dark:text-slate-400 text-xl" {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul style={style} className="list-disc pl-8 mb-4 text-slate-600 dark:text-slate-300" {...attributes}>{children}</ul>
    case 'numbered-list':
      return <ol style={style} className="list-decimal pl-8 mb-4 text-slate-600 dark:text-slate-300" {...attributes}>{children}</ol>
    case 'list-item':
      return <li style={style} className="mb-2 pl-1" {...attributes}>{children}</li>
    case 'heading-one':
      return <h1 style={style} className="text-3xl md:text-4xl font-bold mb-4 mt-8 text-slate-900 dark:text-slate-100" {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 style={style} className="text-2xl font-bold mb-3 mt-8 text-slate-800 dark:text-slate-200" {...attributes}>{children}</h2>
    default:
      // Default paragraph alignment
      return <p style={style} className="mb-4 text-lg text-slate-600 dark:text-slate-300 leading-8" {...attributes}>{children}</p>
  }
}
const ImageElement = ({ attributes, children, element }) => {
  const editor = useSlate()
  const path = ReactEditor.findPath(editor, element)
  const selected = useSlate().selection && Path.isPath(useSlate().selection.focus.path)

  const setProperty = (newProps) => {
    Transforms.setNodes(editor, newProps, { at: path })
  }

  // Determine alignment classes
  let floatClass = "w-full flex justify-center mb-4" // Default (Center/Full)
  if (element.align === 'left') floatClass = "float-left mr-6 mb-4 clear-left"
  if (element.align === 'right') floatClass = "float-right ml-6 mb-4 clear-right"

  return (
    <div {...attributes} className={floatClass} style={{ width: element.align === 'center' ? '100%' : element.width || '33%' }}>
      <div contentEditable={false} className="relative group w-full">
        {selected && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-1 bg-slate-900 dark:bg-slate-100 p-1 rounded-lg shadow-xl z-30 transition-all scale-90">
            {/* Float Controls */}
            <button onClick={() => setProperty({ align: 'left', width: '33%' })} className={`p-1.5 rounded ${element.align === 'left' ? 'bg-indigo-500' : 'hover:bg-slate-700'}`} title="Float Left"><ToolbarIcon>format_align_left</ToolbarIcon></button>
            <button onClick={() => setProperty({ align: 'center', width: '100%' })} className={`p-1.5 rounded ${element.align === 'center' || !element.align ? 'bg-indigo-500' : 'hover:bg-slate-700'}`} title="Center Full"><ToolbarIcon>format_align_center</ToolbarIcon></button>
            <button onClick={() => setProperty({ align: 'right', width: '33%' })} className={`p-1.5 rounded ${element.align === 'right' ? 'bg-indigo-500' : 'hover:bg-slate-700'}`} title="Float Right"><ToolbarIcon>format_align_right</ToolbarIcon></button>
            
            <div className="w-[1px] bg-slate-700 mx-1"></div>
            
            {/* Size Controls (Only show if floated) */}
            {element.align !== 'center' && (
              <>
                <button onClick={() => setProperty({ width: '25%' })} className="px-2 text-[10px] font-bold text-white dark:text-slate-900">S</button>
                <button onClick={() => setProperty({ width: '50%' })} className="px-2 text-[10px] font-bold text-white dark:text-slate-900">M</button>
              </>
            )}
            
            <button onClick={() => Transforms.removeNodes(editor, { at: path })} className="p-1.5 rounded hover:bg-red-500 text-red-400 hover:text-white"><ToolbarIcon>delete</ToolbarIcon></button>
          </div>
        )}
        <img
          src={element.url}
          alt="Article"
          className={`rounded-lg transition-all duration-300 w-full ${selected ? 'ring-4 ring-indigo-500 shadow-2xl' : 'shadow-md'}`}
        />
      </div>
      {/* Slate requirement: void elements must render children */}
      {children}
    </div>
  )
}
const VideoElement = ({ attributes, children, element }) => {
  const editor = useSlate()
  const path = ReactEditor.findPath(editor, element)
  const selected = useSlate().selection && Path.isPath(useSlate().selection.focus.path)

  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/')
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/')
    return url
  }

  return (
    <div {...attributes}>
      <div contentEditable={false} className="relative my-10 group flex flex-col items-center">
        {selected && (
          <button 
            onClick={() => Transforms.removeNodes(editor, { at: path })}
            className="absolute -top-10 bg-red-500 text-white text-[10px] px-3 py-1 rounded uppercase font-bold shadow-lg z-10 hover:bg-red-600 transition-colors"
          >
            Remove Video
          </button>
        )}
        <div className={`w-full aspect-video rounded-xl overflow-hidden shadow-xl transition-all ${selected ? 'ring-4 ring-indigo-500' : ''}`}>
          <iframe src={getEmbedUrl(element.url)} frameBorder="0" allowFullScreen className="w-full h-full" title="video" />
        </div>
      </div>
      {children}
    </div>
  )
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) children = <strong className="font-bold text-slate-900 dark:text-slate-100">{children}</strong>
  if (leaf.code) children = <code className="bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-200 font-mono text-sm px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600/50">{children}</code>
  if (leaf.italic) children = <em className="italic">{children}</em>
  if (leaf.underline) children = <u className="underline decoration-slate-300 dark:decoration-slate-500 underline-offset-4">{children}</u>
  
  return (
    <span className={!leaf.bold && !leaf.code ? "text-slate-600 dark:text-slate-200" : ""} {...attributes}>
      {children}
    </span>
  )
}

// --- SLATE HELPERS ---

const insertImage = (editor, url) => {
  const text = { text: '' }
  const image = { type: 'image', url, width: '100%', children: [text] }
  Transforms.insertNodes(editor, image)
  Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] })
}

const insertEmbed = (editor, url) => {
  const text = { text: '' }
  const video = { type: 'video', url, children: [text] }
  Transforms.insertNodes(editor, video)
  Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] })
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format, isAlignType(format) ? 'align' : 'type')
  const isList = isListType(format)

  Transforms.unwrapNodes(editor, {
    match: n => Node.isElement(n) && isListType(n.type) && !isAlignType(format),
    split: true,
  })

  let newProperties
  if (isAlignType(format)) {
    newProperties = { align: isActive ? undefined : format }
  } else {
    newProperties = { type: isActive ? 'paragraph' : isList ? 'list-item' : format }
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
          return blockType === 'align' ? n.align === format : n.type === format
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

const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <ToolbarButton
      active={isBlockActive(editor, format, isAlignType(format) ? 'align' : 'type')}
      onPointerDown={event => event.preventDefault()}
      onClick={() => toggleBlock(editor, format)}
    >
      <ToolbarIcon>{icon}</ToolbarIcon>
    </ToolbarButton>
  )
}

const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <ToolbarButton
      active={isMarkActive(editor, format)}
      onPointerDown={event => event.preventDefault()}
      onClick={() => toggleMark(editor, format)}
    >
      <ToolbarIcon>{icon}</ToolbarIcon>
    </ToolbarButton>
  )
}

const isAlignType = format => TEXT_ALIGN_TYPES.includes(format)
const isListType = format => LIST_TYPES.includes(format)

export default CreatePost