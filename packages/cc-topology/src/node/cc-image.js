/**
 * 图片节点
 */

import utils from '../utils'

export default {
  name: 'cc-image',
  extendName: 'image',
  options: {
    setState(name, value, item) {
      // 设置节点状态
      utils.node.setState(name, value, item)
      // 设置锚点状态
      utils.anchor.setState(name, value, item)
    },
    // 绘制后附加锚点
    afterDraw(cfg, group) {
      console.log('afterDraw')
      // 绘制锚点
      utils.anchor.draw(cfg, group)
      /*
      // 告警
      if (cfg.appState && cfg.appState.alert) {
        let size = this.getSize(cfg) || [48, 48];
        let r = size[0] / 2;
        let back1 = group.addShape('circle', {
          zIndex: -3,
          attrs: {
            x: 0,
            y: 0,
            r: r,
            fill: cfg.color || '#1890FF',
            opacity: 0.6
          }
        });
        let back2 = group.addShape('circle', {
          zIndex: -2,
          attrs: {
            x: 0,
            y: 0,
            r: r,
            fill: cfg.color || '#1890FF', // 为了显示清晰，随意设置了颜色
            opacity: 0.6
          }
        });

        let back3 = group.addShape('circle', {
          zIndex: -1,
          attrs: {
            x: 0,
            y: 0,
            r: r,
            fill: cfg.color || '#1890FF',
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
      */
    },
    // 设置告警状态
    afterUpdate(cfg, node) {
      const group = node.getContainer()
      console.log('afterUpdate')
      // 告警
      if (cfg.appState && cfg.appState.alert) {
        let size = this.getSize(cfg) || [48, 48]
        let r = size[0] / 2
        let { id } = cfg
        let halo1 = group.addShape('circle', {
          id: id + '_halo_' + 1,
          attrs: {
            name: 'halo',
            x: 0,
            y: 0,
            r: r,
            fill: cfg.color || '#1890FF',
            opacity: 0.6
          },
          zIndex: -3
        })
        let halo2 = group.addShape('circle', {
          id: id + '_halo_' + 2,
          attrs: {
            name: 'halo',
            x: 0,
            y: 0,
            r: r,
            fill: cfg.color || '#1890FF', // 为了显示清晰，随意设置了颜色
            opacity: 0.6
          },
          zIndex: -2
        })
        let halo3 = group.addShape('circle', {
          id: id + '_halo_' + 3,
          attrs: {
            name: 'halo',
            x: 0,
            y: 0,
            r: r,
            fill: cfg.color || '#1890FF',
            opacity: 0.6
          },
          zIndex: -1
        })
        group.sort() // 排序，根据zIndex 排序
        halo1.animate({ // 逐渐放大，并消失
          r: r + 10,
          opacity: 0.1,
          repeat: true // 循环
        }, 3000, 'easeCubic', null, 0) // 无延迟
        halo2.animate({ // 逐渐放大，并消失
          r: r + 10,
          opacity: 0.1,
          repeat: true // 循环
        }, 3000, 'easeCubic', null, 1000) // 1 秒延迟
        halo3.animate({ // 逐渐放大，并消失
          r: r + 10,
          opacity: 0.1,
          repeat: true // 循环
        }, 3000, 'easeCubic', null, 2000) // 2 秒延迟
      } else {
        const children = group.findAll(function(item) {
          return item._attrs.name === 'halo'
        })
        for (let i = 0; i < children.length; i++) {
          group.removeChild(children[i])
        }
      }
    }
  }
}
