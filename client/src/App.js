import React, { Component } from 'react'

import Navbar from './components/navbar'
import ColorButtonList from './components/colorButtonList'
import ToolButtonList from './components/toolButtonList'
import DrawingCanvas from './components/drawingCanvas'
import LayerMenu from './components/layerMenu'
import NewLayerPopup from './components/newLayerPopup'
import toolList from './config/toolList'

import './stylesheets/app.css'
import utils from './utils'
import ExecutionHistory from './utils/executionHistory'
import ToolButton from './components/toolButton'

export default class App extends Component {

  constructor(){
    super()
    this.executionHistory = new ExecutionHistory;
    this.executionHistory.push(this.state.layers)
    this.redoExecuted = false
    this.undoExecuted = false
  }

  state = {
    displayNewLayerPopup: false,
    selectedColor: '#00aaff',
    selectedTool: 'square',
    layers: [],
    output: null
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("Output: ", this.state.selectedTool)
    if(!utils.arraysAreEqual(prevState.layers, this.state.layers)){
      if(!this.redoExecuted && !this.undoExecuted){
         this.executionHistory.push(this.state.layers)
      }
      this.redoExecuted = false
      this.undoExecuted = false
    }else{
    }
  }

  redo = () => {
    const redoLayers = this.executionHistory.redo()
    if(redoLayers !== null){
      this.redoExecuted = true
      this.setState({
        layers: redoLayers,
      })
    }
  }

  undo = () => {
    const undoLayers = this.executionHistory.undo()
    if(undoLayers !== null){
      this.undoExecuted = true
      this.setState({
        layers: undoLayers,
      })
    }
  }

  save = () => {
    const allElements = []
    const layers = this.state.layers.sort((a, b) => (a.order > b.order) ? 1 : -1)
    let currentOrder = 0
    layers.map(layer => {
      const elements = layer.elements
      utils.sortArrayBy(elements, 'order', 'increasing')
      elements.map(element => {
        allElements.push({
                x: element.x,
                y: element.y,
                width: element.width,
                height: element.height,
                color: element.color,
                order: currentOrder
        })
        currentOrder += 1
      })
    })
    const wholeCanvasLayer = {
          name: "wholeCanvas",
          id: "wholeCanvas",
          order: 0,
          elements: [...allElements]
    }
    console.log("Whole canvas layer: ", wholeCanvasLayer)
    console.log("Selected tool:", this.state.selectedTool)
    return wholeCanvasLayer
  }


  addLayer (layer) {
    const layers_ = this.state.layers
    layers_.push(layer)
    this.setState({
      layers: [...layers_]
    })
  }

  deleteLayer (layerId) {
    const layers_ = this.state.layers.filter(layer => layer.id !== layerId)
    this.setState({
      layers: [...layers_]
    })
  }

  sortLayers (layers) {
    const layersCopy = layers.slice(0)

    function swap (arr, x, y) {
      const temp = arr[x]
      arr[x] = arr[y]
      arr[y] = temp
    }

    for (const i in layersCopy) {
      let maxElement = i
      for (let j = i; j < layers.length; j++) {
        if (layersCopy[j].order > layersCopy[maxElement].order) {
          maxElement = j
        }
      }
      swap(layersCopy, i, maxElement)
    }

    return layersCopy
  }

  displayNewLayerPopup () {
    this.setState({
      displayNewLayerPopup: true
    })
  }

  closeNewLayerPopup () {
    this.setState({
      displayNewLayerPopup: false
    })
  }

  addNewLayer = (layerName) => {
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    const newLayer = {
      name: layerName,
      id: randomId,
      order: this.state.layers.length,
      elements: []
    }
    const layers_ = this.state.layers

    this.setState({
      layers: [...layers_, newLayer],
      displayNewLayerPopup: false
    })
  }

  changeSelectedColor (colorCode) {
    this.setState({
      selectedColor: colorCode
    })
  }

  changeLayerProperty (layerId, property, newValue) {
    const layers_ = this.state.layers.map((layer) => {
      if (layer.id === layerId) {
        layer[property] = newValue
      }
      return layer
    })
    this.setState({
      layers: layers_
    })
  }

  changeLayerName (layerId, newName) {
    this.changeLayerProperty(layerId, 'name', newName)
  }

  increaseLayerOrder (layerId, newOrder) {
    if (newOrder >= this.state.layers.length) { return }

    const layers_ = this.state.layers.map((layer) => {
      if (layer.id === layerId) {
        layer.order = newOrder
      } else if (layer.order === newOrder) {
        layer.order = newOrder - 1
      }
      return layer
    })
    this.setState({
      layers: layers_
    })
  }

  decreaseLayerOrder(layerId, newOrder) {
    if (newOrder < 0) { return }

    const layers_ = this.state.layers.map((layer) => {
      if (layer.id === layerId) {
        layer.order = newOrder
      } else if (layer.order === newOrder) {
        layer.order = newOrder + 1
      }
      return layer
    })
    this.setState({
      layers: layers_
    })
  }

  addLayerElement = (layerId, newElement) => {
    const layers_ = this.state.layers.map((layer) => {
      if(layer.id === layerId){
        return {
          name: layer.name,
          id: layer.id,
          order: layer.order,
          elements: [...layer.elements, newElement]
        }
      }else return layer
    })
    this.setState({
      layers: layers_
    })
  }


  changeElementColor = (layerId, elementOrder, newColor) => {
    const layers_ = this.state.layers.map((layer) => {
      if(layer.id === layerId){
        let elements = layer.elements.map((element) => {
            if(element.order === elementOrder){
              return {
                x: element.x,
                y: element.y,
                width: element.width,
                height: element.height,
                color: newColor,
                order: element.order
              }
            }else return element;
        })
        return {
          name: layer.name,
          id: layer.id,
          order: layer.order,
          elements: elements
        }
      }else return layer
    })
    this.setState({
      layers: layers_
    })
  }

  deleteElement = (layerId, elementOrder) => {
    const layers_ = this.state.layers.map((layer) => {
      if(layer.id === layerId){
        let elements = layer.elements.filter((element) => element.order != elementOrder)
        return {
          name: layer.name,
          id: layer.id,
          order: layer.order,
          elements: elements
        }
      }else return layer
    })
    this.setState({
      layers: layers_
    })
  }

  moveElement = (layerId, elementOrder, elementCoordinates) => {
    
    const layers_ = this.state.layers.map((layer) => {
      if(layer.id === layerId){
        let elements = layer.elements.map((element) => {
            if(element.order === elementOrder){
              return {
                x: elementCoordinates.x,
                y: elementCoordinates.y,
                width: element.width,
                height: element.height,
                color: element.color,
                order: element.order
              }
            }else return element;
        })
        return {
          name: layer.name,
          id: layer.id,
          order: layer.order,
          elements: elements
        }
      }else return layer
    })
    this.setState({
      layers: layers_
    })
  }

   resizeElement = (layerId, elementOrder, elementCoordinates) => {
    
    const layers_ = this.state.layers.map((layer) => {
      if(layer.id === layerId){
        let elements = layer.elements.map((element) => {
            if(element.order === elementOrder){
              return {
                x: elementCoordinates.x,
                y: elementCoordinates.y,
                width: elementCoordinates.width,
                height: elementCoordinates.height,
                color: element.color,
                order: element.order
              }
            }else return element;
        })
        return {
          name: layer.name,
          id: layer.id,
          order: layer.order,
          elements: elements
        }
      }else return layer
    })
    this.setState({
      layers: layers_
    })
  }

  duplicateElement = (layerId, elementOrder) => {
    const layer = this.state.layers.filter(layer => layer.id === layerId)[0]
    const orderedElements = utils.sortArrayBy(layer.elements, 'order', 'increasing')
    const element = orderedElements.filter(element => element.order === elementOrder)[0]
    const newElementOrder = layer.elements.length ? (orderedElements[layer.elements.length - 1].order + 1) : 0
    const newElement = {
                x: element.x,
                y: element.y,
                width: element.width,
                height: element.height,
                color: element.color,
                order: newElementOrder 
    }
    this.addLayerElement(layerId, newElement)
  }

  changeSelectedTool = (tool) => {
    this.setState({
      selectedTool: tool
    })
  }

  pix2pix = (imageBase64) => {
    this.state.selectedTool = null
    console.log("Hi!")
    fetch('http://localhost:5000', {
        method: 'POST',
        moder: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imageBase64)
      })
        .then(res => res.json())
        .then(json => this.setState({output:json['encoded_prediction'].substring(0, json['encoded_prediction'].length - 1)}))
        .catch(err => console.log('Error: ', err))
  }

  render () {
    return (
      <div>
        <Navbar></Navbar>
        <div className="container-fluid">
          <div className="row" id="row-1">
            <div className="col-2">
            </div>
            <div className="col-4" id="tool-button-list-col-1">
              <ToolButtonList toolList={toolList.slice(0, 5)}
                              redo={this.redo}
                              undo={this.undo}
                              selectedTool={this.state.selectedTool}
                              changeSelectedTool={this.changeSelectedTool}>
              </ToolButtonList>
            </div>
            <div className="col-2">
            </div>
            <div className="col-4">
            </div>
          </div>
          <div className="row" id="row-3">
            <div className="col-2">
            </div>
            <div className="col-4" id="tool-button-list-col-2">
              <ToolButtonList toolList={toolList.slice(5, 10)}
                              selectedTool={this.state.selectedTool}
                              changeSelectedTool={this.changeSelectedTool}>
              </ToolButtonList>
            </div>
            <div className="col-2" id="convert-button-list-col">
              <ToolButtonList toolList={toolList.slice(10, 11)}
                              selectedTool={this.state.selectedTool}
                              changeSelectedTool={this.changeSelectedTool}>
              </ToolButtonList>
            </div>
             <div className="col-4" id="output-button-list-col">
              <ToolButtonList toolList={toolList.slice(3, 4)}></ToolButtonList>
            </div>
          </div>
          <div className="row" id="row-2">
            <div className="col-2" id="color-button-list-col">
              <ColorButtonList selectedColor={this.state.selectedColor}
                changeSelectedColor={this.changeSelectedColor.bind(this)}>
              </ColorButtonList>
            </div>
            <div className="col-4" id="drawing-canvas-col">
              <DrawingCanvas
                layers={this.state.selectedTool === "save" ? [this.save()] : this.state.layers}
                selectedColor={this.state.selectedColor}
                selectedTool={this.state.selectedTool}
                addLayerElement={this.addLayerElement}
                changeElementColor={this.changeElementColor}
                deleteElement={this.deleteElement}
                moveElement={this.moveElement}
                resizeElement={this.resizeElement}
                duplicateElement={this.duplicateElement}
                pix2pix={this.pix2pix.bind(this)}
              ></DrawingCanvas>
            </div>
            <div className="col-2" id="layers-menu-col">
              <LayerMenu
                layers = {this.state.layers}
                addLayer = {this.displayNewLayerPopup.bind(this)}
                deleteLayer = {this.deleteLayer.bind(this)}
                changeLayerName = {this.changeLayerName.bind(this)}
                increaseLayerOrder = {this.increaseLayerOrder.bind(this)}
                decreaseLayerOrder = {this.decreaseLayerOrder.bind(this)}
              ></LayerMenu>
            </div>
            <div className="col-4" id="output-canvas-col" style={{padding: '0'}}>
              <div className="output-wrapper" style={{marginRight: '0.25vw', backgroundColor: 'green'}}>
              {
                 this.state.output ? <img src={`data:image/png;base64,${this.state.output}`} style={{width: '100%'}}></img> : ''
              }
              </div>
            </div>
          </div>
        </div>
        {this.state.displayNewLayerPopup &&
      <NewLayerPopup
        addNewLayer={this.addNewLayer.bind(this)}
        close={this.closeNewLayerPopup.bind(this)}>
      </NewLayerPopup>
        }
      </div>
    )
  }
}
