<template>
  <div class="topology">
    <!-- toolbar -->
    <el-row class="toolbar">
      <el-col :span="3">
        <el-checkbox class="edge-enabled" title="连线模式" @change="enableEdgeHandler"></el-checkbox>
        <el-dropdown class="edge-type" trigger="click" @command="changeEdgeType">
        <span class="el-dropdown-link">
          {{ currentEdgeType.label }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="edgeType in edgeTypeList"
              :key="edgeType.guid"
              :command="edgeType.guid"
            >
              {{ edgeType.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="18">
        <div class="graph-ops">
          <i class="fas fa-reply" title="撤销" :class="disableUndo ? 'disabled':''" @click="undoHandler"></i>
          <i class="fas fa-share" title="重做" :class="disableRedo ? 'disabled':''" @click="redoHandler"></i>
          <span class="separator"></span>
          <i class="fas fa-copy" title="复制" :class="disableCopy ? 'disabled':''" @click="copyHandler"></i>
          <i class="fas fa-paste" title="粘贴" :class="disablePaste ? 'disabled':''" @click="pasteHandler"></i>
          <i class="far fa-trash-alt" title="删除" :class="disableDelete ? 'disabled':''" @click="deleteHandler"></i>
          <span class="separator"></span>
          <i class="fas fa-search-plus" id="zoom-in" title="放大" @click="zoomInHandler"></i>
          <i class="fas fa-search-minus" title="缩小" @click="zoomOutHandler"></i>
          <i class="fas fa-compress" title="适应画布" @click="autoZoomHandler"></i>
          <i class="fas fa-expand" title="实际尺寸" @click="resetZoomHandler"></i>
          <span class="separator"></span>
          <i class="fas fa-vector-square" id="multi-select" title="多选" @click="multiSelectHandler"></i>
        </div>
        <el-button size="mini" @click="changeMode('default')">默认</el-button>
        <el-button size="mini" @click="changeMode('preview')">预览</el-button>
        <el-button size="mini" @click="changeMode('edit')">编辑</el-button>
        <el-button size="mini" @click="getGraphData">获取json数据</el-button>
        当前模式：{{ graphMode }}
      </el-col>
      <el-col :span="3" class=""></el-col>
    </el-row>
    <!-- bottom-container -->
    <el-row class="bottom-container">
      <!-- item-pannel -->
      <el-col :span="3" class="item-pannel">
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
          <!--<span>{{ nodeType.label }}</span>-->
        </div>
      </el-col>
      <!-- graph-container -->
      <el-col :span="18" class="graph-container" ref="graphContainer">
        <div id="mount-topology"
             @dragenter="dragenterHandler"
             @dragover="dragoverHandler"
             @drop="dropHandler">
        </div>
      </el-col>
      <!-- graph-pannel -->
      <el-col :span="3" class="graph-pannel">
        <div class="detail-pannel">
          <div v-if="currentFocus === 'node'">
            <div class="pannel-title">节点</div>
          </div>
          <div v-else-if="currentFocus === 'B'">
            B
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
import G6 from "@antv/g6";

const Minimap = require("@antv/g6/build/minimap");
const Grid = require("@antv/g6/build/grid");

export default {
  name: "topology",
  components: {},
  data() {
    return {
      clientWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      clientHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
      nodeTypeList: [
        { guid: "blue", label: "蓝色", imgSrc: require('@/assets/images/blue.svg') },
        { guid: "green", label: "绿色", imgSrc: require('@/assets/images/green.svg') },
        { guid: "purple", label: "紫色", imgSrc: require('@/assets/images/purple.svg') }
      ],
      edgeTypeList: [
        { guid: "line", label: "直线" },
        { guid: "stepline", label: "折线（开发中）" },
        { guid: "quadratic", label: "曲线" },
        { guid: "cubic", label: "波浪线" }
      ],
      graph: "",
      grid: "",
      graphMode: "edit",
      currentEdgeType: {
        guid: "line",
        label: "直线"
      },
      currentFocus: "canvas",
      zoomValue: 1,
      nodesInClipboard: "",
      historyIndex: 0,
      undoCount: 0
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
      let graph = this.graph;
      if (graph) {
        console.log('选中的节点变化了')
        console.log(graph.findAllByState("node", "selected"));
        return graph.findAllByState("node", "selected");
      } else {
        return [];
      }
    },
    selectedEdges: function() {
      let graph = this.graph;
      if (graph) {
        console.log('选中的连线变化了')
        console.log(graph.findAllByState("edge", "selected"));
        return graph.findAllByState("edge", "selected");
      } else {
        return [];
      }
    }
  },
  created() {

  },
  mounted() {
    this.clearHistoryData();
    this.initTopo();
  },
  beforeRouteUpdate(to, from, next) {
    console.log("beforeRouteUpdate");
    this.clearHistoryData();
    next();
  },
  beforeRouteLeave(to, from, next) {
    console.log("beforeRouteLeave");
    this.clearHistoryData();
    next();
  },
  beforeDestroy() {
    console.log("beforeDestroy");
    this.clearHistoryData();
  },
  watch: {
    graphMode: function(value) {
      this.graph.setMode(value);
    }
  },
  methods: {
    dragstartHandler(event, nodeType) {
      event.dataTransfer.setData("text", JSON.stringify(nodeType));
    },
    dragenterHandler(event) {
      event.preventDefault()
    },
    dragoverHandler(event) {
      event.preventDefault()
    },
    dropHandler(event) {
      let nodeTypeStr = event.dataTransfer.getData("text")
      let nodeType = JSON.parse(nodeTypeStr)
      let clientX = event.clientX;
      let clientY = event.clientY;
      this.addNode(clientX, clientY, nodeType)
    },
    dragendHandler() {
    },
    initTopo() {
      let self = this
      // 数据定义
      const data = {
        nodes: [{
          x: 0,
          y: 0,
          shape: "background-animate",
          color: "#40a9ff",
          img: "/img/purple.23f14d56.svg",
          size: [48, 48],
          id: 'node1'
        }, {
          x: 100,
          y: 100,
          shape: "cy-image",
          color: "#40a9ff",
          img: "/img/purple.23f14d56.svg",
          size: [48, 48],
          alert: true,
          id: 'node2'
        }, {
          x: 200,
          y: 100,
          shape: "cy-image",
          color: "#40a9ff",
          img: "/img/purple.23f14d56.svg",
          size: [48, 48],
          alert: false,
          id: 'node3'
        }, {
          id: 'node4',
          x: 300,
          y: 200
        }, {
          id: 'node5',
          x: 300,
          y: 300
        }],
        edges: [{
          id: 'edge1',
          target: 'node2',
          source: 'node4'
        },{
          id: 'edge2',
          target: 'node3',
          source: 'node5'
        }]
      };

      // 自定义节点：带告警的图形节点
      G6.registerNode("cy-image", {
        afterDraw: function afterDraw(cfg, group) {
          if (cfg.alert) {
            let r = cfg.size[0] / 2;
            let back1 = group.addShape('circle', {
              zIndex: -3,
              attrs: {
                x: 0,
                y: 0,
                r: r,
                fill: cfg.color,
                opacity: 0.6
              }
            });
            let back2 = group.addShape('circle', {
              zIndex: -2,
              attrs: {
                x: 0,
                y: 0,
                r: r,
                fill: cfg.color, // 为了显示清晰，随意设置了颜色
                opacity: 0.6
              }
            });
            let back3 = group.addShape('circle', {
              zIndex: -1,
              attrs: {
                x: 0,
                y: 0,
                r: r,
                fill: cfg.color,
                opacity: 0.6
              }
            });
            group.sort(); // 排序，根据zIndex 排序
            back1.animate({ // 逐渐放大，并消失
              r: r + 10,
              opacity: 0.1,
              repeat: true // 循环
            }, 3000, 'easeCubic', null, 0); // 无延迟
            back2.animate({ // 逐渐放大，并消失
              r: r + 10,
              opacity: 0.1,
              repeat: true // 循环
            }, 3000, 'easeCubic', null, 1000); // 1 秒延迟
            back3.animate({ // 逐渐放大，并消失
              r: r + 10,
              opacity: 0.1,
              repeat: true // 循环
            }, 3000, 'easeCubic', null, 2000); // 2 秒延迟
          }
        }
      }, "image");
      // 自定义边：折线
      G6.registerEdge("stepline", {
        draw(cfg, group) {
          let startPoint = cfg.startPoint;
          let endPoint = cfg.endPoint;
          let shape = group.addShape('path', {
            attrs: {
              stroke: '#333',
              path: [
                ['M', startPoint.x, startPoint.y],
                ['L', endPoint.x / 3 + 2 / 3 * startPoint.x, startPoint.y],
                ['L', endPoint.x / 3 + 2 / 3 * startPoint.x, endPoint.y],
                ['L', endPoint.x, endPoint.y]
              ]
            }
          });
          return shape;
        }
      });
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
      // 封装鼠标点击的交互
      G6.registerBehavior("click-event", {
        getEvents() {
          return {
            "node:click": "onNodeClick",
            "node:contextmenu": "onNodeRightClick",
            "edge:click": "onEdgeClick",
            "edge:contextmenu": "onEdgeRightClick",
            "canvas:click": "onCanvasClick"
          };
        },
        onNodeClick() {
          self.currentFocus = "node";
        },
        onNodeRightClick(event) {
          let graph = this.graph;
          let clickNode = event.item;
          let clickNodeModel = clickNode.getModel();
          let selectedNodes = graph.findAllByState("node", "selected");
          // 如果当前点击节点不是之前选中的单个节点，才进行下面的处理
          if (!(selectedNodes.length === 1 && clickNodeModel.id === selectedNodes[0].getModel().id)) {
            // 先取消所有节点的选中状态
            graph.findAllByState("node", "selected").forEach(node => {
              node.setState("selected", false);
            });
            // 再添加该节点的选中状态
            clickNode.setState("selected", true);
            self.currentFocus = "node";
          }
          let point = { x: event.x, y: event.y };
          console.log("右击了节点")
        },
        onEdgeClick(event) {
          let clickEdge = event.item;
          console.log('点击边了')
          clickEdge.setState("selected", !clickEdge.hasState("selected"));
          self.currentFocus = "edge";
        },
        onEdgeRightClick(event) {
          let graph = this.graph;
          let clickEdge = event.item;
          let clickEdgeModel = clickEdge.getModel();
          let selectedEdges = graph.findAllByState("edge", "selected");
          // 如果当前点击节点不是之前选中的单个节点，才进行下面的处理
          if (!(selectedEdges.length === 1 && clickEdgeModel.id === selectedEdges[0].getModel().id)) {
            // 先取消所有节点的选中状态
            graph.findAllByState("edge", "selected").forEach(edge => {
              edge.setState("selected", false);
            });
            // 再添加该节点的选中状态
            clickEdge.setState("selected", true);
            self.currentFocus = "edge";
          }
          let point = { x: event.x, y: event.y };
          console.log("右击了边")
        },
        onCanvasClick() {
          self.currentFocus = "canvas";
        }
      });
      // 封装键盘事件的交互
      G6.registerBehavior("keyup-event", {
        getEvents() {
          return {
            "keyup": "onKeyup"
          };
        },
        onKeyup(event) {
          let graph = this.graph;
          let selectedNodes = graph.findAllByState("node", "selected");
          let selectedEdges = graph.findAllByState("edge", "selected");
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
      // 封装记录【拖拽】操作的事件(用于【撤销】和【重做】)
      G6.registerBehavior("record-actions", {
        getEvents() {
          return {
            "node:dragstart": "onNodeDragstart",
            "node:dragend": "onNodeDragend"
          };
        },
        onNodeDragstart() {
          let graph = this.graph;
          this.historyData = JSON.stringify(graph.save());
        },
        onNodeDragend() {
          if (this.historyData) {
            let graph = this.graph;
            // 如果当前点过【撤销】了，拖拽节点后没有【重做】功能
            // 重置undoCount，拖拽后的数据给(当前所在historyIndex + 1)，且清空这个时间点之后的记录
            if (self.undoCount > 0) {
              self.historyIndex = self.historyIndex - self.undoCount; // 此时的historyIndex应当更新为【撤销】后所在的索引位置
              for (let i = 1; i <= self.undoCount; i++) {
                let key = `graph_history_${self.historyIndex + i}`;
                self.removeHistoryData(key);
              }
              self.undoCount = 0;
            } else {
              // 正常顺序执行的情况，记录拖拽前的数据状态
              let key = `graph_history_${self.historyIndex}`;
              self.addHistoryData(key, this.historyData);
            }
            // 记录拖拽后的数据状态
            self.historyIndex += 1;
            let key = `graph_history_${self.historyIndex}`;
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
      let navigator = self.$refs.navigator;
      let minimapWidth = navigator.clientWidth;
      let minimapHeight = navigator.clientHeight;
      let minimap = new Minimap({
        size: [minimapWidth, minimapHeight],
        container: "g6-minimap",
        type: "default"
      });
      self.graph = new G6.Graph({
        plugins: [minimap],
        container: "mount-topology",
        width: graphWidth,
        height: graphHeight,
        nodeStyle: {
          selected: {
            shadowColor: '#626262',
            shadowBlur: 8,
            shadowOffsetX: -1,
            shadowOffsetY: 3
          }
        },
        edgeStyle: {
          default: {
            stroke: '#e2e2e2',
            lineWidth: 3,
            lineAppendWidth: 4
          },
          selected: {
            shadowColor: '#626262',
            shadowBlur: 3
          }
        },
        modes: {
          default: [
            "drag-canvas",
            "drag-node",
            "click-select",
            "activate-relations",
            "debug"
          ],
          preview: [
            "drag-canvas",
            "drag-node",
            "click-select",
            {
              type: "tooltip",
              formatterText(model) {
                return model.label;
              }
            },
            {
              type: "edge-tooltip",
              formatterText(model) {
                return model.label;
              }
            },
            "activate-relations",
            "collapse-expand" // todo...编写回调函数
          ],
          edit: [
            "drag-node",
            "drag-canvas",
            "click-select",
            "right-click-node",
            "right-click-edge",
            // 自定义Behavior
            "click-event",
            "keyup-event",
            "record-actions"
          ],
          addEdge: [
            "drag-canvas",
            // 自定义Behavior
            "click-add-edge"
          ],
          multiSelect: [
            {
              type: "brush-select",
              onSelect(nodes) {
                this.graph.setMode("edit");
                window.document.getElementById("multi-select").style.backgroundColor = "transparent";
              },
              onDeselect() {
              }
            }
          ]
        }
      });
      // 将 read 方法分解成 data() 和 render 方法，便于整个生命周期的管理
      self.graph.read(data);
      self.graph.render();
      self.graph.setMode(self.graphMode);
    },
    enableEdgeHandler(enableEdge) {
      let graphMode = enableEdge ? "addEdge" : "edit";
      this.graph.setMode(graphMode);
    },
    changeEdgeType(command) {
      this.currentEdgeType = this.edgeTypeList.filter(edgeType => edgeType.guid === command)[0];
    },
    undoHandler() {
      if (this.historyIndex > 0 && this.historyIndex - (this.undoCount + 1) >= 0) {
        this.undoCount += 1;
        let key = `graph_history_${this.historyIndex - this.undoCount}`;
        let historyData = this.getHistoryData(key);
        console.log(historyData)
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
      if (graph && nodesInClipboard.length > 0) {
        // 记录【粘贴】前的数据状态
        let historyData = JSON.stringify(graph.save());
        let key = `graph_history_${this.historyIndex}`;
        this.addHistoryData(key, historyData);
        // 开始粘贴
        for (let i = 0; i < nodesInClipboard.length; i++) {
          let node = nodesInClipboard[i];
          let model = node.getModel();
          let newModel = {...model, id:G6.Util.uniqueId(), x:model.x+10, y: model.y +10};
          graph.addItem("node", newModel);
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
      let selectedNodes = graph.findAllByState("node", "selected");
      let selectedEdges = graph.findAllByState("edge", "selected");
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
      if (graph) {
        graph.zoom(1.2);
      }
    },
    zoomOutHandler() {
      let graph = this.graph;
      if (graph) {
        graph.zoom(0.8);
      }
    },
    autoZoomHandler() {
      let graph = this.graph;
      if (graph) {
        graph.fitView(10);
        // this.zoomValue = graph.getZoom();  // TODO...怎么处理changeZoomHandler的二次触发问题
      }
    },
    resetZoomHandler() {
      let graph = this.graph;
      if (graph) {
        graph.zoomTo(1);
      }
    },
    multiSelectHandler(event) {
      event.target.style.backgroundColor = "#EEEEEE";
      this.graph.setMode("multiSelect");
    },
    enableGridHandler(enableGrid) {
      if (enableGrid) {
        this.grid = new Grid();
        this.graph.addPlugin(this.grid);
      } else {
        this.graph.removePlugin(this.grid);
      }
    },
    changeZoomHandler(zoomTo) {
      let graph = this.graph;
      if (graph) {
        graph.zoomTo(zoomTo);
      }
    },
    changeMode(value) {
      this.graphMode = value
    },
    addNode(clientX, clientY, nodeType) {
      let graph = this.graph;
      if (graph) {
        // 记录【添加节点】前的数据状态
        let historyData = JSON.stringify(graph.save());
        let key = `graph_history_${this.historyIndex}`;
        this.addHistoryData(key, historyData);
        // 开始添加
        let droppoint = graph.getPointByClient(clientX, clientY)
        let node = graph.addItem("node", {
          id: G6.Util.uniqueId(),
          x: droppoint.x,
          y: droppoint.y,
          label: nodeType.label,
          labelCfg: {
            position: "bottom"
          },
          shape: "image",
          img: nodeType.imgSrc,
          size: [48, 48]
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
    getGraphData() {
      let graph = this.graph;
      if (graph) {
        return graph.save();
      } else {
        return { nodes: [], edges: [] };
      }
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
        if (key.startsWith("graph_history")) {
          sessionStorage.removeItem(key);
        }
      }
    },
    changeGraphData(data) {
      let graph = this.graph;
      if (graph) {
        graph.changeData(data);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
*[draggable = true] {
  -khtml-user-drag: element;
}

.topology {
  height: 100%;
  margin: 0;
  padding: 0;
}

.toolbar {
  /*z-index: 3;*/
  /*width: 100%;*/
  /*height: 42px;*/
  color: #333;
  text-align: left;
  vertical-align: middle;
  line-height: 42px;
  background-color: #ffffff;
  border: 1px solid #E9E9E9;
  box-shadow: 0 8px 12px 0 rgba(0, 52, 107, 0.04);

  .edge-enabled {
    width: 40%;
    text-align: center;
  }

  .edge-type {
    width: 60%;
    /*margin-right: 20px;*/
    line-height: 25px;
    text-align: left;
    /*border-right: 1px solid #E6E9ED;*/
  }

  .graph-ops {
    display: inline-block;
    vertical-align: middle;
    margin-left: 20px;

    i {
      width: 20px;
      height: 20px;
      margin: 0 6px;
      line-height: 20px;
      color: #a8a8a8;
      text-align: center;
      border-radius: 2px;
      display: inline-block;
      border: 1px solid rgba(2, 2, 2, 0);
    }

    i:hover {
      cursor: pointer;
      border: 1px solid #E9E9E9;
    }

    .disabled {
      color: rgba(0,0,0,0.25);
    }

    .disabled:hover {
      cursor: not-allowed;
      border: 1px solid rgba(2,2,2,0);
    }

    .icon-select {
      background-color: #EEEEEE;
    }

    .separator {
      margin: 4px;
      border-left: 1px solid #E9E9E9;
    }
  }
}

.bottom-container {
  height: 100%;

  .item-pannel {
    /*position: absolute;*/
    /*left: 0;*/
    /*z-index: 2;*/
    /*width: 200px;*/
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
    /*margin-left: 200px;*/
    /*margin-right: 200px;*/
    height: 100%;

    #mount-topology {
      width: 100%;
      height: 100%;
    }
  }

  .graph-pannel {
    /*position: absolute;*/
    /*right: 0;*/
    /*z-index: 2;*/
    /*width: 200px;*/
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
    /*display: none;*/
    /*position: absolute;*/
    /*right: 0;*/
    /*bottom: 0;*/
    /*z-index: 3;*/
    /*padding-top: 0;*/
    /*width: 200px;*/
    /*height: 180px;*/
    /*color: #333;*/
    /*font-size: 12px;*/
    /*text-align: left;*/
    /*background-color: #F7F9FB;*/
    /*border-left: 1px solid #E6E9ED;*/
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
</style>
