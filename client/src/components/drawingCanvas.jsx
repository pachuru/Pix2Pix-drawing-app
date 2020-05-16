import React, { Component } from 'react'

import "../stylesheets/drawingCanvas.css"

import Layer from './layer'

export default class DrawingCanvas extends Component {
    render() {
        return (
            <div id="canvas-wrapper">
                {this.props.layers.map((layer, index) => {
                   return <Layer
                            key={index}
                            id={layer.id}
                            elements={layer.elements}
                            order={layer.order}
                            selectedColor={this.props.selectedColor}
                            >
                          </Layer>
                  })
                }
            </div>
        )
    }
}
