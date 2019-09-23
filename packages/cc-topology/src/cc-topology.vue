<template>
  <div class="topology">
    <!-- toolbar -->
    <div v-if="graphMode === 'edit'">
      <toolbar-edit></toolbar-edit>
    </div>
    <div v-else>
      <toolbar-preview></toolbar-preview>
    </div>
    <!-- bottom-container -->
    <el-row class="bottom-container">
      <!-- item-pannel -->
      <el-col v-if="graphMode === 'edit'" :span="3" class="item-pannel">
        <div
          class="node-type"
          v-for="nodeType in nodeTypeList"
          :key="nodeType.guid">
          <img
            :src="nodeType.imgSrc"
            :alt="nodeType.label"
            :title="nodeType.label"
            draggable="true"
            @dragstart="dragstartHandler($event, nodeType)"
            @dragend="dragendHandler"
          />
        </div>
      </el-col>
      <!-- graph-container -->
      <el-col
        :span="graphMode === 'edit' ? 18 : 24"
        class="graph-container"
        ref="graphContainer">
        <div
          id="mount-topology"
          @dragenter="dragenterHandler"
          @dragover="dragoverHandler"
          @drop="dropHandler"
        ></div>
      </el-col>
      <!-- graph-pannel -->
      <el-col v-if="graphMode === 'edit'" :span="3" class="graph-pannel">
        <div class="detail-pannel">
          <div v-if="currentFocus === 'node'">
            <div class="pannel-title">节点</div>
            <div class="block-container">
              <span>节点标签</span>
              <!--<el-input v-model="selectedNodeParams.label" size="mini"></el-input>-->
              <input class="params-input" type="text" autocomplete="off" v-model="selectedNodeParams.label"/>
              <div v-for="(value, key) in nodeAppConfig" :key="key">
                <span>{{ value }}</span>
                <!--<el-input v-model="selectedNodeParams.appConfig[key]" size="mini"></el-input>-->
                <input class="params-input" type="text" autocomplete="off" v-model="selectedNodeParams.appConfig[key]"/>
              </div>
            </div>
          </div>
          <div v-else-if="currentFocus === 'edge'">
            <div class="pannel-title">连线</div>
            <div class="block-container">
              <span>连线标签</span>
              <input class="params-input" type="text" autocomplete="off" v-model="selectedEdgeParams.label"/>
              <div v-for="(value, key) in edgeAppConfig" :key="key">
                <span>{{ value }}</span>
                <input class="params-input" type="text" autocomplete="off" v-model="selectedEdgeParams.appConfig[key]"/>
              </div>
            </div>
          </div>
          <div v-else-if="currentFocus === 'C'">
            C
          </div>
          <div v-else>
            <div class="pannel-title">画布</div>
            <div class="block-container">
              <el-checkbox @change="enableGridHandler">网格对齐</el-checkbox>
            </div>
          </div>
        </div>
        <!-- navigator-pannel -->
        <div class="navigator-pannel">
          <div class="pannel-title">导航器</div>
          <div class="navigator" ref="navigator">
            <div id="g6-minimap"></div>
          </div>
          <div class="zoom-slider">
            <el-slider
              v-model="zoomValue"
              :min="0.5"
              :max="2"
              :step="0.01"
              :format-tooltip="(val=>{return `${parseInt(val*100)}%`})" @input="changeZoomHandler"></el-slider>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Loading, Row, Col, Slider, Checkbox } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import G6 from '@antv/g6'

import ToolbarPreview from './toolbar-preview'
import ToolbarEdit from './toolbar-edit'
import registerNode from './node'
import registerEdge from './edge'
import ccBehavior from './behavior'
import config from './config'
import theme from './theme'
import initGraph from './graph'

const Minimap = require('@antv/g6/build/minimap')
const Grid = require('@antv/g6/build/grid')
registerNode(G6)
registerEdge(G6)
ccBehavior.register(G6)

export default {
  name: 'CCTopology',
  components: {
    // element-ui的组件
    'el-row': Row,
    'el-col': Col,
    'el-slider': Slider,
    'el-checkbox': Checkbox,
    // 自定义的组件
    'toolbar-preview': ToolbarPreview,
    'toolbar-edit': ToolbarEdit
  },
  props: {
    graphData: {
      type: Object,
      default: () => {
        return { nodes: [], edges: [] }
      }
    },
    nodeTypeList: {
      type: Array,
      default: () => {
        return [
          {
            guid: 'server',
            label: '服务器',
            imgSrc: 'data:image/png;base64,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'
          },
          {
            guid: 'database',
            label: '数据库',
            imgSrc: 'data:image/png;base64,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'
          },
          {
            guid: 'firewall',
            label: '防火墙',
            imgSrc: 'data:image/png;base64,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'
          },
          {
            guid: 'client',
            label: '客户端',
            imgSrc: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABICAYAAAB7qJLVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAACcQAAAnEAGUaVEZAAAAB3RJTUUH4wUGFSkCASqMfAAABb9JREFUeNrtnE1vG8cZgJ93hkty9WHISR2kimC1SOAgaIEg6CmpiwJFCwdtgBY+5hi76K2HXPMDeizQS5BrDjkZdmA4SNxDERT2oT0Z6ZcbBEVc1zHhKpJrkxSXOztvDxQZ0qYUrmUuV+I8F4GLmf14NPvOO7O7A4FCka8rcObMGQBUddbnWipUlWazSZZlABhjADh37tye9XYV3hfdx3svQXoPEcF7z82bN02SJKyurrKxsZHFcYy1FlXl0qVL4+uO2zgkW4DvA68Ca0xwR8wR4pyLWq2W3d7e9qr6b+CDer3+x263q8YYLl68+FClyrg9qSrWWrz3rwO/BY7N+urKSKVSYXl5GYBWqwXwRqfTefPWrVvvrq+vj61jxm3cuWWeAd4iyN4TYwxLS0tUKhWAJ1X1rbW1teP92P5Q+T329TzwrVlf0EHAWksURf2f68B3duvv9hK+yC4hJ/AwIoPurSIiy7uVyy1UjOnfPnOPcw71PledXOYqUZWTr77G8WdPzH1enqry2afXufaHj3Dd7sT1JhbuvefYN5/hez/4EfFiHebbN4kH+8QxbvztE+7c+NfE9XK18Kga9dLFLE+tw4nPPGIMNsoXXk2u0sDcN+0RlLyR9RGEB/ZDEF4wQXjBBOEFE4QXTDFDxoMyqVtAAjZ14VnqyLpp7vSpaETAVqPceXVeprp3n3madzZJO5MPfWdJVK+y/PQ3MHZ6kXaqMVyzjCx10zzEYyVLHZpNdxgdOs2CCcILJggvmCC8YILwgplqWijWYqsRekDSQluNEGuneoypCjfWsPzUEwcmNbRRZao5OBQw0jQVi4mm22oeG4dhaF/UhRwUQqdZMKV9wWS/E4xlvalKKVzxbGZ3SHQbyaleUWoSc9Q+hZTwBi6dcAFupp9xZft9Et/J39QVaibmZPxzjkcnStfSSyccoOE+p+n/h8E+Umxo+rs03Occj07M+lIeonz3HL2wkDeUDCMIWrq23aOUwmF/nV45VfcoZUhZMMsIgiffm6l9BGHBLD9S3WlTOuEKPFd9EacpLX8PyRlZVGHRHOG56oulbOmlEw5Ql0Veqv9wX/soo2woqXAor7D9UtpO87AShBdMEF4wQXjBBOEFE4QXTBBeMEF4weQe+OgDf+cV5z0KuaceJhYuwHanw3+bLeqLQulf+J4iSu9L5Cx1pEmSq+7kwo3hy9u3+PPvP2Dthe8iInPrXKS3psx//vFXthpfIGbyyLzrAjWqas0DO/JZxt+vfsw//3T14HxGMi0UMpfmrjZWeLvdxntfXVhYMHbMq1+PcqBAj7HCm80mwCbQXVpaiiVvzzBnqCr+q2U8uqr65W5lK3vs5JNWq3U9y7KX4jgmSN+dbrdLstN5ish1EfnLbr5Gtg6vUdjpdLh79+4pVf2diJTv8XeJGFo75lNjzK+zLLtcqVRwzrGwsMD58+cHZce2cBFZieP4J3Ecv5ym6e00Tb+tqtEEx55nUufc7Xa7/VNr7ZPAR8aYzXa7PVJo0MLPnj3b/089DbwN/AwIkidERMiyjK2tLZIkyUTkQxH5lap+UavVuHDhAjB+aP8G8AuC7FyoKuar9cCsqr6mqr9M05Th9NoMV6An+ZVZn/wh4uV6vV5LhkajgxieJAmqWqnVakshI3k8qGrdOTcSRQY/Njc3aTQadDqdWZ/noWYkpIgI9+/fJ8k5IRNgZ25JcW7v75kGIcVai7XWO+fSra0t4jgOC0LmJE1TukNrGIpIaq31w2s8DoxWq1UajUaysrJyzXv/453VggP749rGxkayuro62DASUlZWVhCRd4Crsz7TQ8AVEXnn6NGjIxtH0pFTp071w8i6qr4OnARqhAc8kyJAAlwxxrynqjecc1y+fHlQYCRI7yzSjjHmRpqmvzly5EhVVcNzzxyIiL937163Wq3ivefB6e2xCffp06cBhqccAznojyyHJ60CM+L/5UoejpR/JKUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDUtMDZUMjE6NDE6MDIrMDg6MDCIwcUDAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTA1LTA2VDIxOjQxOjAyKzA4OjAw+Zx9vwAAAEN0RVh0c29mdHdhcmUAL3Vzci9sb2NhbC9pbWFnZW1hZ2ljay9zaGFyZS9kb2MvSW1hZ2VNYWdpY2stNy8vaW5kZXguaHRtbL21eQoAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADYxMo3L7dgAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANzgzuT1cbQAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNTU3MTUwMDYyDS3pMwAAABF0RVh0VGh1bWI6OlNpemUAOTg0MUJ1EjZzAAAAYnRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vaG9tZS93d3dyb290L25ld3NpdGUvd3d3LmVhc3lpY29uLm5ldC9jZG4taW1nLmVhc3lpY29uLmNuL2ZpbGVzLzEyMy8xMjMzMzgyLnBuZ6YwiUMAAAAASUVORK5CYII='
          }
        ]
      }
    },
    nodeAppConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
    edgeAppConfig: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      loadingInstance: null,
      clientWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      clientHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
      edgeShapeList: [
        { guid: 'cc-line', label: '直线', class: 'iconfont icon-flow-line' },
        { guid: 'cc-polyline', label: '折线', class: 'iconfont icon-flow-broken' },
        { guid: 'cc-cubic', label: '曲线', class: 'iconfont icon-flow-curve' }
      ],
      graph: null,
      grid: null,
      minimap: null,
      graphMode: 'preview',
      currentEdgeShape: {
        guid: 'cc-line',
        label: '直线'
      },
      currentFocus: 'canvas',
      selectedNode: null,
      selectedNodeParams: {
        label: '',
        appConfig: this.nodeAppConfig
      },
      selectedNodeParamsTimeout: null,
      selectedEdge: null,
      selectedEdgeParams: {
        label: '',
        appConfig: this.edgeAppConfig
      },
      selectedEdgeParamsTimeout: null,
      zoomValue: 1,
      nodesInClipboard: [],
      historyIndex: 0,
      undoCount: 0,
      onresizeTimeout: null
    }
  },
  computed: {
    disableUndo: function() {
      return this.historyIndex === 0 || this.historyIndex - (this.undoCount + 1) < 0
    },
    disableRedo: function() {
      return this.historyIndex === 0 || this.historyIndex === 10 || this.undoCount < 1
    },
    disableCopy: function() {
      return this.selectedNodes.length === 0
    },
    disablePaste: function() {
      return this.nodesInClipboard.length === 0
    },
    disableDelete: function() {
      return this.selectedNodes.length === 0 && this.selectedEdges.length === 0
    },
    selectedNodes: function() {
      let self = this
      let graph = self.graph
      if (graph && !graph.destroyed) {
        return graph.findAllByState('node', 'selected')
      } else {
        return []
      }
    },
    selectedEdges: function() {
      let graph = this.graph
      if (graph && !graph.destroyed) {
        return graph.findAllByState('edge', 'selected')
      } else {
        return []
      }
    }
  },
  watch: {
    layoutType() {
      this.initTopo(this.graphData)
    },
    selectedNodeParams: {
      deep: true,
      handler: function(newVal, oldVal) {
        // 实时监听input值的变化，停止输入300ms后执行update，而不是时时update
        clearTimeout(this.selectedNodeParamsTimeout)
        this.selectedNodeParamsTimeout = setTimeout(() => {
          let selectedNodeModel = this.selectedNode.getModel()
          selectedNodeModel.label = newVal.label
          selectedNodeModel.appConfig = newVal.appConfig
          // todo...测试用彩蛋 -- start
          if (newVal.label === '开启告警') {
            selectedNodeModel.appState.alert = true
          } else if (newVal.label === '关闭告警') {
            selectedNodeModel.appState.alert = false
          }
          // todo...测试用菜单 -- end
          this.selectedNode.update(selectedNodeModel)
        }, 300)
      }
    },
    selectedEdgeParams: {
      deep: true,
      handler: function(newVal, oldVal) {
        // 实时监听input值的变化，停止输入300ms后执行update，而不是时时update
        clearTimeout(this.selectedEdgeParamsTimeout)
        this.selectedEdgeParamsTimeout = setTimeout(() => {
          let selectedEdgeModel = this.selectedEdge.getModel()
          selectedEdgeModel.label = newVal.label
          selectedEdgeModel.appConfig = newVal.appConfig
          this.selectedEdge.update(selectedEdgeModel)
        }, 300)
      }
    }
  },
  created() {
  },
  mounted() {
    ccBehavior.obj.clickEventEdit.sendThis(this)
    ccBehavior.obj.dragEventEdit.sendThis(this)
    this.clearHistoryData()
    this.initTopo(this.graphData)
    window.onresize = () => {
      return (() => {
        this.onresizeHandler()
      })()
    }
  },
  beforeRouteUpdate(to, from, next) {
    console.log('beforeRouteUpdate')
    this.clearHistoryData()
    next()
  },
  beforeRouteLeave(to, from, next) {
    console.log('beforeRouteLeave')
    this.clearHistoryData()
    next()
  },
  beforeDestroy() {
    console.log('beforeDestroy')
    this.clearHistoryData()
  },
  methods: {
    openFullScreenLoading() {
      this.loadingInstance = Loading.service({
        // lock: true,
        text: '自动布局中...',
        spinner: 'el-icon-loading',
        background: 'transparent'
      })
    },
    closeFullScreenLoading() {
      this.$nextTick(() => {
        this.loadingInstance.close()
      })
    },
    dragstartHandler(event, nodeType) {
      event.dataTransfer.setData('text', JSON.stringify(nodeType))
    },
    dragenterHandler(event) {
      event.preventDefault()
    },
    dragoverHandler(event) {
      event.preventDefault()
    },
    dropHandler(event) {
      let nodeTypeStr = event.dataTransfer.getData('text')
      let nodeType = JSON.parse(nodeTypeStr)
      let clientX = event.clientX
      let clientY = event.clientY
      this.addNode(clientX, clientY, nodeType)
    },
    dragendHandler() {
    },
    initTopo(graphData) {
      let self = this
      if (self.graph) {
        self.graph.destroy()
      }
      // 【预览模式】 - 封装的节点展开/收缩交互
      G6.registerBehavior('my-collapse-expand', {
        getEvents() {
          return {
            'node:click': 'onNodeClick'
          }
        },
        onNodeClick(event) {
          let clickNode = event.item
          this.sourceNodeIds = [clickNode._cfg.id]
          if (clickNode.hasState('collapse')) {
            // 节点已收缩, 需要展开
            let visible = true
            this.collapseOrExpand(clickNode, visible)
            clickNode.clearStates('collapse')
          } else {
            // 节点未收缩, 需要收缩
            let visible = false
            this.collapseOrExpand(clickNode, visible)
            clickNode.setState('collapse', true)
          }
          self.graph.paint()
        },
        collapseOrExpand(sourceNode, visible) {
          let outEdges = sourceNode.getOutEdges()
          for (let i = 0; i < outEdges.length; i++) {
            let targetNode = outEdges[i].getTarget()
            let targetNodeId = targetNode._cfg.id
            if (!this.sourceNodeIds.includes(targetNodeId)) {
              targetNode.changeVisibility(visible)
              // 如果一个节点隐藏/显示了，那么它关联的所有边都隐藏
              let relationEdges = targetNode.getEdges()
              for (let i = 0; i < relationEdges.length; i++) {
                relationEdges[i].changeVisibility(visible)
              }
              this.sourceNodeIds.push(targetNodeId)
              // 递归, 该节点的下属节点继续隐藏
              if (targetNode.getOutEdges().length > 0) {
                this.collapseOrExpand(targetNode, visible)
              }
            }
          }
        }
      })
      // 【编辑模式】 - 封装键盘事件的交互
      G6.registerBehavior('keyup-event', {
        getEvents() {
          return {
            'keyup': 'onKeyup'
          }
        },
        onKeyup(event) {
          let graph = this.graph
          let selectedNodes = graph.findAllByState('node', 'selected')
          let selectedEdges = graph.findAllByState('edge', 'selected')
          if (event.keyCode === 46 && (selectedNodes.length > 0 || selectedEdges.length > 0)) {
            // 记录【删除】前的数据状态
            let historyData = JSON.stringify(graph.save())
            let key = `graph_history_${self.historyIndex}`
            self.addHistoryData(key, historyData)
            // 开始删除
            for (let i = 0; i < selectedNodes.length; i++) {
              graph.removeItem(selectedNodes[i])
            }
            for (let i = 0; i < selectedEdges.length; i++) {
              graph.removeItem(selectedEdges[i])
            }
            // 记录【删除】后的数据状态
            // 如果当前点过【撤销】了，拖拽节点后将取消【重做】功能
            // 重置undoCount，【删除】后的数据状态给(当前所在historyIndex + 1)，且清空这个时间点之后的记录
            if (self.undoCount > 0) {
              self.historyIndex = self.historyIndex - self.undoCount // 此时的historyIndex应当更新为【撤销】后所在的索引位置
              for (let i = 1; i <= self.undoCount; i++) {
                let key = `graph_history_${self.historyIndex + i}`
                self.removeHistoryData(key)
              }
              self.undoCount = 0
            }
            // 记录【删除】后的数据状态
            self.historyIndex += 1
            key = `graph_history_${self.historyIndex}`
            let currentData = JSON.stringify(graph.save())
            self.addHistoryData(key, currentData)
          }
        }
      })

      // 图画布的定义
      let graphContainer = self.$refs.graphContainer
      let graphWidth = graphContainer.$el.clientWidth
      let graphHeight = graphContainer.$el.clientHeight
      // Plugins
      let plugins = []
      let modes = {
        default: [
          'drag-canvas',
          'drag-node',
          'click-select'
        ],
        preview: [
          'drag-canvas',
          'zoom-canvas',
          // "drag-node",
          // 'click-select',
          {
            type: 'tooltip',
            formatterText(model) {
              return model.label
            }
          },
          {
            type: 'edge-tooltip',
            formatterText(model) {
              return model.label
            }
          },
          // 自定义Behavior
          'my-collapse-expand'
        ],
        edit: [
          'drag-node',
          'drag-canvas',
          'click-select',
          'right-click-node',
          'right-click-edge',
          // 自定义Behavior
          'hover-event-edit',
          'click-event-edit',
          'keyup-event',
          // 'drag-event-edit',
          'drag-add-edge'
        ],
        addEdge: [
          'drag-canvas',
          // 自定义Behavior
          'click-add-edge'
        ],
        multiSelect: [
          {
            type: 'brush-select',
            onSelect() {
              this.graph.setMode('edit')
              window.document.getElementById('multi-select').style.backgroundColor = 'transparent'
            }
          }
        ]
      }
      if (self.graphMode === 'edit') {
        let navigator = self.$refs.navigator
        let minimapWidth = navigator ? navigator.clientWidth : 160
        let minimapHeight = navigator ? navigator.clientHeight : 120
        minimapWidth = minimapWidth > 160 ? minimapWidth : 120
        minimapHeight = minimapHeight > 160 ? minimapHeight : 120
        let minimap = new Minimap({
          size: [minimapWidth, minimapHeight],
          container: 'g6-minimap',
          type: 'default'
        })
        plugins.push(minimap)
      }
      /* 生成图 */
      if (self.layoutType === 'force') {
        /* 力导布局: force-layout */
        self.graph = initGraph.forceLayoutGraph(G6, {
          plugins: plugins,
          container: 'mount-topology',
          width: graphWidth,
          height: graphHeight,
          modes: modes,
          graphData: graphData
        })
      } else {
        /* 默认布局: 自由布局 */
        self.graph = initGraph.commonGraph(G6, {
          plugins: plugins,
          container: 'mount-topology',
          width: graphWidth,
          height: graphHeight,
          modes: modes,
          graphData: graphData
        })
      }
      self.graph.$C = config
      self.graph.$T = theme.defaultStyle
      self.graph.setMode(self.graphMode)
      self.graph.refresh()
    },
    autoLayout() {
      let self = this
      // 数据获取
      let graphData = self.getGraphData()
      if (self.graph && !self.graph.destroyed) {
        self.graph.destroy()
      }
      let graphContainer = self.$refs.graphContainer
      let graphWidth = graphContainer.$el.clientWidth
      let graphHeight = graphContainer.$el.clientHeight
      self.openFullScreenLoading()
      let promise = new Promise((resolve) => {
        initGraph.forceLayoutGraph(resolve, G6, {
          container: 'mount-topology',
          width: graphWidth,
          height: graphHeight,
          graphData: graphData
        })
      })
      promise.then(graph => {
        self.graph = graph
        self.closeFullScreenLoading()
        self.initTopo(self.getGraphData())
      })
    },
    changeEdgeShape(command) {
      this.currentEdgeShape = this.edgeShapeList.filter(edgeShape => edgeShape.guid === command)[0]
      this.graph.$C.edge.shape = this.currentEdgeShape['guid']
    },
    undoHandler() {
      if (this.historyIndex > 0 && this.historyIndex - (this.undoCount + 1) >= 0) {
        this.undoCount += 1
        let key = `graph_history_${this.historyIndex - this.undoCount}`
        let historyData = this.getHistoryData(key)
        this.changeGraphData(JSON.parse(historyData))
      }
    },
    redoHandler() {
      if (this.undoCount > 0) {
        let key = `graph_history_${this.historyIndex - this.undoCount + 1}`
        let historyData = this.getHistoryData(key)
        this.changeGraphData(JSON.parse(historyData))
        this.undoCount -= 1
      }
    },
    copyHandler() {
      this.nodesInClipboard = this.selectedNodes
    },
    pasteHandler() {
      let graph = this.graph
      let nodesInClipboard = this.nodesInClipboard
      if (graph && !graph.destroyed && nodesInClipboard.length > 0) {
        // 记录【粘贴】前的数据状态
        let historyData = JSON.stringify(graph.save())
        let key = `graph_history_${this.historyIndex}`
        this.addHistoryData(key, historyData)
        // 开始粘贴
        for (let i = 0; i < nodesInClipboard.length; i++) {
          let node = nodesInClipboard[i]
          let model = node.getModel()
          let newModel = { ...model, id: G6.Util.uniqueId(), x: model.x + 10, y: model.y + 10 }
          graph.addItem('node', newModel)
        }
        // 记录【粘贴】后的数据状态
        // 如果当前点过【撤销】了，【粘贴】后将取消【重做】功能
        // 重置undoCount，【粘贴】后的数据状态给(当前所在historyIndex + 1)，且清空这个时间点之后的记录
        if (this.undoCount > 0) {
          this.historyIndex = this.historyIndex - this.undoCount // 此时的historyIndex应当更新为【撤销】后所在的索引位置
          for (let i = 1; i <= this.undoCount; i++) {
            let key = `graph_history_${this.historyIndex + i}`
            this.removeHistoryData(key)
          }
          this.undoCount = 0
        }
        // 存储【粘贴】后的数据状态
        this.historyIndex += 1
        key = `graph_history_${this.historyIndex}`
        let currentData = JSON.stringify(graph.save())
        this.addHistoryData(key, currentData)
      }
    },
    deleteHandler() {
      let graph = this.graph
      let selectedNodes = graph.findAllByState('node', 'selected')
      let selectedEdges = graph.findAllByState('edge', 'selected')
      if (this.selectedNodes.length > 0 || this.selectedEdges.length > 0) {
        // 记录【删除】前的数据状态
        let historyData = JSON.stringify(graph.save())
        let key = `graph_history_${this.historyIndex}`
        this.addHistoryData(key, historyData)
        // 开始删除
        for (let i = 0; i < selectedNodes.length; i++) {
          graph.removeItem(selectedNodes[i])
        }
        for (let i = 0; i < selectedEdges.length; i++) {
          graph.removeItem(selectedEdges[i])
        }
        // 记录【删除】后的数据状态
        // 如果当前点过【撤销】了，拖拽节点后将取消【重做】功能
        // 重置undoCount，【删除】后的数据状态给(当前所在historyIndex + 1)，且清空这个时间点之后的记录
        if (this.undoCount > 0) {
          this.historyIndex = this.historyIndex - this.undoCount // 此时的historyIndex应当更新为【撤销】后所在的索引位置
          for (let i = 1; i <= this.undoCount; i++) {
            let key = `graph_history_${this.historyIndex + i}`
            this.removeHistoryData(key)
          }
          this.undoCount = 0
        }
        // 记录【删除】后的数据状态
        this.historyIndex += 1
        key = `graph_history_${this.historyIndex}`
        let currentData = JSON.stringify(graph.save())
        this.addHistoryData(key, currentData)
      }
    },
    zoomInHandler() {
      let graph = this.graph
      if (graph && !graph.destroyed) {
        graph.zoom(1.2)
      }
    },
    zoomOutHandler() {
      let graph = this.graph
      if (graph && !graph.destroyed) {
        graph.zoom(0.8)
      }
    },
    autoZoomHandler() {
      let graph = this.graph
      if (graph && !graph.destroyed) {
        graph.fitView(10)
        // this.zoomValue = graph.getZoom();  // TODO...怎么处理changeZoomHandler的二次触发问题
      }
    },
    resetZoomHandler() {
      let graph = this.graph
      if (graph && !graph.destroyed) {
        graph.zoomTo(1)
      }
    },
    multiSelectHandler(event) {
      event.target.style.backgroundColor = '#EEEEEE'
      this.graph.setMode('multiSelect')
    },
    enableGridHandler(enableGrid) {
      if (enableGrid) {
        this.grid = new Grid()
        this.graph.addPlugin(this.grid)
      } else {
        this.graph.removePlugin(this.grid)
      }
    },
    enableMinimapHandler(enableMinimap) {
      if (enableMinimap) {
        this.minimap = new Minimap({
          size: [200, 120],
          type: 'default',
          className: 'g6-minimap-preview'
        })
        this.graph.addPlugin(this.minimap)
      } else {
        this.graph.removePlugin(this.minimap)
      }
    },
    changeZoomHandler(zoomTo) {
      let graph = this.graph
      if (graph && !graph.destroyed) {
        graph.zoomTo(zoomTo)
      }
    },
    changeModeHandler(graphMode) {
      this.graphMode = graphMode
      this.$nextTick(() => {
        this.initTopo(this.graphData)
      })
    },
    addNode(clientX, clientY, nodeType) {
      let graph = this.graph
      if (graph && !graph.destroyed) {
        // 记录【添加节点】前的数据状态
        let historyData = JSON.stringify(graph.save())
        let key = `graph_history_${this.historyIndex}`
        this.addHistoryData(key, historyData)
        // 开始添加
        let droppoint = graph.getPointByClient(clientX, clientY)
        let node = graph.addItem('node', {
          id: G6.Util.uniqueId(),
          x: droppoint.x,
          y: droppoint.y,
          label: nodeType.label,
          labelCfg: {
            position: 'bottom'
          },
          shape: 'cc-image',
          img: nodeType.imgSrc,
          size: [55, 55],
          width: 48,
          height: 48,
          anchorPoints: [
            [0.5, 0], // top
            [1, 0.5], // right
            [0.5, 1], // bottom
            [0, 0.5] // left
          ],
          // 自定义属性
          appState: {
            alert: false
          }
        })
        // 记录【添加节点】后的数据状态
        if (node) {
          // 如果当前点过【撤销】了，【添加节点】后将取消【重做】功能
          // 重置undoCount，【添加节点】后的数据状态给(当前所在historyIndex + 1)，且清空这个时间点之后的记录
          if (this.undoCount > 0) {
            this.historyIndex = this.historyIndex - this.undoCount // 此时的historyIndex应当更新为【撤销】后所在的索引位置
            for (let i = 1; i <= this.undoCount; i++) {
              let key = `graph_history_${this.historyIndex + i}`
              this.removeHistoryData(key)
            }
            this.undoCount = 0
          }
          // 记录【添加节点】后的数据状态
          this.historyIndex += 1
          let key = `graph_history_${this.historyIndex}`
          let currentData = JSON.stringify(graph.save())
          this.addHistoryData(key, currentData)
        }
      }
    },
    unselectAllNodes() {
    },
    addHistoryData(key, value) {
      sessionStorage.setItem(key, value)
    },
    getHistoryData(key) {
      return sessionStorage.getItem(key)
    },
    removeHistoryData(key) {
      sessionStorage.removeItem(key)
    },
    clearHistoryData() {
      for (let i = 0; i < sessionStorage.length; i++) {
        let key = sessionStorage.key(i)
        if (key.startsWith('graph_history')) {
          sessionStorage.removeItem(key)
        }
      }
    },
    onresizeHandler() {
      // 实时监听窗口大小变化
      let self = this
      clearTimeout(this.onresizeTimeout)
      this.onresizeTimeout = setTimeout(() => {
        console.log('窗口大小变化')
        let graph = self.graph
        if (graph && !graph.destroyed) {
          let graphContainer = self.$refs.graphContainer
          let graphWidth = graphContainer.$el.clientWidth
          let graphHeight = graphContainer.$el.clientHeight
          graph.changeSize(graphWidth, graphHeight)
        }
      }, 1000)
    },
    /* 暴露给外部的接口 */
    refreshGraph() {
      let graph = this.graph
      if (graph && !graph.destroyed) {
        graph.refresh()
      }
    },
    getGraphData() {
      let graph = this.graph
      if (graph && !graph.destroyed) {
        console.log(JSON.stringify(graph.save()))
        return graph.save()
      } else {
        return { nodes: [], edges: [] }
      }
    },
    changeGraphData(data) {
      let graph = this.graph
      if (graph && !graph.destroyed) {
        graph.changeData(data)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/iconfont/iconfont.css';

*[draggable = true] {
  -khtml-user-drag: element;
}

.topology {
  height: 100%;
  margin: 0;
  padding: 0;
}

.bottom-container {
  /*height: calc(100% - 55px);*/
  height: 100%;
  /*width: calc(100% - 5px);*/

  .item-pannel {
    height: 100%;
    min-height: 600px;
    padding-top: 0;
    color: #333;
    font-size: 12px;
    text-align: center;
    background-color: #F7F9FB;
    border-right: 1px solid #E6E9ED;

    .node-type {
      display: inline-block;
      width: 55px;
      height: 55px;
      text-align: center;
      vertical-align: middle;
      border: 1px solid transparent;
      margin: 3px;

      img {
        height: 48px;
        width: 48px;
        padding-top: 5px;
      }

      span {
        font-size: 14px;
        display: block;
        line-height: 3px;
      }
    }

    .node-type:hover {
      cursor: move;
      border: 1px solid #ccc;
    }
  }

  .graph-container {
    height: 100%;
    min-height: 600px;

    #mount-topology {
      width: 100%;
      height: 100%;
    }
  }

  .graph-pannel {
    height: 100%;
    min-height: 600px;
    padding-top: 0;
    color: #333;
    font-size: 12px;
    text-align: left;
    background-color: #F7F9FB;
    border-left: 1px solid #E6E9ED;

    .detail-pannel {
      height: 60%;
      min-height: 360px;

      .block-container {
        padding: 16px 8px;

        .params-input {
          -webkit-appearance: none;
          background-color: #FFF;
          background-image: none;
          border-radius: 4px;
          border: 1px solid #DCDFE6;
          box-sizing: border-box;
          color: #606266;
          display: inline-block;
          outline: 0;
          transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
          padding: 0 5px;
          width: 100%;
          height: 25px;
          line-height: 25px;
          font-size: 12px;
        }
      }
    }

    .navigator-pannel {
      height: 40%;
      min-height: 240px;

      .navigator {
        padding: 1px;
        height: 55%;
        min-height: 135px;
      }

      .zoom-slider {
        padding: 0 6px;
      }
    }

    .pannel-title {
      padding-left: 12px;
      height: 32px;
      color: #000;
      line-height: 32px;
      background-color: #EBEEF2;
      border-top: 1px solid #DCE3E8;
      border-bottom: 1px solid #DCE3E8;
    }
  }
}
</style>

<style lang="scss">
.g6-tooltip {
  padding: 10px 6px;
  color: #444;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #e2e2e2;
  border-radius: 4px;
}

.navigator-pannel .zoom-slider .el-slider__button {
  width: 10px;
  height: 10px;
}

// 预览模式自动生成的节点
.graph-container {
  #mount-topology .g6-minimap-preview {
    position: absolute;
    right: 10px;
    bottom: 60px;
    border: 1px solid #e2e2e2;
  }
}
</style>
