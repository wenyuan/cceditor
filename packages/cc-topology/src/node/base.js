/**
 * @author: wenyuan
 * @data: 2019/07/05
 * @repository: https://github.com/wenyuan
 * @description: 节点基础方法
 */

import utils from '../utils'

export default {
  setState(name, value, item) {
    // 设置节点状态
    utils.node.setState(name, value, item)
    // 设置锚点状态
    utils.anchor.setState(name, value, item)
  },
  // 绘制后附加锚点
  afterDraw(cfg, group) {
    // 绘制锚点
    utils.anchor.draw(cfg, group)
  }
}
