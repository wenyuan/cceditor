/**
 * @author: winyuan
 * @data: 2019/07/16
 * @repository: https://github.com/winyuan
 * @description: edit mode: 鼠标点击交互
 */

// 用来获取调用此js的vue组件实例（this）
let vm = null

const sendThis = (_this) => {
  vm = _this
}

export default {
  sendThis, // 暴露函数
  name: 'click-event-edit',
  options: {
    getEvents() {
      return {
        'node:click': 'onNodeClick',
        'node:contextmenu': 'onNodeRightClick',
        'edge:click': 'onEdgeClick',
        'edge:contextmenu': 'onEdgeRightClick',
        'canvas:click': 'onCanvasClick'
      }
    },
    onNodeClick(event) {
      // todo..."selected"是g6自带的状态，在"drag-add-edge"中的"node:mouseup"事件也会触发，故此处不需要设置"selected"状态
      // let clickNode = event.item;
      // clickNode.setState('selected', !clickNode.hasState('selected'));
      vm.currentFocus = 'node'
      this.updateVmData(event)
    },
    onNodeRightClick(event) {
      let graph = vm.graph
      let clickNode = event.item
      let clickNodeModel = clickNode.getModel()
      let selectedNodes = graph.findAllByState('node', 'selected')
      // 如果当前点击节点不是之前选中的单个节点，才进行下面的处理
      if (!(selectedNodes.length === 1 && clickNodeModel.id === selectedNodes[0].getModel().id)) {
        // 先取消所有节点的选中状态
        graph.findAllByState('node', 'selected').forEach(node => {
          node.setState('selected', false)
        })
        // 再添加该节点的选中状态
        clickNode.setState('selected', true)
        vm.currentFocus = 'node'
        this.updateVmData(event)
      }
      let point = { x: event.x, y: event.y }
      console.log('右击了节点')
    },
    onEdgeClick(event) {
      let clickEdge = event.item
      clickEdge.setState('selected', !clickEdge.hasState('selected'))
      vm.currentFocus = 'edge'
      this.updateVmData(event)
    },
    onEdgeRightClick(event) {
      let graph = vm.graph
      let clickEdge = event.item
      let clickEdgeModel = clickEdge.getModel()
      let selectedEdges = graph.findAllByState('edge', 'selected')
      // 如果当前点击节点不是之前选中的单个节点，才进行下面的处理
      if (!(selectedEdges.length === 1 && clickEdgeModel.id === selectedEdges[0].getModel().id)) {
        // 先取消所有节点的选中状态
        graph.findAllByState('edge', 'selected').forEach(edge => {
          edge.setState('selected', false)
        })
        // 再添加该节点的选中状态
        clickEdge.setState('selected', true)
        vm.currentFocus = 'edge'
        this.updateVmData(event)
      }
      let point = { x: event.x, y: event.y }
      console.log('右击了边')
    },
    onCanvasClick() {
      vm.currentFocus = 'canvas'
    },
    updateVmData(event) {
      console.log(event.item._cfg.type)
      if (event.item._cfg.type === 'node') {
        // 更新vm的data: selectedNode 和 selectedNodeParams
        let clickNode = event.item
        if (clickNode.hasState('selected')) {
          let clickNodeModel = clickNode.getModel()
          console.log('clickNodeModel:', clickNodeModel)
          vm.selectedNode = clickNode
          let nodeAppConfig = { ...vm.nodeAppConfig }
          Object.keys(nodeAppConfig).forEach(function(key) {
            nodeAppConfig[key] = ''
          })
          vm.selectedNodeParams = {
            label: clickNodeModel.label || '',
            appConfig: { ...nodeAppConfig, ...clickNodeModel.appConfig }
          }
        }
      } else if (event.item._cfg.type === 'edge') {
        // 更新vm的data: selectedEdge 和 selectedEdgeParams
        let clickEdge = event.item
        if (clickEdge.hasState('selected')) {
          let clickEdgeModel = clickEdge.getModel()
          console.log('clickEdgeModel:', clickEdgeModel)
          vm.selectedEdge = clickEdge
          let edgeAppConfig = { ...vm.edgeAppConfig }
          Object.keys(edgeAppConfig).forEach(function(key) {
            edgeAppConfig[key] = ''
          })
          vm.selectedEdgeParams = {
            label: clickEdgeModel.label || '',
            appConfig: { ...edgeAppConfig, ...clickEdgeModel.appConfig }
          }
        }
      }
    }
  }
}
