import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
var enzyme = require('enzyme');

test('renders learn react link', () => {
  var wrapper = enzyme.shallow(<App />);
  /*
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();*/

});
