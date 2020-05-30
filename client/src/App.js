import React, { Component } from 'react'

import Navbar from './components/navbar'
import ColorButtonList from './components/colorButtonList'
import ToolButtonList from './components/toolButtonList'
import DrawingCanvas from './components/drawingCanvas'
import LayerMenu from './components/layerMenu'
import NewLayerPopup from './components/newLayerPopup'
import LoadStatePopup from './components/loadStatePopup'
import toolList from './config/toolList'

import './stylesheets/app.css'
import utils from './utils'
import ExecutionHistory from './utils/executionHistory'
import constants from './config/constants'

/**
 * App component binds the whole logic of the app, it's the entry point
 * of the app.
 * @component
 */
class App extends Component {

  /**
   * @param {Object} executionHistory an executionHistory object to allow
   * redoing and undoing changes
   * @param {Boolean} redoExecuted a variable that indicates if the
   * redo action has been executed
   * @param {Boolean} undoExecuted a variable that indicates if the
   * undo action has been executed
   */
  constructor(){
    super()
    this.executionHistory = new ExecutionHistory;
    this.executionHistory.push(this.state.layers)
    this.redoExecuted = false
    this.undoExecuted = false
  }

  /**
   * @param {Boolean} displayNewLayerPopup indicates if
   * a new layer popup must be displayed
   * @param {Boolean} displayLoadStatePopup indicates if
   * a load state popup must be displayed
   * @param {String} selectedColor indicates the currently
   * selected color
   * @param {String} selectedTool indicates the currently 
   * selected tool
   * @param {Array} layers holds the layers of the app
   * @param {Object} output holds the output of the pix2pix
   * net if it exists
   */
  state = {
    displayNewLayerPopup: false,
    displayLoadStatePopup: false,
    selectedColor: constants.door,
    selectedTool: constants.square,
    layers: [],
    output: null
  }

  /**
   * If the layers have changed and no redo neither undo action
   * have been executed then the change is stored in the executionHistory
   * @param {Object} prevProps 
   * @param {Object} prevState 
   */
  componentDidUpdate(prevProps, prevState) {
    if(!utils.arraysAreEqual(prevState.layers, this.state.layers)){
      if(!this.redoExecuted && !this.undoExecuted){
         this.executionHistory.push(this.state.layers)
      }
      this.redoExecuted = false
      this.undoExecuted = false
    }else{
    }
  }

  /**
   * Redoes an action
   */
  redo = () => {
    const redoLayers = this.executionHistory.redo()
    if(redoLayers !== null){
      this.redoExecuted = true
      this.setState({
        layers: redoLayers,
      })
    }
  }

  /**
   * Undoes an action
   */
  undo = () => {
    const undoLayers = this.executionHistory.undo()
    if(undoLayers !== null){
      this.undoExecuted = true
      this.setState({
        layers: undoLayers,
      })
    }
  }

  /**
   * Saves the state of the app's layers into a json file 
   * named "canvas-json"
   */
  save = () => {
      let a = document.createElement("a");
      let file = new Blob([JSON.stringify({layers: this.state.layers})], {type: 'json'});
      a.href = URL.createObjectURL(file);
      a.download = constants.output_json_name
      document.body.appendChild(a)
      a.click();
      document.body.removeChild(a)
  }

  /**
   * Merges the layers into a single layer
   */
  mergeLayers = () => {
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
          name: constants.merged_canvas_name,
          id: constants.merged_canvas_name,
          order: 0,
          elements: [...allElements]
    }

    this.setState({
      selectedTool: null
    })

    return wholeCanvasLayer
  }

  /**
   * Displays a Load State Popup
   */
  load = () => {
    this.displayLoadStatePopup()
  }

  /**
   * Replaces the current layers with the layers
   * given in the state object
   * @param {Object} state object that contains 
   * an array of layers
   */
  loadState = (state) =>{
    this.setState({
      layers : [...state.layers]
    })
  }

  /**
   * Stores the generated output by the pix2pix net
   * as an image named "output.png"
   */
  store = () => {
    if(this.state.output){
        const link = document.createElement('a')
        link.href = document.getElementById("output-image").src
        link.download = constants.output_image_name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        this.setState({
          selectedTool: null
        })
    }
  }

  /**
   * Deletes a layer
   * @param {Number} layerId the id of the layer to be deleted
   */
  deleteLayer (layerId) {
    const layers_ = this.state.layers.filter(layer => layer.id !== layerId)
    this.setState({
      layers: [...layers_]
    })
  }

  /**
   * Sets the displayNewLayerPopup as true so when the app re-renders
   * it'll render also the NewLayerPopup
   */
  displayNewLayerPopup () {
    this.setState({
      displayNewLayerPopup: true
    })
  }

  /**
   * Sets the displayLoadStatePopup as true so when the app re-renders
   * it'll render also the LoadStatePopup
   */
  displayLoadStatePopup() {
    this.setState({
      displayLoadStatePopup: true
    })
  }

  /**
   * Sets the displayNewLayerPopup as false so when the app re-renders
   * it'll stop rendering the NewLayerPopup
   */
  closeNewLayerPopup () {
    this.setState({
      displayNewLayerPopup: false
    })
  }

  /**
   * Sets the displayLoadStatePopup as false so when the app re-renders
   * it'll stop rendering the LoadStatePopup
   */
  closeLoadStatePopup(){
    this.setState({
      displayLoadStatePopup: false
    })
  }

  /**
   * Adds a new layer given a layer name
   */
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

  /**
   * Sets the selected color
   * @param {String} colorCode the hex code of the color
   */
  changeSelectedColor (colorCode) {
    this.setState({
      selectedColor: colorCode
    })
  }

  /**
   * Changes a layer property
   * @param {String} layerId the id of the layer
   * @param {String} property the property to be changed
   * @param {Any} newValue the new value for the property
   */
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

  /**
   * Changes the name of a layer
   * @param {String} layerId the id of the layer
   * @param {String} newName the new name of the layer
   */
  changeLayerName (layerId, newName) {
    this.changeLayerProperty(layerId, 'name', newName)
  }

  /**
   * Increases the layer order
   * @param {String} layerId the id of the layer
   * @param {Number} newOrder the order in which the layer should be placed
   */
  increaseLayerOrder (layerId, newOrder) {
    if (newOrder >= this.state.layers.length) { return }

    const layers_ = this.state.layers.map((layer) => {
      if (layer.id === layerId) {
        return{   
            name: layer.name,
            id: layer.id,
            order: newOrder,
            elements: [...layer.elements]
        }
      } else if (layer.order === newOrder) {
        return{   
            name: layer.name,
            id: layer.id,
            order: newOrder - 1,
            elements: [...layer.elements]
        }
      }
      return layer
    })
    this.setState({
      layers: layers_
    })
  }

  /**
   * Decreases the layer order
   * @param {String} layerId the id of the layer
   * @param {Number} newOrder the order in which the layer should be placed
   */
  decreaseLayerOrder(layerId, newOrder) {
    if (newOrder < 0) { return }

    const layers_ = this.state.layers.map((layer) => {
      if (layer.id === layerId) {
        return{   
            name: layer.name,
            id: layer.id,
            order: newOrder,
            elements: [...layer.elements]
        }
      } else if (layer.order === newOrder) {
        return{   
            name: layer.name,
            id: layer.id,
            order: newOrder + 1,
            elements: [...layer.elements]
        }
      }
      return layer
    })
    this.setState({
      layers: layers_
    })
  }

  /**
   * Adds an element to a layer
   * @param {String} layerId the id of the layer
   * @param {Object} element the new element
   */
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

  /**
   * Changes the color of an element
   * @param {String} layerId the id of the layer where the object resides
   * @param {Number} elementOrder the order of the element
   * @param {String} newColor the new color of the element
   */
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

  /**
   * Deletes an element
   * @param {String} layerId the id of the layer where the object resides
   * @param {Number} elementOrder the order of the element
   */
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

  /**
   * Changes the position of an element
   * @param {String} layerId the id of the layer where the object resides
   * @param {Number} elementOrder the order of the element
   * @param {Object} elementCoordinates an object which contains the new x and y
   * of the element
   */
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

  /**
   * Resizes an element
   * @param {String} layerId the id of the layer where the object resides
   * @param {Number} elementOrder the order of the element
   * @param {Object} elementCoordinates an object which contains the new x, y
   * width and height of the element
   */
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

  /**
   * Duplicates an element in its position
   * @param {String} layerId the id of the layer where the element resides
   * @param {Number} elementOrder the order of the element
   */
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

  /**
   * Changes the currently selected tool
   */
  changeSelectedTool = (tool) => {
    this.setState({
      selectedTool: tool
    })
  }

  /**
   * Performs a request to the API with an image to be converted
   * as payload. The response is saved in the state output variable
   * @param {Object} imageBase64 the image to be converted
   */
  pix2pix = (imageBase64) => {
    this.state.selectedTool = null
    fetch('http://localhost:8000', {
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
                              load={this.load}
                              save={this.save}
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
              <ToolButtonList toolList={toolList.slice(11, 12)}
                              store={this.store}
                              changeSelectedTool={this.changeSelectedTool}>
              </ToolButtonList>
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
                layers={(this.state.selectedTool === "save" || this.state.selectedTool === 'convert') ? [this.mergeLayers()] : this.state.layers}
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
            <div className="col-4" id="output-canvas-col">
              {
                 this.state.output ? <img id="output-image" src={`data:image/png;base64,${this.state.output}`}></img> : ''
              }
            </div>
          </div>
        </div>
        {this.state.displayNewLayerPopup &&
      <NewLayerPopup
        addNewLayer={this.addNewLayer.bind(this)}
        close={this.closeNewLayerPopup.bind(this)}>
      </NewLayerPopup>
        }
        {this.state.displayLoadStatePopup &&
      <LoadStatePopup
        close={this.closeLoadStatePopup.bind(this)}
        loadState={this.loadState.bind(this)}
      >
      </LoadStatePopup>
        }
      </div>
    )
  }
}

export default App
