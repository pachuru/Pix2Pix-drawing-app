import React from "react";
import { create } from "react-test-renderer";
import ColorButton from '../components/colorButton'

describe("Button component", () => {
  test("Matches the snapshot", () => {
    const colorButton = create(<ColorButton />);
    expect(colorButton.toJSON()).toMatchSnapshot();
  });
});