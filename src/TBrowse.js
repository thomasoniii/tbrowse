import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import './TBrowse.css';
import Layout from './Layout';
import Tree from './Tree';

const windowResizeDebounceMs = 200;
const defaultNodeHeight = 20;

class TBrowse extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nodeHeight: defaultNodeHeight,
      tree: props.tree
    }
  }

  componentWillMount() {
    this.resizeListener = _.debounce(
      this.updateAvailableWidth.bind(this),
      windowResizeDebounceMs
    );
    if (!_.isUndefined(global.addEventListener)) {
      global.addEventListener('resize', this.resizeListener);
    }
  }

  componentWillUnmount() {
    if (this.resizeListener) {
      global.removeEventListener('resize', this.resizeListener);
    }
  }

  updateAvailableWidth() {
    const DOMNode = ReactDOM.findDOMNode(this);
    let parentWidth = DOMNode.parentNode ? DOMNode.parentNode.clientWidth : DOMNode.clientWidth;
    parentWidth -= 30;
    if (this.state.width !== parentWidth) {
      this.setState({width: parentWidth, top: DOMNode.offsetTop});
    }
  }

  componentDidMount() {
    this.updateAvailableWidth();
  }

  updateLayout(zones) {
    this.setState({zones})
  }

  render() {
    return (
      <div className="TBrowse">
        <Layout width={this.state.width} onUpdate={this.updateLayout.bind(this)}/>
        <Tree {...this.state}/>
      </div>
    )
  }
}
export default TBrowse;
