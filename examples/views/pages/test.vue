<template>
  <div class="about">
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>
          <el-button type="primary" @click="changeMode('default')">默认</el-button>
          <el-button type="primary" @click="changeMode('addNode')">添加节点</el-button>
          <el-button type="primary" @click="changeMode('addEdge')">添加连线</el-button>
          <div id="cy-topology"></div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import G6 from '@antv/g6'

export default {
  name: 'about',
  components: {},
  data() {
    return {
      graph: ''
    }
  },
  mounted() {
    this.initTopo()
  },
  methods: {
    initTopo() {
      // 数据定义
      const data = {
        nodes: [{
          id: 'node1',
          x: 100,
          y: 200
        }, {
          id: 'node2',
          x: 300,
          y: 200
        }, {
          id: 'node3',
          x: 300,
          y: 300
        }],
        edges: [{
          id: 'edge1',
          target: 'node2',
          source: 'node1'
        }]
      }

      // 图画布的定义
      this.graph = new G6.Graph({
        container: 'cy-topology',
        width: 500,
        height: 500,
        modes: {
          default: ['drag-node', 'click-select'],
          addNode: ['click-add-node', 'click-select'],
          addEdge: ['click-add-edge', 'click-select']
        }
      })

      // 将 read 方法分解成 data() 和 render 方法，便于整个生命周期的管理
      this.graph.read(data)
      this.graph.render()

      // 封装点击添加节点的交互
      G6.registerBehavior('click-add-node', {
        getEvents() {
          return {
            'canvas:click': 'onClick'
          }
        },
        onClick(ev) {
          const graph = this.graph
          const node = graph.addItem('node', {
            x: ev.x,
            y: ev.y,
            id: G6.Util.uniqueId()
          })
        }
      })

      // 封装点击添加边的交互
      G6.registerBehavior('click-add-edge', {
        getEvents() {
          return {
            'node:click': 'onClick',
            mousemove: 'onMousemove',
            'edge:click': 'onEdgeClick' // 点击空白处，取消边
          }
        },
        onClick(ev) {
          const node = ev.item
          const graph = this.graph
          const point = { x: ev.x, y: ev.y }
          const model = node.getModel()
          if (this.addingEdge && this.edge) {
            graph.updateItem(this.edge, {
              target: model.id
            })

            this.edge = null
            this.addingEdge = false
          } else {
            this.edge = graph.addItem('edge', {
              source: model.id,
              target: point
            })
            this.addingEdge = true
          }
        },
        onMousemove(ev) {
          const point = { x: ev.x, y: ev.y }
          if (this.addingEdge && this.edge) {
            this.graph.updateItem(this.edge, {
              target: point
            })
          }
        },
        onEdgeClick(ev) {
          const currentEdge = ev.item
          // 拖拽过程中，点击会点击到新增的边上
          if (this.addingEdge && this.edge == currentEdge) {
            graph.removeItem(this.edge)
            this.edge = null
            this.addingEdge = false
          }
        }
      })

    },
    changeMode(value) {
      this.graph.setMode(value)
    }
  }
}
</script>

<style>
.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
