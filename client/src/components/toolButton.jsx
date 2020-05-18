import React from 'react'
import PropTypes from 'prop-types'
import '../stylesheets/toolButton.css'

export default function ToolButton (props) {
  const toolName = props.toolName
  const toolId = 'tool-' + props.toolName
  return (
    <div className="tool-button-wrapper">
      <button className="tool-button bg-dark" id={toolId} type="button">
        <img className="tool-button-icon" src={require('../images/tools/' + toolName + '.svg')} alt="Logo"/>
      </button>
    </div>
  )
}

ToolButton.propTypes = {
  toolName: PropTypes.string
}
