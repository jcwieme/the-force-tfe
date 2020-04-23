<template>
  <div class="history">
    <h3>{{ number }}</h3>
    <h4>{{ title }}</h4>
    <div v-for="(p, index) in text" :key="index" v-html="p"></div>
  </div>
</template>

<script>
export default {
  name: 'History',
  computed: {
    text: function() {
      return this.$store.state.movies[this.$route.params.id - 1].text.intro
    },
    number: function() {
      return this.$store.state.movies[this.$route.params.id - 1].number
    },
    title: function() {
      return this.$store.state.movies[
        this.$route.params.id - 1
      ].title.toUpperCase()
    },
  },
}
</script>

<style lang="scss">
.history {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  font-family: roboto, sans-serif;

  color: #ffe403;

  &__message {
    font-size: 24px;
    margin-bottom: 30px;
    color: white;
    text-align: center;
  }

  h3 {
    font-size: 24px;
  }

  h4 {
    margin-bottom: 30px;
    font-size: 34px;
  }

  div {
    width: 30vw;
    font-size: 24px;
    margin-bottom: 30px;
  }

  &__word {
    white-space: nowrap;
    position: relative;

    cursor: pointer;

    &:hover {
      &::before {
        height: 100%;
        transition: all 300ms ease;
      }
    }

    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 10px;
      background-color: rgba(255, 255, 255, 0.3);
      transition: all 300ms ease;
    }
  }
}
</style>
