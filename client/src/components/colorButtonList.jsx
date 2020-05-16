import React from 'react'
import colorList from '../config/colorList'
import ColorButton from './colorButton'
import PropTypes from 'prop-types'

import '../stylesheets/colorButtonList.css'

export default function ColorButtonList (props) {
  return (
    <ul id="color-button-unordered-list">
      {
        colorList.map((color, index) => {
          return <li key={index}>
            <ColorButton colorName={color.name}
              colorCode={color.code}
              selectedColor={props.selectedColor}
              changeSelectedColor={props.changeSelectedColor}>
            </ColorButton>
          </li>
        })
      }
    </ul>
  )
}

ColorButtonList.propTypes = {
  selectedColor: PropTypes.string,
  changeSelectedColor: PropTypes.func
}
