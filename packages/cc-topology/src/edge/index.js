/**
 * 注册边
 */

import ccLine from './cc-line'
import ccPolyline from './cc-polyline'
import ccCubic from './cc-cubic'

const obj = {
  ccLine,
  ccPolyline,
  ccCubic
}

export default function(G6) {
  Object.values(obj).map(item => {
    G6.registerEdge(item.name, item.options, item.extendName)
  })
}
