import React, { Component } from 'react'
import PropTypes from 'prop-types'

import '../stylesheets/layer.css'
import utils from '../utils'
import constants from '../config/constants'

/**
 * Layer component contains the canvas where the user interacts with its painting.
 * The Layer has a set of elements (rectangles, also referred as squares) that can be created
 * and are displayed in the canvas.
 * @component
 */

class Layer extends Component {
  /**
   * Layer constructor
   * @param {Boolean} Layer.dragging Indicates if the user is currently dragging the mouse after click
   * @param {Number} Layer.clickDownX X-coordinate of the last click the user did
   * @param {Number} Layer.clickDownY Y-coordinate of the last click the user did
   * @param {Object} Layer.selectedElement Last selected element in the layer
   * @param {Object} Layer.corners Corners of the selected element
   * @param {Object} Layer.closestCorner Closest corner to the user click
   * @param {Object} Layer.state State of the component
   * @param {Object} Layer.onMouseClickDown Stores the functions that could be called when the user clicks on the canvas
   * @param {Object} Layer.onMouseMoveWith Stores the functions that could be called when the user moves the mouse
   * @param {Object} Layer.onMouseReleaseWith Stores the functions that could be called when the user releases the click
   *
   */
  constructor (props) {
    super(props)
    this.dragging = false
    this.clickDownX = 0
    this.clickDownY = 0
    this.selectedElement = null
    this.corners = null
    this.closestCorner = null
    /**
     * State the of Layer Component
     * @param {Number} canvasHeight height of the canvas
     * @param {Number} canvasHeight width of the canvas
     */
    this.state = {
      canvasHeight: 0,
      canvasWidth: 0
    }

    /**
     * Reference to the Layer component so it can be used inside the following objects
     */
    const ref = this

    /**
     * An Object that contains all the possible functions that can be addressed when the user
     * clicks on the canvas.
     */
    this.onMouseClickDownWith = {

      /**
       * Register the (x,y) coordinate that represents one of the corners of a new square
       * @param {MouseEvent} event
       */
      square (event) {
        const { mousePosX, mousePosY } = ref.calculateMousePosition(event)
        ref.clickDownX = mousePosX
        ref.clickDownY = mousePosY
        ref.dragging = true
      },

      /**
       * Fills a selected square with the current given color
       * @param {MouseEvent} event
       */
      fill (event) {
        const { mousePosX, mousePosY } = ref.calculateMousePosition(event)
        const elementsUnderClick = utils.calculateRectanglesUnderPoint(ref.props.elements, mousePosX, mousePosY)

        if (elementsUnderClick.length) {
          utils.sortArrayBy(elementsUnderClick, 'order', 'decreasing')
          ref.props.changeElementColor(ref.props.id, elementsUnderClick[0].order, ref.props.selectedColor)
        }
      },

      /**
       * Delete the selected element
       * @param {MouseEvent} event
       */
      delete (event) {
        const { mousePosX, mousePosY } = ref.calculateMousePosition(event)
        const elementsUnderClick = utils.calculateRectanglesUnderPoint(ref.props.elements, mousePosX, mousePosY)

        if (elementsUnderClick.length) {
          utils.sortArrayBy(elementsUnderClick, 'order', 'decreasing')
          ref.props.deleteElement(ref.props.id, elementsUnderClick[0].order)
        }
      },

      /**
       * Selects an element that will be moved
       * @param {MouseEvent} event
       */
      move (event) {
        const { mousePosX, mousePosY } = ref.calculateMousePosition(event)
        ref.clickDownX = mousePosX
        ref.clickDownY = mousePosY

        const elementsUnderClick = utils.calculateRectanglesUnderPoint(ref.props.elements, mousePosX, mousePosY)

        if (elementsUnderClick.length) {
          utils.sortArrayBy(elementsUnderClick, 'order', 'decreasing')
          ref.selectedElement = elementsUnderClick[0]
          ref.dragging = true
        }
      },

      /**
       * Selectes an element that will be moved and saves all its corner and the closest
       * corner to the user click
       * @param {MouseEvent} event
       */
      resize (event) {
        const { mousePosX, mousePosY } = ref.calculateMousePosition(event)
        ref.clickDownX = mousePosX
        ref.clickDownY = mousePosY

        const elementsUnderClick = utils.calculateRectanglesUnderPoint(ref.props.elements, mousePosX, mousePosY)

        if (elementsUnderClick.length) {
          utils.sortArrayBy(elementsUnderClick, 'order', 'decreasing')
          ref.selectedElement = elementsUnderClick[0]

          ref.corners = utils.calculateCorners(ref.selectedElement)
          ref.closestCorner = utils.closerTo(ref.corners, { x: mousePosX, y: mousePosY })
          ref.dragging = true
        }
      },

      /**
       * Duplicates the selected element with its same position
       * @param {MouseEvent} event
       */
      duplicate (event) {
        const { mousePosX, mousePosY } = ref.calculateMousePosition(event)
        const elementsUnderClick = utils.calculateRectanglesUnderPoint(ref.props.elements, mousePosX, mousePosY)

        if (elementsUnderClick.length) {
          utils.sortArrayBy(elementsUnderClick, 'order', 'decreasing')
          ref.props.duplicateElement(ref.props.id, elementsUnderClick[0].order)
        }
      }
    }

    /**
     * An object that contains all the functions that could be called during the mouse
     * movement.
     */
    this.onMouseMoveWith = {
      /**
       * While the user holds the click (dragging is true) new width and height are
       * calculated based on the current mouse position and the mouse position registered
       * when the user clicked. Rectangle is redrawed.
       * @param {MouseEvent} event
       */
      square (event) {
        if (ref.dragging) {
          const { mousePosX, mousePosY } = ref.calculateMousePosition(event)
          const width = mousePosX - ref.clickDownX
          const height = mousePosY - ref.clickDownY
          ref.redrawCanvas()
          ref.drawRectangle(ref.clickDownX, ref.clickDownY, width, height, ref.props.selectedColor)
        }
      },

      /**
       * Based on how much and in which direction the user has moved the cursor
       * the reference corner for drawing an element is updated. Width and height
       * remains the same.
       * @param {MouseEvent} event
       */
      move (event) {
        if (ref.dragging) {
          const { mousePosX, mousePosY } = ref.calculateMousePosition(event)
          const xShift = mousePosX - ref.clickDownX
          const yShift = mousePosY - ref.clickDownY
          const x = ref.selectedElement.x + xShift
          const y = ref.selectedElement.y + yShift
          ref.props.moveElement(ref.props.id, ref.selectedElement.order, { x, y })
        }
      },

      /**
       * Based on the closest corner to the user click it updates the rest of the corners
       * taking in account the direction and magnitude of the cursor movement.
       * @param {MouseEvent} event
       */
      resize (event) {
        if (ref.dragging) {
          const { mousePosX, mousePosY } = ref.calculateMousePosition(event)
          const xShift = mousePosX - ref.clickDownX
          const yShift = mousePosY - ref.clickDownY
          const corners = {
            topRight: { x: ref.corners.topRight.x, y: ref.corners.topRight.y },
            topLeft: { x: ref.corners.topLeft.x, y: ref.corners.topLeft.y },
            bottomRight: { x: ref.corners.bottomRight.x, y: ref.corners.bottomRight.y },
            bottomLeft: { x: ref.corners.bottomLeft.x, y: ref.corners.bottomLeft.y }
          }

          if (ref.closestCorner === 'topRight') {
            corners.topRight.x += xShift
            corners.topRight.y += yShift
            corners.bottomRight.x += xShift
            corners.topLeft.y += yShift
          } else if (ref.closestCorner === 'topLeft') {
            corners.topLeft.x += xShift
            corners.topLeft.y += yShift
            corners.bottomLeft += xShift
            corners.topRight.y += yShift
          } else if (ref.closestCorner === 'bottomLeft') {
            corners.bottomLeft.x += xShift
            corners.bottomLeft.y += yShift
            corners.topLeft.x += xShift
            corners.bottomRight.y += yShift
          } else if (ref.closestCorner === 'bottomRight') {
            corners.bottomRight.x += xShift
            corners.bottomRight.y += yShift
            corners.topRight.x += xShift
            corners.bottomLeft.y += yShift
          }

          const x = corners.topLeft.x
          const y = corners.topLeft.y
          const width = corners.topRight.x - corners.topLeft.x
          const height = corners.bottomRight.y - corners.topRight.y

          ref.props.resizeElement(ref.props.id, ref.selectedElement.order, { x, y, width, height })
        }
      }
    }

    /**
     * An object that contains all the functions that could be called when the use releases the mouse.
     * All of them call resetValues() at the end of its execution to reset the constructor variables values
     * in order to prevent buggy behaviours.
     */
    this.onMouseReleaseWith = {
      /**
       * Performs the same activity as its analogous function in the onMouseMoveWith object
       * but this time instead of just redrawing the element, the element is stored.
       * @param {MouseEvent} event
       */
      square (event) {
        const { mousePosX, mousePosY } = ref.calculateMousePosition(event)
        const width = mousePosX - ref.clickDownX
        const height = mousePosY - ref.clickDownY
        const color = ref.props.selectedColor
        ref.storeElement(ref.clickDownX, ref.clickDownY, width, height, color)
        ref.resetValues()
      },

      /**
       * Resets the values, putting dragging as false.
       * @see {@link resetValues}
       * @param {MouseEvent} event
       */
      move (event) {
        ref.resetValues()
      },

      /**
       * Resets the values, putting dragging as false.
       * @see {@link resetValues}
       * @param {MouseEvent} event
       */
      resize (event) {
        ref.resetValues()
      }
    }
  }

  /**
   * Resets the variables of the component (except the objects storing the logic for handling the mouse actions)
   */
  resetValues () {
    this.clickDownX = 0
    this.clickDownY = 0
    this.selectedElement = null
    this.corners = null
    this.closestCorner = null
    this.dragging = false
  }

  /**
   * Called when the component mounts.
   * It gets the current context of the canvas and sets the initial canvas height and width.
   */
  componentDidMount () {
    const canvasId = 'canvas-' + this.props.id
    this.ctx = document.getElementById(canvasId).getContext('2d')
    this.setState({
      canvasHeight: document.getElementById('canvas-wrapper').clientHeight,
      canvasWidth: document.getElementById('canvas-wrapper').clientWidth
    })
  }

  /**
   * Called when the component updates.
   * It sets the canvas order and redraws the canvas.Then if user has request to save or convert
   * the canvas through the pix2pix net, it performs that action.
   * @see {@link setCanvasOrder}
   * @see {@link redrawCanvas}
   * @see {@link saveCanvas}
   * @see {@link convertCanvas}
   */
  componentDidUpdate () {
    this.setCanvasOrder()
    this.redrawCanvas()
    this.saveCanvas()
    this.convertCanvas()
  }

  /**
   * Based on the order of the layer, it sets the canvas z-index to that order, allowing the
   * canvas to be displayed closer or further.
   */
  setCanvasOrder () {
    const canvasId = 'canvas-' + this.props.id
    document.getElementById(canvasId).style.zIndex = this.props.order
  }

  /**
   * Clears the canvas, depending on the selected tool it might or not draw a background (so if the user
   * downloads the canvas the background isn't white) and finally it draws the elements stored in the layer.
   */
  redrawCanvas () {
    this.clearCanvas()
    if (this.props.order === 0 && (this.selectedTool === constants.save || this.selectedTool === constants.convert)) { this.drawBackground() }
    this.drawElements()
  }

  /**
   * Draws a background with the color of the "background" semantic label.
   */
  drawBackground () {
    const canvasId = 'canvas-' + this.props.id
    const canvasWidth = document.getElementById(canvasId).width
    const canvasHeight = document.getElementById(canvasId).height
    this.drawRectangle(0, 0, canvasWidth, canvasHeight, constants.background)
  }

  /**
   * Saves the canvas as an image under the "canvas.png" name when the
   * currently selected tool is save.
   */
  saveCanvas () {
    if (this.props.selectedTool === 'save') {
      const canvasId = 'canvas-' + this.props.id
      const link = document.createElement('a')
      link.href = document.getElementById(canvasId).toDataURL()
      link.download = constants.output_canvas_image_name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  /**
   * Stores the canvas as an image into an object called imageBase64
   * and calls the pix2pix function passed as props with that object as argument.
   */
  convertCanvas () {
    if (this.props.selectedTool === constants.convert) {
      const canvasId = 'canvas-' + this.props.id
      const img = document.getElementById(canvasId).toDataURL()
      const imageBase64 = {
        data: img
      }
      this.props.pix2pix(imageBase64)
    }
  }

  /**
   * Clears the canvas content.
   */
  clearCanvas () {
    this.ctx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight)
  }

  /**
   * If there exists a function defined in the onMouseClickDownWith object which name is equal to the
   * currently selected tool and the user clicks in the canvas it calls that function.
   * @param {MouseEvent} event
   * @see {@link onMouseClickDownWith}
   */
  onMouseClickDown (event) {
    if (typeof (this.onMouseClickDownWith[this.props.selectedTool]) === 'function') { this.onMouseClickDownWith[this.props.selectedTool](event) }
  }

  /**
   * If there exists a function defined in the onMouseMoveWith object which name is equal to the
   * currently selected tool and the user moves the cursor it calls that function.
   * @param {MouseEvent} event
   * @see {@link onMouseMoveWith}
   */
  onMouseMove (event) {
    if (typeof (this.onMouseMoveWith[this.props.selectedTool]) === 'function') { this.onMouseMoveWith[this.props.selectedTool](event) }
  }

  /**
   * If there exists a function defined in the onMouseReleaseWith object which name is equal to the
   * currently selected tool and the user releases a click it calls that function.
   * @param {MouseEvent} event
   * @see {@link onMouseReleaseWith}
   */
  onMouseRelease (event) {
    if (typeof (this.onMouseReleaseWith[this.props.selectedTool]) === 'function') { this.onMouseReleaseWith[this.props.selectedTool](event) }
  }

  /**
   * Calculates the mouse position relative to the canvas instead of the mouse position relative to
   * the whole program window.
   * @param {MouseEvent} event
   */
  calculateMousePosition (event) {
    const offsetX = document.getElementById('canvas-wrapper').getBoundingClientRect().left
    const offsetY = document.getElementById('canvas-wrapper').getBoundingClientRect().top
    const mousePosX = (event.clientX - offsetX)
    const mousePosY = (event.clientY - offsetY)
    return { mousePosX, mousePosY }
  }

  /**
   * Draws the elements stored in the layer.
   */
  drawElements = () => {
    this.props.elements.map((element) => {
      this.drawRectangle(element.x, element.y, element.width, element.height, element.color)
    })
  }

  /**
   * Draws a rectangle in the canvas
   * @param {Number} cornerX the x-coordinate of a corner
   * @param {Number} cornerY the y-coordinate of a corner
   * @param {Number} width  width of the rectangle
   * @param {Number} height height of the rectangle
   * @param {String} color color of the rectangle
   */
  drawRectangle (cornerX, cornerY, width, height, color) {
    this.ctx.beginPath()
    this.ctx.fillStyle = color
    this.ctx.globalAlpha = 1
    this.ctx.rect(cornerX, cornerY, width, height)
    this.ctx.fill()
  }

  /**
   * Stores an element (square) in the layer component
   * @param {Number} x x-coordinate of one of the element's corner
   * @param {Number} y y-coordinate of one of the element's corner
   * @param {Number} width width of the element
   * @param {Number} height height of the element
   * @param {String} color color of the element
   */
  storeElement (x, y, width, height, color) {
    const orderedElements = utils.sortArrayBy(this.props.elements, 'order', 'increasing')
    const order = this.props.elements.length ? (orderedElements[this.props.elements.length - 1].order + 1) : 0
    const newElement = {
      x: x,
      y: y,
      width: width,
      height: height,
      color: color,
      order: order
    }
    this.props.addLayerElement(this.props.id, newElement)
  }

  /**
   * Renders the component
   */
  render () {
    const id = 'canvas-' + this.props.id
    return (
      <canvas id={id}
        width={this.state.canvasWidth}
        height={this.state.canvasHeight}
        onMouseDown={(e) => this.onMouseClickDown(e)}
        onMouseUp={(e) => this.onMouseRelease(e)}
        onMouseMove={(e) => this.onMouseMove(e)}>
      </canvas>
    )
  }
}

/**
 * Layer proptypes
 * @param {Number} id The id of the layer
 * @param {Number} order The order of the layer display in relation with the other layers
 * @param {Array} elements The elements of the layer to be displayed
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
Layer.propTypes = {
  id: PropTypes.string,
  order: PropTypes.number,
  elements: PropTypes.array,
  selectedColor: PropTypes.string,
  selectedTool: PropTypes.string,
  addLayerElement: PropTypes.func,
  changeElementcolor: PropTypes.func,
  deleteElement: PropTypes.func,
  moveElement: PropTypes.func,
  resizeElement: PropTypes.func,
  duplicateElement: PropTypes.func,
  pix2pix: PropTypes.func
}

export default Layer
