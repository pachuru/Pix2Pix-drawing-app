import React, { Component } from 'react'

import "../stylesheets/drawingCanvas.css"

export default class DrawingCanvas extends Component {
    render() {
        return (
            <div id="canvas-wrapper">
                <canvas id="canvas" width="0" height="0">

                </canvas>
            </div>
        )
    }
}
