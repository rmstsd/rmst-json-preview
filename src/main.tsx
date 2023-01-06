import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)

// ReactDom.render(!location.hash ? <App /> : <NotFixedHeightDemo />, document.querySelector('#app'))
