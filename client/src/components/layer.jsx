import React, { Component } from 'react'
import PropTypes from 'prop-types'

import '../stylesheets/layer.css'
import utils from '../utils'

export default class Layer extends Component {
  constructor (props) {
    super(props)
    this.dragging = false
    this.initialRectX = 0
    this.initialRectY = 0
    this.clickDownX = 0
    this.clickDownY = 0
    this.selectedElement = null
    this.corners = null
    this.closestCorner = null
    this.state = {
      canvasHeight: 0,
      canvasWidth: 0
    }
    const ref = this

    this.onMouseClickDownWith = {
      square (event) {
        const { mousePosX, mousePosY } = ref.calculateMousePosition(event)
        ref.dragging = true
        ref.initialRectX = mousePosX
        ref.initialRectY = mousePosY
      },

      fill (event) {
        const { mousePosX, mousePosY } = ref.calculateMousePosition(event)
        const elementsUnderClick = utils.calculateRectanglesUnderPoint(ref.props.elements, mousePosX, mousePosY)

        if (elementsUnderClick.length) {
          utils.sortArrayBy(elementsUnderClick, 'order', 'decreasing')
          ref.props.changeElementColor(ref.props.id, elementsUnderClick[0].order, ref.props.selectedColor)
        }
      },

      delete (event) {
        const { mousePosX, mousePosY } = ref.calculateMousePosition(event)
        const elementsUnderClick = utils.calculateRectanglesUnderPoint(ref.props.elements, mousePosX, mousePosY)

        if (elementsUnderClick.length) {
          utils.sortArrayBy(elementsUnderClick, 'order', 'decreasing')
          ref.props.deleteElement(ref.props.id, elementsUnderClick[0].order)
        }
      },

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

          console.log('Closest corner: ', ref.closestCorner)

          ref.dragging = true
        }
      },

      duplicate (event) {
        const { mousePosX, mousePosY } = ref.calculateMousePosition(event)
        const elementsUnderClick = utils.calculateRectanglesUnderPoint(ref.props.elements, mousePosX, mousePosY)

        if (elementsUnderClick.length) {
          utils.sortArrayBy(elementsUnderClick, 'order', 'decreasing')
          ref.props.duplicateElement(ref.props.id, elementsUnderClick[0].order)
        }
      }
    }

    this.onMouseMoveWith = {
      square (event) {
        if (ref.dragging) {
          const { mousePosX, mousePosY } = ref.calculateMousePosition(event)
          const width = mousePosX - ref.initialRectX
          const height = mousePosY - ref.initialRectY
          ref.redrawCanvas()
          ref.drawRectangle(ref.initialRectX, ref.initialRectY, width, height, ref.props.selectedColor)
        }
      },

      move (event) {
        if (ref.dragging) {
          const { mousePosX, mousePosY } = ref.calculateMousePosition(event)
          const xShift = mousePosX - ref.clickDownX
          const yShift = mousePosY - ref.clickDownY
          const x = ref.selectedElement.x + xShift
          const y = ref.selectedElement.y + yShift
          ref.props.moveElement(ref.props.id, ref.selectedElement.order, { x, y })
          /* ref.redrawCanvas()
          ref.drawRectangle(x + xShift, y + yShift, width, height, ref.props.selectedColor)
          */
        }
      },

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
          /* ref.redrawCanvas()
          ref.drawRectangle(x + xShift, y + yShift, width, height, ref.props.selectedColor)
          */
        }
      }
    }

    this.onMouseReleaseWith = {
      square (event) {
        ref.dragging = false
        const { mousePosX, mousePosY } = ref.calculateMousePosition(event)
        const width = mousePosX - ref.initialRectX
        const height = mousePosY - ref.initialRectY
        const color = ref.props.selectedColor
        ref.storeElement(ref.initialRectX, ref.initialRectY, width, height, color)
      },

      move (event) {
        ref.dragging = false
      },

      resize (event) {
        ref.dragging = false
      }
    }
  }

  componentDidMount () {
    const canvasId = 'canvas-' + this.props.id
    this.ctx = document.getElementById(canvasId).getContext('2d')
    this.setState({
      canvasHeight: document.getElementById('canvas-wrapper').clientHeight,
      canvasWidth: document.getElementById('canvas-wrapper').clientWidth
    })
  }

  componentDidUpdate () {
    this.setCanvasOrder()
    this.redrawCanvas()
    // this.saveCanvas()
    this.convertCanvas()
  }

  setCanvasOrder () {
    const canvasId = 'canvas-' + this.props.id
    document.getElementById(canvasId).style.zIndex = this.props.order
  }

  redrawCanvas () {
    this.clearCanvas()
    this.drawBackground()
    this.drawElements()
  }

  drawBackground () {
    const canvasId = 'canvas-' + this.props.id
    const canvasWidth = document.getElementById(canvasId).width
    const canvasHeight = document.getElementById(canvasId).height
    this.drawRectangle(0, 0, canvasWidth, canvasHeight, '#0000aa')
  }

  saveCanvas () {
    if (this.props.selectedTool === 'save') {
      console.log('Saving!')
      const canvasId = 'canvas-' + this.props.id
      const link = document.createElement('a')
      link.href = document.getElementById(canvasId).toDataURL()
      link.download = 'test.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  convertCanvas () {
    if (this.props.selectedTool === 'convert') {
      console.log('Converting!')
      const canvasId = 'canvas-' + this.props.id
      const img = document.getElementById(canvasId).toDataURL()
      const imageBase64 = {
        data: img
      }
      this.props.pix2pix(imageBase64)
    }
  }

  clearCanvas () {
    this.ctx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight)
  }

  onMouseClickDown (event) {
    if (typeof (this.onMouseClickDownWith[this.props.selectedTool]) === 'function') { this.onMouseClickDownWith[this.props.selectedTool](event) }
  }

  onMouseMove (event) {
    if (typeof (this.onMouseMoveWith[this.props.selectedTool]) === 'function') { this.onMouseMoveWith[this.props.selectedTool](event) }
  }

  onMouseRelease (event) {
    if (typeof (this.onMouseReleaseWith[this.props.selectedTool]) === 'function') { this.onMouseReleaseWith[this.props.selectedTool](event) }
  }

  calculateMousePosition (event) {
    const offsetX = document.getElementById('canvas-wrapper').getBoundingClientRect().left
    const offsetY = document.getElementById('canvas-wrapper').getBoundingClientRect().top
    const mousePosX = (event.clientX - offsetX)
    const mousePosY = (event.clientY - offsetY)
    return { mousePosX, mousePosY }
  }

    drawElements = () => {
      this.props.elements.map((element) => {
        this.drawRectangle(element.x, element.y, element.width, element.height, element.color)
      })
    }

    drawRectangle (cornerX, cornerY, width, height, color) {
      this.ctx.beginPath()
      this.ctx.fillStyle = color
      this.ctx.globalAlpha = 1
      this.ctx.rect(cornerX, cornerY, width, height)
      this.ctx.fill()
    }

    drawPoint (xPos, yPos, radius, pointThickness, pointColor) {
      this.ctx.strokeStyle = pointColor
      this.ctx.fillStyle = pointColor
      this.ctx.lineWidth = pointThickness
      this.ctx.beginPath()
      this.ctx.arc(xPos, yPos, radius, 0, 2 * Math.PI, true)
      this.ctx.stroke()
      this.ctx.fill()
    }

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

Layer.propTypes = {
  id: PropTypes.string,
  order: PropTypes.number,
  elements: PropTypes.array,
  selectedColor: PropTypes.string,
  selectedTool: PropTypes.func,
  addLayerElement: PropTypes.func,
  changeElementcolor: PropTypes.func,
  deleteElement: PropTypes.func,
  moveElement: PropTypes.func,
  resizeElement: PropTypes.func,
  pix2pix: PropTypes.func
}
