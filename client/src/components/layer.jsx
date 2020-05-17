import React, { Component } from 'react'
import PropTypes from 'prop-types'

import '../stylesheets/layer.css'

export default class Layer extends Component {
  constructor (props) {
    super(props)
    this.dragging = false
    this.initialRectX = 0
    this.initialRectY = 0
    this.state = {
      canvasHeight: 0,
      canvasWidth: 0
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
    const { mousePosX, mousePosY } = this.calculateMousePosition(event)
    this.dragging = true
    this.initialRectX = mousePosX
    this.initialRectY = mousePosY
  }

  onMouseMove (event) {
    if (this.dragging) {
      const { mousePosX, mousePosY } = this.calculateMousePosition(event)
      const width = mousePosX - this.initialRectX
      const height = mousePosY - this.initialRectY
      this.redrawCanvas()
      this.drawRectangle(this.initialRectX, this.initialRectY, width, height, this.props.selectedColor)
    }
  }

  onMouseRelease (event) {
    this.dragging = false
    const { mousePosX, mousePosY } = this.calculateMousePosition(event)
    const width = mousePosX - this.initialRectX
    const height = mousePosY - this.initialRectY
    const color = this.props.selectedColor
    this.storeElement(this.initialRectX, this.initialRectY, width, height, color)
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
      this.props.elements.push({
        x: x,
        y: y,
        width: width,
        height: height,
        color: color
      })
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
  id: PropTypes.number,
  order: PropTypes.number,
  elements: PropTypes.array,
  selectedColor: PropTypes.string
}
