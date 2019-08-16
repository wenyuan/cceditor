/**
 * 拓扑图的自定义节点
 * @param G6
 */
export default function(G6) {
  // 自定义节点：带告警的图形节点
  G6.registerNode(
    'cc-image',
    {
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
          back1.animate(
            {
              // 逐渐放大，并消失
              r: r + 10,
              opacity: 0.1,
              repeat: true // 循环
            },
            3000,
            'easeCubic',
            null,
            0
          ); // 无延迟
          back2.animate(
            {
              // 逐渐放大，并消失
              r: r + 10,
              opacity: 0.1,
              repeat: true // 循环
            },
            3000,
            'easeCubic',
            null,
            1000
          ); // 1 秒延迟
          back3.animate(
            {
              // 逐渐放大，并消失
              r: r + 10,
              opacity: 0.1,
              repeat: true // 循环
            },
            3000,
            'easeCubic',
            null,
            2000
          ); // 2 秒延迟
        }
      }
    },
    'image'
  );
}
