import React from 'react';
import * as d3 from 'd3';

const animateElement = path => {
  const length = path.getTotalLength();
  path.classList.remove('path-invisible');

  // Clear any previous transition
  path.style.transition = path.style.WebkitTransition = 'none';
  // Set up the starting positions
  path.style.strokeDasharray = length + ' ' + length;
  path.style.strokeDashoffset = length;
  // Trigger a layout so styles are calculated & the browser
  // picks up the starting position before animating
  path.getBoundingClientRect();
  // Define transition
  path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset 2s ease-in-out';
  path.style.strokeDashoffset = '0';
};

const animatePath = uniqueClass => {
  const elems = document.getElementsByClassName(uniqueClass);
  animateElement(elems[1]);
  animateElement(elems[2]);
};

const adjustHeight = () => {
  let invParent = document.getElementsByClassName('inventory-parent');
  if (invParent.length > 0) {
    invParent = invParent[0];
    invParent.style.maxHeight = window.innerHeight + 'px';
  }
  let inventory = document.getElementsByClassName('inventory');
  if (inventory.length > 0) {
    inventory = inventory[0];
    inventory.style.height = window.innerHeight - 150 + 'px';
  }
};

export default class LineChart extends React.Component {
  constructor() {
    super();
  }

  shouldComponentUpdate(nextProps, nextState) {
    // avoid redrawing the line on state change
    return false;
  }

  componentWillUpdate() {
    // each update flush the nodes of the chart
    while (this.rootNode.firstChild) {
      this.rootNode.removeChild(this.rootNode.firstChild);
    }
  }

  drawLineChart() {
    if (!this.rootNode) {
      return;
    }
    const parent = this.rootNode.parentElement;
    const pInfo = parent.getBoundingClientRect();
    const width = pInfo.right - pInfo.left - 30;
    const height = window.innerHeight - 100;

    adjustHeight();

    // Create the container
    const svgContainer = d3
      .select(this.rootNode)
      .append('svg')
      .attr('width', window.innerWidth)
      .attr('height', height);

    const lineFunction = d3.svg
      .line()
      .x(function(d) {
        return d.x;
      })
      .y(function(d) {
        return d.y;
      })
      .interpolate('linear');

    const offset = 10;

    const topLineData = [
      { x: width, y: height / 2 - offset },
      { x: width, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: height / 2 - offset }
    ];

    const bottomLineData = [
      { x: width, y: height / 2 + offset },
      { x: width, y: height },
      { x: 0, y: height },
      { x: 0, y: height / 2 + offset }
    ];

    //Draw first line
    svgContainer
      .append('path')
      .attr('class', this.props.data + ' path-invisible')
      .attr('d', lineFunction(topLineData))
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke', '#6e78ef');

    //Draw second line
    svgContainer
      .append('path')
      .attr('class', this.props.data + ' path-invisible')
      .attr('d', lineFunction(bottomLineData))
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke', '#6e78ef');

    animatePath(this.props.data);
  }
  render() {
    // only start drawing (accessing the DOM) after the first render
    const unique = this.props.data;
    if (this.rootNode) {
      this.drawLineChart();
    } else {
      // setTimeout necessary for the very first draw, to ensure drawing using a DOMNode
      setTimeout(() => this.drawLineChart(), 0);
    }

    return <div className={unique} ref={node => (this.rootNode = node)} />;
  }
}
