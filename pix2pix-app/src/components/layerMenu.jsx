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
                layers.map((layer, index) => {
                        return <LayerButton 
                                    key={index}
                                    layer={layer}
                                    deleteLayer={props.deleteLayer}
                                    changeLayerName={props.changeLayerName}
                                    changeLayerOrder={props.changeLayerOrder}
                                ></LayerButton>
                })
            }
        </div>
    )
}
