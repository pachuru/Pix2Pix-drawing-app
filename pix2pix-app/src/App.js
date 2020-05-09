import React, { Component } from 'react'
import { Row, Col } from 'antd'

import Navbar from './components/navbar'

export default class App extends Component {
  render() {
    return (
      <div>
        <Navbar></Navbar>
      </div>
    )
  }
}
