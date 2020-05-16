import React from 'react'
import LayerButton from './layerButton'
import AddLayerButton from './addLayerButton'

import "../stylesheets/layerMenu.css"


export default function LayerMenu(props) {
    let layers = props.layers
    return (
        <div id="layer-menu-wrapper">
            <AddLayerButton
                addLayer={props.addLayer}
            ></AddLayerButton>
            {
                layers.sort((a, b) => (a.order > b.order) ? -1 : 1)
                       .map((layer, index) => {
                        return <LayerButton 
                                    key={index}
                                    layer={layer}
                                    deleteLayer={props.deleteLayer}
                                    changeLayerName={props.changeLayerName}
                                    increaseLayerOrder={props.increaseLayerOrder}
                                    decreaseLayerOrder={props.decreaseLayerOrder}
                                ></LayerButton>
                })
            }
        </div>
    )
}
