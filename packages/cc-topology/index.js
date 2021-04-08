/**
 * @author: wenyuan
 * @data: 2019/08/20
 * @repository: https://github.com/wenyuan
 * @description: 导入组件，组件必须声明 name
 */

import CCTopology from './src/cc-topology'

// 为组件提供 install 安装方法，供按需引入
CCTopology.install = function(Vue) {
  console.info('install----CCEditor: CCTopology----')
  Vue.component(CCTopology.name, CCTopology)
}

// 默认导出组件
export default CCTopology
