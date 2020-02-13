/**
 * @author: winyuan
 * @data: 2019/07/16
 * @repository: https://github.com/winyuan
 * @description: edit mode: 通过拖拽节点上的锚点添加连线
 */
import utils from '../utils'

// 用来获取调用此js的vue组件实例（this）
let vm = null

const sendThis = (_this) => {
  vm = _this
}

import G6 from '@antv/g6'
import theme from '../theme'

export default {
  sendThis, // 暴露函数
  name: 'drag-add-edge',
  options: {
    getEvents() {
      return {
        'node:mousedown': 'onNodeMousedown',
        'node:mouseup': 'onNodeMouseup',
        'edge:mouseup': 'onEdgeMouseup',
        'mousemove': 'onMousemove'
      }
    },
    onNodeMousedown(event) {
      let self = this
      // 交互过程中的信息
      self.evtInfo = {
        action: null,
        node: event.item,
        target: event.target
      }
      if (self.evtInfo.target && self.evtInfo.target.attrs.name) {
        // todo...未来可能针对锚点增加其它功能(例如拖拽调整大小)
        switch (self.evtInfo.target.attrs.name) {
          case 'anchor':
            self.evtInfo.action = 'drawEdge'
            break
        }
      } else {
        self.evtInfo.action = 'dragNode'
      }
      if (self.evtInfo && self.evtInfo.action) {
        self[self.evtInfo.action].start.call(self, event)
      }
    },
    onNodeMouseup(event) {
      let self = this
      if (self.evtInfo && self.evtInfo.action) {
        self[self.evtInfo.action].stop.call(self, event)
      }
    },
    onEdgeMouseup(event) {
      let self = this
      if (self.evtInfo && self.evtInfo.action === 'drawEdge') {
        self[self.evtInfo.action].stop.call(self, event)
      }
    },
    onMousemove(event) {
      let self = this
      if (self.evtInfo && self.evtInfo.action) {
        self[self.evtInfo.action].move.call(self, event)
      }
    },
    drawEdge: {
      isMoving: false,
      currentLine: null,
      start: function(event) {
        let self = this
        let themeStyle = theme.defaultStyle // todo...先使用默认主题，后期可能增加其它风格的主体

        // ************** 暂存【连线】前的数据状态 start **************
        let graph = vm.graph
        self.historyData = JSON.stringify(graph.save())
        // ************** 暂存【连线】前的数据状态 end **************

        let sourceAnchor
        let sourceNodeModel = self.evtInfo.node.getModel()
        // 锚点数据
        let anchorPoints = self.evtInfo.node.getAnchorPoints()
        // 处理线条目标点
        if (anchorPoints && anchorPoints.length) {
          // 获取距离指定坐标最近的一个锚点
          sourceAnchor = self.evtInfo.node.getLinkPoint({
            x: event.x,
            y: event.y
          })
        }
        self.drawEdge.currentLine = self.graph.addItem('edge', {
          // id: G6.Util.uniqueId(),  // 这种生成id的方式有bug，会重复
          id: utils.generateUUID(),
          // 起始节点
          source: sourceNodeModel.id,
          sourceAnchor: sourceAnchor ? sourceAnchor.anchorIndex : '',
          // 终止节点/位置
          target: {
            x: event.x,
            y: event.y
          },
          type: self.graph.$C.edge.type || 'cc-line',
          style: G6.Util.mix({}, themeStyle.edgeStyle.default, self.graph.$C.edge.style)
        })
        self.drawEdge.isMoving = true
      },
      move(event) {
        let self = this
        if (self.drawEdge.isMoving && self.drawEdge.currentLine) {
          self.graph.updateItem(self.drawEdge.currentLine, {
            target: {
              x: event.x,
              y: event.y
            }
          })
        }
      },
      stop(event) {
        let self = this
        if (self.drawEdge.isMoving) {
          if (self.drawEdge.currentLine === event.item) {
            // 画线过程中点击则移除当前画线
            self.graph.removeItem(event.item)
          } else {
            let targetNode = event.item
            let targetNodeModel = targetNode.getModel()
            let targetAnchor = null
            // 锚点数据
            let anchorPoints = targetNode.getAnchorPoints()
            // 处理线条目标点
            if (anchorPoints && anchorPoints.length) {
              // 获取距离指定坐标最近的一个锚点
              targetAnchor = targetNode.getLinkPoint({ x: event.x, y: event.y })
            }
            self.graph.updateItem(self.drawEdge.currentLine, {
              target: targetNodeModel.id,
              targetAnchor: targetAnchor ? targetAnchor.anchorIndex : ''
            })

            // ************** 记录historyData的逻辑 start **************
            if (this.historyData) {
              let graph = this.graph
              // 如果当前点过【撤销】了，拖拽节点后没有【重做】功能
              // 重置undoCount，拖拽后的数据给(当前所在historyIndex + 1)，且清空这个时间点之后的记录
              if (vm.undoCount > 0) {
                vm.historyIndex = vm.historyIndex - vm.undoCount // 此时的historyIndex应当更新为【撤销】后所在的索引位置
                for (let i = 1; i <= vm.undoCount; i++) {
                  let key = `graph_history_${vm.historyIndex + i}`
                  vm.removeHistoryData(key)
                }
                vm.undoCount = 0
              } else {
                // 正常顺序执行的情况，记录拖拽前的数据状态
                let key = `graph_history_${vm.historyIndex}`
                vm.addHistoryData(key, this.historyData)
              }
              // 记录拖拽后的数据状态
              vm.historyIndex += 1
              let key = `graph_history_${vm.historyIndex}`
              let currentData = JSON.stringify(graph.save())
              vm.addHistoryData(key, currentData)
            }
            // ************** 记录historyData的逻辑 end **************
          }
        }
        self.drawEdge.currentLine = null
        self.drawEdge.isMoving = false
        self.evtInfo = null
      }
    },
    dragNode: {
      start(event) {
        let self = this
      },
      move(event) {
        let self = this
        if (self.evtInfo.node) {
          let attrs = {
            x: event.x,
            y: event.y
          }
          // 更新节点
          self.graph.updateItem(self.evtInfo.node, attrs)
        }
      },
      stop(event) {
        let self = this
        self.dragNode.clear.call(self)
        self.graph.paint()
      },
      clear() {
        let self = this
        self.evtInfo = null
      }
    }
  }
}
