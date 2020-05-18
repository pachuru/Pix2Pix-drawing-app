import React from 'react'
import '../stylesheets/colorButton.css'
import PropTypes from 'prop-types'

/* Icons made by <a href="https://www.flaticon.com/authors/vectors-market"
title="Vectors Market">Vectors Market</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a> */

export default function ColorButton (props) {
  const colorName = props.colorName
  const buttonId = 'color-button-' + colorName.replace(/\s+/g, '-').toLowerCase()
  return (
    <div className="color-button-wrapper" id={buttonId} >
      <button className="color-button" type="button" onClick={() => props.changeSelectedColor(props.colorCode)}>
        <span clasName="color-text">{colorName}</span>
      </button>
      <img className="color-image" src={require('../images/colors/' + colorName + '.svg')} alt="Color"/>
    </div>
  )
}

ColorButton.propTypes = {
  colorName: PropTypes.string,
  colorCode: PropTypes.string,
  changeSelectedColor: PropTypes.func
}
