import React, { Component } from 'react'

import "../stylesheets/layer.css"

export default class Layer extends Component {

    constructor(props){
        super(props)
        this.dragging = false
        this.initialRectX = 0
        this.initialRectY = 0
        this.state = {
            canvasHeight: 0,
            canvasWidth: 0
        }
    }

    componentDidMount(){
        this.ctx = this.refs.canvas.getContext("2d")
        this.setState({
           canvasHeight : document.getElementById("canvas-wrapper").clientHeight,
           canvasWidth : document.getElementById("canvas-wrapper").clientWidth
        })
    }

    componentDidUpdate(){
        this.redrawCanvas();
    }

    redrawCanvas(){
        this.clearCanvas();
        this.drawElements();
    }

    clearCanvas(){
        this.ctx.clearRect(0,0, this.state.canvasWidth, this.state.canvasHeight);
    }

    onMouseClickDown(event){
        let {mousePosX, mousePosY} = this.calculateMousePosition(event)
        this.dragging = true
        this.initialRectX = mousePosX
        this.initialRectY = mousePosY
    }

    onMouseMove(event){
        if(this.dragging){
            let {mousePosX, mousePosY} = this.calculateMousePosition(event)
            let width = mousePosX - this.initialRectX
            let height = mousePosY - this.initialRectY
            this.redrawCanvas()
            this.drawRectangle(this.initialRectX, this.initialRectY, width, height)
        }
    }
    
    onMouseRelease(event){
        this.dragging = false
        let {mousePosX, mousePosY} = this.calculateMousePosition(event)
        let width = mousePosX - this.initialRectX
        let height = mousePosY - this.initialRectY
        this.storeElement(this.initialRectX, this.initialRectY, width, height)
    }

    calculateMousePosition(event){
        let offsetX = document.getElementById("canvas-wrapper").getBoundingClientRect().left
        let offsetY = document.getElementById("canvas-wrapper").getBoundingClientRect().top
        let mousePosX = (event.clientX - offsetX) 
        let mousePosY = (event.clientY - offsetY) 
        return {mousePosX, mousePosY}
    }

    drawElements = () => {
        this.props.elements.map((element) => {
            this.drawRectangle(element.x, element.y, element.width, element.height)
        })
    }

    drawRectangle(cornerX, cornerY, width, height){
        this.ctx.beginPath();
        this.ctx.fillStyle = "#2be828"
        this.ctx.globalAlpha = 0.75;
        this.ctx.rect(cornerX, cornerY, width, height)
        this.ctx.fill()
        this.ctx.globalAlpha = 1;
    }

    storeElement(x, y, width, height){
        this.props.elements.push({
            x: x,
            y: y,
            width: width, 
            height: height
        })
    }

    drawPoint(x,y){
        let pointThickness = 2;
        let pointColor = "#FFF"

        this.ctx.strokeStyle = pointColor;
        this.ctx.lineWidth = pointThickness;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 2, 0, 2 * Math.PI, true);
        this.ctx.stroke();
    }

    

    render() {
        return (
                <canvas id="canvas" ref="canvas" 
                                    width={this.state.canvasWidth}  
                                    height={this.state.canvasHeight}
                                    onMouseDown={(e) => this.onMouseClickDown(e)} 
                                    onMouseUp={(e) => this.onMouseRelease(e)}
                                    onMouseMove={(e) => this.onMouseMove(e)}>
                </canvas>
        )
    }
}
