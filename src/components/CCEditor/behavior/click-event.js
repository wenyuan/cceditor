/**
 * edit模式
 * 鼠标点击交互
 */
// 用来获取调用此js的vue组件实例（this）
let vm = null;

const sendThis = (_this) => {
  vm = _this;
};

export default {
  sendThis, // 暴露函数
  name: 'click-event',
  options: {
    getEvents() {
      return {
        'node:click': 'onNodeClick',
        'node:contextmenu': 'onNodeRightClick',
        'edge:click': 'onEdgeClick',
        'edge:contextmenu': 'onEdgeRightClick',
        'canvas:click': 'onCanvasClick'
      };
    },
    onNodeClick(event) {
      vm.currentFocus = 'node';
      // todo..."selected"是g6自带的状态，在"drag-add-edge"中的"node:mouseup"事件也会触发，故此处不需要设置"selected"状态
      // let clickNode = event.item;
      // clickNode.setState('selected', !clickNode.hasState('selected'));
    },
    onNodeRightClick(event) {
      let graph = vm.graph;
      let clickNode = event.item;
      let clickNodeModel = clickNode.getModel();
      let selectedNodes = graph.findAllByState('node', 'selected');
      console.log(clickNode);
      // 如果当前点击节点不是之前选中的单个节点，才进行下面的处理
      if (!(selectedNodes.length === 1 && clickNodeModel.id === selectedNodes[0].getModel().id)) {
        // 先取消所有节点的选中状态
        graph.findAllByState('node', 'selected').forEach(node => {
          node.setState('selected', false);
        });
        // 再添加该节点的选中状态
        clickNode.setState('selected', true);
        vm.currentFocus = 'node';
      }
      let point = { x: event.x, y: event.y };
      console.log('右击了节点');
    },
    onEdgeClick(event) {
      let clickEdge = event.item;
      console.log('点击边了');
      // vm.graph.setItemState(clickEdge, 'selected', !clickEdge.hasState('selected'));
      clickEdge.setState('selected', !clickEdge.hasState('selected'))
      vm.currentFocus = 'edge';
    },
    onEdgeRightClick(event) {
      let graph = vm.graph;
      let clickEdge = event.item;
      let clickEdgeModel = clickEdge.getModel();
      let selectedEdges = graph.findAllByState('edge', 'selected');
      // 如果当前点击节点不是之前选中的单个节点，才进行下面的处理
      if (!(selectedEdges.length === 1 && clickEdgeModel.id === selectedEdges[0].getModel().id)) {
        // 先取消所有节点的选中状态
        graph.findAllByState('edge', 'selected').forEach(edge => {
          edge.setState('selected', false);
        });
        // 再添加该节点的选中状态
        clickEdge.setState('selected', true);
        vm.currentFocus = 'edge';
      }
      let point = { x: event.x, y: event.y };
      console.log('右击了边');
    },
    onCanvasClick() {
      vm.currentFocus = 'canvas';
    }
  }
};
