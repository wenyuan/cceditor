/**
 * @author: winyuan
 * @data: 2019/07/18
 * @repository: https://github.com/winyuan
 * @description: 线公共方法
 */

import utils from '../utils'

export default {
  draw(cfg, group) {
    const { startPoint, endPoint } = cfg
    const keyShape = group.addShape('path', {
      className: 'edge-shape',
      attrs: {
        ...cfg.style,
        path: [
          ['M', startPoint.x, startPoint.y],
          ['L', endPoint.x, endPoint.y]
        ]
      },
      name: 'edge-shape'
    })
    return keyShape
  },
  setState(name, value, item) {
    // 设置边状态
    utils.edge.setState(name, value, item)
  }
}
