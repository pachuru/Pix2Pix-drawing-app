import React, { Component } from 'react'
import '../stylesheets/drawingCanvas.css'
import PropTypes from 'prop-types'

import Layer from './layer'

export default class DrawingCanvas extends Component {
  render () {
    return (
      <div id="canvas-wrapper">
        {this.props.layers.map((layer, index) => {
          return <Layer
            key={index}
            id={layer.id}
            elements={layer.elements}
            order={layer.order}
            selectedColor={this.props.selectedColor}
            selectedTool={this.props.selectedTool}
            addLayerElement={this.props.addLayerElement}
            changeElementColor={this.props.changeElementColor}
            deleteElement={this.props.deleteElement}
          >
          </Layer>
        })
        }
      </div>
    )
  }
}

DrawingCanvas.propTypes = {
  layers: PropTypes.array,
  selectedColor: PropTypes.string,
  selectedTool: PropTypes.func,
  addLayerElement: PropTypes.func,
  changeElementColor: PropTypes.func,
  deleteElement: PropTypes.func
}
