import React, { Component } from 'react'
import { Row, Col } from 'antd'

import Navbar from './components/navbar'
import ColorButton from './components/colorButton'
import ColorButtonList from './components/colorButtonList'
import ToolButton from './components/toolButton'

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
            <div class="col-2">
              <ToolButton
                toolName={"undo"}
              ></ToolButton>
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
