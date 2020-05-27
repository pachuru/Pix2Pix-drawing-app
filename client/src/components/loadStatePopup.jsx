import React from 'react'
import PropTypes from 'prop-types'

import '../stylesheets/loadStatePopup.css'

/**
 * LoadStatePopup component renders a popup window that allows the user
 * to load a JSON file with the layers configuration that he wants to render.
 * @component
 */
class LoadStatePopup extends React.Component {
    /**
     * Handles the user click to the load file button
     * It loads the file and pass the content parsed as an object to the
     * loadState() function passed as props
     */
    handleInputChange = (event) => {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = reader.result
        this.props.loadState(JSON.parse(content))
        this.props.close()
      }
      reader.readAsText(file)
    }

    render () {
      return (
        <div id="load-state-form-background">
          <div id="load-state-form">
            <button id="exit-load-state-button" onClick={this.props.close}>
              <img id="exit-load-state-icon" src={require('../images/tools/remove.svg')} alt="RemoveIcon"/>
            </button>
            <span id="load-state-span">LOAD FILE:</span>
            <div id="load-state-input-wrapper">
              <input id="load-state-input" type="file" title="" onChange={(e) => this.handleInputChange(e)}>
              </input>
            </div>
          </div>
        </div>
      )
    }
}

/**
 * LoadStatePopup proptypes
 * @param {Function} close function to close the popup
 * @param {Function} loadState function to load the JSON file configuration into the app
 */
LoadStatePopup.propTypes = {
  close: PropTypes.func,
  loadState: PropTypes.func
}

export default LoadStatePopup
