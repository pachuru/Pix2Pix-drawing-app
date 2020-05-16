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

export default class LayerButton extends React.Component {
    state = {
      layerName: ''
    }

    componentDidMount () {
      this.setState({
        layerName: this.props.layer.name
      })
    }

    componentDidUpdate (prevProps) {
      if (prevProps.layer.name !== this.props.layer.name) {
        this.setState({
          layerName: this.props.layer.name
        })
      }
    }

    handleInputChange = (e) => {
      this.setState({
        layerName: e.target.value
      })
    }

    handleInputSubmit = (e) => {
      if (e.keyCode === 13) {
        this.props.changeLayerName(this.props.layer.id, this.state.layerName)
      }
    }

    render () {
      const layerId = this.props.layer.id
      const layerOrder = this.props.layer.order
      return (
        <div id="layer-button-wrapper">
          <input id="layer-input-text" type="text" value={this.state.layerName} onChange={(e) => this.handleInputChange(e)} onKeyDown={(e) => this.handleInputSubmit(e)}>
          </input>
          <button id="hide-layer-button" className="bg-dark">
            <img id="hide-layer-icon" src={require('../images/tools/hide.svg')} alt="AddIcon"/>
          </button>
          <button id="delete-layer-button" className="bg-dark" onClick={() => this.props.deleteLayer(layerId)}>
            <img id="delete-layer-icon" src={require('../images/tools/remove.svg')} alt="DeleteIcon"/>
          </button>
          <button id="up-layer-button" className="bg-dark" onClick={() => this.props.increaseLayerOrder(layerId, layerOrder + 1)}>
            <img id="up-layer-icon" src={require('../images/tools/up.svg')} alt="UpIcon"/>
          </button>
          <button id="down-layer-button" className="bg-dark" onClick={() => this.props.decreaseLayerOrder(layerId, layerOrder - 1)}>
            <img id="down-layer-icon" src={require('../images/tools/down.svg')} alt="DownIcon"/>
          </button>
        </div>
      )
    }
}

LayerButton.propTypes = {
  layer: PropTypes.object,
  deleteLayer: PropTypes.func,
  increaseLayerOrder: PropTypes.func,
  decreaseLayerOrder: PropTypes.func,
  changeLayerName: PropTypes.func
}
