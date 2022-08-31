import React from 'react'
import ReactDom from 'react-dom'

import App from './App'
import NotFixedHeightDemo from './NotFixedHeightDemo'

ReactDom.render(!location.hash ? <App /> : <NotFixedHeightDemo />, document.querySelector('#app'))
