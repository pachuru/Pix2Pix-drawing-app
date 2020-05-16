import React from 'react'
import "../stylesheets/toolButton.css"

export default function ToolButton(props) {
    const toolName = props.toolName
    return (
        <div id="tool-button-wrapper">
            <button id="tool-button" class="bg-dark" type="button">
                 <img id="tool-button-icon" src={require('../images/tools/' + toolName + '.svg')} alt="Logo"/>       
            </button>
        </div>
    )
}
