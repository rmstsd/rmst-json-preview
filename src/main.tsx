import ReactDOM from 'react-dom/client'

import '@arco-design/web-react/dist/css/arco.css'

import 'virtual:uno.css'

import App from './App'
import TestVirtual from './testFeat/TestVirtual'

import './app.less'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(<App />)

// ReactDom.render(!location.hash ? <App /> : <NotFixedHeightDemo />, document.querySelector('#app'))
