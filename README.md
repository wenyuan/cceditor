# CCEditor
> A visual graph editor based on G6 and Vue.js.
> 基于G6和Vue的可视化图形编辑器。

## 版本
| 稳定版本 |
| :-------- |
| [v1.0.0](http://192.168.10.43/BigView/cceditor/tree/master) |

## 预览
[DEMO演示](http://192.168.10.43/BigView/cceditor.git)
![](./docs/preview.png)

## 项目依赖
* [Vue.js（2.x）](https://cn.vuejs.org/)
* [Element UI（2.x）](https://element.eleme.cn/2.0/#/zh-CN)
* [AntV G6（3.x）](http://antv.alipay.com/zh-cn/index.html)

## 项目结构
```
.
├── packages  // 源码
├── examples  // 用例（开发调试用）
├── 其它
|
```

## 开发方式
### 1. 调试
```bash
npm install
npm run serve
```

### 2. 发布
```bash
npm run lib
npm pack
```


## 使用方式
### 1. 安装CCEditor
```bash
# 本地安装
npm install chaincloud-cceditor-0.1.0.tgz

# npm安装（暂不支持）
npm install @chaincloud/cceditor --save
```

### 2. 引入CCEditor
#### 全局注册
在 `main.js` 中写入以下内容：
* 完整引入：引入整个CCEditor：

```javascript
import Vue from 'vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'

import App from './App.vue'

Vue.use(ElementUI)

/* 全局注册：引入整个CCEditor */
import CCEditor from '@chaincloud/cceditor'
Vue.use(CCEditor)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```
* 按需引入：引入需要的模块，例如CCTopology：

```javascript
import Vue from 'vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'

import App from './App.vue'

Vue.use(ElementUI)

/* 全局注册：只加载CCTopology */
import { CCTopology } from '@chaincloud/cceditor'
Vue.use(CCTopology)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

#### 局部注册
在 `ComponentA.vue` 中进行局部注册：
```vue
<script>
import { CCTopology } from '@chaincloud/cceditor'

export default {
  name: 'ComponentA',
  components: {
    'cc-topology': CCTopology
  }
}
</script>
```

### 3. 开始使用
#### 属性
TODO...

#### 方法
TODO...
