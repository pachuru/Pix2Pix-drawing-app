import React from 'react'
import PropTypes from 'prop-types'
import '../stylesheets/toolButton.css'

export default function ToolButton (props) {
  const toolName = props.toolName
  return (
    <div id="tool-button-wrapper">
      <button id="tool-button" className="bg-dark" type="button">
        <img id="tool-button-icon" src={require('../images/tools/' + toolName + '.svg')} alt="Logo"/>
      </button>
    </div>
  )
}

ToolButton.propTypes = {
  toolName: PropTypes.string
}
