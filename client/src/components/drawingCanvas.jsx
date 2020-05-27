import React, { Component } from 'react'
import '../stylesheets/drawingCanvas.css'
import PropTypes from 'prop-types'

import Layer from './layer'

/**
 * DrawingCanvas component returns a layer component for each one of
 * the app layers. In order to avoid buggy behaviours it sorts the layers first.
 * @component
 */
class DrawingCanvas extends Component {
  render () {
    return (
      <div id="canvas-wrapper">
        {this.props.layers.sort((a, b) => (a.order > b.order) ? -1 : 1)
          .map((layer, index) => {
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
              moveElement={this.props.moveElement}
              resizeElement={this.props.resizeElement}
              duplicateElement={this.props.duplicateElement}
              pix2pix={this.props.pix2pix}
            >
            </Layer>
          })
        }
      </div>
    )
  }
}

/**
 * DrawingCanvas proptypes
 * @param {Array} layers The app layers
 * @param {String} selectedColor The currently selected color in the app
 * @param {String} selectedTool The currently selected tool in the app
 * @param {Function} addLayerElement A function to add an element to the layer
 * @param {Function} changeElementColor A function to change an element's color
 * @param {Function} deleteElement A function to delete an element
 * @param {Function} moveElement A function to move an element
 * @param {Function} resizeElement A function to resize an element
 * @param {Function} duplicateElement function to duplicate an element
 * @param {Function} pix2pix A function to perform a pix2pix conversion of the canvas
 */
DrawingCanvas.propTypes = {
  layers: PropTypes.array,
  selectedColor: PropTypes.string,
  selectedTool: PropTypes.string,
  addLayerElement: PropTypes.func,
  changeElementColor: PropTypes.func,
  deleteElement: PropTypes.func,
  moveElement: PropTypes.func,
  resizeElement: PropTypes.func,
  duplicateElement: PropTypes.func,
  pix2pix: PropTypes.func
}

export default DrawingCanvas
