import React from 'react';
import { render } from 'react-dom';
import TBrowse from './src/TBrowse';

const launchTBrowse = (props, element) => {
  render(<TBrowse {...props} />, element);
};

module.exports = launchTBrowse;
