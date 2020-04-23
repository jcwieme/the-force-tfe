<template>
  <ul class="choice">
    <router-link tag="li" to="movie/1/history" class="choice__movie">
      <div class="choice__title">
        <span class="choice__number">i</span>
        <div class="choice__reveal">
          <span class="choice__star choice__star--top"><span>StaR</span></span>
          <span class="choice__name">
            the phantom menace
          </span>
          <span class="choice__star choice__star--bottom"
            ><span>Wars</span></span
          >
        </div>
      </div>
    </router-link>
    <router-link tag="li" to="movie/2/history" class="choice__movie">
      <div class="choice__title">
        <span class="choice__number">ii</span>
        <div class="choice__reveal">
          <span class="choice__star choice__star--top"><span>StaR</span></span>
          <span class="choice__name">
            attack of the clones
          </span>
          <span class="choice__star choice__star--bottom"
            ><span>Wars</span></span
          >
        </div>
      </div>
    </router-link>
    <router-link tag="li" to="movie/3/history" class="choice__movie">
      <div class="choice__title">
        <span class="choice__number">iii</span>
        <div class="choice__reveal">
          <span class="choice__star choice__star--top"><span>StaR</span></span>
          <span class="choice__name">
            revenge of the sith
          </span>
          <span class="choice__star choice__star--bottom"
            ><span>Wars</span></span
          >
        </div>
      </div>
    </router-link>
    <router-link tag="li" to="movie/4/history" class="choice__movie">
      <div class="choice__title">
        <span class="choice__number">iv</span>
        <div class="choice__reveal">
          <span class="choice__star choice__star--top"><span>StaR</span></span>
          <span class="choice__name">
            a new hope
          </span>
          <span class="choice__star choice__star--bottom"
            ><span>Wars</span></span
          >
        </div>
      </div>
    </router-link>
    <router-link tag="li" to="movie/5/history" class="choice__movie">
      <div class="choice__title">
        <span class="choice__number">v</span>
        <div class="choice__reveal">
          <span class="choice__star choice__star--top"><span>StaR</span></span>
          <span class="choice__name">
            the empire strike back
          </span>
          <span class="choice__star choice__star--bottom"
            ><span>Wars</span></span
          >
        </div>
      </div>
    </router-link>
    <router-link tag="li" to="movie/6/history" class="choice__movie">
      <div class="choice__title">
        <span class="choice__number">vi</span>
        <div class="choice__reveal">
          <span class="choice__star choice__star--top"><span>StaR</span></span>
          <span class="choice__name">
            return of the jedi
          </span>
          <span class="choice__star choice__star--bottom"
            ><span>Wars</span></span
          >
        </div>
      </div>
    </router-link>
  </ul>
</template>

<script>
export default {
  name: 'Choice',
}
</script>

<style lang="scss">
.choice {
  color: #ffe403;
  font-family: star_jediregular;
  letter-spacing: 0.1em;
  text-decoration: none;
  list-style-type: none;
  margin: 0;
  padding: 0;

  height: 100vh;
  width: 100vw;

  display: table;
  table-layout: fixed;

  &__movie {
    display: table-cell;
    vertical-align: middle;
    position: relative;
    width: calc(100% / 6);
    height: 100%;
    transition: all 500ms ease;
    border-right: 3px solid #ffe403;

    overflow: hidden;

    cursor: pointer;

    &:last-child {
      border: none;
    }

    &:hover {
      width: 60%;

      .choice__number {
        color: #ffe403;
        opacity: 0;

        transition: color 200ms ease, opacity 500ms 200ms ease;
      }

      .choice__star--top,
      .choice__star--bottom {
        span {
          transform: translateY(0);
          opacity: 1;

          transition: transform 500ms 700ms ease, opacity 500ms 700ms ease;
        }
      }
      .choice__name {
        opacity: 1;

        transition: opacity 500ms 950ms ease;
      }
    }
  }

  &__title {
    width: 100%;
    height: 100%;

    position: relative;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  &__number {
    font-size: 140px;
    letter-spacing: 10px;
    color: #18181c;
    text-shadow: -1px 1px 0 #ffe403, 1px 1px 0 #ffe403, 1px -1px 0 #ffe403,
      -1px -1px 0 #ffe403;
  }

  &__reveal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;

    span {
      line-height: 1;
    }
  }

  &__star {
    font-size: 90px;
    color: #18181c;
    text-shadow: -1px 1px 0 #ffe403, 1px 1px 0 #ffe403, 1px -1px 0 #ffe403,
      -1px -1px 0 #ffe403;
    width: 115%;
    text-align: center;
    overflow-y: hidden;

    &--top {
      margin-bottom: 10px;

      span {
        display: block;
        transform: translateY(100%);
        opacity: 0;
      }
    }

    &--bottom {
      margin-top: -5px;

      span {
        display: block;
        transform: translateY(-100%);
        opacity: 0;
      }
    }
  }
  &__name {
    font-size: 18px;
    color: white;
    opacity: 0;
  }
}
</style>
