/**
 * @author: winyuan
 * @data: 2019/07/05
 * @repository: https://github.com/winyuan
 * @description: 图的布局方式/图的初始化
 */

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
  commonGraph: function (G6, options) {
    let graphData = options.graphData
    let themeStyle = theme.defaultStyle // todo...先使用默认主题，后期可能增加其它风格的主体
    // 生成G6实例
    let graph = new G6.Graph({
      plugins: options.plugins,
      container: options.container,
      width: options.width,
      height: options.height,
      groupByTypes: options.graphMode === 'edit', // TODO...G6 节点与边的层级(临时方案)
      defaultNode: {
        type: 'cc-rect',
        labelCfg: themeStyle.nodeLabelCfg
      },
      defaultEdge: {
        type: 'cc-line',
        labelCfg: themeStyle.edgeLabelCfg
      },
      defaultCombo: {
        type: 'circle',
        style: themeStyle.comboStyle.default,
        labelCfg: themeStyle.comboLabelCfg
      },
      nodeStateStyles: themeStyle.nodeStyle,
      edgeStateStyles: themeStyle.edgeStyle,
      comboStateStyles: themeStyle.comboStyle,
      modes: options.modes
    })
    // 将 read 方法分解成 data() 和 render 方法，便于整个生命周期的管理
    graph.read(graphData)
    graph.render()
    // 返回G6实例
    return graph
  }
}

export default initGraph
