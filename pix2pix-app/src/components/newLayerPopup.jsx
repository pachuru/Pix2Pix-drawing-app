import React from 'react'
import "../stylesheets/newLayerPopup.css"


export default function NewLayerPopup() {
    return (
        <div id="new-layer-form-background">
          <div id="new-layer-form">
                    <span id="new-layer-span">LAYER NAME:</span>
                    <div id="new-layer-input">
                        <input id="new-layer-input-text" type="text">
                       </input>
                        <button id="new-layer-input-button" type="button">
                            CREATE
                        </button>
                    </div>
          </div>
        </div>
    )
}
