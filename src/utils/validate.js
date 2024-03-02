/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  return true
}

export function validPhone(str) {
  const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
  return str !== undefined && reg.test(str)
}
