import React from 'react'
import "../stylesheets/layerButton.css"

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

export default class LayerButton extends React.Component{

    constructor(props){
        super(props)
    }

    state = {
        layerName: ""
    }

    componentDidMount(){
        let layerName = this.props.layer.name
        this.setState({
            layerName: layerName
        })
    }

    handleInputChange = (e) => {
        this.setState({
            layerName: e.target.value
        })
    }

    handleInputSubmit = (e) => {
        if(e.keyCode == 13){
            this.props.changeLayerName(this.props.layer.id, this.state.layerName)
        }
    }

    render(){
        const layerName = this.props.layer.name;
        const layerId = this.props.layer.id;
        const layerOrder = this.props.layer.order;
        return (
            <div id="layer-button-wrapper">
                <input id="layer-input-text" type="text" value={this.state.layerName} onChange={(e) => this.handleInputChange(e)} onKeyDown={(e) => this.handleInputSubmit(e)}>
                </input>
                <button id="hide-layer-button" class="bg-dark">
                    <img id="hide-layer-icon" src={require('../images/tools/hide.svg')} alt="AddIcon"/>
                </button>
                <button id="delete-layer-button" class="bg-dark" onClick={() => this.props.deleteLayer(layerId)}>
                    <img id="delete-layer-icon" src={require('../images/tools/remove.svg')} alt="DeleteIcon"/>
                </button>
                <button id="up-layer-button" class="bg-dark" onClick={() => this.props.changeLayerOrder(layerId, layerOrder + 1)}>
                    <img id="up-layer-icon" src={require('../images/tools/up.svg')} alt="UpIcon"/>
                </button>
                <button id="down-layer-button" class="bg-dark" onClick={() => this.props.changeLayerOrder(layerId, layerOrder - 1)}>
                    <img id="down-layer-icon" src={require('../images/tools/down.svg')} alt="DownIcon"/>
                </button>
            </div>
        )
    }
}
