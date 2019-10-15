/**
 * @author: winyuan
 * @data: 2019/07/05
 * @repository: https://github.com/winyuan
 * @description: 矩形节点
 */

import base from './base'
import theme from '../theme'

export default {
  name: 'cc-rect',
  extendName: 'rect',
  options: {
    ...base,
    getShapeStyle(cfg) {
      const size = this.getSize(cfg) || [48, 48]
      const width = size[0]
      const height = size[1]
      const themeStyle = theme.defaultStyle // todo...先使用默认主题，后期可能增加其它风格的主体
      const style = {
        x: 0 - width / 2,
        y: 0 - height / 2,
        width: width,
        height: height,
        ...themeStyle.nodeStyle.default
      }
      return style
    }
  }
}
