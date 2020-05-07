<template>
  <div class="choice__el">
    <span class="choice__number">{{ choice.number }}</span>
    <div class="choice__animation">
      <span class="choice__franchise choice__franchise--star">
        <span>StaR</span>
      </span>
      <span class="choice__title">
        {{ choice.title }}
      </span>
      <span class="choice__franchise choice__franchise--wars">
        <span>Wars</span>
      </span>
    </div>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'comp-choice',
  props: {
    choice: Object,
  },
})
</script>

<style lang="scss"></style>
