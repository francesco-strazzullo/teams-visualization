
import * as d3 from 'd3'

const renderBubbles = (svg, width, nodes, color, props) => {
  const {
    graph,
    bubbleClickFun,
    valueFont,
    labelFont
  } = props

  const bubbleChart = d3.select(svg).append('g')
    .attr('class', 'bubble-chart')
    .attr('transform', function (d) { return 'translate(' + (width * graph.offsetX) + ',' + (width * graph.offsetY) + ')' })

  const node = bubbleChart.selectAll('.node')
    .data(nodes)
    .enter().append('g')
    .attr('class', 'node')
    .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })
    .on('click', function (d) {
      bubbleClickFun(d.label)
    })

  node.append('circle')
    .attr('id', function (d) { return d.id })
    .attr('r', function (d) { return d.r - (d.r * 0.04) })
    .style('fill', function (d) { return d.data.color ? d.data.color : color(nodes.indexOf(d)) })
    .style('z-index', 1)
    .on('mouseover', function (d) {
      d3.select(this).attr('r', d.r * 1.04)
    })
    .on('mouseout', function (d) {
      const r = d.r - (d.r * 0.04)
      d3.select(this).attr('r', r)
    })

  node.append('clipPath')
    .attr('id', function (d) { return 'clip-' + d.id })
    .append('use')
    .attr('xlink:href', function (d) { return '#' + d.id })

  node.append('text')
    .attr('class', 'value-text')
    .style('font-size', `${valueFont.size}px`)
    .attr('clip-path', function (d) { return 'url(#clip-' + d.id + ')' })
    .style('font-weight', (d) => {
      return valueFont.weight ? valueFont.weight : 600
    })
    .style('font-family', valueFont.family)
    .style('fill', () => {
      return valueFont.color ? valueFont.color : '#000'
    })
    .style('stroke', () => {
      return valueFont.lineColor ? valueFont.lineColor : '#000'
    })
    .style('stroke-width', () => {
      return valueFont.lineWeight ? valueFont.lineWeight : 0
    })
    .text(function (d) { return d.value })

  node.append('text')
    .attr('class', 'label-text')
    .style('font-size', `${labelFont.size}px`)
    .attr('clip-path', function (d) { return 'url(#clip-' + d.id + ')' })
    .style('font-weight', (d) => {
      return labelFont.weight ? labelFont.weight : 600
    })
    .style('font-family', labelFont.family)
    .style('fill', () => {
      return labelFont.color ? labelFont.color : '#000'
    })
    .style('stroke', () => {
      return labelFont.lineColor ? labelFont.lineColor : '#000'
    })
    .style('stroke-width', () => {
      return labelFont.lineWeight ? labelFont.lineWeight : 0
    })
    .text(function (d) {
      return d.label
    })

  // Center the texts inside the circles.
  d3.selectAll('.label-text').attr('x', function (d) {
    const self = d3.select(this)
    const width = self.node().getBBox().width
    return -(width / 2)
  })
    .style('opacity', function (d) {
      const self = d3.select(this)
      const width = self.node().getBBox().width
      d.hideLabel = width * 1.05 > (d.r * 2)
      return d.hideLabel ? 0 : 1
    })
    .attr('y', function (d) {
      return labelFont.size / 2
    })

  // Center the texts inside the circles.
  d3.selectAll('.value-text').attr('x', function (d) {
    const self = d3.select(this)
    const width = self.node().getBBox().width
    return -(width / 2)
  })
    .attr('y', function (d) {
      if (d.hideLabel) {
        return valueFont.size / 3
      } else {
        return -valueFont.size * 0.5
      }
    })

  node.append('title')
    .text(function (d) { return d.label })
}

const renderLegend = (svg, width, height, offset, nodes, color, props) => {
  const {
    legendClickFun,
    legendFont
  } = props
  const bubble = d3.select('.bubble-chart')
  const bubbleHeight = bubble.node().getBBox().height

  const legend = d3.select(svg).append('g')
    .attr('transform', function () { return `translate(${offset},${(bubbleHeight) * 0.05})` })
    .attr('class', 'legend')

  let textOffset = 0
  const texts = legend.selectAll('.legend-text')
    .data(nodes)
    .enter()
    .append('g')
    .attr('transform', (d, i) => {
      const offset = textOffset
      textOffset += legendFont.size + 10
      return `translate(0,${offset})`
    })
    .on('mouseover', function (d) {
      d3.select('#' + d.id).attr('r', d.r * 1.04)
    })
    .on('mouseout', function (d) {
      const r = d.r - (d.r * 0.04)
      d3.select('#' + d.id).attr('r', r)
    })
    .on('click', function (d) {
      legendClickFun(d.label)
    })

  texts.append('rect')
    .attr('width', 30)
    .attr('height', legendFont.size)
    .attr('x', 0)
    .attr('y', -legendFont.size)
    .style('fill', 'transparent')

  texts.append('rect')
    .attr('width', legendFont.size)
    .attr('height', legendFont.size)
    .attr('x', 0)
    .attr('y', -legendFont.size)
    .style('fill', function (d) { return d.data.color ? d.data.color : color(nodes.indexOf(d)) })

  texts.append('text')
    .style('font-size', `${legendFont.size}px`)
    .style('font-weight', (d) => {
      return legendFont.weight ? legendFont.weight : 600
    })
    .style('font-family', legendFont.family)
    .style('fill', () => {
      return legendFont.color ? legendFont.color : '#000'
    })
    .style('stroke', () => {
      return legendFont.lineColor ? legendFont.lineColor : '#000'
    })
    .style('stroke-width', () => {
      return legendFont.lineWeight ? legendFont.lineWeight : 0
    })
    .attr('x', (d) => { return legendFont.size + 10 })
    .attr('y', 0)
    .text((d) => { return d.label })
}

const render = (svg, params) => {
  const {
    overflow,
    graph,
    data,
    height,
    width,
    padding,
    showLegend,
    legendPercentage
  } = params
  // Reset the svg element to a empty state.
  svg.innerHTML = ''
  // Allow bubbles overflowing its SVG container in visual aspect if props(overflow) is true.
  if (overflow) { svg.style.overflow = 'visible' }

  const bubblesWidth = showLegend ? width * (1 - (legendPercentage / 100)) : width
  const legendWidth = width - bubblesWidth
  const color = d3.scaleOrdinal(d3.schemeCategory10)

  const pack = d3.pack()
    .size([bubblesWidth * graph.zoom, bubblesWidth * graph.zoom])
    .padding(padding)

  // Process the data to have a hierarchy structure;
  const root = d3.hierarchy({ children: data })
    .sum(function (d) { return d.value })
    .sort(function (a, b) { return b.value - a.value })
    .each((d) => {
      if (d.data.label) {
        d.label = d.data.label
        d.id = d.data.label.toLowerCase().replace(/ |\//g, '-')
      }
    })

  // Pass the data to the pack layout to calculate the distribution.
  const nodes = pack(root).leaves()

  // Call to the function that draw the bubbles.
  renderBubbles(svg, bubblesWidth, nodes, color, params)
  // Call to the function that draw the legend.
  if (showLegend) {
    renderLegend(svg, legendWidth, height, bubblesWidth, nodes, color, params)
  }
}

export default render
