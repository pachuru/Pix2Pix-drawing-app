import React from 'react'
import PropTypes from 'prop-types'
import '../stylesheets/toolButton.css'

/**
 * ToolButton component returns a button with the icon of the tool it represents
 * and allows the user to set that tool as the currently selected tool
 * @component
 */
function ToolButton (props) {
  const toolName = props.toolName
  const toolId = 'tool-' + props.toolName
  const backgroundColor = (toolName === props.selectedTool) ? '#1d2124' : '#343a40'

  /**
   * When the user clicks the button, if there exists a function for that specific
   * tool it is called. After that the currently selected tool changes to that tool.
   */
  const handleClick = () => {
    props.toolFunction()
    props.changeSelectedTool(toolName)
  }

  return (
    <div className="tool-button-wrapper">
      <button className="tool-button" style={{ backgroundColor: backgroundColor }} id={toolId} onClick={handleClick} type="button">
        <img className="tool-button-icon" src={require('../images/tools/' + toolName + '.svg')} alt="ToolIcon"/>
      </button>
    </div>
  )
}

/**
 * ToolButton proptypes
 * @param {String} toolName the name of the tool
 * @param {Function} toolFunction the functionality of the tool.
 * If a function for a tool doesn't exists, because it only works by changing
 * the selectedTool variable, an empty function is passed
 * @param {String} selectedTool the currently selected tool
 * @param {Function} changeSelectedTool a function that changes the currently
 * selected tool
 */
ToolButton.propTypes = {
  toolName: PropTypes.string,
  toolFunction: PropTypes.func,
  selectedTool: PropTypes.string,
  changeSelectedTool: PropTypes.func
}

export default ToolButton
