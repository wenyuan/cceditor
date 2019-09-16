/**
 * 注册交互
 */
import dragAddEdge from './drag-add-edge';
import hoverEvent from './hover-event';
import clickEvent from './click-event';
import dragEvent from './drag-event';

const obj = {
  dragAddEdge,
  hoverEvent,
  clickEvent,
  dragEvent
};

export default {
  obj,
  register(G6) {
    Object.values(obj).map(item => {
      G6.registerBehavior(item.name, item.options);
    });
  }
};
