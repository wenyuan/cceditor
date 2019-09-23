/**
 * 注册节点
 */

import ccRect from './cc-rect'
import ccImage from './cc-image'

const obj = {
  ccRect,
  ccImage
}

export default function(G6) {
  Object.values(obj).map(item => {
    G6.registerNode(item.name, item.options, item.extendName)
  })
}
