/**
 * edit模式
 * 鼠标拖动节点的交互(记录拖拽前后的数据，用于【撤销】和【重做】)
 */
// 用来获取调用此js的vue组件实例（this）
let vm = null;

const sendThis = (_this) => {
  vm = _this;
};

export default {
  sendThis, // 暴露函数
  name: 'drag-event-edit',
  options: {
    getEvents() {
      return {
        'node:dragstart': 'onNodeDragstart',
        'node:dragend': 'onNodeDragend'
      };
    },
    onNodeDragstart() {
      let graph = vm.graph;
      this.historyData = JSON.stringify(graph.save());
    },
    onNodeDragend() {
      if (this.historyData) {
        let graph = this.graph;
        // 如果当前点过【撤销】了，拖拽节点后没有【重做】功能
        // 重置undoCount，拖拽后的数据给(当前所在historyIndex + 1)，且清空这个时间点之后的记录
        if (vm.undoCount > 0) {
          vm.historyIndex = vm.historyIndex - vm.undoCount; // 此时的historyIndex应当更新为【撤销】后所在的索引位置
          for (let i = 1; i <= vm.undoCount; i++) {
            let key = `graph_history_${vm.historyIndex + i}`;
            vm.removeHistoryData(key);
          }
          vm.undoCount = 0;
        } else {
          // 正常顺序执行的情况，记录拖拽前的数据状态
          let key = `graph_history_${vm.historyIndex}`;
          vm.addHistoryData(key, this.historyData);
        }
        // 记录拖拽后的数据状态
        vm.historyIndex += 1;
        let key = `graph_history_${vm.historyIndex}`;
        let currentData = JSON.stringify(graph.save());
        vm.addHistoryData(key, currentData);
      }
    }
  }
};
