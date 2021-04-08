/**
 * @author: wenyuan
 * @data: 2019/08/15
 * @repository: https://github.com/wenyuan
 * @description: set node state
 */

import theme from '../../theme'

export default function(name, value, item) {
  const group = item.getContainer()
  const shape = group.get('children')[0] // 顺序根据 draw 时确定
  const themeStyle = theme.defaultStyle // todo...先使用默认主题，后期可能增加其它风格的主体
  if (name === 'active') {
    if (value) {
      shape.attr(themeStyle.nodeStyle.active)
    } else {
      shape.attr(themeStyle.nodeStyle.inactive)
    }
  } else if (name === 'selected') {
    if (value) {
      shape.attr(themeStyle.nodeStyle.selected)
    } else {
      shape.attr(themeStyle.nodeStyle.default)
    }
  }
}
