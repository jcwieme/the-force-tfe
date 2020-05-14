<template>
  <div class="numbers__column" :class="dataChart.class">
    <h3
      class="numbers__title"
      :class="[!checkNumbers ? 'numbers__title--fade' : '']"
    >
      {{ dataChart.title }}
    </h3>
    <div class="numbers__graph" :id="dataChart.id"></div>
    <div
      class="numbers__info"
      :class="[!checkNumbers ? 'numbers__info--fade' : '']"
    >
      <p class="numbers__total">
        {{ dataChart.value }}<span class="numbers__special">%</span>
      </p>
      <p>{{ dataChart.sub }}</p>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, computed } from '@vue/composition-api'
import * as d3 from 'd3'

export default defineComponent({
  name: 'd3Pie',
  props: {
    dataChart: {
      type: Object,
    },
  },
  setup(props, ctx) {
    const checkNumbers = computed(() => {
      return ctx.root.$store.state.checks.numbers
    })
    onMounted(() => {
      window.addEventListener('resize', onResize)
      draw()
    })
    const onResize = () => {
      if (window.innerWidth > 1024 && ctx.root.$route.name === 'Numbers') {
        if (document.querySelector(`#${props.dataChart.id}`))
          document.querySelector(`#${props.dataChart.id}`).innerHTML = ''
        draw()
      }
    }

    const draw = () => {
      var width = Math.min(window.innerHeight, window.innerWidth) * 0.25
      var height = Math.min(window.innerHeight, window.innerWidth) * 0.25
      var margin = 10
      var data = props.dataChart.data
        .slice()
        .sort((a, b) => d3.ascending(a.value, b.value))

      var radius = Math.min(width, height) / 2 - margin

      var svg = d3
        .select(`#${props.dataChart.id}`)
        .append('svg')
        .attr('width', width + margin)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

      var gDefs = svg.append('g').attr('id', 'gDefs')
      //Filter for the outside glow
      var filter = gDefs.append('filter').attr('id', 'glowPie')
      filter
        .append('feGaussianBlur')
        .attr('stdDeviation', '2')
        .attr('result', 'coloredBlur')
      var feMerge = filter.append('feMerge')
      feMerge.append('feMergeNode').attr('in', 'coloredBlur')
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

      var pie = d3
        .pie()
        .sort(null)
        .value(function(d) {
          return d.value.value
        })

      var arc = d3
        .arc()
        .innerRadius(Math.min(width, height) / 3.2)
        .outerRadius(radius)
        .padAngle(0.05)

      var data_ready = pie(d3.entries(data))
      var circles = svg
        .selectAll('portions')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('id', d => {
          return 'circle_' + d.data.value.name
        })
        .attr('class', () => {
          return 'portions pie_' + props.dataChart.id
        })
        .transition()
        .attr('fill', 'transparent')
        .attr('stroke', function(d) {
          return d.data.value.color
        })
        .style('stroke-width', '3')
        .style('stroke-alignement', 'inner')
        .style('opacity', 0.7)
        .attr('filter', 'url(#glowPie)')

      svg
        .append('text')
        .attr('id', `text_${props.dataChart.id}`)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('fill', 'white')
        .attr('opacity', 0)
        .attr('y', 20)
        .text('')

      svg
        .append('text')
        .attr('id', `number_${props.dataChart.id}`)
        .attr('text-anchor', 'middle')
        .attr('font-size', '28px')
        .attr('fill', 'white')
        .attr('opacity', 0)
        .attr('y', -5)
        .text('')

      if (!ctx.root.$store.state.checks.numbers) {
        circles
          .transition()
          .delay(function(d, i) {
            return 2400 + i * 500
          })
          .duration(500)
          .attrTween('d', function(d) {
            var i = d3.interpolate(d.startAngle + 0.1, d.endAngle)
            return function(t) {
              d.endAngle = i(t)
              return arc(d)
            }
          })
      } else {
        circles.attr('d', function(d) {
          return arc(d)
        })
      }

      d3.selectAll(`.pie_${props.dataChart.id}`).on('mouseover', d => {
        d3.select(`#text_${props.dataChart.id}`)
          .text(d.data.value.name)
          .transition()
          .attr('opacity', 1)

        d3.select(`#number_${props.dataChart.id}`)
          .text(d.data.value.value)
          .transition()
          .attr('opacity', 1)

        d3.select(`#circle_${d.data.value.name}`)
          .transition()
          .attr('fill', d.data.value.color)
      })

      d3.selectAll(`.pie_${props.dataChart.id}`).on('mouseout', d => {
        d3.select(`#text_${props.dataChart.id}`)
          .transition()
          .attr('opacity', 0)

        d3.select(`#number_${props.dataChart.id}`)
          .transition()
          .attr('opacity', 0)

        d3.select(`#circle_${d.data.value.name}`)
          .transition()
          .attr('fill', 'transparent')
      })
    }
    return {
      checkNumbers,
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

.portions {
  cursor: pointer;
}
</style>
