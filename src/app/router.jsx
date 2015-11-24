import React from 'react'
import ReactDOM from 'react-dom'
import { default as Router, Route, IndexRoute } from 'react-router'

import Layout from './components/layout'
import Home from './components/home'
import ReportList from './components/report/list/ReportList'
import Report from './components/report/show/Report'

// Routes
let routes = (
  <Route path='/' component={Layout}>
    <IndexRoute component={Home} />
    <Route path='/home' component={Home}/>
    <Route path='/reports' component={ReportList}/>
    <Route path='/report/:id' component={Report}/>
  </Route>
)

exports.start = function () {
  ReactDOM.render((<Router>{routes}</Router>), document.getElementById('container'))
}
