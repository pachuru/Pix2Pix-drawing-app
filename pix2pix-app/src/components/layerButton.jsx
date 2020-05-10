import React from 'react'
import "../stylesheets/layerButton.css"

/*
Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> 
from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
*/

/*
Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> 
from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
*/

/*
Icons made by <a href="https://www.flaticon.com/authors/those-icons" title="Those Icons">Those Icons</a> 
from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
*/

/*
Icons made by <a href="https://icon54.com/" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/"
title="Flaticon"> www.flaticon.com</a> 
 */

export default function LayerButton(props){
    const layerName = props.layerName;
    return (
        <div id="layer-button-wrapper">
            <input id="layer-input-text" type="text" value={layerName}>
            </input>
            <button id="hide-layer-button" class="bg-dark">
                 <img id="hide-layer-icon" src={require('../images/tools/hide.svg')} alt="AddIcon"/>
            </button>
            <button id="delete-layer-button" class="bg-dark">
                <img id="delete-layer-icon" src={require('../images/tools/remove.svg')} alt="AddIcon"/>
            </button>
            <button id="up-layer-button" class="bg-dark">
                <img id="up-layer-icon" src={require('../images/tools/up.svg')} alt="AddIcon"/>
            </button>
            <button id="down-layer-button" class="bg-dark">
                <img id="down-layer-icon" src={require('../images/tools/down.svg')} alt="AddIcon"/>
            </button>
        </div>
    )
}
