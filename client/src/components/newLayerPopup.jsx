import React from 'react'
import PropTypes from 'prop-types'

import '../stylesheets/newLayerPopup.css'

export default class NewLayerPopup extends React.Component {
    state = {
      layerInputText: ''
    }

    handleInputChange = (event) => {
      this.setState({ layerInputText: event.target.value })
    }

    handleButtonClick = () => {
      this.props.addNewLayer(this.state.layerInputText)
    }

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

NewLayerPopup.propTypes = {
  addNewLayer: PropTypes.func,
  close: PropTypes.func
}
