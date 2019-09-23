/**
 * edit模式
 * 悬浮交互
 */

export default {
  name: 'hover-event-edit',
  options: {
    getEvents() {
      return {
        'node:mouseover': 'onNodeHover',
        'node:mouseout': 'onNodeOut'
      }
    },
    onNodeHover(event) {
      let hoverNode = event.item
      hoverNode.setState('hover', true)
    },
    onNodeOut(event) {
      let hoverNode = event.item
      hoverNode.setState('hover', false)
    }
  }
}
