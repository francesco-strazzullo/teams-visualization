import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import renderChart from '../lib/bubbleChart'

export default class BubbleChart extends Component {
  componentDidMount () {
    this.svg = ReactDOM.findDOMNode(this)
    renderChart(this.svg, this.props)
  }

  componentDidUpdate () {
    const {
      width,
      height
    } = this.props
    if (width !== 0 && height !== 0) {
      renderChart(this.svg, this.props)
    }
  }

  render () {
    const {
      width,
      height
    } = this.props
    return (
      <svg width={width} height={height} />
    )
  }
}

BubbleChart.propTypes = {
  overflow: PropTypes.bool,
  graph: PropTypes.shape({
    zoom: PropTypes.number,
    offsetX: PropTypes.number,
    offsetY: PropTypes.number
  }),
  width: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.number,
  showLegend: PropTypes.bool,
  legendPercentage: PropTypes.number,
  legendFont: PropTypes.shape({
    family: PropTypes.string,
    size: PropTypes.number,
    color: PropTypes.string,
    weight: PropTypes.string
  }),
  valueFont: PropTypes.shape({
    family: PropTypes.string,
    size: PropTypes.number,
    color: PropTypes.string,
    weight: PropTypes.string
  }),
  labelFont: PropTypes.shape({
    family: PropTypes.string,
    size: PropTypes.number,
    color: PropTypes.string,
    weight: PropTypes.string
  })
}
BubbleChart.defaultProps = {
  overflow: false,
  graph: {
    zoom: 1.1,
    offsetX: -0.05,
    offsetY: -0.01
  },
  width: 1000,
  height: 800,
  padding: 0,
  showLegend: true,
  legendPercentage: 20,
  legendFont: {
    family: 'Arial',
    size: 12,
    color: '#000',
    weight: 'bold'
  },
  valueFont: {
    family: 'Arial',
    size: 16,
    color: '#fff',
    weight: 'bold'
  },
  labelFont: {
    family: 'Arial',
    size: 11,
    color: '#fff',
    weight: 'normal'
  },
  bubbleClickFun: (label) => { console.log(`Bubble ${label} is clicked ...`) },
  legendClickFun: (label) => { console.log(`Legend ${label} is clicked ...`) }
}
