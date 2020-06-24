/**
 * @author: winyuan
 * @data: 2019/07/16
 * @repository: https://github.com/winyuan
 * @description: edit mode: 悬浮交互
 */

export default {
  name: 'hover-event-edit',
  options: {
    getEvents () {
      return {
        'node:mouseover': 'onNodeHover',
        'node:mouseout': 'onNodeOut',
        'combo:mouseover': 'onComboHover',
        'combo:mouseout': 'onComboOut'
      }
    },
    onNodeHover (event) {
      let hoverNode = event.item
      hoverNode.setState('hover', true)
    },
    onNodeOut (event) {
      let hoverNode = event.item
      hoverNode.setState('hover', false)
    },
    onComboHover (event) {
      let hoverCombo = event.item
      hoverCombo.setState('hover', true)
    },
    onComboOut (event) {
      let hoverCombo = event.item
      hoverCombo.setState('hover', false)
    }
  }
}
