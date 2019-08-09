export default function(G6){
  let self = Vue;
  // 封装添加边的交互
  G6.registerBehavior("click-add-edge", {
    getEvents() {
      return {
        "node:click": "onNodeClick",
        "canvas:mousemove": "onMousemove",
        "edge:click": "onEdgeClick" // 点击空白处，取消边
      };
    },
    onNodeClick(event) {
      let graph = this.graph;
      let node = event.item;
      let point = { x: event.x, y: event.y };
      let model = node.getModel();
      let edgeShape = self.currentEdgeType.guid || "line";
      if (this.addingEdge && this.edge) {
        // 点击第二个节点
        console.log('点击第二个节点')
        graph.updateItem(this.edge, {
          target: model.id
        });
        this.edge = null;
        this.addingEdge = false;
        // 记录【连线】前后的数据状态
        if (this.historyData) {
          let graph = this.graph;
          // 如果当前点过【撤销】了，连线后没有【重做】功能
          // 重置undoCount，连线后的数据给(当前所在historyIndex + 1)，且清空这个时间点之后的记录
          if (self.undoCount > 0) {
            self.historyIndex = self.historyIndex - self.undoCount; // 此时的historyIndex应当更新为【撤销】后所在的索引位置
            for (let i = 1; i <= self.undoCount; i++) {
              let key = `graph_history_${self.historyIndex + i}`;
              self.removeHistoryData(key);
            }
            self.undoCount = 0;
          } else {
            // 正常顺序执行的情况，记录【连线】前的数据状态
            let key = `graph_history_${self.historyIndex}`;
            self.addHistoryData(key, this.historyData);
          }
          // 记录【连线】后的数据状态
          self.historyIndex += 1;
          let key = `graph_history_${self.historyIndex}`;
          let currentData = JSON.stringify(graph.save());
          self.addHistoryData(key, currentData);
        }
      } else {
        // 点击第一个节点
        this.historyData = JSON.stringify(graph.save());
        console.log('点击第一个节点')
        if (edgeShape === "stepline") {
          this.edge = graph.addItem("edge", {
            source: model.id,
            target: point,
            shape: edgeShape,
            controlPoints: [{ x: 100, y: 70 }]
          });
        } else {
          this.edge = graph.addItem("edge", {
            source: model.id,
            target: point,
            shape: edgeShape
          });
        }
        this.addingEdge = true;
      }
    },
    onMousemove(event) {
      const point = { x: event.x, y: event.y };
      if (this.addingEdge && this.edge) {
        this.graph.updateItem(this.edge, {
          target: point
        });
      }
    },
    onEdgeClick(ev) {
      let graph = this.graph;
      const currentEdge = ev.item;
      // 拖拽过程中，点击会点击到新增的边上
      if (this.addingEdge && this.edge === currentEdge) {
        graph.removeItem(this.edge);
        this.edge = null;
        this.addingEdge = false;
      }
    }
  });
}
