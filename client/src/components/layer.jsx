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

        ref.dragging = true

        const elementsUnderClick = utils.calculateRectanglesUnderPoint(ref.props.elements, mousePosX, mousePosY)

        if (elementsUnderClick.length) {
          utils.sortArrayBy(elementsUnderClick, 'order', 'decreasing')
          ref.selectedElement = elementsUnderClick[0]
        }
      },

      resize (event){
        const { mousePosX, mousePosY } = ref.calculateMousePosition(event)
        ref.clickDownX = mousePosX
        ref.clickDownY = mousePosY

        const elementsUnderClick = utils.calculateRectanglesUnderPoint(ref.props.elements, mousePosX, mousePosY)

        if (elementsUnderClick.length) {
          utils.sortArrayBy(elementsUnderClick, 'order', 'decreasing')
          ref.selectedElement = elementsUnderClick[0]

          let offset = 10
          if(ref.clickDownX >= ref.selectedElement.x - offset || ref.clickDownX <= ref.selectedElement.x + offset){
            if(ref.clickDownY >= ref.selectedElement.y - offset || ref.clickDownY <= ref.selectedElement.y + offset){
                ref.dragging = true
            }
          }

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

      resize (event){
        if (ref.dragging) {
          const { mousePosX, mousePosY } = ref.calculateMousePosition(event)
          const xShift = mousePosX - ref.clickDownX
          const yShift = mousePosY - ref.clickDownY
          const x = ref.selectedElement.x + xShift
          const width = ref.selectedElement.width - xShift
          const y = ref.selectedElement.y + yShift
          const height = ref.selectedElement.height - yShift
          ref.props.resizeElement(ref.props.id, ref.selectedElement.order, { x, y, width, height})
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

      resize (event){
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
  }

  setCanvasOrder () {
    const canvasId = 'canvas-' + this.props.id
    document.getElementById(canvasId).style.zIndex = this.props.order
  }

  redrawCanvas () {
    this.clearCanvas()
    this.drawElements()
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

    drawPoint (x, y) {
      const pointThickness = 2
      const pointColor = '#FFF'

      this.ctx.strokeStyle = pointColor
      this.ctx.lineWidth = pointThickness
      this.ctx.beginPath()
      this.ctx.arc(x, y, 2, 0, 2 * Math.PI, true)
      this.ctx.stroke()
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
  resizeElement: PropTypes.func
}
