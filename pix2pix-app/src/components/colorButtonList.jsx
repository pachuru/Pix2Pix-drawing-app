import React from 'react'
import colorList from '../config/colorList'
import ColorButton from './colorButton'

import '../stylesheets/colorButtonList.css'

export default function ColorButtonList() {
    return (
        <ul id="color-button-unordered-list">
            {
                colorList.map((value, index) => {
                    return <li key={index}><ColorButton colorName={value}></ColorButton></li>
                })
            }
        </ul>
    )
}
