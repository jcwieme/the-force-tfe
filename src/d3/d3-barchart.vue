<template>
  <div class="bar">Coucou</div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import * as d3 from 'd3'

export default defineComponent({
  name: 'd3Bar',
  setup() {
    console.log(d3)
  },
})
</script>

<style lang="scss"></style>
