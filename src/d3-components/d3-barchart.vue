<template>
  <div class="numbers__column" :class="dataBar.other.class">
    <h3 class="numbers__title">{{ dataBar.other.title }}</h3>
    <div class="numbers__graph" :id="dataBar.id"></div>
    <div class="numbers__info">
      <p class="numbers__total">{{ dataBar.other.value }}</p>
      <p>{{ dataBar.other.sub }}</p>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from '@vue/composition-api'
import * as d3 from 'd3'

export default defineComponent({
  name: 'd3Bar',
  props: {
    dataBar: {
      type: Object,
    },
  },
  setup(props, ctx) {
    onMounted(() => {
      window.addEventListener('resize', onResize)
      draw()
    })
    const onResize = () => {
      if (window.innerWidth > 1024 && ctx.root.$route.name === 'Numbers') {
        if (document.querySelector(`#${props.dataBar.id}`))
          document.querySelector(`#${props.dataBar.id}`).innerHTML = ''
        draw()
      }
    }
    const draw = () => {
      // set the dimensions and margins of the graph
      // var margin = 20

      // set the ranges
      var y = d3
        .scaleBand()
        .range([0, window.innerHeight * 0.25])
        .padding(0.5)

      var x = d3.scaleLinear().range([0, window.innerWidth * 0.7 * 0.4])

      // append the svg object to the body of the page
      // append a 'group' element to 'svg'
      // moves the 'group' element to the top left margin
      var svg = d3
        .select(`#${props.dataBar.id}`)
        .append('svg')
        .attr('width', window.innerWidth * 0.7 * 0.4)
        .attr('height', window.innerHeight * 0.25)
        .append('g')

      var gDefs = svg.append('g').attr('id', 'gDefs')
      //Filter for the outside glow
      var filter = gDefs
        .append('filter')
        .attr('id', 'glowBar')
        .attr('filterUnits', 'userSpaceOnUse')
      filter
        .append('feGaussianBlur')
        .attr('stdDeviation', '5')
        .attr('result', 'coloredBlur')
      var feMerge = filter.append('feMerge')
      feMerge.append('feMergeNode').attr('in', 'coloredBlur')
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

      // Scale the range of the data in the domains
      x.domain([
        0,
        d3.max(props.dataBar.data, function(d) {
          return d.value.value
        }),
      ])
      y.domain(
        props.dataBar.data.map(function(d) {
          return d.name
        })
      )

      //y.domain([0, d3.max(data, function(d) { return d.value; })]);

      // append the rectangles for the bar chart
      var bar = svg
        .selectAll('.bar')
        .data(props.dataBar.data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('data-number', d => {
          return d.value.value
        })
        .attr('width', function(d) {
          return x(d.value.value)
        })
        .attr('y', function(d) {
          return y(d.name)
        })
        .attr('height', y.bandwidth())
        .attr('stroke', function(d, i) {
          if (i === 1) {
            return '#8D2426'
          } else {
            return '#196890'
          }
        })
        .attr('stroke-width', '2')
        .style('filter', 'url(#glowBar)')

      var marginRight = window.innerWidth * 0.018
      // add the y Axis
      svg
        .append('g')
        .call(d3.axisLeft(y))
        .selectAll('text')
        .style('fill', '#ffe403')
        .style('text-anchor', 'start')
        .style('font-size', window.innerWidth * 0.00655)
        .attr('transform', 'translate(' + marginRight + ',' + 0 + ')')

      // Remove line
      svg.select('.domain').remove()

      svg
        .append('rect')
        .attr('width', '1')
        .attr('y', 0)
        .attr('x', 0)
        .attr('height', window.innerHeight * 0.25)
        .attr('stroke', '#ffe403')
        .attr('stroke-width', '5')

      bar.on('mouseover', d => {
        console.log(d)
      })
    }
  },
})
</script>

<style lang="scss">
.bar {
  fill: transparent;
  cursor: pointer;
}
.tick {
  font-family: star_jediregular;
  letter-spacing: 0.1em;
}
</style>
