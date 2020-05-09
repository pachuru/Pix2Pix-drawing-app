import React, { Component } from 'react'
import { Row, Col } from 'antd'

import Navbar from './components/navbar'
import ColorButton from './components/colorButton'

export default class App extends Component {
  render() {
    return (
      <div>
        <Navbar></Navbar>
        <ColorButton
          colorName={"BROWN"}
        ></ColorButton>
      </div>
    )
  }
}
