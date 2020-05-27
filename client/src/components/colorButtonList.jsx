import React from 'react'
import colorList from '../config/colorList'
import ColorButton from './colorButton'
import PropTypes from 'prop-types'

import '../stylesheets/colorButtonList.css'

/**
 * ColorButtonList component returns a list of ColorButton components
 * @component
 */
function ColorButtonList (props) {
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

/**
 * ColorButtonList proptypes
 * @param {Function} changeSelectedColor function to change the currently selected color
 * @param {String} selectedColor the hex code of the currently selected color
 */
ColorButtonList.propTypes = {
  selectedColor: PropTypes.string,
  changeSelectedColor: PropTypes.func
}

export default ColorButtonList