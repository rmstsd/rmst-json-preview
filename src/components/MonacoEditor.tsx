import React, { FC, useEffect, useRef } from 'react'

import * as monaco from 'monaco-editor'

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  }
}

type MonacoEditorProps = React.HTMLAttributes<HTMLDivElement> & { value: string }
const MonacoEditor: FC<MonacoEditorProps> = ({ value, ...hTMLAttributes }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>()

  useEffect(() => {
    const container = document.querySelector('.monaco-container') as HTMLElement
    editorRef.current = monaco.editor.create(container, {
      value: '',
      language: 'json',
      mouseWheelZoom: true,
      smoothScrolling: true,
      fontSize: 18,
      minimap: { maxColumn: 50, showSlider: 'always' },
      tabCompletion: 'on',
      tabSize: 2
    })

    const ob = new ResizeObserver(() => {
      editorRef.current.layout()
    })

    ob.observe(container)
  }, [])

  useEffect(() => {
    editorRef.current.setValue(value)
  }, [value])

  return <div className="monaco-container" {...hTMLAttributes}></div>
}

export default MonacoEditor
