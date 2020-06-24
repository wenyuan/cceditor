/**
 * @author: winyuan
 * @data: 2019/11/20
 * @repository: https://github.com/winyuan
 * @description: dark style
 */

export default {
  // 节点样式
  nodeStyle: {
    default: {
      stroke: '#CED4D9',
      fill: 'transparent',
      shadowOffsetX: 0,
      shadowOffsetY: 4,
      shadowBlur: 10,
      shadowColor: 'rgba(13, 26, 38, 0.08)',
      lineWidth: 1,
      radius: 4,
      strokeOpacity: 0.7
    },
    selected: {
      shadowColor: '#ff240b',
      shadowBlur: 4,
      shadowOffsetX: 0,
      shadowOffsetY: 0
      // shadowColor: '#626262',
      // shadowBlur: 8,
      // shadowOffsetX: -1,
      // shadowOffsetY: 3
    },
    unselected: {
      shadowColor: ''
    }
  },
  // 节点标签样式
  nodeLabelCfg: {
    positions: 'center',
    style: {
      fill: '#FFF'
    }
  },
  // 连线样式
  edgeStyle: {
    default: {
      stroke: '#53da3a',
      lineWidth: 2,
      strokeOpacity: 0.92,
      lineAppendWidth: 10
      // endArrow: true
    },
    active: {
      shadowColor: 'red',
      shadowBlur: 4,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    },
    inactive: {
      shadowColor: ''
    },
    selected: {
      shadowColor: '#ff240b',
      shadowBlur: 4,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    },
    unselected: {
      shadowColor: ''
    }
  },
  // 连线标签样式
  edgeLabelCfg: {
    position: 'center',
    autoRotate: false,
    style: {
      fill: '#000'
    }
  },
  // 锚点样式
  anchorStyle: {
    default: {
      radius: 3,
      symbol: 'circle',
      fill: '#FFFFFF',
      fillOpacity: 0,
      stroke: '#1890FF',
      strokeOpacity: 0,
      cursor: 'crosshair'
    },
    hover: {
      fillOpacity: 1,
      strokeOpacity: 1
    },
    unhover: {
      fillOpacity: 0,
      strokeOpacity: 0
    },
    active: {
      fillOpacity: 1,
      strokeOpacity: 1
    },
    inactive: {
      fillOpacity: 0,
      strokeOpacity: 0
    }
  },
  // 锚点背景样式
  anchorBgStyle: {
    default: {
      radius: 10,
      symbol: 'circle',
      fill: '#1890FF',
      fillOpacity: 0,
      stroke: '#1890FF',
      strokeOpacity: 0,
      cursor: 'crosshair'
    },
    hover: {
      fillOpacity: 1,
      strokeOpacity: 1
    },
    unhover: {
      fillOpacity: 0,
      strokeOpacity: 0
    },
    active: {
      fillOpacity: 0.3,
      strokeOpacity: 0.5
    },
    inactive: {
      fillOpacity: 0,
      strokeOpacity: 0
    }
  },
  // 分组样式
  comboStyle: {
    default: {
      lineWidth: 1
    },
    hover: {
      lineWidth: 3
    }
  },
  // 分组标签样式
  comboLabelCfg: {
    position: 'top',
    style: {
      fontSize: 20,
      fill: '#4682B4'
    }
  }
}
