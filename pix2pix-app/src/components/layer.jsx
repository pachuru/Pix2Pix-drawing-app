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
        this.setState({
           canvasHeight : document.getElementById("canvas").clientHeight,
           canvasWidth : document.getElementById("canvas").clientWidth
        })
    }

    render() {
        return (
                <canvas id="canvas" ref="canvas" width="0" height="0">

                </canvas>
        )
    }
}
