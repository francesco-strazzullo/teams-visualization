import * as d3 from 'd3'
import renderBubbles from './bubble'
import renderLegend from './legend'

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

  svg.innerHTML = ''
  if (overflow) {
    svg.style.overflow = 'visible'
  }

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
      const { label } = d.data
      if (!label) {
        return
      }

      d.label = label
      d.id = label.toLowerCase().replace(/|\/|&|'/g, '-')
    })

  // Pass the data to the pack layout to calculate the distribution.
  const nodes = pack(root).leaves()

  var defs = d3
    .select(svg)
    .append('defs')

  const dataWithImages = data.filter(e => Boolean(e.payload))
  dataWithImages.forEach(element => {
    defs.append('pattern')
      .attr('id', element.payload.id.toString())
      .attr('x', '0%')
      .attr('y', '0%')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 512 512')
      .append('svg:image')
      .attr('xlink:href', element.payload.image)
      .attr('width', 512)
      .attr('height', 512)
      .attr('x', '0%')
      .attr('y', '0%')
  })

  // Call to the function that draw the bubbles.
  renderBubbles(svg, bubblesWidth, nodes, color, params)
  // Call to the function that draw the legend.
  if (showLegend) {
    renderLegend(svg, legendWidth, height, bubblesWidth, nodes, color, params)
  }
}

export default render
