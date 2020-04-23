export const isArray = a => Array.isArray(a)
export const isObject = o =>
  o === Object(o) && !isArray(o) && typeof o !== 'function'
