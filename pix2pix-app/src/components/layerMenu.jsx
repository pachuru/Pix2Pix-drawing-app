import React from 'react'
import LayerButton from './layerButton'
import AddLayerButton from './addLayerButton'

import "../stylesheets/layerMenu.css"

export default function LayerMenu(props) {
    const layers = props.layers

    return (
        <div id="layer-menu-wrapper">
            <AddLayerButton
                addLayer={props.addLayer}
            ></AddLayerButton>
            {
                layers.map((value) => {
                        return <LayerButton 
                                    layerName={value}
                                ></LayerButton>
                })
            }
        </div>
    )
}
