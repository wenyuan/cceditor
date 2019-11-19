/**
 * @author: winyuan
 * @data: 2019/07/05
 * @repository: https://github.com/winyuan
 * @description: 图的布局方式/图的初始化
 */

import d3 from '../plugins/d3-installer'
import theme from '../theme'

/**
 * 图的布局方式/图的初始化
 * @type {{commonGraph: (function(*, *): G6.Graph)}}
 */
const initGraph = {
  /**
   * 一般布局
   * @param G6
   * @param options
   * @returns {G6.Graph}
   */
  commonGraph: function(G6, options) {
    let graphData = options.graphData
    let themeStyle = theme.defaultStyle // todo...先使用默认主题，后期可能增加其它风格的主体
    // 生成G6实例
    let graph = new G6.Graph({
      plugins: options.plugins,
      container: options.container,
      width: options.width,
      height: options.height,
      // layout: {
      //   type: 'random',
      //   width: options.width,
      //   height: options.height
      // },
      defaultNode: {
        shape: 'cc-rect',
        labelCfg: {
          position: 'bottom'
        }
      },
      defaultEdge: {
        shape: 'cc-line',
        labelCfg: {
          position: 'center',
          autoRotate: false
        }
      },
      nodeStyle: themeStyle.nodeStyle,
      // nodeStyle: {
      //   selected: {
      //     shadowColor: '#626262',
      //     shadowBlur: 8,
      //     shadowOffsetX: -1,
      //     shadowOffsetY: 3
      //   }
      // },
      edgeStyle: themeStyle.edgeStyle,
      // edgeStyle: {
      //   default: {
      //     stroke: '#e2e2e2',
      //     lineWidth: 3,
      //     lineAppendWidth: 10
      //   },
      //   selected: {
      //     shadowColor: '#626262',
      //     shadowBlur: 3
      //   }
      // },
      modes: options.modes
    })
    // 将 read 方法分解成 data() 和 render 方法，便于整个生命周期的管理
    graph.read(graphData)
    graph.render()
    // 返回G6实例
    return graph
  },
  /**
   * 力导布局
   * @param G6
   * @param options
   * @returns {*}
   */
  forceLayoutGraph: function(resolve, G6, options) {
    let graphData = options.graphData
    let themeStyle = theme.defaultStyle // todo...先使用默认主题，后期可能增加其它风格的主体
    // 生成G6实例
    let graph = new G6.Graph({
      container: options.container,
      width: options.width,
      height: options.height,
      nodeStyle: themeStyle.nodeStyle,
      edgeStyle: themeStyle.edgeStyle
    })
    // 初始化力导布局
    let simulation = d3
      .forceSimulation()
      .force(
        'link',
        d3
          .forceLink()
          .id(function(d) {
            return d.id
          })
          .distance(linkDistance)
          .strength(0.5)
      )
      .force('charge', d3.forceManyBody().strength(-500).distanceMax(500).distanceMin(100))
      .force('center', d3.forceCenter(options.width / 2, options.height / 2))
    // 定义节点数据
    simulation.nodes(graphData.nodes).on('tick', ticked)
    // 定义连线数据
    let edges = []
    for (let i = 0; i < graphData.edges.length; i++) {
      edges.push({
        id: graphData.edges[i].id,
        source: graphData.edges[i].source,
        target: graphData.edges[i].target
      })
    }
    simulation.force('link').links(edges)
    graph.data(graphData)
    graph.render()

    function linkDistance(d) {
      return 150
    }

    function ticked() {
      // protect: planA: 移除事件监听器 planB: 手动停止力模拟
      if (graph.destroyed) {
        // simulation.nodes(graphData.nodes).on('tick', null)
        simulation.stop()
        return
      }
      if (!graph.get('data')) {
        // 若是第一次渲染，定义数据，渲染
        graph.data(graphData)
        graph.render()
      } else {
        // 后续渲染，直接刷新所有点和边的位置
        graph.refreshPositions()
      }
    }

    // 控制时间: 只布局10秒
    let t = setTimeout(function() {
      simulation.stop()
      resolve(graph)
    }, 10000)

    // 判断force-layout结束
    simulation.on('end', () => {
      clearTimeout(t)
      resolve(graph)
    })
  }
}

export default initGraph
