import React, { Component } from 'react'
import { Row, Col } from 'antd'

import Navbar from './components/navbar'
import ColorButtonList from './components/colorButtonList'
import ToolButtonList from './components/toolButtonList'
import toolList from './config/toolList'

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
            <div class="col-3" id="tool-button-list-col">
              <ToolButtonList toolList={toolList.slice(0,5)}></ToolButtonList>
              <ToolButtonList toolList={toolList.slice(5,10)}></ToolButtonList>
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
