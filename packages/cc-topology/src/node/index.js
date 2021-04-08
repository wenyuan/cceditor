/**
 * @author: wenyuan
 * @data: 2019/07/05
 * @repository: https://github.com/wenyuan
 * @description: register nodes
 */

import ccRect from './cc-rect'
import ccImage from './cc-image'

const obj = {
  ccRect,
  ccImage
}

export default {
  obj,
  register(G6) {
    Object.values(obj).map(item => {
      G6.registerNode(item.name, item.options, item.extendName)
    })
  }
}
