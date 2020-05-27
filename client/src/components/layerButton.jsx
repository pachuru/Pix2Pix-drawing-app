import React from 'react'
import PropTypes from 'prop-types'
import '../stylesheets/layerButton.css'

/*
Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a>
from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
*/

/*
Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a>
from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
*/

/*
Icons made by <a href="https://www.flaticon.com/authors/those-icons" title="Those Icons">Those Icons</a>
from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
*/

/*
Icons made by <a href="https://icon54.com/" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/"
title="Flaticon"> www.flaticon.com</a>
 */

 /**
 * LayerButton component renders a button that allows the user to change a layer name,
 * order or delete it.
 * @component
 */
class LayerButton extends React.Component {

  /**
   * @param {String} layerName the layer name that the button references to
   */
    state = {
      layerName: ''
    }

    /**
     * Sets the layer name in the state with the layer name value passed as prop
     */
    componentDidMount () {
      this.setState({
        layerName: this.props.layer.name
      })
    }

    /**
     * Updates the layer name of the state if it has changed 
     * @param {Object} prevProps 
     */
    componentDidUpdate (prevProps) {
      if (prevProps.layer.name !== this.props.layer.name) {
        this.setState({
          layerName: this.props.layer.name
        })
      }
    }

    /**
     * Changes the layer name value of the state to match the one the user types in the input form
     */
    handleInputChange = (e) => {
      this.setState({
        layerName: e.target.value
      })
    }

    /**
     * Changes the layer name in the app, calling the changeLayerName function passed as props
     * when the user press enters. It pass as the new layer name value the layer name value stored in the
     * app state.
     */
    handleInputSubmit = (e) => {
      if (e.keyCode === 13) {
        e.preventDefault()
        document.getElementById(`layer-button-${this.props.layer.id}`).firstElementChild.blur()
        this.props.changeLayerName(this.props.layer.id, this.state.layerName)
      }
    }

    render () {
      const layerId = this.props.layer.id
      const layerOrder = this.props.layer.order
      return (
        <div className="layer-button-wrapper" id={`layer-button-${layerId}`}>
          <input className="layer-input-text" type="text" value={this.state.layerName} onChange={(e) => this.handleInputChange(e)} onKeyDown={(e) => this.handleInputSubmit(e)}>
          </input>
          {/*
          <button className="hide-layer-button bg-dark">
            <img className="hide-layer-icon" src={require('../images/tools/hide.svg')} alt="AddIcon"/>
          </button>
          */}
          <button className="delete-layer-button" onClick={() => this.props.deleteLayer(layerId)}>
            <img className="delete-layer-icon" src={require('../images/tools/remove.svg')} alt="DeleteIcon"/>
          </button>
          <button className="up-layer-button" onClick={() => this.props.increaseLayerOrder(layerId, layerOrder + 1)}>
            <img className="up-layer-icon" src={require('../images/tools/up.svg')} alt="UpIcon"/>
          </button>
          <button className="down-layer-button" onClick={() => this.props.decreaseLayerOrder(layerId, layerOrder - 1)}>
            <img className="down-layer-icon" src={require('../images/tools/down.svg')} alt="DownIcon"/>
          </button>
        </div>
      )
    }
}

/**
 * LayerButton proptypes
 * @param {Object} layer the layer the button references to
 * @param {Function} deleteLayer function to delete the layer
 * @param {Function} increaseLayerOrder function to increase the layer order
 * @param {Function} decreaseLayerOrer function to decrease the layer order
 * @param {Function} changeLayerName function to change the layer name
 */
LayerButton.propTypes = {
  layer: PropTypes.object,
  deleteLayer: PropTypes.func,
  increaseLayerOrder: PropTypes.func,
  decreaseLayerOrder: PropTypes.func,
  changeLayerName: PropTypes.func
}

export default LayerButton
