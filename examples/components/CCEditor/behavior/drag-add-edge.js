/**
 * edit模式
 * 通过拖拽节点上的锚点添加连线
 */
import G6 from '@antv/g6';
import theme from '../theme';

export default {
  name: 'drag-add-edge',
  options: {
    getEvents() {
      return {
        'node:mousedown': 'onNodeMousedown',
        'node:mouseup': 'onNodeMouseup',
        'edge:mouseup': 'onEdgeMouseup',
        'mousemove': 'onMousemove'
      };
    },
    onNodeMousedown(event) {
      let self = this;
      // 交互过程中的信息
      self.evtInfo = {
        action: null,
        node: event.item,
        target: event.target
      };
      if (self.evtInfo.target && self.evtInfo.target._attrs.name) {
        // todo...未来可能针对锚点增加其它功能(例如拖拽调整大小)
        switch (self.evtInfo.target._attrs.name) {
          case 'anchor':
            self.evtInfo.action = 'drawEdge';
            break;
        }
      } else {
        self.evtInfo.action = 'dragNode';
      }
      if (self.evtInfo && self.evtInfo.action) {
        self[self.evtInfo.action].start.call(self, event);
      }
    },
    onNodeMouseup(event) {
      let self = this;
      if (self.evtInfo && self.evtInfo.action) {
        self[self.evtInfo.action].stop.call(self, event);
      }
    },
    onEdgeMouseup(event) {
      let self = this;
      if (self.evtInfo && self.evtInfo.action === 'drawEdge') {
        self[self.evtInfo.action].stop.call(self, event);
      }
    },
    onMousemove(event) {
      let self = this;
      if (self.evtInfo && self.evtInfo.action) {
        self[self.evtInfo.action].move.call(self, event);
      }
    },
    drawEdge: {
      isMoving: false,
      currentLine: null,
      start: function(event) {
        let self = this;
        let themeStyle = theme.defaultStyle; // todo...先使用默认主题，后期可能增加其它风格的主体
        let sourceAnchor;
        let sourceNodeModel = self.evtInfo.node.getModel();
        // 锚点数据
        let anchorPoints = self.evtInfo.node.getAnchorPoints();
        // 处理线条目标点
        if (anchorPoints && anchorPoints.length) {
          // 获取距离指定坐标最近的一个锚点
          sourceAnchor = self.evtInfo.node.getLinkPoint({
            x: event.x,
            y: event.y
          });
        }
        self.drawEdge.currentLine = self.graph.addItem('edge', {
          id: G6.Util.uniqueId(),
          // 起始节点
          source: sourceNodeModel.id,
          sourceAnchor: sourceAnchor ? sourceAnchor.anchorIndex : '',
          // 终止节点/位置
          target: {
            x: event.x,
            y: event.y
          },
          shape: self.graph.$C.edge.shape || 'cc-line',
          style: G6.Util.mix({}, themeStyle.edgeStyle.default, self.graph.$C.edge.style)
        });
        self.drawEdge.isMoving = true;
      },
      move(event) {
        let self = this;
        if (self.drawEdge.isMoving && self.drawEdge.currentLine) {
          self.graph.updateItem(self.drawEdge.currentLine, {
            target: {
              x: event.x,
              y: event.y
            }
          });
        }
      },
      stop(event) {
        let self = this;
        if (self.drawEdge.isMoving) {
          if (self.drawEdge.currentLine === event.item) {
            // 画线过程中点击则移除当前画线
            self.graph.removeItem(event.item);
          } else {
            let targetNode = event.item;
            let targetNodeModel = targetNode.getModel();
            let targetAnchor;
            // 锚点数据
            let anchorPoints = targetNode.getAnchorPoints();
            // 处理线条目标点
            if (anchorPoints && anchorPoints.length) {
              // 获取距离指定坐标最近的一个锚点
              targetAnchor = targetNode.getLinkPoint({ x: event.x, y: event.y });
            }
            self.graph.updateItem(self.drawEdge.currentLine, {
              target: targetNodeModel.id,
              targetAnchor: targetAnchor ? targetAnchor.anchorIndex : ''
            });
          }
        }
        self.drawEdge.currentLine = null;
        self.drawEdge.isMoving = false;
        self.evtInfo = null;
      }
    },
    dragNode: {
      start(event) {
        let self = this;
      },
      move(event) {
        let self = this;
        if (self.evtInfo.node) {
          let attrs = {
            x: event.x,
            y: event.y
          };
          // 更新节点
          self.graph.updateItem(self.evtInfo.node, attrs);
        }
      },
      stop(event) {
        let self = this;
        self.dragNode.clear.call(self);
        self.graph.paint();
      },
      clear() {
        let self = this;
        self.evtInfo = null;
      }
    }
  }
};
