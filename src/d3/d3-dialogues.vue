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
    const setupGraphic = {
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
        radius: window.innerWidth / 6,
        angle: [],
        quarterAngle: Math.PI / 2,
        smallQuarterAngleRight: (92.5 * Math.PI) / 180,
        smallQuarterAngleLeft: (87.5 * Math.PI) / 180,
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
          setupGraphic.circle.angle = []
          generateGraph(newVal)
        }
      )
    })

    const generateGraph = data => {
      setupGraphic.circle.angleLabels = 90 / (data.nodes.length / 4)
      setupGraphic.variables.initial = d3
        .select('#my_dataviz')
        .append('svg')
        .attr('width', setupGraphic.width)
        .attr('height', setupGraphic.height)

      setupGraphic.variables.svg = setupGraphic.variables.initial
        .append('g')
        .attr('id', 'svg_container')

      initializeData(data)
    }

    const initializeData = data => {
      setupGraphic.variables.allNodes = data.nodes.map(function(d) {
        return d.name
      })

      // Loop on total character
      for (let i = 0; i < setupGraphic.variables.allNodes.length; i++) {
        // Add one more to add space
        setupGraphic.circle.angle.push(
          (i / (setupGraphic.variables.allNodes.length / 2)) * Math.PI
        )
      }

      var gDefs = setupGraphic.variables.initial.append('g').attr('id', 'gDefs')

      // set the defs group for the images
      setupGraphic.variables.defs = gDefs.append('svg:defs')

      // set up filter
      setupGraphic.variables.grayscale = gDefs
        .append('filter')
        .attr('id', 'desaturate')
        .append('feColorMatrix')
        .attr('type', 'matrix')
        .attr(
          'values',
          '0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0'
        )

      //Filter for the outside glow
      var filter = gDefs.append('filter').attr('id', 'glow')
      filter
        .append('feGaussianBlur')
        .attr('stdDeviation', '2')
        .attr('result', 'coloredBlur')
      var feMerge = filter.append('feMerge')
      feMerge.append('feMergeNode').attr('in', 'coloredBlur')
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

      // add defs and img
      setupGraphic.variables.defsAppends = setupGraphic.variables.defs
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
      setupGraphic.circle.smallCircleRadius =
        setupGraphic.circle.radius /
        (setupGraphic.variables.allNodes.length * 0.5769230769)
      setupGraphic.circle.bigCircleRadius =
        setupGraphic.circle.radius /
        (setupGraphic.variables.allNodes.length * 0.3846153846)

      drawLabels(data)
      drawSubLabels(data)
      drawLinks(data)
      drawHoverLinks(data)
      drawImages(data)
    }

    const drawLabels = data => {
      var gLabels = setupGraphic.variables.svg.append('g').attr('id', 'gLabels')
      // set the labels
      setupGraphic.variables.labels = gLabels
        .selectAll('mylabels')
        .data(data.nodes)
        .enter()
        .append('text')
        .text(function(d) {
          return d.name.toLowerCase()
        })
        .attr('id', d => {
          return '_text_' + d.id
        })
        .attr('x', 0)
        .attr('y', 0)
        .attr('transform', (d, i) => {
          let rotate = null

          if (i < setupGraphic.variables.allNodes.length / 4) {
            rotate = 'rotate(' + (0 + setupGraphic.circle.angleLabels * i) + ')'
          } else if (
            i >= setupGraphic.variables.allNodes.length / 4 &&
            i < setupGraphic.variables.allNodes.length / 2
          ) {
            rotate =
              'rotate(' +
              (-90 +
                setupGraphic.circle.angleLabels *
                  (i % (setupGraphic.variables.allNodes.length / 4))) +
              ')'
          } else if (
            i >= setupGraphic.variables.allNodes.length / 2 &&
            i < (setupGraphic.variables.allNodes.length / 4) * 3
          ) {
            rotate =
              'rotate(' + (180 + setupGraphic.circle.angleLabels * i) + ')'
          } else {
            rotate =
              'rotate(' +
              (-90 +
                setupGraphic.circle.angleLabels *
                  (i % (setupGraphic.variables.allNodes.length / 4))) +
              ')'
          }

          return (
            'translate(' +
            (setupGraphic.circle.originX +
              (setupGraphic.circle.radius +
                setupGraphic.circle.distanceFromPoint) *
                Math.sin(
                  setupGraphic.circle.angle[i] -
                    setupGraphic.circle.quarterAngle
                )) +
            ' , ' +
            (setupGraphic.circle.originY -
              (setupGraphic.circle.radius +
                setupGraphic.circle.distanceFromPoint) *
                Math.cos(
                  setupGraphic.circle.angle[i] -
                    setupGraphic.circle.quarterAngle
                )) +
            '),' +
            rotate
          )
        })
        .style('text-anchor', (d, i) => {
          if (i < setupGraphic.variables.allNodes.length / 4) {
            return 'end'
          } else if (
            i >= setupGraphic.variables.allNodes.length / 4 &&
            i < (setupGraphic.variables.allNodes.length / 4) * 3
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

      setupGraphic.variables.labels.on('click', d => {
        change(d.id)
      })
    }

    const drawSubLabels = data => {
      var gSubLabels = setupGraphic.variables.svg
        .append('g')
        .attr('id', 'gSubLabels')
      setupGraphic.variables.subLabels = gSubLabels
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

          if (i < setupGraphic.variables.allNodes.length / 4) {
            rotate = 'rotate(' + (0 + setupGraphic.circle.angleLabels * i) + ')'
            translateX =
              setupGraphic.circle.originX +
              (setupGraphic.circle.radius +
                setupGraphic.circle.distanceFromPoint) *
                Math.sin(
                  setupGraphic.circle.angle[i] -
                    setupGraphic.circle.smallQuarterAngleRight
                )
            translateY =
              setupGraphic.circle.originY -
              (setupGraphic.circle.radius +
                setupGraphic.circle.distanceFromPoint) *
                Math.cos(
                  setupGraphic.circle.angle[i] -
                    setupGraphic.circle.smallQuarterAngleRight
                )
          } else if (
            i >= setupGraphic.variables.allNodes.length / 4 &&
            i < setupGraphic.variables.allNodes.length / 2
          ) {
            rotate =
              'rotate(' +
              (-90 +
                setupGraphic.circle.angleLabels *
                  (i % (setupGraphic.variables.allNodes.length / 4))) +
              ')'
            translateX =
              setupGraphic.circle.originX +
              (setupGraphic.circle.radius +
                setupGraphic.circle.distanceFromPoint) *
                Math.sin(
                  setupGraphic.circle.angle[i] -
                    setupGraphic.circle.smallQuarterAngleLeft
                )
            translateY =
              setupGraphic.circle.originY -
              (setupGraphic.circle.radius +
                setupGraphic.circle.distanceFromPoint) *
                Math.cos(
                  setupGraphic.circle.angle[i] -
                    setupGraphic.circle.smallQuarterAngleLeft
                )
          } else if (
            i >= setupGraphic.variables.allNodes.length / 2 &&
            i < (setupGraphic.variables.allNodes.length / 4) * 3
          ) {
            rotate =
              'rotate(' + (180 + setupGraphic.circle.angleLabels * i) + ')'
            translateX =
              setupGraphic.circle.originX +
              (setupGraphic.circle.radius +
                setupGraphic.circle.distanceFromPoint) *
                Math.sin(
                  setupGraphic.circle.angle[i] -
                    setupGraphic.circle.smallQuarterAngleLeft
                )
            translateY =
              setupGraphic.circle.originY -
              (setupGraphic.circle.radius +
                setupGraphic.circle.distanceFromPoint) *
                Math.cos(
                  setupGraphic.circle.angle[i] -
                    setupGraphic.circle.smallQuarterAngleLeft
                )
          } else {
            rotate =
              'rotate(' +
              (-90 +
                setupGraphic.circle.angleLabels *
                  (i % (setupGraphic.variables.allNodes.length / 4))) +
              ')'
            translateX =
              setupGraphic.circle.originX +
              (setupGraphic.circle.radius +
                setupGraphic.circle.distanceFromPoint) *
                Math.sin(
                  setupGraphic.circle.angle[i] -
                    setupGraphic.circle.smallQuarterAngleRight
                )
            translateY =
              setupGraphic.circle.originY -
              (setupGraphic.circle.radius +
                setupGraphic.circle.distanceFromPoint) *
                Math.cos(
                  setupGraphic.circle.angle[i] -
                    setupGraphic.circle.smallQuarterAngleRight
                )
          }
          return 'translate(' + translateX + ' , ' + translateY + '),' + rotate
        })
        .style('text-anchor', (d, i) => {
          if (i < setupGraphic.variables.allNodes.length / 4) {
            return 'end'
          } else if (
            i >= setupGraphic.variables.allNodes.length / 4 &&
            i < (setupGraphic.variables.allNodes.length / 4) * 3
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

      var gLinks = setupGraphic.variables.svg.append('g').attr('id', 'gLinks')
      // set the links
      setupGraphic.variables.links = gLinks
        .selectAll('mylinks')
        .data(data.links)
        .enter()
        .append('path')
        .attr('d', d => {
          var startX =
            setupGraphic.circle.originX +
            setupGraphic.circle.radius *
              Math.sin(
                setupGraphic.circle.angle[d.source - 1] -
                  setupGraphic.circle.quarterAngle
              )
          var startY =
            setupGraphic.circle.originY -
            setupGraphic.circle.radius *
              Math.cos(
                setupGraphic.circle.angle[d.source - 1] -
                  setupGraphic.circle.quarterAngle
              )
          var endX =
            setupGraphic.circle.originX +
            setupGraphic.circle.radius *
              Math.sin(
                setupGraphic.circle.angle[d.target - 1] -
                  setupGraphic.circle.quarterAngle
              )
          var endY =
            setupGraphic.circle.originY -
            setupGraphic.circle.radius *
              Math.cos(
                setupGraphic.circle.angle[d.target - 1] -
                  setupGraphic.circle.quarterAngle
              )

          var cxEnd = 0
          var cyEnd = 0
          var cxStart = 0
          var cyStart = 0

          // Faire un système de ratio ? En fonction de sa place ? Comment calculer la place et comment avoir la distance la plus proche ?
          // Calculer la distance entre X et Cx Puis diviser cette distance par la place de d.target
          // ratio a:b
          // rloc = (x1 + b•(x2 - x1)/(a + b), y1 + b•(y2 - y1)/(a + b))
          // rloc X = (x1 + b•(x2 - x1)/(a + b)
          // rloc Y = y1 + b•(y2 - y1)/(a + b))

          let b = Math.floor(setupGraphic.variables.allNodes.length / 4)
          let a = 0

          var sourceUpFour =
            d.source + setupGraphic.variables.allNodes.length / 4 >
            setupGraphic.variables.allNodes.length
              ? d.source +
                setupGraphic.variables.allNodes.length / 4 -
                setupGraphic.variables.allNodes.length
              : d.source + setupGraphic.variables.allNodes.length / 4
          var sourceDownFour =
            d.source - setupGraphic.variables.allNodes.length / 4 < 0
              ? d.source -
                setupGraphic.variables.allNodes.length / 4 +
                (setupGraphic.variables.allNodes.length + d.source)
              : d.source - setupGraphic.variables.allNodes.length / 4

          if (
            d.source + setupGraphic.variables.allNodes.length / 4 >
            setupGraphic.variables.allNodes.length
          ) {
            if (
              (d.target < d.source && d.target >= sourceDownFour) ||
              (d.target > d.source &&
                d.target <= setupGraphic.variables.allNodes.length) ||
              (d.target > 0 && d.target <= sourceUpFour)
            ) {
              a = d.target - d.source + setupGraphic.variables.allNodes.length

              a = Math.abs(a - b)

              if (a === b) {
                cxStart = setupGraphic.circle.originX
                cyStart = setupGraphic.circle.originY
                cxEnd = setupGraphic.circle.originX
                cyEnd = setupGraphic.circle.originY
              } else {
                cxEnd =
                  endX + (b * (setupGraphic.circle.originX - endX)) / (a + b)
                cyEnd =
                  endY + (b * (setupGraphic.circle.originY - endY)) / (a + b)
                cxStart =
                  startX +
                  (b * (setupGraphic.circle.originX - startX)) / (a + b)
                cyStart =
                  startY +
                  (b * (setupGraphic.circle.originY - startY)) / (a + b)
              }
            } else {
              cxStart = setupGraphic.circle.originX
              cyStart = setupGraphic.circle.originY
              cxEnd = setupGraphic.circle.originX
              cyEnd = setupGraphic.circle.originY
            }
          }

          if (d.source - setupGraphic.variables.allNodes.length / 4 < 0) {
            if (
              (d.target > d.source && d.target <= sourceUpFour) ||
              (d.target < d.source && d.target >= 0) ||
              (d.target <= setupGraphic.variables.allNodes.length &&
                d.target >= sourceDownFour)
            ) {
              a =
                Math.abs(d.target - d.source) > b
                  ? Math.abs(
                      d.target -
                        d.source -
                        setupGraphic.variables.allNodes.length
                    )
                  : Math.abs(d.target - d.source)

              a = Math.abs(a - b)

              if (a === b) {
                cxStart = setupGraphic.circle.originX
                cyStart = setupGraphic.circle.originY
                cxEnd = setupGraphic.circle.originX
                cyEnd = setupGraphic.circle.originY
              } else {
                cxEnd =
                  endX + (b * (setupGraphic.circle.originX - endX)) / (a + b)
                cyEnd =
                  endY + (b * (setupGraphic.circle.originY - endY)) / (a + b)
                cxStart =
                  startX +
                  (b * (setupGraphic.circle.originX - startX)) / (a + b)
                cyStart =
                  startY +
                  (b * (setupGraphic.circle.originY - startY)) / (a + b)
              }
            } else {
              cxStart = setupGraphic.circle.originX
              cyStart = setupGraphic.circle.originY
              cxEnd = setupGraphic.circle.originX
              cyEnd = setupGraphic.circle.originY
            }
          }

          if (
            d.source + setupGraphic.variables.allNodes.length / 4 <=
              setupGraphic.variables.allNodes.length &&
            d.source - setupGraphic.variables.allNodes.length / 4 >= 0
          ) {
            if (
              (d.target > d.source && d.target <= sourceUpFour) ||
              (d.target < d.source && d.target >= sourceDownFour)
            ) {
              a = Math.abs(d.target - d.source - b)

              a = Math.abs(a - b)

              if (a === b || a + 1 === b) {
                cxStart = setupGraphic.circle.originX
                cyStart = setupGraphic.circle.originY
                cxEnd = setupGraphic.circle.originX
                cyEnd = setupGraphic.circle.originY
              } else {
                cxEnd =
                  endX + (b * (setupGraphic.circle.originX - endX)) / (a + b)
                cyEnd =
                  endY + (b * (setupGraphic.circle.originY - endY)) / (a + b)
                cxStart =
                  startX +
                  (b * (setupGraphic.circle.originX - startX)) / (a + b)
                cyStart =
                  startY +
                  (b * (setupGraphic.circle.originY - startY)) / (a + b)
              }
            } else {
              cxStart = setupGraphic.circle.originX
              cyStart = setupGraphic.circle.originY
              cxEnd = setupGraphic.circle.originX
              cyEnd = setupGraphic.circle.originY
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
        .attr('stroke', setupGraphic.yellow)
        .attr('stroke-opacity', d => {
          return d.source === 1 || d.target === 1 ? '1' : '0.1'
        })
        .attr('stroke-width', d => {
          return (d.number / maxNumber) * 5 + 1
        })
        .style('filter', d => {
          if (d.source === 1 || d.target === 1) {
            return 'url(#glow)'
          }
        })
    }

    const drawHoverLinks = data => {
      var gHoverLinks = setupGraphic.variables.svg
        .append('g')
        .attr('id', 'gHoverLinks')
      setupGraphic.variables.hoverLinks = gHoverLinks
        .selectAll('mylinks')
        .data(data.links)
        .enter()
        .append('path')
        .attr('d', d => {
          var startX =
            setupGraphic.circle.originX +
            setupGraphic.circle.radius *
              Math.sin(
                setupGraphic.circle.angle[d.source - 1] -
                  setupGraphic.circle.quarterAngle
              )
          var startY =
            setupGraphic.circle.originY -
            setupGraphic.circle.radius *
              Math.cos(
                setupGraphic.circle.angle[d.source - 1] -
                  setupGraphic.circle.quarterAngle
              )
          var endX =
            setupGraphic.circle.originX +
            setupGraphic.circle.radius *
              Math.sin(
                setupGraphic.circle.angle[d.target - 1] -
                  setupGraphic.circle.quarterAngle
              )
          var endY =
            setupGraphic.circle.originY -
            setupGraphic.circle.radius *
              Math.cos(
                setupGraphic.circle.angle[d.target - 1] -
                  setupGraphic.circle.quarterAngle
              )

          var cxEnd = 0
          var cyEnd = 0
          var cxStart = 0
          var cyStart = 0

          let b = Math.floor(setupGraphic.variables.allNodes.length / 4)
          let a = 0

          var sourceUpFour =
            d.source + setupGraphic.variables.allNodes.length / 4 >
            setupGraphic.variables.allNodes.length
              ? d.source +
                setupGraphic.variables.allNodes.length / 4 -
                setupGraphic.variables.allNodes.length
              : d.source + setupGraphic.variables.allNodes.length / 4
          var sourceDownFour =
            d.source - setupGraphic.variables.allNodes.length / 4 < 0
              ? d.source -
                setupGraphic.variables.allNodes.length / 4 +
                (setupGraphic.variables.allNodes.length + d.source)
              : d.source - setupGraphic.variables.allNodes.length / 4

          if (
            d.source + setupGraphic.variables.allNodes.length / 4 >
            setupGraphic.variables.allNodes.length
          ) {
            if (
              (d.target < d.source && d.target >= sourceDownFour) ||
              (d.target > d.source &&
                d.target <= setupGraphic.variables.allNodes.length) ||
              (d.target > 0 && d.target <= sourceUpFour)
            ) {
              a = d.target - d.source + setupGraphic.variables.allNodes.length

              a = Math.abs(a - b)

              if (a === b) {
                cxStart = setupGraphic.circle.originX
                cyStart = setupGraphic.circle.originY
                cxEnd = setupGraphic.circle.originX
                cyEnd = setupGraphic.circle.originY
              } else {
                cxEnd =
                  endX + (b * (setupGraphic.circle.originX - endX)) / (a + b)
                cyEnd =
                  endY + (b * (setupGraphic.circle.originY - endY)) / (a + b)
                cxStart =
                  startX +
                  (b * (setupGraphic.circle.originX - startX)) / (a + b)
                cyStart =
                  startY +
                  (b * (setupGraphic.circle.originY - startY)) / (a + b)
              }
            } else {
              cxStart = setupGraphic.circle.originX
              cyStart = setupGraphic.circle.originY
              cxEnd = setupGraphic.circle.originX
              cyEnd = setupGraphic.circle.originY
            }
          }

          if (d.source - setupGraphic.variables.allNodes.length / 4 < 0) {
            if (
              (d.target > d.source && d.target <= sourceUpFour) ||
              (d.target < d.source && d.target >= 0) ||
              (d.target <= setupGraphic.variables.allNodes.length &&
                d.target >= sourceDownFour)
            ) {
              a =
                Math.abs(d.target - d.source) > b
                  ? Math.abs(
                      d.target -
                        d.source -
                        setupGraphic.variables.allNodes.length
                    )
                  : Math.abs(d.target - d.source)

              a = Math.abs(a - b)

              if (a === b) {
                cxStart = setupGraphic.circle.originX
                cyStart = setupGraphic.circle.originY
                cxEnd = setupGraphic.circle.originX
                cyEnd = setupGraphic.circle.originY
              } else {
                cxEnd =
                  endX + (b * (setupGraphic.circle.originX - endX)) / (a + b)
                cyEnd =
                  endY + (b * (setupGraphic.circle.originY - endY)) / (a + b)
                cxStart =
                  startX +
                  (b * (setupGraphic.circle.originX - startX)) / (a + b)
                cyStart =
                  startY +
                  (b * (setupGraphic.circle.originY - startY)) / (a + b)
              }
            } else {
              cxStart = setupGraphic.circle.originX
              cyStart = setupGraphic.circle.originY
              cxEnd = setupGraphic.circle.originX
              cyEnd = setupGraphic.circle.originY
            }
          }

          if (
            d.source + setupGraphic.variables.allNodes.length / 4 <=
              setupGraphic.variables.allNodes.length &&
            d.source - setupGraphic.variables.allNodes.length / 4 >= 0
          ) {
            if (
              (d.target > d.source && d.target <= sourceUpFour) ||
              (d.target < d.source && d.target >= sourceDownFour)
            ) {
              a = Math.abs(d.target - d.source - b)

              a = Math.abs(a - b)

              if (a === b || a + 1 === b) {
                cxStart = setupGraphic.circle.originX
                cyStart = setupGraphic.circle.originY
                cxEnd = setupGraphic.circle.originX
                cyEnd = setupGraphic.circle.originY
              } else {
                cxEnd =
                  endX + (b * (setupGraphic.circle.originX - endX)) / (a + b)
                cyEnd =
                  endY + (b * (setupGraphic.circle.originY - endY)) / (a + b)
                cxStart =
                  startX +
                  (b * (setupGraphic.circle.originX - startX)) / (a + b)
                cyStart =
                  startY +
                  (b * (setupGraphic.circle.originY - startY)) / (a + b)
              }
            } else {
              cxStart = setupGraphic.circle.originX
              cyStart = setupGraphic.circle.originY
              cxEnd = setupGraphic.circle.originX
              cyEnd = setupGraphic.circle.originY
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
      setupGraphic.variables.hoverLinks.on('mouseover', d => {
        if (
          d3
            .select('#_hover_link_' + d.id)
            .classed('dialogue__hoverLink--actif')
        ) {
          document.querySelector('.number').style.top =
            d3.event.clientY - setupGraphic.circle.radius / 10 / 2 + 'px'
          document.querySelector('.number').style.left =
            d3.event.clientX - 5 - setupGraphic.circle.radius / 10 / 2 + 'px'
          document.querySelector('.number').innerHTML = d.number
          document.querySelector('.number').classList.add('number--actif')

          d3.select('#_hover_link_' + d.id).on('mousemove', () => {
            document.querySelector('.number').style.top =
              d3.event.clientY - setupGraphic.circle.radius / 10 / 2 + 'px'
            document.querySelector('.number').style.left =
              d3.event.clientX - 5 - setupGraphic.circle.radius / 10 / 2 + 'px'
          })
        }
      })

      // mouse out effect links
      setupGraphic.variables.hoverLinks.on('mouseout', d => {
        document.querySelector('.number').classList.remove('number--actif')
        if (d3.select('#_link_' + d.id).classed('dialogue__link--actif')) {
          d3.select('#_link_' + d.id).style('stroke', setupGraphic.yellow)
        }
      })
    }

    const drawImages = data => {
      var gCircles = setupGraphic.variables.svg
        .append('g')
        .attr('id', 'gCircles')

      // add circles
      setupGraphic.variables.circles = gCircles
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
            (setupGraphic.circle.originX -
              30 +
              setupGraphic.circle.radius *
                Math.sin(
                  setupGraphic.circle.angle[i] -
                    setupGraphic.circle.quarterAngle
                )) +
            ',' +
            (setupGraphic.circle.originY -
              30 -
              setupGraphic.circle.radius *
                Math.cos(
                  setupGraphic.circle.angle[i] -
                    setupGraphic.circle.quarterAngle
                )) +
            ')'
          )
        })
        .attr('cx', 30)
        .attr('cy', 30)
        .attr('r', (d, i) => {
          if (i === 0) {
            return setupGraphic.circle.bigCircleRadius
          } else {
            return setupGraphic.circle.smallCircleRadius
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
        .style('stroke', setupGraphic.yellow)
        .style('stroke-width', (d, i) => {
          if (i === 0) {
            return '1'
          } else {
            return '0'
          }
        })

      // hover effects circles
      setupGraphic.variables.circles.on('mouseover', d => {
        d3.select('#_circles_' + d.id)
          .style('filter', null)
          .style('stroke-width', '1')

        document
          .querySelector(`#_text_${d.id}`)
          .classList.add('dialogue__name--hover')
      })

      // mouse out effect circles
      setupGraphic.variables.circles.on('mouseout', d => {
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
      setupGraphic.variables.circles.on('click', d => {
        change(d.id)
      })
    }

    const onResize = () => {
      if (window.innerWidth > 1024 && ctx.root.$route.name === 'Dialogues') {
        setupGraphic.width = window.innerWidth
        setupGraphic.height = window.innerHeight
        setupGraphic.circle.originX = setupGraphic.width / 2
        setupGraphic.circle.originY = setupGraphic.height / 2
        setupGraphic.circle.radius = setupGraphic.width / 6
        setupGraphic.circle.distanceFromPoint = setupGraphic.width / 48

        document.getElementById('svg_container').innerHTML = ''

        setupGraphic.variables.initial
          .attr(
            'width',
            setupGraphic.width +
              setupGraphic.margin.left +
              setupGraphic.margin.right
          )
          .attr(
            'height',
            setupGraphic.height +
              setupGraphic.margin.top +
              setupGraphic.margin.bottom
          )

        draw(props.DataDialogues)
      }
    }

    const change = id => {
      // move the circles
      setupGraphic.variables.circles
        .attr('r', (x, i) => {
          if (i === id - 1) {
            return setupGraphic.circle.bigCircleRadius
          } else {
            return setupGraphic.circle.smallCircleRadius
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
      setupGraphic.variables.labels.attr('class', (x, i) => {
        if (i === id - 1) {
          return 'dialogue__name dialogue__name--active'
        } else {
          return 'dialogue__name'
        }
      })

      // move the subLabels
      setupGraphic.variables.subLabels.attr('class', (x, i) => {
        if (i === id - 1) {
          return 'dialogue__subtitle dialogue__subtitle--active'
        } else {
          return 'dialogue__subtitle'
        }
      })

      // move the links
      setupGraphic.variables.links
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
      setupGraphic.variables.hoverLinks
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
    }
  }

  circle {
    cursor: pointer;
    z-index: 10;
  }
}
</style>
