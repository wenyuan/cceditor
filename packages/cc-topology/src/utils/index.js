/**
 * @author: winyuan
 * @data: 2019/08/15
 * @repository: https://github.com/winyuan
 * @description: graph utils
 */

import node from './node'
import anchor from './anchor'
import edge from './edge'

/**
 * 比较两个对象的内容是否相同（两个对象的键值都相同）
 * @param obj1
 * @param obj2
 * @returns {*}
 */
const isObjectValueEqual = function(obj1, obj2) {
  let o1 = obj1 instanceof Object
  let o2 = obj2 instanceof Object
  // 不是对象的情况
  if (!o1 || !o2) {
    return obj1 === obj2
  }
  // 对象的属性（key值）个数不相等
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false
  }
  // 判断每个属性（如果属性值也是对象则需要递归）
  for (let attr in obj1) {
    let t1 = obj1[attr] instanceof Object
    let t2 = obj2[attr] instanceof Object
    if (t1 && t2) {
      return isObjectValueEqual(obj1[attr], obj2[attr])
    } else if (obj1[attr] !== obj2[attr]) {
      return false
    }
  }
  return true
}


/**
 * 生成uuid算法,碰撞率低于1/2^^122
 * @returns {string}
 */
const generateUUID = function() {
  let d = new Date().getTime()
  //  x 是 0-9 或 a-f 范围内的一个32位十六进制数
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}

export default {
  node,
  anchor,
  edge,
  // 通用工具类函数
  isObjectValueEqual,
  generateUUID
}
