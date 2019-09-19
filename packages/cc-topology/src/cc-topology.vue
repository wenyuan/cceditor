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
import { Loading, Row, Col, Slider, Checkbox } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import G6 from '@antv/g6';

import ToolbarPreview from './toolbar-preview';
import ToolbarEdit from './toolbar-edit';
import registerNode from './node';
import registerEdge from './edge';
import ccBehavior from './behavior';
import config from './config';
import theme from './theme';
import initGraph from './graph';

const Minimap = require('@antv/g6/build/minimap');
const Grid = require('@antv/g6/build/grid');
registerNode(G6);
registerEdge(G6);
ccBehavior.register(G6);

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
        return { nodes: [], edges: [] };
      }
    },
    nodeAppConfig: {
      type: Object,
      default: () => {
        return {};
      }
    },
    edgeAppConfig: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      loadingInstance: null,
      clientWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      clientHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
      nodeTypeList: [
        { guid: 'blue', label: '蓝色', imgSrc: '../../assets/images/blue.svg' },
        { guid: 'green', label: '绿色', imgSrc: require('~/assets/images/green.svg') },
        { guid: 'purple', label: '紫色', imgSrc: '/images/purple.svg' }
      ],
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
    };
  },
  computed: {
    disableUndo: function() {
      return this.historyIndex === 0 || this.historyIndex - (this.undoCount + 1) < 0;
    },
    disableRedo: function() {
      return this.historyIndex === 0 || this.historyIndex === 10 || this.undoCount < 1;
    },
    disableCopy: function() {
      return this.selectedNodes.length === 0;
    },
    disablePaste: function() {
      return this.nodesInClipboard.length === 0;
    },
    disableDelete: function() {
      return this.selectedNodes.length === 0 && this.selectedEdges.length === 0;
    },
    selectedNodes: function() {
      let self = this;
      let graph = self.graph;
      if (graph && !graph.destroyed) {
        return graph.findAllByState('node', 'selected');
      } else {
        return [];
      }
    },
    selectedEdges: function() {
      let graph = this.graph;
      if (graph && !graph.destroyed) {
        return graph.findAllByState('edge', 'selected');
      } else {
        return [];
      }
    }
  },
  watch: {
    layoutType() {
      this.initTopo(this.graphData);
    },
    selectedNodeParams: {
      deep: true,
      handler: function(newVal, oldVal) {
        // 实时监听input值的变化，停止输入300ms后执行update，而不是时时update
        clearTimeout(this.selectedNodeParamsTimeout);
        this.selectedNodeParamsTimeout = setTimeout(() => {
          let selectedNodeModel = this.selectedNode.getModel();
          selectedNodeModel.label = newVal.label;
          selectedNodeModel.appConfig = newVal.appConfig;
          // todo...测试用彩蛋 -- start
          if (newVal.label === '开启告警') {
            selectedNodeModel.appState.alert = true;
          } else if (newVal.label === '关闭告警') {
            selectedNodeModel.appState.alert = false;
          }
          // todo...测试用菜单 -- end
          this.selectedNode.update(selectedNodeModel);
        }, 300);
      }
    },
    selectedEdgeParams: {
      deep: true,
      handler: function(newVal, oldVal) {
        // 实时监听input值的变化，停止输入300ms后执行update，而不是时时update
        clearTimeout(this.selectedEdgeParamsTimeout);
        this.selectedEdgeParamsTimeout = setTimeout(() => {
          let selectedEdgeModel = this.selectedEdge.getModel();
          selectedEdgeModel.label = newVal.label;
          selectedEdgeModel.appConfig = newVal.appConfig;
          this.selectedEdge.update(selectedEdgeModel);
        }, 300);
      }
    }
  },
  created() {
  },
  mounted() {
    ccBehavior.obj.clickEventEdit.sendThis(this);
    ccBehavior.obj.dragEventEdit.sendThis(this);
    this.clearHistoryData();
    this.initTopo(this.graphData);
    window.onresize = () => {
      return (() => {
        this.onresizeHandler();
      })();
    };
  },
  beforeRouteUpdate(to, from, next) {
    console.log('beforeRouteUpdate');
    this.clearHistoryData();
    next();
  },
  beforeRouteLeave(to, from, next) {
    console.log('beforeRouteLeave');
    this.clearHistoryData();
    next();
  },
  beforeDestroy() {
    console.log('beforeDestroy');
    this.clearHistoryData();
  },
  methods: {
    openFullScreenLoading() {
      this.loadingInstance = Loading.service({
        // lock: true,
        text: '自动布局中...',
        spinner: 'el-icon-loading',
        background: 'transparent'
      });
    },
    closeFullScreenLoading() {
      this.$nextTick(() => {
        this.loadingInstance.close();
      });
    },
    dragstartHandler(event, nodeType) {
      event.dataTransfer.setData('text', JSON.stringify(nodeType));
    },
    dragenterHandler(event) {
      event.preventDefault();
    },
    dragoverHandler(event) {
      event.preventDefault();
    },
    dropHandler(event) {
      let nodeTypeStr = event.dataTransfer.getData('text');
      let nodeType = JSON.parse(nodeTypeStr);
      let clientX = event.clientX;
      let clientY = event.clientY;
      this.addNode(clientX, clientY, nodeType);
    },
    dragendHandler() {
    },
    initTopo(graphData) {
      let self = this;
      if (self.graph) {
        self.graph.destroy();
      }
      // 【预览模式】 - 封装的节点展开/收缩交互
      G6.registerBehavior('my-collapse-expand', {
        getEvents() {
          return {
            'node:click': 'onNodeClick'
          };
        },
        onNodeClick(event) {
          let clickNode = event.item;
          this.sourceNodeIds = [clickNode._cfg.id];
          if (clickNode.hasState('collapse')) {
            // 节点已收缩, 需要展开
            let visible = true;
            this.collapseOrExpand(clickNode, visible);
            clickNode.clearStates('collapse');
          } else {
            // 节点未收缩, 需要收缩
            let visible = false;
            this.collapseOrExpand(clickNode, visible);
            clickNode.setState('collapse', true);
          }
          self.graph.paint();
        },
        collapseOrExpand(sourceNode, visible) {
          let outEdges = sourceNode.getOutEdges();
          for (let i = 0; i < outEdges.length; i++) {
            let targetNode = outEdges[i].getTarget();
            let targetNodeId = targetNode._cfg.id;
            if (!this.sourceNodeIds.includes(targetNodeId)) {
              targetNode.changeVisibility(visible);
              // 如果一个节点隐藏/显示了，那么它关联的所有边都隐藏
              let relationEdges = targetNode.getEdges();
              for (let i = 0; i < relationEdges.length; i++) {
                relationEdges[i].changeVisibility(visible);
              }
              this.sourceNodeIds.push(targetNodeId);
              // 递归, 该节点的下属节点继续隐藏
              if (targetNode.getOutEdges().length > 0) {
                this.collapseOrExpand(targetNode, visible);
              }
            }
          }
        }
      });
      // 【编辑模式】 - 封装键盘事件的交互
      G6.registerBehavior('keyup-event', {
        getEvents() {
          return {
            'keyup': 'onKeyup'
          };
        },
        onKeyup(event) {
          let graph = this.graph;
          let selectedNodes = graph.findAllByState('node', 'selected');
          let selectedEdges = graph.findAllByState('edge', 'selected');
          if (event.keyCode === 46 && (selectedNodes.length > 0 || selectedEdges.length > 0)) {
            // 记录【删除】前的数据状态
            let historyData = JSON.stringify(graph.save());
            let key = `graph_history_${self.historyIndex}`;
            self.addHistoryData(key, historyData);
            // 开始删除
            for (let i = 0; i < selectedNodes.length; i++) {
              graph.removeItem(selectedNodes[i]);
            }
            for (let i = 0; i < selectedEdges.length; i++) {
              graph.removeItem(selectedEdges[i]);
            }
            // 记录【删除】后的数据状态
            // 如果当前点过【撤销】了，拖拽节点后将取消【重做】功能
            // 重置undoCount，【删除】后的数据状态给(当前所在historyIndex + 1)，且清空这个时间点之后的记录
            if (self.undoCount > 0) {
              self.historyIndex = self.historyIndex - self.undoCount; // 此时的historyIndex应当更新为【撤销】后所在的索引位置
              for (let i = 1; i <= self.undoCount; i++) {
                let key = `graph_history_${self.historyIndex + i}`;
                self.removeHistoryData(key);
              }
              self.undoCount = 0;
            }
            // 记录【删除】后的数据状态
            self.historyIndex += 1;
            key = `graph_history_${self.historyIndex}`;
            let currentData = JSON.stringify(graph.save());
            self.addHistoryData(key, currentData);
          }
        }
      });

      // 图画布的定义
      let graphContainer = self.$refs.graphContainer;
      let graphWidth = graphContainer.$el.clientWidth;
      let graphHeight = graphContainer.$el.clientHeight;
      // Plugins
      let plugins = [];
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
              return model.label;
            }
          },
          {
            type: 'edge-tooltip',
            formatterText(model) {
              return model.label;
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
              this.graph.setMode('edit');
              window.document.getElementById('multi-select').style.backgroundColor = 'transparent';
            }
          }
        ]
      };
      if (self.graphMode === 'edit') {
        let navigator = self.$refs.navigator;
        let minimapWidth = navigator ? navigator.clientWidth : 200;
        let minimapHeight = navigator ? navigator.clientHeight : 120;
        let minimap = new Minimap({
          size: [minimapWidth, minimapHeight],
          container: 'g6-minimap',
          type: 'default'
        });
        plugins.push(minimap);
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
        });
      } else {
        /* 默认布局: 自由布局 */
        self.graph = initGraph.commonGraph(G6, {
          plugins: plugins,
          container: 'mount-topology',
          width: graphWidth,
          height: graphHeight,
          modes: modes,
          graphData: graphData
        });
      }
      self.graph.$C = config;
      self.graph.$T = theme.defaultStyle;
      self.graph.setMode(self.graphMode);
    },
    autoLayout() {
      let self = this;
      // 数据获取
      let graphData = self.getGraphData();
      if (self.graph && !self.graph.destroyed) {
        self.graph.destroy();
      }
      let graphContainer = self.$refs.graphContainer;
      let graphWidth = graphContainer.$el.clientWidth;
      let graphHeight = graphContainer.$el.clientHeight;
      self.openFullScreenLoading();
      let promise = new Promise((resolve) => {
        initGraph.forceLayoutGraph(resolve, G6, {
          container: 'mount-topology',
          width: graphWidth,
          height: graphHeight,
          graphData: graphData
        });
      });
      promise.then(graph => {
        self.graph = graph;
        self.closeFullScreenLoading();
        self.initTopo(self.getGraphData());
      });
    },
    changeEdgeShape(command) {
      this.currentEdgeShape = this.edgeShapeList.filter(edgeShape => edgeShape.guid === command)[0];
      this.graph.$C.edge.shape = this.currentEdgeShape['guid'];
    },
    undoHandler() {
      if (this.historyIndex > 0 && this.historyIndex - (this.undoCount + 1) >= 0) {
        this.undoCount += 1;
        let key = `graph_history_${this.historyIndex - this.undoCount}`;
        let historyData = this.getHistoryData(key);
        this.changeGraphData(JSON.parse(historyData));
      }
    },
    redoHandler() {
      if (this.undoCount > 0) {
        let key = `graph_history_${this.historyIndex - this.undoCount + 1}`;
        let historyData = this.getHistoryData(key);
        this.changeGraphData(JSON.parse(historyData));
        this.undoCount -= 1;
      }
    },
    copyHandler() {
      this.nodesInClipboard = this.selectedNodes;
    },
    pasteHandler() {
      let graph = this.graph;
      let nodesInClipboard = this.nodesInClipboard;
      if (graph && !graph.destroyed && nodesInClipboard.length > 0) {
        // 记录【粘贴】前的数据状态
        let historyData = JSON.stringify(graph.save());
        let key = `graph_history_${this.historyIndex}`;
        this.addHistoryData(key, historyData);
        // 开始粘贴
        for (let i = 0; i < nodesInClipboard.length; i++) {
          let node = nodesInClipboard[i];
          let model = node.getModel();
          let newModel = { ...model, id: G6.Util.uniqueId(), x: model.x + 10, y: model.y + 10 };
          graph.addItem('node', newModel);
        }
        // 记录【粘贴】后的数据状态
        // 如果当前点过【撤销】了，【粘贴】后将取消【重做】功能
        // 重置undoCount，【粘贴】后的数据状态给(当前所在historyIndex + 1)，且清空这个时间点之后的记录
        if (this.undoCount > 0) {
          this.historyIndex = this.historyIndex - this.undoCount; // 此时的historyIndex应当更新为【撤销】后所在的索引位置
          for (let i = 1; i <= this.undoCount; i++) {
            let key = `graph_history_${this.historyIndex + i}`;
            this.removeHistoryData(key);
          }
          this.undoCount = 0;
        }
        // 存储【粘贴】后的数据状态
        this.historyIndex += 1;
        key = `graph_history_${this.historyIndex}`;
        let currentData = JSON.stringify(graph.save());
        this.addHistoryData(key, currentData);
      }
    },
    deleteHandler() {
      let graph = this.graph;
      let selectedNodes = graph.findAllByState('node', 'selected');
      let selectedEdges = graph.findAllByState('edge', 'selected');
      if (this.selectedNodes.length > 0 || this.selectedEdges.length > 0) {
        // 记录【删除】前的数据状态
        let historyData = JSON.stringify(graph.save());
        let key = `graph_history_${this.historyIndex}`;
        this.addHistoryData(key, historyData);
        // 开始删除
        for (let i = 0; i < selectedNodes.length; i++) {
          graph.removeItem(selectedNodes[i]);
        }
        for (let i = 0; i < selectedEdges.length; i++) {
          graph.removeItem(selectedEdges[i]);
        }
        // 记录【删除】后的数据状态
        // 如果当前点过【撤销】了，拖拽节点后将取消【重做】功能
        // 重置undoCount，【删除】后的数据状态给(当前所在historyIndex + 1)，且清空这个时间点之后的记录
        if (this.undoCount > 0) {
          this.historyIndex = this.historyIndex - this.undoCount; // 此时的historyIndex应当更新为【撤销】后所在的索引位置
          for (let i = 1; i <= this.undoCount; i++) {
            let key = `graph_history_${this.historyIndex + i}`;
            this.removeHistoryData(key);
          }
          this.undoCount = 0;
        }
        // 记录【删除】后的数据状态
        this.historyIndex += 1;
        key = `graph_history_${this.historyIndex}`;
        let currentData = JSON.stringify(graph.save());
        this.addHistoryData(key, currentData);
      }
    },
    zoomInHandler() {
      let graph = this.graph;
      if (graph && !graph.destroyed) {
        graph.zoom(1.2);
      }
    },
    zoomOutHandler() {
      let graph = this.graph;
      if (graph && !graph.destroyed) {
        graph.zoom(0.8);
      }
    },
    autoZoomHandler() {
      let graph = this.graph;
      if (graph && !graph.destroyed) {
        graph.fitView(10);
        // this.zoomValue = graph.getZoom();  // TODO...怎么处理changeZoomHandler的二次触发问题
      }
    },
    resetZoomHandler() {
      let graph = this.graph;
      if (graph && !graph.destroyed) {
        graph.zoomTo(1);
      }
    },
    multiSelectHandler(event) {
      event.target.style.backgroundColor = '#EEEEEE';
      this.graph.setMode('multiSelect');
    },
    enableGridHandler(enableGrid) {
      if (enableGrid) {
        this.grid = new Grid();
        this.graph.addPlugin(this.grid);
      } else {
        this.graph.removePlugin(this.grid);
      }
    },
    enableMinimapHandler(enableMinimap) {
      if (enableMinimap) {
        this.minimap = new Minimap({
          size: [200, 120],
          type: 'default',
          className: 'g6-minimap-preview'
        });
        this.graph.addPlugin(this.minimap);
      } else {
        this.graph.removePlugin(this.minimap);
      }
    },
    changeZoomHandler(zoomTo) {
      let graph = this.graph;
      if (graph && !graph.destroyed) {
        graph.zoomTo(zoomTo);
      }
    },
    changeModeHandler(graphMode) {
      this.graphMode = graphMode;
      this.$nextTick(() => {
        this.initTopo(this.graphData);
      });
    },
    addNode(clientX, clientY, nodeType) {
      let graph = this.graph;
      if (graph && !graph.destroyed) {
        // 记录【添加节点】前的数据状态
        let historyData = JSON.stringify(graph.save());
        let key = `graph_history_${this.historyIndex}`;
        this.addHistoryData(key, historyData);
        // 开始添加
        let droppoint = graph.getPointByClient(clientX, clientY);
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
        });
        // 记录【添加节点】后的数据状态
        if (node) {
          // 如果当前点过【撤销】了，【添加节点】后将取消【重做】功能
          // 重置undoCount，【添加节点】后的数据状态给(当前所在historyIndex + 1)，且清空这个时间点之后的记录
          if (this.undoCount > 0) {
            this.historyIndex = this.historyIndex - this.undoCount; // 此时的historyIndex应当更新为【撤销】后所在的索引位置
            for (let i = 1; i <= this.undoCount; i++) {
              let key = `graph_history_${this.historyIndex + i}`;
              this.removeHistoryData(key);
            }
            this.undoCount = 0;
          }
          // 记录【添加节点】后的数据状态
          this.historyIndex += 1;
          let key = `graph_history_${this.historyIndex}`;
          let currentData = JSON.stringify(graph.save());
          this.addHistoryData(key, currentData);
        }
      }
    },
    unselectAllNodes() {
    },
    addHistoryData(key, value) {
      sessionStorage.setItem(key, value);
    },
    getHistoryData(key) {
      return sessionStorage.getItem(key);
    },
    removeHistoryData(key) {
      sessionStorage.removeItem(key);
    },
    clearHistoryData() {
      for (let i = 0; i < sessionStorage.length; i++) {
        let key = sessionStorage.key(i);
        if (key.startsWith('graph_history')) {
          sessionStorage.removeItem(key);
        }
      }
    },
    onresizeHandler() {
      // 实时监听窗口大小变化
      let self = this;
      clearTimeout(this.onresizeTimeout);
      this.onresizeTimeout = setTimeout(() => {
        console.log('窗口大小变化')
        let graph = self.graph;
        if (graph && !graph.destroyed) {
          let graphContainer = self.$refs.graphContainer;
          let graphWidth = graphContainer.$el.clientWidth;
          let graphHeight = graphContainer.$el.clientHeight;
          graph.changeSize(graphWidth, graphHeight);
        }
      }, 1000);
    },
    /* 暴露给外部的接口 */
    refreshGraph() {
      let graph = this.graph;
      if (graph && !graph.destroyed) {
        graph.refresh();
      }
    },
    getGraphData() {
      let graph = this.graph;
      if (graph && !graph.destroyed) {
        console.log(JSON.stringify(graph.save()));
        return graph.save();
      } else {
        return { nodes: [], edges: [] };
      }
    },
    changeGraphData(data) {
      let graph = this.graph;
      if (graph && !graph.destroyed) {
        graph.changeData(data);
      }
    }
  }
};
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

    #mount-topology {
      width: 100%;
      height: 100%;
    }
  }

  .graph-pannel {
    height: 100%;
    padding-top: 0;
    color: #333;
    font-size: 12px;
    text-align: left;
    background-color: #F7F9FB;
    border-left: 1px solid #E6E9ED;

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

  .detail-pannel {
    height: 60%;

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

    .navigator {
      padding: 1px;
      height: 55%;
    }

    .zoom-slider {
      padding: 0 6px;
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
