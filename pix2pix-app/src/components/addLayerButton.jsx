import React from 'react'

/*
Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" 
title="Flaticon"> www.flaticon.com</a>
*/

import "../stylesheets/addLayerButton.css"

export default function LayerAddButton(props) {

    return (
        <div id="add-layer-button-wrapper">
            <button id="add-layer-button" class="bg-dark" type="button" onClick={() => props.addLayer()}>
                <span id="add-layer-text">ADD LAYER</span>
                <img id="add-layer-icon" src={require('../images/tools/add.svg')} alt="AddIcon"/>
            </button>
        </div>
    )
}
