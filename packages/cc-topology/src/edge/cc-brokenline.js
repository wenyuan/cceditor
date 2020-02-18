/**
 * @author: winyuan
 * @data: 2019/10/22
 * @repository: https://github.com/winyuan
 * @description: 折线
 */

import base from './base'
import theme from '../theme'

/**
 * fix: 继承 polyline 在 G6 3.x 里面有bug
 * 现实现方法参考 https://g6.antv.vision/zh/examples/shape/customEdge#customPolyline
 */
export default {
  name: 'cc-brokenline',
  extendName: 'line',
  options: {
    ...base,
    getPath(points) {
      const startPoint = points[0]
      const endPoint = points[1]
      return [
        ['M', startPoint.x, startPoint.y],
        ['L', endPoint.x / 3 + 2 / 3 * startPoint.x, startPoint.y],
        ['L', endPoint.x / 3 + 2 / 3 * startPoint.x, endPoint.y],
        ['L', endPoint.x, endPoint.y]
      ]
    },
    getShapeStyle(cfg) {
      const { startPoint, endPoint } = cfg
      const controlPoints = this.getControlPoints(cfg)
      let points = [startPoint] // 添加起始点
      // 添加控制点
      if (controlPoints) {
        points = points.concat(controlPoints)
      }
      // 添加结束点
      points.push(endPoint)
      const path = this.getPath(points)
      const themeStyle = theme.defaultStyle // todo...先使用默认主题，后期可能增加其它风格的主体
      const style = {
        stroke: '#BBB',
        lineWidth: 1,
        path,
        startArrow: false,
        endArrow: false,
        ...themeStyle.edgeStyle.default
      }
      return style
    }
  }
}
