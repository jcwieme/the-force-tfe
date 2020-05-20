<template>
  <div class="numbers__column" :class="dataBar.other.class">
    <h3
      class="numbers__title"
      :class="[!checkNumbers ? 'numbers__title--fade' : '']"
    >
      {{ dataBar.other.title }}
    </h3>
    <div class="numbers__graph" :id="dataBar.id"></div>
    <div
      class="numbers__info"
      :class="[!checkNumbers ? 'numbers__info--fade' : '']"
    >
      <transition name="fade" mode="out-in">
        <p class="numbers__total" :key="value">
          {{ value ? value : dataBar.other.value }}
        </p>
      </transition>
      <transition name="fade" mode="out-in">
        <p :key="value">
          {{
            value !== dataBar.other.value && value !== null
              ? dataBar.other.global + ' in star wars movies'
              : dataBar.other.sub
          }}
        </p>
      </transition>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  ref,
  computed,
  watch,
} from '@vue/composition-api'
import * as d3 from 'd3'

export default defineComponent({
  name: 'd3Bar',
  props: {
    dataBar: {
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
        if (document.querySelector(`#${props.dataBar.id}`))
          document.querySelector(`#${props.dataBar.id}`).innerHTML = ''
        draw()
      }
    }
    const value = ref(null)
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
        .attr('id', d => {
          return 'bar_' + d.value.value
        })
        .attr('data-color', (d, i) => {
          if (i === 1) {
            return '#8D2426'
          } else {
            return '#196890'
          }
        })
        .attr('data-number', d => {
          return d.value.value
        })
        .attr('width', 0)
        .attr('y', d => {
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
      var text = svg
        .append('g')
        .call(d3.axisLeft(y))
        .selectAll('text')
        .style('fill', '#ffe403')
        .style('text-anchor', 'start')
        .style('font-size', window.innerWidth * 0.00655)
        .attr('transform', 'translate(' + marginRight + ',' + 0 + ')')
        .style('pointer-events', 'none')
        .style('opacity', 0)

      // Remove line
      svg.select('.domain').remove()

      var line = svg
        .append('rect')
        .attr('width', '1')
        .attr('y', 0)
        .attr('x', 0)
        .attr('height', 0)
        .attr('stroke', '#ffe403')
        .attr('stroke-width', '5')

      if (!ctx.root.$store.state.checks.numbers) {
        bar
          .transition()
          .duration(800)
          .attr('width', d => {
            return x(d.value.value)
          })
          .delay(function(d, i) {
            return 800 + i * 400
          })
        text
          .transition()
          .duration(400)
          .style('opacity', 1)
          .delay(2400)
        line
          .transition()
          .duration(400)
          .style('height', window.innerHeight * 0.25)
          .delay(400)
      } else {
        bar.attr('width', d => {
          return x(d.value.value)
        })
        text.style('opacity', 1)
        line.style('height', window.innerHeight * 0.25)
      }

      watch(
        () => ctx.root.$store.state.checks.numbers,
        newV => {
          if (newV) {
            bar.on('mouseover', d => {
              d3.select(`#bar_${d.value.value}`)
                .transition()
                .style(
                  'fill',
                  d3.select(`#bar_${d.value.value}`)._groups[0][0].dataset.color
                )

              value.value = d.value.value
            })

            bar.on('mouseout', d => {
              d3.select(`#bar_${d.value.value}`)
                .transition()
                .style('fill', 'transparent')
            })
          }
        }
      )
    }

    return {
      value,
      checkNumbers,
    }
  },
})
</script>

<style lang="scss">
.bar {
  cursor: pointer;
}
.tick {
  font-family: 'star_jediregular', sans-serif;
  letter-spacing: 0.1em;
}
</style>
