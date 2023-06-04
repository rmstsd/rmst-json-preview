import ReactDOM from 'react-dom/client'

import '@arco-design/web-react/dist/css/arco.css'

import App from './App'
import './app.less'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)

// ReactDom.render(!location.hash ? <App /> : <NotFixedHeightDemo />, document.querySelector('#app'))
