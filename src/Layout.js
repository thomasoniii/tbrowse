import React, { Component } from 'react';
import _ from 'lodash';
import interact from 'interact.js';
import './Layout.css';

const defaultZones = {
  tree: {
    label: 'gene tree',
    width: 300,
    minWidth: 100
  },
  label: {
    label: 'label',
    width: 200,
    minWidth: 50
  },
  number: {
    label: 'number',
    width: 100,
    minWidth: 30
  }
};

class Layout extends Component {

  constructor(props) {
    super(props);
    let zones = _.cloneDeep(defaultZones); // combine with props
    let activeZones = [
      _.clone(zones.tree),
      _.clone(zones.label),
      _.clone(zones.number),
      _.clone(zones.number)
    ];
    let maxX = 0;
    activeZones.forEach((zone) => {
      zone.offset = maxX;
      maxX += zone.width;
    });
    let width = props.width;
    this.state = {zones, activeZones, width};
  }

  getAvailableSpace(idx) {
    let min = 0
      , max = this.state.width
      , i;

    let zones = this.state.activeZones;

    for(i=0;i<idx;i++) {
      min += zones[i].width;
    }
    for(i=idx+1;i<zones.length;i++) {
      max -= zones[i].width;
    }
    return {min, max};
  }

  dragMoveListener (event) {
    let target = event.target;
    let zoneidx = +target.getAttribute('zoneidx');
    let range = this.getAvailableSpace(zoneidx);

    let thisZone = this.state.activeZones[zoneidx];
    let x = thisZone.offset + event.dx;
    if (x < range.min) { x = range.min }
    range.max -= thisZone.width;
    if (x > range.max) { x = range.max }

    if (x !== thisZone.offset) {
      let activeZones = _.cloneDeep(this.state.activeZones);
      activeZones[zoneidx].offset = x;
      if (event.dx > 0) {
        for(let i = zoneidx + 1; i < activeZones.length; i++) {
          if (activeZones[i].offset < activeZones[i-1].offset + activeZones[i-1].width) {
            activeZones[i].offset = activeZones[i-1].offset + activeZones[i-1].width;
          }
        }
      }
      else {
        for(let i = zoneidx - 1; i >= 0; i--) {
          if (activeZones[i].offset + activeZones[i].width > activeZones[i+1].offset) {
            activeZones[i].offset = activeZones[i+1].offset - activeZones[i].width;
          }
        }
      }
      this.setState({activeZones});
    }
  }

  dragResizeListener (event) {
    let target = event.target;
    let zoneidx = +target.getAttribute('zoneidx');
    let range = this.getAvailableSpace(zoneidx);

    let thisZone = this.state.activeZones[zoneidx];
    let x = thisZone.offset;

    let activeZones = _.cloneDeep(this.state.activeZones);
    let newWidth = event.rect.width;
    let toTheRight = true;
    let update = false;

    if (event.edges.left) { // move left edge
      x += event.dx;
      range.max -= thisZone.minWidth;
      if (x < range.min) { x = range.min }
      if (x > range.max) { x = range.max }
      if (x !== thisZone.offset) {
        newWidth = thisZone.width + thisZone.offset - x;
        if (newWidth < thisZone.minWidth) { newWidth = thisZone.minWidth }
        toTheRight = true;
        update = true;
      }
    }
    else if (event.edges.right) { // move right edge
      let right = x + event.rect.width;
      range.min += thisZone.minWidth;
      if (right < range.min) { right = range.min }
      if (right > range.max) { right = range.max }
      newWidth = right - x;
      if (newWidth < thisZone.minWidth) { newWidth = thisZone.minWidth }
      if (newWidth === thisZone.minWidth) { x += event.dx };

      toTheRight = (event.deltaRect.right > 0);

      let lastZoneOffset = 0;
      if (zoneidx > 0) {
        const lastZone = this.state.activeZones[zoneidx - 1];
        lastZoneOffset = lastZone.offset + lastZone.width;
      }
      update = (x !== lastZoneOffset || newWidth !== thisZone.width);
    }
    if (update) {
      activeZones[zoneidx].width = newWidth;
      activeZones[zoneidx].offset = x;
      if (toTheRight) {
        for(let i = zoneidx + 1; i < activeZones.length; i++) {
          if (activeZones[i].offset < activeZones[i-1].offset + activeZones[i-1].width) {
            activeZones[i].offset = activeZones[i-1].offset + activeZones[i-1].width;
          }
        }
      }
      else {
        for(let i = zoneidx - 1; i >= 0; i--) {
          if (activeZones[i].offset + activeZones[i].width > activeZones[i+1].offset) {
            activeZones[i].offset = activeZones[i+1].offset - activeZones[i].width;
          }
        }
      }
      this.setState({activeZones});
    }
  }

  componentDidMount() {
    interact('.zone-cfg')
      .draggable({
        onmove: this.dragMoveListener.bind(this)
      })
      .resizable({
        edges: {left: true, right: true, bottom: false, top: false },
        onmove: this.dragResizeListener.bind(this)
      });
    this.props.onUpdate(this.state.activeZones)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.width !== this.props.width) {
      this.setState({width: nextProps.width});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(prevState.activeZones, this.state.activeZones)) {
      this.props.onUpdate(this.state.activeZones);
    }
  }

  render() {
    let zones = this.state.activeZones.map((zone, idx) => {
      let style = {
        width: zone.width + 'px',
        left: zone.offset + 'px'
      };
      // todo: replace {zone.label} with a component with a drop down list of available zones
      return (
        <div className="zone-cfg"
             key={idx}
             style={style}
             zoneidx={idx}>
          {zone.label}&nbsp;
          <a href='http://gramene.org'>link</a>
        </div>
      )
    });

    let lastZone = this.state.activeZones[this.state.activeZones.length-1];
    let maxX = lastZone.offset + lastZone.width;

    return (
      <div>
        {zones}
        <div className="fixed-zone-cfg" style={{left: maxX + 'px'}}>+</div>
      </div>
    )
  }
}
export default Layout;
