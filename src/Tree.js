import React, { Component } from 'react';
import _ from 'lodash';
import './Tree.css';

class Tree extends Component {

  constructor(props) {
    super(props);
    console.log('tree props',props);
    this.state = _.cloneDeep(props);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps, this.props)) {
      this.setState(nextProps);
    }
  }


  render() {
    let zones = [];
    if (this.state.zones) {
      zones = this.state.zones.map((zone, idx) => {
        let style = {
          width: zone.width + 'px',
          left: zone.offset + 'px',
          top: this.state.top + 32 + 'px'
        };
        return (
          <div className='zone' key={idx} style={style}>
            This is where you render the {zone.label}
          </div>
        )
      })
    }

    return (
      <div>
        {zones}
      </div>
    )
  }
}
export default Tree;
