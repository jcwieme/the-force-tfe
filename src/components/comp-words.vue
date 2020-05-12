<template>
  <transition name="fade">
    <div class="words__popup">
      <ul class="words__speakers" :class="`words__speakers--${columns}`">
        <li
          v-for="(speaker, index) in dataSpeakers.from.slice(0, sliceN)"
          :key="index"
        >
          <div class="words__row">
            <img :src="speaker.path" alt="def" />
            <div class="words__data">
              <p>{{ speaker.character.toLowerCase() }}</p>
              <sub>{{ speaker.number }} times</sub>
            </div>
          </div>
        </li>
        <li v-if="dataSpeakers.from.length > sliceN" class="words__popup--more">
          <div class="words__row">
            <span> +{{ dataSpeakers.from.length - sliceN }} </span>
            <div class="words__data">
              <p>{{ dataSpeakers.from.length - sliceN }} others</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'comp-words',
  props: {
    dataSpeakers: Object,
  },
  setup(props) {
    const sliceN = ref(0)
    const columns = computed(() => {
      if (props.dataSpeakers.from.length >= 20) {
        return '2'
      } else {
        return Math.ceil(props.dataSpeakers.from.length / 10)
      }
    })

    if (
      props.dataSpeakers.from.length % 2 === 1 &&
      props.dataSpeakers.from.length >= 10
    ) {
      sliceN.value = props.dataSpeakers.from.length - 2
    } else {
      sliceN.value = props.dataSpeakers.from.length
    }

    if (props.dataSpeakers.from.length >= 20) {
      sliceN.value = 19
    }

    console.log(sliceN.value)

    return {
      columns,
      sliceN,
    }
  },
})
</script>

<style lang="scss">
.words {
  &__popup {
    position: fixed;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    background-color: #18181c;
    border: 3px solid #ffe403;

    pointer-events: none;

    font-size: 1.6rem;
    line-height: 1;

    sub {
      font-family: 'roboto';
      color: white;
      font-size: 1.1rem;
    }

    &--more {
      span {
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
        background-color: rgba(24, 24, 28, 0.9);
        line-height: 1;

        display: flex;
        align-items: center;
        justify-content: center;

        font-family: 'roboto-black';
        font-size: 1.2rem;
        color: white;

        border: 1px solid #ffe403;
      }
    }
  }
  &__row {
    display: flex;
    align-items: center;

    img {
      border-radius: 50%;
      width: 3rem; // 30px
      height: 3rem;

      border: 1px solid #ffe403;
    }
  }

  &__speakers {
    padding: 4rem;
    list-style: none;

    li {
      margin-bottom: 1rem;
      height: 32px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    &--2 {
      columns: 2;
    }

    &--3 {
      columns: 3;
    }
  }

  &__data {
    margin-left: 1rem;

    display: flex;
    flex-direction: column;

    p {
      font-family: 'star_jediregular';
      letter-spacing: 0.1em;
      color: #ffe403;
      margin-bottom: 5px;
    }
  }
}
</style>
