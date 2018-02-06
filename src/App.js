import React, { Component } from 'react';
import Helmet from 'react-helmet';
import './App.css';
import TBrowse from './TBrowse.js';

// the top level app demonstrating TBrowse
// UI options for obtaining a tree
// 1. choose an example tree from genetrees.org (actually runs a search for a specific gene and loads the tree)
// 2. let the user search for a tree
// 2.a. populate a drop down of sets of trees
// 2.b. let the user search within a set
// 2.c. let the user pick a gene from the search results (always load the first result?)

// search bar at the top
// result list on the left
// viewer area to the right <-- this is tbrowse

// tbrowse props
// tree: object as obtained from genetrees.org
// foci: list of nodes to expand up to, else everything

import exampleTree from './fixtures/ath_osa_waxy.json';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Helmet title="TBrowse" />
        <TBrowse tree={exampleTree}/>
      </div>
    );
  }
}

export default App;
