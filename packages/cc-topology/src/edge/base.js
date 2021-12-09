/**
 * @author: wenyuan
 * @data: 2019/07/18
 * @repository: https://github.com/wenyuan
 * @description: 线公共方法
 */

import utils from '../utils'

export default {
  draw(cfg, group) {
    const { startPoint, endPoint } = cfg
    let style = cfg.style
    // combo 收缩后的连线样式
    style.stroke = '#A3B1BF'
    style.lineWidth = 2
    const keyShape = group.addShape('path', {
      className: 'edge-shape',
      attrs: {
        ...style,
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
