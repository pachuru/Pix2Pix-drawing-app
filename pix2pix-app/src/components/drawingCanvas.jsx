import React, { Component } from 'react'

import "../stylesheets/drawingCanvas.css"

import Layer from './layer'

export default class DrawingCanvas extends Component {
    render() {
        return (
            <div id="canvas-wrapper">
                {this.props.layers.map((layer) => {
                   return <Layer
                            order={layer.order}>
                          </Layer>
                  })
                }
            </div>
        )
    }
}
