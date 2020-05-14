import React, { Component } from 'react'

import "../stylesheets/layer.css"

export default class Layer extends Component {

    constructor(props){
        super(props)
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
    }

    onMouseClickDown(event){
        let {mousePosX, mousePosY} = this.calculateMousePosition(event)
        this.drawPoint(mousePosX, mousePosY)
    }

    onMouseMove(event){

    }
    
    onMouseRelease(event){

    }

    calculateMousePosition(event){
        let offsetX = document.getElementById("canvas-wrapper").getBoundingClientRect().left
        let offsetY = document.getElementById("canvas-wrapper").getBoundingClientRect().top
        let mousePosX = (event.clientX - offsetX) 
        let mousePosY = (event.clientY - offsetY) 
        return {mousePosX, mousePosY}
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
