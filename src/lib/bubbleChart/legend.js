import * as d3 from 'd3'

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

export default renderLegend
