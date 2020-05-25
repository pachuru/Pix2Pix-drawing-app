import React from 'react'
import '../stylesheets/colorButton.css'
import PropTypes from 'prop-types'

/* Icons made by <a href="https://www.flaticon.com/authors/vectors-market"
title="Vectors Market">Vectors Market</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a> */

export default function ColorButton (props) {
  const colorName = props.colorName
  const buttonId = 'color-button-' + colorName.replace(/\s+/g, '-').toLowerCase()
  const backgroundColor = (props.colorCode === props.selectedColor) ? '#1d2124' : '#343a40'

  return (
    <div className="color-button-wrapper" id={buttonId} style={{ backgroundColor: backgroundColor }} >
      <button className="color-button" type="button" style={{ backgroundColor: backgroundColor }} onClick={() => props.changeSelectedColor(props.colorCode)}>
        <span className="color-text">{colorName}</span>
      </button>
      <img className="color-image" src={require('../images/colors/' + colorName + '.svg')} style={{ backgroundColor: backgroundColor }} alt="ColorIcon"/>
    </div>
  )
}

ColorButton.propTypes = {
  colorName: PropTypes.string,
  colorCode: PropTypes.string,
  changeSelectedColor: PropTypes.func,
  selectedColor: PropTypes.string
}
