import { useEffect, useRef } from 'react'
import ReactQuill from 'react-quill-new'
import * as Y from 'yjs'
import { QuillBinding } from 'y-quill'
import { getOrCreateDoc } from '../../collaboration/ydoc'

const TextWidget = ({ docId, widgetId }) => {
  const quillRef = useRef(null)
  const bindingRef = useRef(null)

  useEffect(() => {
    const ydoc = getOrCreateDoc(docId)

    const ytext = ydoc.getText(`widget-${widgetId}`)

    if (quillRef.current) {
      const quill = quillRef.current.getEditor()

      bindingRef.current = new QuillBinding(ytext, quill)
    }

    return () => {
      if (bindingRef.current) {
        bindingRef.current.destroy()
      }
    }
  }, [docId, widgetId])

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
    />
  )
}

export default TextWidget
