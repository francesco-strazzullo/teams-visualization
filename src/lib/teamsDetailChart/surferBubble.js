
import * as d3 from 'd3'

const renderBubbles = (svg, width, nodes, props) => {
  const {
    graph,
    bubbleClickFun
  } = props

  const surferNodes = nodes
    .filter(n => Boolean(n.label))
    .filter(n => Boolean(n.data.surfer))

  const bubbleChart = d3.select(svg).append('g')
    .attr('class', 'bubble-chart')
    .attr('transform', function (d) { return 'translate(' + (width * graph.offsetX) + ',' + (width * graph.offsetY) + ')' })

  const node = bubbleChart.selectAll('.node')
    .data(surferNodes)
    .enter().append('g')
    .attr('class', 'node')
    .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })
    .on('click', function (d) {
      bubbleClickFun(d.label)
    })

  node.append('circle')
    .attr('id', function (d) { return d.id })
    .attr('r', function (d) { return d.r - (d.r * 0.04) })
    .style('z-index', 1)
    .attr('fill', d => `url(#${d.data.surfer.id})`)
    .on('mouseover', function (d) {
      d3.select(this).attr('r', d.r * 1.04)
    })
    .on('mouseout', function (d) {
      const r = d.r - (d.r * 0.04)
      d3.select(this).attr('r', r)
    })

  node.append('title')
    .text(function (d) { return d.label })
}

export default renderBubbles
