<template>
  <div class="number">80</div>
</template>

<script>
export default {
  name: 'NumberBubble',
}
</script>

<style lang="scss">
.number {
  background-color: #18181c;
  font-size: calc(100vw / 129.5);
  border: #ffe403 2px solid;
  color: white;
  font-family: star_jediregular;
  border-radius: 50%;
  width: calc(100vw * 0.021);
  height: calc(100vw * 0.021);
  transform: scale(0);
  transition: transform 0.1s;

  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  text-align: center;
  vertical-align: center;

  position: absolute;
  top: 0;
  left: 0;

  z-index: 11;
  cursor: none;

  &--actif {
    transform: scale(1);
  }
}
</style>
