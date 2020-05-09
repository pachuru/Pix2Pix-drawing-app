import React, { Component } from 'react'
import { Row, Col } from 'antd'

import Navbar from './components/navbar'
import ColorButtonList from './components/colorButtonList'
import ToolButtonList from './components/toolButtonList'


import "./stylesheets/app.css"

export default class App extends Component {
  render() {
    return (
      <div>
        <Navbar></Navbar>
        <div class="container-fluid">
          <div class="row">
            <div class="col-2">
            </div>
            <div class="col-4">
              <ToolButtonList></ToolButtonList>
            </div>
          </div>
          <div class="row" id="color-button-list-row">
            <div class="col-2" id="color-button-list-col">
              <ColorButtonList></ColorButtonList>
            </div>
          </div>
        </div>
       </div>
    )
  }
}
