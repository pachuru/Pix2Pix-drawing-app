import React from 'react'
import PropTypes from 'prop-types'

import '../stylesheets/loadStatePopup.css'

export default class LoadStatePopup extends React.Component {
    state = {
      layerInputText: ''
    }

    handleInputChange = (event) => {
      console.log('Files: ', event.target.files)
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

LoadStatePopup.propTypes = {
  close: PropTypes.func,
  loadState: PropTypes.func
}
