/**
 * Created by winyuan on 2019/10/14
 * Description: common utils
 */

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object} targetObj
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments: deepClone')
  }
  let targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(key => {
    if (source[key] && typeof source[key] === 'object') {
      targetObj[key] = deepClone(source[key])
    } else {
      targetObj[key] = source[key]
    }
  })
  return targetObj
}

/**
 * Randomly extract one or more elements from an array
 * If you want to use a perfect solution, use lodash's _.sample or _.sampleSize
 * @param {Array} arr
 * @param {number} count
 * @returns {Array} arr
 */
export function getRandomArrayElements(arr, count = 1) {
  if (count > arr.length) {
    throw new Error('error arguments: count is greater than length of array')
  }
  let shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random())
    temp = shuffled[index]
    shuffled[index] = shuffled[i]
    shuffled[i] = temp
  }
  return shuffled.slice(min)
}
