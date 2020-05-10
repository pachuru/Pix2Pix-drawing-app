import React from 'react'
import ToolButton from './toolButton'
import "../stylesheets/toolButtonList.css"

export default function ToolButtonList(props) {
    const toolList = props.toolList;
    return (
        <div>
            <ul id="tool-button-unordered-list">
                {
                    toolList.map((value, index) => {
                          return <li id="tool-button-list-element" key={index}><ToolButton toolName={value}></ToolButton></li>
                    })
                }
            </ul>
        </div>
    )
}
