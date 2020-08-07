import * as d3 from 'd3'
import _ from 'lodash'
import renderTeamBubble from '../teamBubble'

const mapHierarchy = data => data
  .map(t => {
    return {
      label: t.name,
      value: t.surfers.length
    }
  })
  .sort((a, b) => {
    return a.label.localeCompare(b.label)
  })

const createBackgroundDefs = (svg, data) => {
  const defs = d3
    .select(svg)
    .append('defs')

  const surfers = _.uniqBy(data
    .map(r => r.surfers)
    .flat(), 'id')

  surfers.forEach(surfer => {
    defs.append('pattern')
      .attr('id', surfer.id)
      .attr('x', '0%')
      .attr('y', '0%')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 512 512')
      .append('svg:image')
      .attr('xlink:href', surfer.image)
      .attr('width', 512)
      .attr('height', 512)
      .attr('x', '0%')
      .attr('y', '0%')
  })

  return defs
}

const render = (svg, data, params) => {
  const {
    overflow,
    width
  } = params

  svg.innerHTML = ''
  if (overflow) {
    svg.style.overflow = 'visible'
  }

  const color = d3.scaleOrdinal(d3.schemeCategory10)

  const pack = d3.pack()
    .size([width, width])

  // Process the data to have a hierarchy structure;
  const root = d3.hierarchy({ children: mapHierarchy(data) })
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

  createBackgroundDefs(svg, data)

  renderTeamBubble(svg, width, nodes, color, params)
  // renderSurferBubble(svg, width, nodes, params)
}

export default render
