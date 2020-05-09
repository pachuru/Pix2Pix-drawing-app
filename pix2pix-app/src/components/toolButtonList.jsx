import React from 'react'
import toolList from "../config/toolList"
import ToolButton from './toolButton'
import "../stylesheets/toolButtonList.css"

export default function ToolButtonList() {
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
