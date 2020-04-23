/* eslint-disable no-param-reassign */
import { computed } from '@vue/composition-api'
import { isObject } from '@/inc/utils'

/**
 * Return a function expect two param contains namespace and map.
 * It will normalize the namespace and then the param's function will handle the new namespace and the map.
 */
function normalizeNamespace(fn) {
  return (ctx, namespace, map) => {
    if (typeof namespace !== 'string') {
      map = namespace
      namespace = ''
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/'
    }

    return fn(ctx, namespace, map)
  }
}

/**
 * Validate whether given map is valid or not
 */
function isValidMap(map) {
  return Array.isArray(map) || isObject(map)
}

/**
 * Normalize the map
 * normalizeMap([1, 2]) => [ { key: 1, val: 1 }, { key: 2, val: 2 } ]
 * normalizeMap({a: 1, b: 2}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 } ]
 */
function normalizeMap(map) {
  if (!isValidMap(map)) {
    return []
  }

  return Array.isArray(map)
    ? map.map(key => ({ key, val: key }))
    : Object.keys(map).map(key => ({ key, val: map[key] }))
}

/**
 * Search a special module from store by namespace. if module not exist, print error message.
 */
function getModuleByNamespace(store, helper, namespace) {
  const module = store._modulesNamespaceMap[namespace]
  if (process.env.NODE_ENV !== 'production' && !module) {
    console.error(
      `[store/utils] module namespace not found in ${helper}(): ${namespace}`
    )
  }

  return module
}

/**
 * Reduce the code which written in Vue.js for getting the state.
 */
export const mapState = normalizeNamespace((ctx, namespace, states) => {
  const res = {}
  if (process.env.NODE_ENV !== 'production' && !isValidMap(states)) {
    console.error(
      '[store/utils] mapState: mapper parameter must be either an Array or an Object'
    )
  }
  normalizeMap(states).forEach(({ key, val }) => {
    res[key] = computed(() => {
      let { getters, state } = ctx.root.$store

      if (namespace) {
        const module = getModuleByNamespace(
          ctx.root.$store,
          'mapState',
          namespace
        )

        if (!module) {
          return null
        }

        ;({ getters, state } = module.context)
      }

      // TODO: check this vs ctx for call…
      return typeof val === 'function'
        ? val.call(ctx, state, getters)
        : state[val]
    })

    // Mark vuex getter for devtools
    // res[key].vuex = true
  })

  return res
})

/**
 * Reduce the code which written in Vue.js for committing the mutation
 */
export const mapMutations = normalizeNamespace((ctx, namespace, mutations) => {
  const res = {}
  if (process.env.NODE_ENV !== 'production' && !isValidMap(mutations)) {
    console.error(
      '[store/utils] mapMutations: mapper parameter must be either an Array or an Object'
    )
  }
  normalizeMap(mutations).forEach(({ key, val }) => {
    res[key] = function mappedMutation(...args) {
      // Get the commit method from store
      let { commit } = ctx.root.$store

      if (namespace) {
        const module = getModuleByNamespace(
          ctx.root.$store,
          'mapMutations',
          namespace
        )

        if (!module) {
          return null
        }

        ;({ commit } = module.context)
      }

      // TODO: check `this` vs `ctx` for call…
      /* eslint-disable indent */
      return typeof val === 'function'
        ? val.apply(ctx, [commit].concat(args))
        : commit.apply(ctx.root.$store, [val].concat(args))
      /* eslint-enable indent */
    }
  })

  return res
})

/**
 * Reduce the code which written in Vue.js for getting the getters
 */
export const mapGetters = normalizeNamespace((ctx, namespace, getters) => {
  const res = {}
  if (process.env.NODE_ENV !== 'production' && !isValidMap(getters)) {
    console.error(
      '[store/utils] mapGetters: mapper parameter must be either an Array or an Object'
    )
  }

  normalizeMap(getters).forEach(({ key, val }) => {
    // The namespace has been mutated by normalizeNamespace
    val = namespace + val
    res[key] = computed(() => {
      if (
        namespace &&
        !getModuleByNamespace(ctx.root.$store, 'mapGetters', namespace)
      ) {
        return null
      }

      if (
        process.env.NODE_ENV !== 'production' &&
        !(val in ctx.root.$store.getters)
      ) {
        console.error(`[store/utils] unknown getter: ${val}`)

        return null
      }

      return ctx.root.$store.getters[val]
    })

    // Mark vuex getter for devtools
    // res[key].vuex = true
  })

  return res
})

/**
 * Reduce the code which written in Vue.js for dispatch the action
 */
export const mapActions = normalizeNamespace((ctx, namespace, actions) => {
  const res = {}

  if (process.env.NODE_ENV !== 'production' && !isValidMap(actions)) {
    console.error(
      '[store/utils] mapActions: mapper parameter must be either an Array or an Object'
    )
  }
  normalizeMap(actions).forEach(({ key, val }) => {
    res[key] = function mappedAction(...args) {
      // Get dispatch function from store
      let { dispatch } = ctx.root.$store

      if (namespace) {
        const module = getModuleByNamespace(
          ctx.root.$store,
          'mapActions',
          namespace
        )

        if (!module) {
          return null
        }

        ;({ dispatch } = module.context)
      }

      // TODO: check this vs ctx for call…
      /* eslint-disable indent */
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(ctx.root.$store, [val].concat(args))
      /* eslint-enable indent */
    }
  })

  return res
})
