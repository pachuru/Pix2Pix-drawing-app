import React from 'react'
import PropTypes from 'prop-types'

import '../stylesheets/newLayerPopup.css'

/**
 * NewLayerPopup component renders a popup window that allows the user
 * to load set the name for a new layer and create it
 * @component
 */
class NewLayerPopup extends React.Component {
  /**
   * @param {String} layerInputText the text that's being written in 
   * the input text of the popup
   */
    state = {
      layerInputText: ''
    }

    /**
     * Handles a change in the input text
     * @param {Event} event
     */
    handleInputChange = (event) => {
      this.setState({ layerInputText: event.target.value })
    }

    /**
     * Handles a click in the create button of the component and calls the
     * addNewLayer function
     */
    handleButtonClick = () => {
      this.props.addNewLayer(this.state.layerInputText)
    }

    /**
     * Analogous to the handleButtonClick function but instead of pressing a button
     * it works by pressing the Enter key
     */
    handleInputSubmit = (e) => {
      if (e.keyCode === 13) {
        this.props.addNewLayer(this.state.layerInputText)
      }
    }

    render () {
      return (
        <div id="new-layer-form-background">
          <div id="new-layer-form">
            <button id="exit-new-layer-button" onClick={this.props.close}>
              <img id="exit-new-layer-icon" src={require('../images/tools/remove.svg')} alt="RemoveIcon"/>
            </button>
            <span id="new-layer-span">LAYER NAME:</span>
            <div id="new-layer-input">
              <input id="new-layer-input-text" type="text" onChange={(e) => this.handleInputChange(e)} onKeyDown={(e) => this.handleInputSubmit(e)}>
              </input>
              <button id="new-layer-input-button" type="button" onClick={this.handleButtonClick}>
                                    CREATE
              </button>
            </div>
          </div>
        </div>
      )
    }
}

/**
 * NewLayerPopup proptypes
 * @param {Function} addNewLayer adds a new layer to the app with the given name
 * @param {Function} close closes the popup
 */

NewLayerPopup.propTypes = {
  addNewLayer: PropTypes.func,
  close: PropTypes.func
}

export default NewLayerPopup