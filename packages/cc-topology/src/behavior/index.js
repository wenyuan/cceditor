/**
 * @author: winyuan
 * @data: 2019/07/16
 * @repository: https://github.com/winyuan
 * @description: register behaviors
 */

import dragAddEdge from './drag-add-edge'
import hoverEventEdit from './hover-event-edit'
import clickEventEdit from './click-event-edit'
import dragEventEdit from './drag-event-edit'
import keyupEventEdit from './keyup-event-edit'

const obj = {
  dragAddEdge,
  hoverEventEdit,
  clickEventEdit,
  dragEventEdit,
  keyupEventEdit
}

export default {
  obj,
  register(G6) {
    Object.values(obj).map(item => {
      G6.registerBehavior(item.name, item.options)
    })
  }
}
