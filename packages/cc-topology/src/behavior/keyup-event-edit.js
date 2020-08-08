/**
 * @author: winyuan
 * @data: 2019/07/16
 * @repository: https://github.com/winyuan
 * @description: edit mode: 键盘事件的交互，主要是删除节点和连线(记录删除前后的数据，用于【撤销】和【重做】)
 */

// 用来获取调用此js的vue组件实例（this）
let vm = null

const sendThis = (_this) => {
  vm = _this
}

export default {
  sendThis, // 暴露函数
  name: 'keyup-event-edit',
  options: {
    getEvents () {
      return {
        'keyup': 'onKeyup'
      }
    },
    onKeyup (event) {
      let graph = this.graph
      let selectedNodes = graph.findAllByState('node', 'selected')
      let selectedEdges = graph.findAllByState('edge', 'selected')
      if (event.keyCode === 46 && (selectedNodes.length > 0 || selectedEdges.length > 0)) {
        // ************** 记录【删除】前的数据状态 start **************
        let historyData = JSON.stringify(graph.save())
        let key = `graph_history_${vm.historyIndex}`
        vm.addHistoryData(key, historyData)
        // ************** 记录【删除】前的数据状态 end **************
        // 开始删除
        for (let i = 0; i < selectedNodes.length; i++) {
          graph.removeItem(selectedNodes[i])
        }
        for (let i = 0; i < selectedEdges.length; i++) {
          graph.removeItem(selectedEdges[i])
        }
        // ************** 记录【删除】后的数据状态 start **************
        // 如果当前点过【撤销】了，拖拽节点后将取消【重做】功能
        // 重置undoCount，【删除】后的数据状态给(当前所在historyIndex + 1)，且清空这个时间点之后的记录
        if (vm.undoCount > 0) {
          vm.historyIndex = vm.historyIndex - vm.undoCount // 此时的historyIndex应当更新为【撤销】后所在的索引位置
          for (let i = 1; i <= vm.undoCount; i++) {
            let key = `graph_history_${vm.historyIndex + i}`
            vm.removeHistoryData(key)
          }
          vm.undoCount = 0
        }
        // 记录【删除】后的数据状态
        vm.historyIndex += 1
        key = `graph_history_${vm.historyIndex}`
        let currentData = JSON.stringify(graph.save())
        vm.addHistoryData(key, currentData)
        // ************** 记录【删除】后的数据状态 end **************
      }
    }
  }
}
