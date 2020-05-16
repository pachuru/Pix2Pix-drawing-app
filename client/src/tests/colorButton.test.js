import React from "react"
import ColorButton from "../components/colorButton"
import {shallow} from 'enzyme';

describe("Color button test", () => {
    it("Test button on click", () => {
        const wrapper = shallow(<ColorButton colorName="background"/>)
    })
})