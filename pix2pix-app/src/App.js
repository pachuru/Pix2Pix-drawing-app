import React, { Component } from 'react'
import { Row, Col } from 'antd'

import Navbar from './components/navbar'
import ColorButtonList from './components/colorButtonList'
import ToolButtonList from './components/toolButtonList'
import DrawingCanvas from './components/drawingCanvas'
import AddLayerButton from './components/addLayerButton'
import toolList from './config/toolList'

import "./stylesheets/app.css"


export default class App extends Component {
  render() {
    return (
      <div>
        <Navbar></Navbar>
        <div class="container-fluid">
          <div class="row" id="row-1">
            <div class="col-2">
            </div>
            <div class="col-4" id="tool-button-list-col">
              <ToolButtonList toolList={toolList.slice(0,5)}></ToolButtonList>
              <ToolButtonList toolList={toolList.slice(5,10)}></ToolButtonList>
            </div>
            <div class="col-2">

            </div>
            <div class="col-4" id="output-button-list-col">
                <ToolButtonList toolList={toolList.slice(2,3)}></ToolButtonList>
            </div>
          </div>
          <div class="row" id="row-2">
            <div class="col-2" id="color-button-list-col">
              <ColorButtonList></ColorButtonList>
            </div>
            <div class="col-4" id="drawing-canvas-col">
              <DrawingCanvas></DrawingCanvas>
            </div>
            <div class="col-2" id="canvas-layers-col">
              <AddLayerButton></AddLayerButton>
            </div>
            <div class="col-4" id="output-canvas-col">

            </div>
          </div>
        </div>
       </div>
    )
  }
}
