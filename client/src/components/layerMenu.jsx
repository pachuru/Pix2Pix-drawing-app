import React from 'react'
import PropTypes from 'prop-types'
import LayerButton from './layerButton'
import AddLayerButton from './addLayerButton'

import '../stylesheets/layerMenu.css'

/**
 * LayerMenu component returns a button for each layer the app owns to allow
 * the modification of those layers. It also returns the AddLayerButton to
 * add a new layer button.
 * @component
 */
function LayerMenu (props) {
  const layers = props.layers
  return (
    <div id="layer-menu-wrapper">
      <AddLayerButton
        addLayer={props.addLayer}
      ></AddLayerButton>
      {
        layers.sort((a, b) => (a.order > b.order) ? -1 : 1)
          .map((layer, index) => {
            return <LayerButton
              key={index}
              layer={layer}
              deleteLayer={props.deleteLayer}
              changeLayerName={props.changeLayerName}
              increaseLayerOrder={props.increaseLayerOrder}
              decreaseLayerOrder={props.decreaseLayerOrder}
            ></LayerButton>
          })
      }
    </div>
  )
}

/**
 * LayerMenu proptypes
 * @param {Object} layers the layers for which the menu will return a button
 * @param {Function} addLayer function to add a layer
 * @param {Function} deleteLayer function to delete the layer
 * @param {Function} increaseLayerOrder function to increase the layer order
 * @param {Function} decreaseLayerOrer function to decrease the layer order
 * @param {Function} changeLayerName function to change the layer name
 */
LayerMenu.propTypes = {
  layers: PropTypes.array,
  addLayer: PropTypes.func,
  deleteLayer: PropTypes.func,
  increaseLayerOrder: PropTypes.func,
  decreaseLayerOrder: PropTypes.func,
  changeLayerName: PropTypes.func
}

export default LayerMenu
