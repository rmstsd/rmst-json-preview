import React, { FC, useEffect, useRef } from 'react'

import * as monaco from 'monaco-editor'

self.MonacoEnvironment = {
  getWorker: function (workerId, label) {
    const getWorkerModule = (moduleUrl, label) => {
      // @ts-ignore
      return new Worker(self.MonacoEnvironment.getWorkerUrl(moduleUrl), {
        name: label,
        type: 'module'
      })
    }

    switch (label) {
      case 'json':
        return getWorkerModule('/monaco-editor/esm/vs/language/json/json.worker?worker', label)
      default:
        return getWorkerModule('/monaco-editor/esm/vs/editor/editor.worker?worker', label)
    }
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
