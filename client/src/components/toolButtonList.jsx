import React from 'react'
import PropTypes from 'prop-types'
import ToolButton from './toolButton'
import '../stylesheets/toolButtonList.css'

export default function ToolButtonList (props) {
  const toolList = props.toolList
  return (
    <div>
      <ul className="tool-button-unordered-list">
        {
          toolList.map((toolName, index) => {
            return <li className="tool-button-list-element" key={index}>
              <ToolButton toolName={toolName}
                toolFunction={props[toolName]}
                selectedTool={props.selectedTool}
                changeSelectedTool={props.changeSelectedTool}/>
            </li>
          })
        }
      </ul>
    </div>
  )
}

ToolButtonList.propTypes = {
  toolList: PropTypes.array,
  selectedTool: PropTypes.string,
  changeSelectedTool: PropTypes.func
}
