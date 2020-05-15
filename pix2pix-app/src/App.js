import React, { Component } from 'react'
import { Row, Col } from 'antd'

import Navbar from './components/navbar'
import ColorButtonList from './components/colorButtonList'
import ToolButtonList from './components/toolButtonList'
import DrawingCanvas from './components/drawingCanvas'
import LayerMenu from './components/layerMenu'
import NewLayerPopup from './components/newLayerPopup'
import toolList from './config/toolList'

import "./stylesheets/app.css"


export default class App extends Component {

  state = {
    displayNewLayerPopup: false,
    selectedColor : "#00aaff",
    layers : [
      {
        name: "Prueba",
        id: "has123",
        order: 0,
        elements: [
          {
            x: 100,
            y: 100,
            width: 100,
            height: 100,
            color: "#00aaff"
          }
        ]
      }
    ]
  }

  componentDidUpdate(){
    console.log(this.state)
  }

  addLayer(layer){
    let layers_ = this.state.layers
    layers_.push(layer)
    this.setState({
      layers : [...layers_]
    })
  }

  deleteLayer(layerId){
    let layers_ = this.state.layers.filter(layer => layer.id != layerId)
    this.setState({
      layers: [...layers_]
    })
  }


  displayNewLayerPopup(){
    this.setState({
      displayNewLayerPopup: true
    })
  }

  closeNewLayerPopup(){
    this.setState({
      displayNewLayerPopup: false
    })
  }

  addNewLayer = (layerName) => {

    //http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    let randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    let newLayer = {
      name: layerName,
      id: randomId,
      order: this.state.layers.length,
      elements: []
    }    
    let layers_ = this.state.layers
    
    this.setState({
      layers: [...layers_, newLayer],
      displayNewLayerPopup: false
    })
  }

  changeSelectedColor(colorCode){
    this.setState({
      selectedColor: colorCode
    })
  }

  changeLayerProperty(layerId, property, newValue){
    let layers_ = this.state.layers.map((layer) => {
      if(layer.id == layerId){
         layer[property] = newValue;
      } 
         return layer
    })
    this.setState({
      layers: layers_
    })
  }

  
  changeLayerName(layerId, newName){
    this.changeLayerProperty(layerId, "name", newName)
  }

  increaseLayerOrder(layerId, newOrder){

    if(newOrder >= this.state.layers.length)
       return

    let layers_ = this.state.layers.map((layer) => {
      if(layer.id == layerId){
        layer["order"] = newOrder
      }else if(layer.order == newOrder){
        layer["order"] = newOrder - 1
      }
      return layer
    })
    this.setState({
      layers: layers_
    })
  }

  decreaseLayerOrder(layerId, newOrder){

    if(newOrder < 0)
      return

    let layers_ = this.state.layers.map((layer) => {
      if(layer.id == layerId){
        layer["order"] = newOrder
      }else if(layer.order == newOrder){
        layer["order"] = newOrder + 1
      }
      return layer
    })
    this.setState({
      layers: layers_
    })
  }

  
  
  /*
  changeLayerOrder(layerId, newOrder){
    this.changeLayerProperty(layerId, "order", newOrder)
  }
  */

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
              <ColorButtonList selectedColor={this.state.selectedColor}
                               changeSelectedColor={this.changeSelectedColor.bind(this)}>
              </ColorButtonList>
            </div>
            <div class="col-4" id="drawing-canvas-col">
              <DrawingCanvas
                layers={this.state.layers}
                selectedColor={this.state.selectedColor}
              ></DrawingCanvas>
            </div>
            <div class="col-2" id="layers-menu-col">
              <LayerMenu
                layers = {this.state.layers}
                addLayer = {this.displayNewLayerPopup.bind(this)}
                deleteLayer = {this.deleteLayer.bind(this)}
                changeLayerName = {this.changeLayerName.bind(this)}
                increaseLayerOrder = {this.increaseLayerOrder.bind(this)}
                decreaseLayerOrder = {this.decreaseLayerOrder.bind(this)}
              ></LayerMenu>
            </div>
            <div class="col-4" id="output-canvas-col">

            </div>
          </div>
        </div>
      {this.state.displayNewLayerPopup 
      && <NewLayerPopup 
          addNewLayer={this.addNewLayer.bind(this)}
          close={this.closeNewLayerPopup.bind(this)}>
          </NewLayerPopup> 
      }
        </div>
    )
  }
}
