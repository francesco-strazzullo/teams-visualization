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

  // Call to the function that draw the bubbles.
  renderBubbles(svg, bubblesWidth, nodes, color, params)
  // Call to the function that draw the legend.
  if (showLegend) {
    renderLegend(svg, legendWidth, height, bubblesWidth, nodes, color, params)
  }
}

export default render
