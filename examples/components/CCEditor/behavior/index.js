/**
 * 注册交互
 */
import dragAddEdge from './drag-add-edge';
import hoverEventEdit from './hover-event-edit';
import clickEventEdit from './click-event-edit';
import dragEventEdit from './drag-event-edit';

const obj = {
  dragAddEdge,
  hoverEventEdit,
  clickEventEdit,
  dragEventEdit
};

export default {
  obj,
  register(G6) {
    Object.values(obj).map(item => {
      G6.registerBehavior(item.name, item.options);
    });
  }
};
