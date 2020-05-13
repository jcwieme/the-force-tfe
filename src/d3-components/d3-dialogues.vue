<template>
  <div id="my_dataviz" class="dialogue"></div>
</template>

<script>
import { defineComponent, onMounted, watch } from '@vue/composition-api'
import * as d3 from 'd3'

export default defineComponent({
  name: 'd3Dialogues',
  props: {
    DataDialogues: Object,
  },
  setup(props, ctx) {
    const setup = {
      margin: {
        top: 150,
        right: 150,
        bottom: 150,
        left: 150,
      },
      width: window.innerWidth,
      height: window.innerHeight,
      yellow: '#ffe403',
      circle: {
        originX: window.innerWidth / 2,
        originY: window.innerHeight / 2,
        radius: window.innerWidth / 7,
        angle: [],
        quarterAngle: Math.PI / 2,
        smallQuarterAngleRight: (93.5 * Math.PI) / 180,
        smallQuarterAngleLeft: (86.5 * Math.PI) / 180,
        distanceFromPoint: window.innerWidth / 48,
        smallCircleRadius: null,
        bigCircleRadius: null,
        angleLabels: null,
      },
      variables: {
        allNodes: null,
        cache: null,
        labels: null,
        subLabels: null,
        links: null,
        hoverLinks: null,
        defs: null,
        circles: null,
        defsAppends: null,
        grayscale: null,
        blur: null,
        initial: null,
        svg: null,
      },
    }

    onMounted(() => {
      generateGraph(props.DataDialogues)

      window.addEventListener('resize', onResize)

      watch(
        () => props.DataDialogues,
        newVal => {
          document.querySelector('#my_dataviz').innerHTML = ''
          setup.circle.angle = []
          generateGraph(newVal)
        }
      )
    })

    const generateGraph = data => {
      setup.circle.angleLabels = 90 / (data.nodes.length / 4)
      setup.variables.initial = d3
        .select('#my_dataviz')
        .append('svg')
        .attr('width', setup.width)
        .attr('height', setup.height)

      setup.variables.svg = setup.variables.initial
        .append('g')
        .attr('id', 'svg_container')

      initializeData(data)
    }

    const initializeData = data => {
      setup.variables.allNodes = data.nodes.map(function(d) {
        return d.name
      })

      // Loop on total character
      for (let i = 0; i < setup.variables.allNodes.length; i++) {
        // Add one more to add space
        setup.circle.angle.push(
          (i / (setup.variables.allNodes.length / 2)) * Math.PI
        )
      }

      var gDefs = setup.variables.initial.append('g').attr('id', 'gDefs')

      // set the defs group for the images
      setup.variables.defs = gDefs.append('svg:defs')

      // set up filter
      setup.variables.grayscale = gDefs
        .append('filter')
        .attr('id', 'desaturate')
        .append('feColorMatrix')
        .attr('type', 'matrix')
        .attr(
          'values',
          '0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0'
        )

      //Filter for the outside glow
      var filter = gDefs
        .append('filter')
        .attr('id', 'glow')
        .attr('filterUnits', 'userSpaceOnUse')
      filter
        .append('feGaussianBlur')
        .attr('stdDeviation', '3')
        .attr('result', 'coloredBlur')
      var feMerge = filter.append('feMerge')
      feMerge.append('feMergeNode').attr('in', 'coloredBlur')
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

      // add defs and img
      setup.variables.defsAppends = setup.variables.defs
        .selectAll('mynodes')
        .data(data.nodes)
        .enter()
        .append('pattern')
        .attr('id', d => {
          return d.id
        })
        .attr('height', '100%')
        .attr('width', '100%')
        .attr('patternContentUnits', 'objectBoundingBox')
        .append('image')
        .attr('height', 1)
        .attr('width', 1)
        .attr('preserveAspectRatio', 'none')
        .attr('xlink:href', d => {
          return d.img
        })

      draw(data)
    }

    const draw = data => {
      setup.circle.smallCircleRadius =
        setup.circle.radius / (setup.variables.allNodes.length * 0.5769230769)
      setup.circle.bigCircleRadius =
        setup.circle.radius / (setup.variables.allNodes.length * 0.3846153846)

      drawLabels(data)
      drawSubLabels(data)
      drawLinks(data)
      drawHoverLinks(data)
      drawImages(data)
    }

    const drawLabels = data => {
      var gLabels = setup.variables.svg.append('g').attr('id', 'gLabels')
      // set the labels
      setup.variables.labels = gLabels
        .selectAll('mylabels')
        .data(data.nodes)
        .enter()
        .append('text')
        .text(function(d) {
          let name = d.name.toLowerCase().split(' ')
          if (name.findIndex(el => el === 'imperial') === 0) {
            name[name.findIndex(el => el === 'imperial')] = 'imp.'
          }
          return name.join(' ')
        })
        .attr('id', d => {
          return '_text_' + d.id
        })
        .attr('x', 0)
        .attr('y', 0)
        .attr('transform', (d, i) => {
          let rotate = null

          if (i < setup.variables.allNodes.length / 4) {
            rotate = 'rotate(' + (0 + setup.circle.angleLabels * i) + ')'
          } else if (
            i >= setup.variables.allNodes.length / 4 &&
            i < setup.variables.allNodes.length / 2
          ) {
            rotate =
              'rotate(' +
              (-90 +
                setup.circle.angleLabels *
                  (i % (setup.variables.allNodes.length / 4))) +
              ')'
          } else if (
            i >= setup.variables.allNodes.length / 2 &&
            i < (setup.variables.allNodes.length / 4) * 3
          ) {
            rotate = 'rotate(' + (180 + setup.circle.angleLabels * i) + ')'
          } else {
            rotate =
              'rotate(' +
              (-90 +
                setup.circle.angleLabels *
                  (i % (setup.variables.allNodes.length / 4))) +
              ')'
          }

          return (
            'translate(' +
            (setup.circle.originX +
              (setup.circle.radius + setup.circle.distanceFromPoint) *
                Math.sin(setup.circle.angle[i] - setup.circle.quarterAngle)) +
            ' , ' +
            (setup.circle.originY -
              (setup.circle.radius + setup.circle.distanceFromPoint) *
                Math.cos(setup.circle.angle[i] - setup.circle.quarterAngle)) +
            '),' +
            rotate
          )
        })
        .style('text-anchor', (d, i) => {
          if (i < setup.variables.allNodes.length / 4) {
            return 'end'
          } else if (
            i >= setup.variables.allNodes.length / 4 &&
            i < (setup.variables.allNodes.length / 4) * 3
          ) {
            return 'start'
          } else {
            return 'end'
          }
        })
        .attr('class', (d, i) => {
          if (i === 0) {
            return 'dialogue__name dialogue__name--active'
          } else {
            return 'dialogue__name'
          }
        })
        .style('dominant-baseline', 'middle')

      setup.variables.labels.on('click', d => {
        change(d.id)
      })
    }

    const drawSubLabels = data => {
      var gSubLabels = setup.variables.svg.append('g').attr('id', 'gSubLabels')
      setup.variables.subLabels = gSubLabels
        .selectAll('mylabels')
        .data(data.nodes)
        .enter()
        .append('text')
        .text(function(d) {
          return d.number + ' lines'
        })
        .attr('x', 0)
        .attr('y', 0)
        .attr('transform', (d, i) => {
          let rotate = null
          let translateX = null
          let translateY = null

          if (i < setup.variables.allNodes.length / 4) {
            rotate = 'rotate(' + (0 + setup.circle.angleLabels * i) + ')'
            translateX =
              setup.circle.originX +
              (setup.circle.radius + setup.circle.distanceFromPoint) *
                Math.sin(
                  setup.circle.angle[i] - setup.circle.smallQuarterAngleRight
                )
            translateY =
              setup.circle.originY -
              (setup.circle.radius + setup.circle.distanceFromPoint) *
                Math.cos(
                  setup.circle.angle[i] - setup.circle.smallQuarterAngleRight
                )
          } else if (
            i >= setup.variables.allNodes.length / 4 &&
            i < setup.variables.allNodes.length / 2
          ) {
            rotate =
              'rotate(' +
              (-90 +
                setup.circle.angleLabels *
                  (i % (setup.variables.allNodes.length / 4))) +
              ')'
            translateX =
              setup.circle.originX +
              (setup.circle.radius + setup.circle.distanceFromPoint) *
                Math.sin(
                  setup.circle.angle[i] - setup.circle.smallQuarterAngleLeft
                )
            translateY =
              setup.circle.originY -
              (setup.circle.radius + setup.circle.distanceFromPoint) *
                Math.cos(
                  setup.circle.angle[i] - setup.circle.smallQuarterAngleLeft
                )
          } else if (
            i >= setup.variables.allNodes.length / 2 &&
            i < (setup.variables.allNodes.length / 4) * 3
          ) {
            rotate = 'rotate(' + (180 + setup.circle.angleLabels * i) + ')'
            translateX =
              setup.circle.originX +
              (setup.circle.radius + setup.circle.distanceFromPoint) *
                Math.sin(
                  setup.circle.angle[i] - setup.circle.smallQuarterAngleLeft
                )
            translateY =
              setup.circle.originY -
              (setup.circle.radius + setup.circle.distanceFromPoint) *
                Math.cos(
                  setup.circle.angle[i] - setup.circle.smallQuarterAngleLeft
                )
          } else {
            rotate =
              'rotate(' +
              (-90 +
                setup.circle.angleLabels *
                  (i % (setup.variables.allNodes.length / 4))) +
              ')'
            translateX =
              setup.circle.originX +
              (setup.circle.radius + setup.circle.distanceFromPoint) *
                Math.sin(
                  setup.circle.angle[i] - setup.circle.smallQuarterAngleRight
                )
            translateY =
              setup.circle.originY -
              (setup.circle.radius + setup.circle.distanceFromPoint) *
                Math.cos(
                  setup.circle.angle[i] - setup.circle.smallQuarterAngleRight
                )
          }
          return 'translate(' + translateX + ' , ' + translateY + '),' + rotate
        })
        .style('text-anchor', (d, i) => {
          if (i < setup.variables.allNodes.length / 4) {
            return 'end'
          } else if (
            i >= setup.variables.allNodes.length / 4 &&
            i < (setup.variables.allNodes.length / 4) * 3
          ) {
            return 'start'
          } else {
            return 'end'
          }
        })
        .attr('class', (d, i) => {
          if (i === 0) {
            return 'dialogue__subtitle dialogue__subtitle--active'
          } else {
            return 'dialogue__subtitle'
          }
        })
        .style('dominant-baseline', 'middle')
    }

    const drawLinks = data => {
      const maxNumber = Math.max(...data.links.map(s => s.number))

      var gLinks = setup.variables.svg.append('g').attr('id', 'gLinks')
      // set the links
      setup.variables.links = gLinks
        .selectAll('mylinks')
        .data(data.links)
        .enter()
        .append('path')
        .attr('d', d => {
          var startX =
            setup.circle.originX +
            setup.circle.radius *
              Math.sin(
                setup.circle.angle[d.source - 1] - setup.circle.quarterAngle
              )
          var startY =
            setup.circle.originY -
            setup.circle.radius *
              Math.cos(
                setup.circle.angle[d.source - 1] - setup.circle.quarterAngle
              )
          var endX =
            setup.circle.originX +
            setup.circle.radius *
              Math.sin(
                setup.circle.angle[d.target - 1] - setup.circle.quarterAngle
              )
          var endY =
            setup.circle.originY -
            setup.circle.radius *
              Math.cos(
                setup.circle.angle[d.target - 1] - setup.circle.quarterAngle
              )

          var cxEnd = 0
          var cyEnd = 0
          var cxStart = 0
          var cyStart = 0

          let b = Math.floor(setup.variables.allNodes.length / 4)
          let a = 0

          var sourceUpFour =
            d.source + setup.variables.allNodes.length / 4 >
            setup.variables.allNodes.length
              ? d.source +
                setup.variables.allNodes.length / 4 -
                setup.variables.allNodes.length
              : d.source + setup.variables.allNodes.length / 4
          var sourceDownFour =
            d.source - setup.variables.allNodes.length / 4 < 0
              ? d.source -
                setup.variables.allNodes.length / 4 +
                (setup.variables.allNodes.length + d.source)
              : d.source - setup.variables.allNodes.length / 4

          if (
            d.source + setup.variables.allNodes.length / 4 >
            setup.variables.allNodes.length
          ) {
            if (
              (d.target < d.source && d.target >= sourceDownFour) ||
              (d.target > d.source &&
                d.target <= setup.variables.allNodes.length) ||
              (d.target > 0 && d.target <= sourceUpFour)
            ) {
              a = d.target - d.source + setup.variables.allNodes.length

              a = Math.abs(a - b)

              if (a === b) {
                cxStart = setup.circle.originX
                cyStart = setup.circle.originY
                cxEnd = setup.circle.originX
                cyEnd = setup.circle.originY
              } else {
                cxEnd = endX + (b * (setup.circle.originX - endX)) / (a + b)
                cyEnd = endY + (b * (setup.circle.originY - endY)) / (a + b)
                cxStart =
                  startX + (b * (setup.circle.originX - startX)) / (a + b)
                cyStart =
                  startY + (b * (setup.circle.originY - startY)) / (a + b)
              }
            } else {
              cxStart = setup.circle.originX
              cyStart = setup.circle.originY
              cxEnd = setup.circle.originX
              cyEnd = setup.circle.originY
            }
          }

          if (d.source - setup.variables.allNodes.length / 4 < 0) {
            if (
              (d.target > d.source && d.target <= sourceUpFour) ||
              (d.target < d.source && d.target >= 0) ||
              (d.target <= setup.variables.allNodes.length &&
                d.target >= sourceDownFour)
            ) {
              a =
                Math.abs(d.target - d.source) > b
                  ? Math.abs(
                      d.target - d.source - setup.variables.allNodes.length
                    )
                  : Math.abs(d.target - d.source)

              a = Math.abs(a - b)

              if (a === b) {
                cxStart = setup.circle.originX
                cyStart = setup.circle.originY
                cxEnd = setup.circle.originX
                cyEnd = setup.circle.originY
              } else {
                cxEnd = endX + (b * (setup.circle.originX - endX)) / (a + b)
                cyEnd = endY + (b * (setup.circle.originY - endY)) / (a + b)
                cxStart =
                  startX + (b * (setup.circle.originX - startX)) / (a + b)
                cyStart =
                  startY + (b * (setup.circle.originY - startY)) / (a + b)
              }
            } else {
              cxStart = setup.circle.originX
              cyStart = setup.circle.originY
              cxEnd = setup.circle.originX
              cyEnd = setup.circle.originY
            }
          }

          if (
            d.source + setup.variables.allNodes.length / 4 <=
              setup.variables.allNodes.length &&
            d.source - setup.variables.allNodes.length / 4 >= 0
          ) {
            if (
              (d.target > d.source && d.target <= sourceUpFour) ||
              (d.target < d.source && d.target >= sourceDownFour)
            ) {
              a = Math.abs(d.target - d.source - b)

              a = Math.abs(a - b)

              if (a === b || a + 1 === b) {
                cxStart = setup.circle.originX
                cyStart = setup.circle.originY
                cxEnd = setup.circle.originX
                cyEnd = setup.circle.originY
              } else {
                cxEnd = endX + (b * (setup.circle.originX - endX)) / (a + b)
                cyEnd = endY + (b * (setup.circle.originY - endY)) / (a + b)
                cxStart =
                  startX + (b * (setup.circle.originX - startX)) / (a + b)
                cyStart =
                  startY + (b * (setup.circle.originY - startY)) / (a + b)
              }
            } else {
              cxStart = setup.circle.originX
              cyStart = setup.circle.originY
              cxEnd = setup.circle.originX
              cyEnd = setup.circle.originY
            }
          }

          return (
            'M ' +
            startX +
            ' ' +
            startY +
            ' C ' +
            cxStart +
            ' ' +
            cyStart +
            ', ' +
            cxEnd +
            ' ' +
            cyEnd +
            ', ' +
            endX +
            ' ' +
            endY
          )
        })
        .attr('id', d => {
          return '_link_' + d.id
        })
        .attr('data-number', d => {
          return d.number
        })
        .attr('class', d => {
          if (d.source === 1 || d.target === 1) {
            return 'dialogue__link dialogue__link--actif'
          } else {
            return 'dialogue__link'
          }
        })
        .style('fill', 'none')
        .attr('stroke', setup.yellow)
        .attr('stroke-opacity', d => {
          return d.source === 1 || d.target === 1 ? '1' : '0.1'
        })
        .attr('stroke-width', d => {
          return (d.number / maxNumber) * 5 + 1
        })
      // .attr('filter', d => {
      //   if (d.source === 1 || d.target === 1) {
      //     return 'url(#glow)'
      //   }
      // })
    }

    const drawHoverLinks = data => {
      var gHoverLinks = setup.variables.svg
        .append('g')
        .attr('id', 'gHoverLinks')
      setup.variables.hoverLinks = gHoverLinks
        .selectAll('mylinks')
        .data(data.links)
        .enter()
        .append('path')
        .attr('d', d => {
          var startX =
            setup.circle.originX +
            setup.circle.radius *
              Math.sin(
                setup.circle.angle[d.source - 1] - setup.circle.quarterAngle
              )
          var startY =
            setup.circle.originY -
            setup.circle.radius *
              Math.cos(
                setup.circle.angle[d.source - 1] - setup.circle.quarterAngle
              )
          var endX =
            setup.circle.originX +
            setup.circle.radius *
              Math.sin(
                setup.circle.angle[d.target - 1] - setup.circle.quarterAngle
              )
          var endY =
            setup.circle.originY -
            setup.circle.radius *
              Math.cos(
                setup.circle.angle[d.target - 1] - setup.circle.quarterAngle
              )

          var cxEnd = 0
          var cyEnd = 0
          var cxStart = 0
          var cyStart = 0

          let b = Math.floor(setup.variables.allNodes.length / 4)
          let a = 0

          var sourceUpFour =
            d.source + setup.variables.allNodes.length / 4 >
            setup.variables.allNodes.length
              ? d.source +
                setup.variables.allNodes.length / 4 -
                setup.variables.allNodes.length
              : d.source + setup.variables.allNodes.length / 4
          var sourceDownFour =
            d.source - setup.variables.allNodes.length / 4 < 0
              ? d.source -
                setup.variables.allNodes.length / 4 +
                (setup.variables.allNodes.length + d.source)
              : d.source - setup.variables.allNodes.length / 4

          if (
            d.source + setup.variables.allNodes.length / 4 >
            setup.variables.allNodes.length
          ) {
            if (
              (d.target < d.source && d.target >= sourceDownFour) ||
              (d.target > d.source &&
                d.target <= setup.variables.allNodes.length) ||
              (d.target > 0 && d.target <= sourceUpFour)
            ) {
              a = d.target - d.source + setup.variables.allNodes.length

              a = Math.abs(a - b)

              if (a === b) {
                cxStart = setup.circle.originX
                cyStart = setup.circle.originY
                cxEnd = setup.circle.originX
                cyEnd = setup.circle.originY
              } else {
                cxEnd = endX + (b * (setup.circle.originX - endX)) / (a + b)
                cyEnd = endY + (b * (setup.circle.originY - endY)) / (a + b)
                cxStart =
                  startX + (b * (setup.circle.originX - startX)) / (a + b)
                cyStart =
                  startY + (b * (setup.circle.originY - startY)) / (a + b)
              }
            } else {
              cxStart = setup.circle.originX
              cyStart = setup.circle.originY
              cxEnd = setup.circle.originX
              cyEnd = setup.circle.originY
            }
          }

          if (d.source - setup.variables.allNodes.length / 4 < 0) {
            if (
              (d.target > d.source && d.target <= sourceUpFour) ||
              (d.target < d.source && d.target >= 0) ||
              (d.target <= setup.variables.allNodes.length &&
                d.target >= sourceDownFour)
            ) {
              a =
                Math.abs(d.target - d.source) > b
                  ? Math.abs(
                      d.target - d.source - setup.variables.allNodes.length
                    )
                  : Math.abs(d.target - d.source)

              a = Math.abs(a - b)

              if (a === b) {
                cxStart = setup.circle.originX
                cyStart = setup.circle.originY
                cxEnd = setup.circle.originX
                cyEnd = setup.circle.originY
              } else {
                cxEnd = endX + (b * (setup.circle.originX - endX)) / (a + b)
                cyEnd = endY + (b * (setup.circle.originY - endY)) / (a + b)
                cxStart =
                  startX + (b * (setup.circle.originX - startX)) / (a + b)
                cyStart =
                  startY + (b * (setup.circle.originY - startY)) / (a + b)
              }
            } else {
              cxStart = setup.circle.originX
              cyStart = setup.circle.originY
              cxEnd = setup.circle.originX
              cyEnd = setup.circle.originY
            }
          }

          if (
            d.source + setup.variables.allNodes.length / 4 <=
              setup.variables.allNodes.length &&
            d.source - setup.variables.allNodes.length / 4 >= 0
          ) {
            if (
              (d.target > d.source && d.target <= sourceUpFour) ||
              (d.target < d.source && d.target >= sourceDownFour)
            ) {
              a = Math.abs(d.target - d.source - b)

              a = Math.abs(a - b)

              if (a === b || a + 1 === b) {
                cxStart = setup.circle.originX
                cyStart = setup.circle.originY
                cxEnd = setup.circle.originX
                cyEnd = setup.circle.originY
              } else {
                cxEnd = endX + (b * (setup.circle.originX - endX)) / (a + b)
                cyEnd = endY + (b * (setup.circle.originY - endY)) / (a + b)
                cxStart =
                  startX + (b * (setup.circle.originX - startX)) / (a + b)
                cyStart =
                  startY + (b * (setup.circle.originY - startY)) / (a + b)
              }
            } else {
              cxStart = setup.circle.originX
              cyStart = setup.circle.originY
              cxEnd = setup.circle.originX
              cyEnd = setup.circle.originY
            }
          }

          return (
            'M ' +
            startX +
            ' ' +
            startY +
            ' C ' +
            cxStart +
            ' ' +
            cyStart +
            ', ' +
            cxEnd +
            ' ' +
            cyEnd +
            ', ' +
            endX +
            ' ' +
            endY
          )
        })
        .attr('id', d => {
          return '_hover_link_' + d.id
        })
        .attr('data-number', d => {
          return d.number
        })
        .attr('class', d => {
          if (d.source === 1 || d.target === 1) {
            return 'dialogue__hoverLink dialogue__hoverLink--actif'
          } else {
            return 'dialogue__hoverLink'
          }
        })
        .style('fill', 'none')
        .attr('stroke', '#fff')
        .attr('stroke-opacity', '0')
        .attr('stroke-width', d => {
          return d.source === 1 || d.target === 1 ? '10' : '0'
        })

      // hover effect links
      setup.variables.hoverLinks.on('mouseover', d => {
        if (
          d3
            .select('#_hover_link_' + d.id)
            .classed('dialogue__hoverLink--actif')
        ) {
          document.querySelector('.number').style.top =
            d3.event.clientY - setup.circle.radius / 10 / 2 + 'px'
          document.querySelector('.number').style.left =
            d3.event.clientX - 5 - setup.circle.radius / 10 / 2 + 'px'
          document.querySelector('.number').innerHTML = d.number
          document.querySelector('.number').classList.add('number--actif')

          d3.select('#_hover_link_' + d.id).on('mousemove', () => {
            document.querySelector('.number').style.top =
              d3.event.clientY - setup.circle.radius / 10 / 2 + 'px'
            document.querySelector('.number').style.left =
              d3.event.clientX - 5 - setup.circle.radius / 10 / 2 + 'px'
          })
        }
      })

      // mouse out effect links
      setup.variables.hoverLinks.on('mouseout', d => {
        document.querySelector('.number').classList.remove('number--actif')
        if (d3.select('#_link_' + d.id).classed('dialogue__link--actif')) {
          d3.select('#_link_' + d.id).style('stroke', setup.yellow)
        }
      })
    }

    const drawImages = data => {
      var gCircles = setup.variables.svg.append('g').attr('id', 'gCircles')

      // add circles
      setup.variables.circles = gCircles
        .selectAll('mynodes')
        .data(data.nodes)
        .enter()
        .append('circle')
        .attr('id', d => {
          return '_circles_' + d.id
        })
        .attr('transform', (d, i) => {
          return (
            'translate(' +
            (setup.circle.originX -
              30 +
              setup.circle.radius *
                Math.sin(setup.circle.angle[i] - setup.circle.quarterAngle)) +
            ',' +
            (setup.circle.originY -
              30 -
              setup.circle.radius *
                Math.cos(setup.circle.angle[i] - setup.circle.quarterAngle)) +
            ')'
          )
        })
        .attr('cx', 30)
        .attr('cy', 30)
        .attr('r', (d, i) => {
          if (i === 0) {
            return setup.circle.bigCircleRadius
          } else {
            return setup.circle.smallCircleRadius
          }
        })
        .attr('class', (d, i) => {
          if (i === 0) {
            return '_circle_selected'
          }
        })
        .style('fill', d => {
          return 'url(#' + d.id + ')'
        })
        .style('filter', (d, i) => {
          if (i !== 0) {
            return 'url(#desaturate)'
          }
        })
        .style('stroke', setup.yellow)
        .style('stroke-width', (d, i) => {
          if (i === 0) {
            return '1'
          } else {
            return '0'
          }
        })

      // hover effects circles
      setup.variables.circles.on('mouseover', d => {
        d3.select('#_circles_' + d.id)
          .style('filter', null)
          .style('stroke-width', '1')

        document
          .querySelector(`#_text_${d.id}`)
          .classList.add('dialogue__name--hover')
      })

      // mouse out effect circles
      setup.variables.circles.on('mouseout', d => {
        d3.select('#_circles_' + d.id)
          .style('filter', 'url(#desaturate)')
          .style('stroke-width', '0')
        d3.select('._circle_selected')
          .style('filter', null)
          .style('stroke-width', '1')
        document
          .querySelector(`#_text_${d.id}`)
          .classList.remove('dialogue__name--hover')
      })

      // Click effect circles
      setup.variables.circles.on('click', d => {
        change(d.id)
      })
    }

    const onResize = () => {
      if (window.innerWidth > 1024 && ctx.root.$route.name === 'Dialogues') {
        setup.width = window.innerWidth
        setup.height = window.innerHeight
        setup.circle.originX = setup.width / 2
        setup.circle.originY = setup.height / 2
        setup.circle.radius = setup.width / 6
        setup.circle.distanceFromPoint = setup.width / 48

        if (document.getElementById('svg_container'))
          document.getElementById('svg_container').innerHTML = ''

        setup.variables.initial
          .attr('width', setup.width + setup.margin.left + setup.margin.right)
          .attr('height', setup.height + setup.margin.top + setup.margin.bottom)

        draw(props.DataDialogues)
      }
    }

    const change = id => {
      // move the circles
      setup.variables.circles
        .attr('r', (x, i) => {
          if (i === id - 1) {
            return setup.circle.bigCircleRadius
          } else {
            return setup.circle.smallCircleRadius
          }
        })
        .attr('class', (x, i) => {
          if (i === id - 1) {
            return '_circle_selected'
          }
        })
        .style('filter', (x, i) => {
          if (i !== id - 1) {
            return 'url(#desaturate)'
          }
        })
        .style('stroke-width', (x, i) => {
          if (i === id - 1) {
            return '1'
          } else {
            return '0'
          }
        })

      // move the labels
      setup.variables.labels.attr('class', (x, i) => {
        if (i === id - 1) {
          return 'dialogue__name dialogue__name--active'
        } else {
          return 'dialogue__name'
        }
      })

      // move the subLabels
      setup.variables.subLabels.attr('class', (x, i) => {
        if (i === id - 1) {
          return 'dialogue__subtitle dialogue__subtitle--active'
        } else {
          return 'dialogue__subtitle'
        }
      })

      // move the links
      setup.variables.links
        .attr('class', x => {
          if (x.source === id || x.target === id) {
            return 'dialogue__link--actif'
          }
        })
        .style('stroke-opacity', function(link_d) {
          return link_d.source === id || link_d.target === id ? '1' : '0.1'
        })
        .style('filter', x => {
          if (x.source === id || x.target === id) {
            return 'url(#glow)'
          }
        })

      // move the hover links
      setup.variables.hoverLinks
        .attr('class', x => {
          if (x.source === id || x.target === id) {
            return 'dialogue__hoverLink--actif'
          }
        })
        .style('stroke-width', function(link_d) {
          return link_d.source === id || link_d.target === id ? 10 : 0
        })

      d3.select('._selected').style('filter', null)
    }
  },
})
</script>

<style lang="scss">
#my_dataviz {
  z-index: 10;
}
.dialogue {
  font-family: star_jediregular;
  letter-spacing: 0.1em;
  font-size: calc(100vw / 168);
  * {
    user-select: none;
  }

  &__name {
    fill: #ffe403;
    opacity: 0.5;
    position: relative;
    cursor: default;

    &--hover {
      opacity: 1;
    }

    &--active {
      font-size: calc(100vw / 100);
      opacity: 1;
    }
  }

  &__subtitle {
    fill: #fff;
    opacity: 0;
    position: relative;
    cursor: default;

    &--active {
      opacity: 1;
    }
  }

  &__hoverLink {
    &--actif {
      cursor: none;
    }
  }

  &__link {
    pointer-events: none;

    &--actif {
      cursor: none;
      filter: url('#glow');
    }
  }

  circle {
    cursor: pointer;
    z-index: 10;
  }
}
</style>
