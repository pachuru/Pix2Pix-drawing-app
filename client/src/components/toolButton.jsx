import React from 'react'
import PropTypes from 'prop-types'
import '../stylesheets/toolButton.css'

export default function ToolButton (props) {
  const toolName = props.toolName
  const toolId = 'tool-' + props.toolName
  const backgroundColor = (toolName === props.selectedTool) ? '#1d2124' : '#343a40'

  const handleClick = () => {
    props.toolFunction()
    props.changeSelectedTool(toolName)
  }

  return (
    <div className="tool-button-wrapper">
      <button className="tool-button" style={{ backgroundColor: backgroundColor }} id={toolId} onClick={handleClick} type="button">
        <img className="tool-button-icon" src={require('../images/tools/' + toolName + '.svg')} alt="Logo"/>
      </button>
    </div>
  )
}

ToolButton.propTypes = {
  toolName: PropTypes.string,
  toolFunction: PropTypes.func,
  selectedTool: PropTypes.string,
  changeSelectedTool: PropTypes.func
}
