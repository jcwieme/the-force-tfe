<template>
  <div id="my_dataviz" class="dialogue"></div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'd3Dialogues',
  props: {
    DataDialogues: Object,
  },
  data() {
    return {
      setupGraphic: {
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
      },
    }
  },
  watch: {
    DataDialogues: function(newVal) {
      document.querySelector('#my_dataviz').innerHTML = ''
      this.setupGraphic.circle.angle = []
      this.generateGraph(newVal)
    },
  },
  created() {
    window.addEventListener('resize', this.onResize)
  },
  mounted() {
    this.generateGraph(this.DataDialogues)
  },
  methods: {
    generateGraph(data) {
      this.setupGraphic.circle.angleLabels = 90 / (data.nodes.length / 4)
      this.setupGraphic.variables.initial = d3
        .select('#my_dataviz')
        .append('svg')
        .attr('width', this.setupGraphic.width)
        .attr('height', this.setupGraphic.height)

      this.setupGraphic.variables.svg = this.setupGraphic.variables.initial
        .append('g')
        .attr('id', 'svg_container')

      this.initializeData(data)
    },
    initializeData(data) {
      this.setupGraphic.variables.allNodes = data.nodes.map(function(d) {
        return d.name
      })

      this.setupGraphic.circle.smallCircleRadius =
        this.setupGraphic.circle.radius /
        (this.setupGraphic.variables.allNodes.length * 0.5769230769)
      this.setupGraphic.circle.bigCircleRadius =
        this.setupGraphic.circle.radius /
        (this.setupGraphic.variables.allNodes.length * 0.3846153846)

      // Loop on total character
      for (let i = 0; i < this.setupGraphic.variables.allNodes.length; i++) {
        // Add one more to add space
        this.setupGraphic.circle.angle.push(
          (i / (this.setupGraphic.variables.allNodes.length / 2)) * Math.PI
        )
      }

      var gDefs = this.setupGraphic.variables.initial
        .append('g')
        .attr('id', 'gDefs')

      // set the defs group for the images
      this.setupGraphic.variables.defs = gDefs.append('svg:defs')

      // set up filter
      this.setupGraphic.variables.grayscale = gDefs
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
      this.setupGraphic.variables.defsAppends = this.setupGraphic.variables.defs
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

      this.draw(data)
    },
    draw(data) {
      this.drawLabels(data)
      this.drawSubLabels(data)
      this.drawLinks(data)
      this.drawHoverLinks(data)
      this.drawImages(data)
    },
    drawLabels(data) {
      var gLabels = this.setupGraphic.variables.svg
        .append('g')
        .attr('id', 'gLabels')
      // set the labels
      this.setupGraphic.variables.labels = gLabels
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

          if (i < this.setupGraphic.variables.allNodes.length / 4) {
            rotate =
              'rotate(' + (0 + this.setupGraphic.circle.angleLabels * i) + ')'
          } else if (
            i >= this.setupGraphic.variables.allNodes.length / 4 &&
            i < this.setupGraphic.variables.allNodes.length / 2
          ) {
            rotate =
              'rotate(' +
              (-90 +
                this.setupGraphic.circle.angleLabels *
                  (i % (this.setupGraphic.variables.allNodes.length / 4))) +
              ')'
          } else if (
            i >= this.setupGraphic.variables.allNodes.length / 2 &&
            i < (this.setupGraphic.variables.allNodes.length / 4) * 3
          ) {
            rotate =
              'rotate(' + (180 + this.setupGraphic.circle.angleLabels * i) + ')'
          } else {
            rotate =
              'rotate(' +
              (-90 +
                this.setupGraphic.circle.angleLabels *
                  (i % (this.setupGraphic.variables.allNodes.length / 4))) +
              ')'
          }

          return (
            'translate(' +
            (this.setupGraphic.circle.originX +
              (this.setupGraphic.circle.radius +
                this.setupGraphic.circle.distanceFromPoint) *
                Math.sin(
                  this.setupGraphic.circle.angle[i] -
                    this.setupGraphic.circle.quarterAngle
                )) +
            ' , ' +
            (this.setupGraphic.circle.originY -
              (this.setupGraphic.circle.radius +
                this.setupGraphic.circle.distanceFromPoint) *
                Math.cos(
                  this.setupGraphic.circle.angle[i] -
                    this.setupGraphic.circle.quarterAngle
                )) +
            '),' +
            rotate
          )
        })
        .style('text-anchor', (d, i) => {
          if (i < this.setupGraphic.variables.allNodes.length / 4) {
            return 'end'
          } else if (
            i >= this.setupGraphic.variables.allNodes.length / 4 &&
            i < (this.setupGraphic.variables.allNodes.length / 4) * 3
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

      this.setupGraphic.variables.labels.on('click', d => {
        this.change(d.id)
      })
    },
    drawSubLabels(data) {
      var gSubLabels = this.setupGraphic.variables.svg
        .append('g')
        .attr('id', 'gSubLabels')
      this.setupGraphic.variables.subLabels = gSubLabels
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

          if (i < this.setupGraphic.variables.allNodes.length / 4) {
            rotate =
              'rotate(' + (0 + this.setupGraphic.circle.angleLabels * i) + ')'
            translateX =
              this.setupGraphic.circle.originX +
              (this.setupGraphic.circle.radius +
                this.setupGraphic.circle.distanceFromPoint) *
                Math.sin(
                  this.setupGraphic.circle.angle[i] -
                    this.setupGraphic.circle.smallQuarterAngleRight
                )
            translateY =
              this.setupGraphic.circle.originY -
              (this.setupGraphic.circle.radius +
                this.setupGraphic.circle.distanceFromPoint) *
                Math.cos(
                  this.setupGraphic.circle.angle[i] -
                    this.setupGraphic.circle.smallQuarterAngleRight
                )
          } else if (
            i >= this.setupGraphic.variables.allNodes.length / 4 &&
            i < this.setupGraphic.variables.allNodes.length / 2
          ) {
            rotate =
              'rotate(' +
              (-90 +
                this.setupGraphic.circle.angleLabels *
                  (i % (this.setupGraphic.variables.allNodes.length / 4))) +
              ')'
            translateX =
              this.setupGraphic.circle.originX +
              (this.setupGraphic.circle.radius +
                this.setupGraphic.circle.distanceFromPoint) *
                Math.sin(
                  this.setupGraphic.circle.angle[i] -
                    this.setupGraphic.circle.smallQuarterAngleLeft
                )
            translateY =
              this.setupGraphic.circle.originY -
              (this.setupGraphic.circle.radius +
                this.setupGraphic.circle.distanceFromPoint) *
                Math.cos(
                  this.setupGraphic.circle.angle[i] -
                    this.setupGraphic.circle.smallQuarterAngleLeft
                )
          } else if (
            i >= this.setupGraphic.variables.allNodes.length / 2 &&
            i < (this.setupGraphic.variables.allNodes.length / 4) * 3
          ) {
            rotate =
              'rotate(' + (180 + this.setupGraphic.circle.angleLabels * i) + ')'
            translateX =
              this.setupGraphic.circle.originX +
              (this.setupGraphic.circle.radius +
                this.setupGraphic.circle.distanceFromPoint) *
                Math.sin(
                  this.setupGraphic.circle.angle[i] -
                    this.setupGraphic.circle.smallQuarterAngleLeft
                )
            translateY =
              this.setupGraphic.circle.originY -
              (this.setupGraphic.circle.radius +
                this.setupGraphic.circle.distanceFromPoint) *
                Math.cos(
                  this.setupGraphic.circle.angle[i] -
                    this.setupGraphic.circle.smallQuarterAngleLeft
                )
          } else {
            rotate =
              'rotate(' +
              (-90 +
                this.setupGraphic.circle.angleLabels *
                  (i % (this.setupGraphic.variables.allNodes.length / 4))) +
              ')'
            translateX =
              this.setupGraphic.circle.originX +
              (this.setupGraphic.circle.radius +
                this.setupGraphic.circle.distanceFromPoint) *
                Math.sin(
                  this.setupGraphic.circle.angle[i] -
                    this.setupGraphic.circle.smallQuarterAngleRight
                )
            translateY =
              this.setupGraphic.circle.originY -
              (this.setupGraphic.circle.radius +
                this.setupGraphic.circle.distanceFromPoint) *
                Math.cos(
                  this.setupGraphic.circle.angle[i] -
                    this.setupGraphic.circle.smallQuarterAngleRight
                )
          }
          return 'translate(' + translateX + ' , ' + translateY + '),' + rotate
        })
        .style('text-anchor', (d, i) => {
          if (i < this.setupGraphic.variables.allNodes.length / 4) {
            return 'end'
          } else if (
            i >= this.setupGraphic.variables.allNodes.length / 4 &&
            i < (this.setupGraphic.variables.allNodes.length / 4) * 3
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
    },
    drawLinks(data) {
      var gLinks = this.setupGraphic.variables.svg
        .append('g')
        .attr('id', 'gLinks')
      // set the links
      this.setupGraphic.variables.links = gLinks
        .selectAll('mylinks')
        .data(data.links)
        .enter()
        .append('path')
        .attr('d', d => {
          var startX =
            this.setupGraphic.circle.originX +
            this.setupGraphic.circle.radius *
              Math.sin(
                this.setupGraphic.circle.angle[d.source - 1] -
                  this.setupGraphic.circle.quarterAngle
              )
          var startY =
            this.setupGraphic.circle.originY -
            this.setupGraphic.circle.radius *
              Math.cos(
                this.setupGraphic.circle.angle[d.source - 1] -
                  this.setupGraphic.circle.quarterAngle
              )
          var endX =
            this.setupGraphic.circle.originX +
            this.setupGraphic.circle.radius *
              Math.sin(
                this.setupGraphic.circle.angle[d.target - 1] -
                  this.setupGraphic.circle.quarterAngle
              )
          var endY =
            this.setupGraphic.circle.originY -
            this.setupGraphic.circle.radius *
              Math.cos(
                this.setupGraphic.circle.angle[d.target - 1] -
                  this.setupGraphic.circle.quarterAngle
              )
          var dx = endX - startX
          var dy = endY - startY
          var dr = Math.sqrt(dx * dx + dy * dy)

          var curveDirection = 0

          if (d.source + 30 < this.setupGraphic.variables.allNodes.length) {
            if (d.target > d.source && d.target <= d.source + 30) {
              curveDirection = 0
            } else {
              curveDirection = 1
            }
          } else {
            if (
              d.target < d.source &&
              d.target >=
                d.source + 30 - this.setupGraphic.variables.allNodes.length
            ) {
              curveDirection = 1
            } else {
              curveDirection = 0
            }
          }

          return (
            'M ' +
            startX +
            ' ' +
            startY +
            ' A ' +
            dr +
            ' ' +
            dr +
            ' 0 0 ' +
            curveDirection +
            ' ' +
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
        .attr('stroke', this.setupGraphic.yellow)
        .attr('stroke-opacity', d => {
          return d.source === 1 || d.target === 1 ? '1' : '0.2'
        })
        .attr('stroke-width', d => {
          return d.source === 1 || d.target === 1 ? '2' : '0.5'
        })
        .style('filter', d => {
          if (d.source === 1 || d.target === 1) {
            return 'url(#glow)'
          }
        })
    },
    drawHoverLinks(data) {
      var gHoverLinks = this.setupGraphic.variables.svg
        .append('g')
        .attr('id', 'gHoverLinks')
      this.setupGraphic.variables.hoverLinks = gHoverLinks
        .selectAll('mylinks')
        .data(data.links)
        .enter()
        .append('path')
        .attr('d', d => {
          var startX =
            this.setupGraphic.circle.originX +
            this.setupGraphic.circle.radius *
              Math.sin(
                this.setupGraphic.circle.angle[d.source - 1] -
                  this.setupGraphic.circle.quarterAngle
              )
          var startY =
            this.setupGraphic.circle.originY -
            this.setupGraphic.circle.radius *
              Math.cos(
                this.setupGraphic.circle.angle[d.source - 1] -
                  this.setupGraphic.circle.quarterAngle
              )
          var endX =
            this.setupGraphic.circle.originX +
            this.setupGraphic.circle.radius *
              Math.sin(
                this.setupGraphic.circle.angle[d.target - 1] -
                  this.setupGraphic.circle.quarterAngle
              )
          var endY =
            this.setupGraphic.circle.originY -
            this.setupGraphic.circle.radius *
              Math.cos(
                this.setupGraphic.circle.angle[d.target - 1] -
                  this.setupGraphic.circle.quarterAngle
              )
          var dx = endX - startX
          var dy = endY - startY
          var dr = Math.sqrt(dx * dx + dy * dy)

          var curveDirection = 0

          if (d.source + 30 < this.setupGraphic.variables.allNodes.length) {
            if (d.target > d.source && d.target <= d.source + 30) {
              curveDirection = 0
            } else {
              curveDirection = 1
            }
          } else {
            if (
              d.target < d.source &&
              d.target >=
                d.source + 30 - this.setupGraphic.variables.allNodes.length
            ) {
              curveDirection = 1
            } else {
              curveDirection = 0
            }
          }

          return (
            'M ' +
            startX +
            ' ' +
            startY +
            ' A ' +
            dr +
            ' ' +
            dr +
            ' 0 0 ' +
            curveDirection +
            ' ' +
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
      this.setupGraphic.variables.hoverLinks.on('mouseover', d => {
        if (
          d3
            .select('#_hover_link_' + d.id)
            .classed('dialogue__hoverLink--actif')
        ) {
          document.querySelector('.number').style.top =
            d3.event.clientY - this.setupGraphic.circle.radius / 10 / 2 + 'px'
          document.querySelector('.number').style.left =
            d3.event.clientX -
            5 -
            this.setupGraphic.circle.radius / 10 / 2 +
            'px'
          document.querySelector('.number').innerHTML = d.number
          document.querySelector('.number').classList.add('number--actif')

          d3.select('#_hover_link_' + d.id).on('mousemove', () => {
            document.querySelector('.number').style.top =
              d3.event.clientY - this.setupGraphic.circle.radius / 10 / 2 + 'px'
            document.querySelector('.number').style.left =
              d3.event.clientX -
              5 -
              this.setupGraphic.circle.radius / 10 / 2 +
              'px'
          })
        }
      })

      // mouse out effect links
      this.setupGraphic.variables.hoverLinks.on('mouseout', d => {
        document.querySelector('.number').classList.remove('number--actif')
        if (d3.select('#_link_' + d.id).classed('dialogue__link--actif')) {
          d3.select('#_link_' + d.id).style('stroke', this.setupGraphic.yellow)
        }
      })
    },
    drawImages(data) {
      var gCircles = this.setupGraphic.variables.svg
        .append('g')
        .attr('id', 'gCircles')

      // add circles
      this.setupGraphic.variables.circles = gCircles
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
            (this.setupGraphic.circle.originX -
              30 +
              this.setupGraphic.circle.radius *
                Math.sin(
                  this.setupGraphic.circle.angle[i] -
                    this.setupGraphic.circle.quarterAngle
                )) +
            ',' +
            (this.setupGraphic.circle.originY -
              30 -
              this.setupGraphic.circle.radius *
                Math.cos(
                  this.setupGraphic.circle.angle[i] -
                    this.setupGraphic.circle.quarterAngle
                )) +
            ')'
          )
        })
        .attr('cx', 30)
        .attr('cy', 30)
        .attr('r', (d, i) => {
          if (i === 0) {
            return this.setupGraphic.circle.bigCircleRadius
          } else {
            return this.setupGraphic.circle.smallCircleRadius
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
        .style('stroke', this.setupGraphic.yellow)
        .style('stroke-width', (d, i) => {
          if (i === 0) {
            return '1'
          } else {
            return '0'
          }
        })

      // hover effects circles
      this.setupGraphic.variables.circles.on('mouseover', d => {
        d3.select('#_circles_' + d.id)
          .style('filter', null)
          .style('stroke-width', '1')

        document
          .querySelector(`#_text_${d.id}`)
          .classList.add('dialogue__name--hover')
      })

      // mouse out effect circles
      this.setupGraphic.variables.circles.on('mouseout', d => {
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
      this.setupGraphic.variables.circles.on('click', d => {
        this.change(d.id)
      })
    },
    onResize() {
      if (window.innerWidth > 1024) {
        this.setupGraphic.width = window.innerWidth
        this.setupGraphic.height = window.innerHeight
        this.setupGraphic.circle.originX = this.setupGraphic.width / 2
        this.setupGraphic.circle.originY = this.setupGraphic.height / 2
        this.setupGraphic.circle.radius = this.setupGraphic.width / 6
        this.setupGraphic.circle.smallCircleRadius =
          this.setupGraphic.circle.radius / 30
        this.setupGraphic.circle.bigCircleRadius =
          this.setupGraphic.circle.radius / 20
        this.setupGraphic.circle.distanceFromPoint =
          this.setupGraphic.width / 48
        document.querySelector('.number').style.width =
          this.setupGraphic.circle.radius / 10 + 'px'
        document.querySelector('.number').style.height =
          this.setupGraphic.circle.radius / 10 + 'px'
        document.querySelector('.number').style.fontSize =
          this.setupGraphic.width / 129.5 + 'px'
        document.querySelector('.dialogue').style.fontSize =
          this.setupGraphic.width / 168 + 'px'
        document.querySelector('.dialogue__name--active').style.fontSize =
          this.setupGraphic.width / 100 + 'px'
        document.getElementById('svg_container').innerHTML = ''

        this.setupGraphic.variables.initial
          .attr(
            'width',
            this.setupGraphic.width +
              this.setupGraphic.margin.left +
              this.setupGraphic.margin.right
          )
          .attr(
            'height',
            this.setupGraphic.height +
              this.setupGraphic.margin.top +
              this.setupGraphic.margin.bottom
          )

        this.draw(this.DataDialogues)
      }
    },
    change(id) {
      // move the circles
      this.setupGraphic.variables.circles
        .attr('r', (x, i) => {
          if (i === id - 1) {
            return this.setupGraphic.circle.bigCircleRadius
          } else {
            return this.setupGraphic.circle.smallCircleRadius
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
      this.setupGraphic.variables.labels.attr('class', (x, i) => {
        if (i === id - 1) {
          return 'dialogue__name dialogue__name--active'
        } else {
          return 'dialogue__name'
        }
      })

      // move the subLabels
      this.setupGraphic.variables.subLabels.attr('class', (x, i) => {
        if (i === id - 1) {
          return 'dialogue__subtitle dialogue__subtitle--active'
        } else {
          return 'dialogue__subtitle'
        }
      })

      // move the links
      this.setupGraphic.variables.links
        .attr('class', x => {
          if (x.source === id || x.target === id) {
            return 'dialogue__link--actif'
          }
        })
        .style('stroke-opacity', function(link_d) {
          return link_d.source === id || link_d.target === id ? '1' : '0.2'
        })
        .style('stroke-width', function(link_d) {
          return link_d.source === id || link_d.target === id ? 2 : 1
        })
        .style('filter', x => {
          if (x.source === id || x.target === id) {
            return 'url(#glow)'
          }
        })

      // move the hover links
      this.setupGraphic.variables.hoverLinks
        .attr('class', x => {
          if (x.source === id || x.target === id) {
            return 'dialogue__hoverLink--actif'
          }
        })
        .style('stroke-width', function(link_d) {
          return link_d.source === id || link_d.target === id ? 10 : 0
        })

      d3.select('._selected').style('filter', null)
    },
  },
}
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
