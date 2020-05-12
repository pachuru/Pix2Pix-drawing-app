import React from 'react'
import "../stylesheets/newLayerPopup.css"


export default class NewLayerPopup extends React.Component {

    constructor(props){
        super(props)
    }

    state = {
        layerInputText: ""
    }

    handleInputChange = (event) => {
        this.setState({layerInputText: event.target.value})
    }

    handleButtonClick = () => {
        this.props.addNewLayer(this.state.layerInputText)
    }

    render(){
        return (
            <div id="new-layer-form-background">
                <div id="new-layer-form">
                            <button id="exit-new-layer-button" onClick={this.props.close}>
                                <img id="exit-new-layer-icon" src={require('../images/tools/remove.svg')} alt="AddIcon"/>
                            </button>
                            <span id="new-layer-span">LAYER NAME:</span>
                            <div id="new-layer-input">
                                <input id="new-layer-input-text" type="text" onChange={(e) => this.handleInputChange(e)}>
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
