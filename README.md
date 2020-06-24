# CCEditor

<p align="center">
  <img src="https://www.wenyuanblog.com/medias/logo/cceditor.png" alt="cceditor" width="120" hegiht="120"/>
</p>

<p align="center">
  <img alt="vue" src="https://img.shields.io/badge/vue-2.6.10-brightgreen.svg?style=flat-square">
  <img alt="g6" src="https://img.shields.io/badge/g6-3.5.0-brightgreen.svg?style=flat-square">
  <img alt="license" src="https://img.shields.io/badge/license-MIT-green.svg?style=flat-square">
  <img alt="release" src="https://img.shields.io/badge/release-v0.1.0-blue.svg?style=flat-square">
  <a href="https://www.wenyuanblog.com/" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/about-My%20Blog-46BC99.svg?style=flat-square" alt="wenyuanblog">
  </a>
  <a href="https://www.wenyuanblog.com/medias/reward/wechatpay.png"  style="text-decoration: none;">
    <img src="https://img.shields.io/badge/%24-donate-ff69b4.svg?style=flat-square" alt="donate">
  </a>
</p>

> A visual graph editor component library based on G6 and Vue.js. </br>
> 基于G6和Vue的可视化图形编辑组件库。

## 一、 版本

| 开发版本 |
| :-------- |
| [v0.1.0](https://github.com/winyuan/cceditor/tree/master) |

## 二、预览

[DEMO演示](http://cceditor.wenyuanblog.com)
![](./docs/preview.png)

## 三、项目依赖

* [Vue.js（2.x）](https://cn.vuejs.org/)
* ~~[Element UI（2.x）](https://element.eleme.cn/2.0/#/zh-CN)~~
* [AntV G6（3.x）](http://antv.alipay.com/zh-cn/index.html)

## 四、项目结构

```
.
├── packages  // 源码
├── examples  // 用例（开发调试用）
├── 其它
|
```

## 五、开发方式

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

## 六、使用方式

### 1. 安装CCEditor

```bash
# 本地安装
npm install chaincloud-cceditor-0.1.0.tgz

# npm安装（暂不支持）
npm install @chaincloud/cceditor --save
```
本地安装：[安装包下载](https://github.com/winyuan/cceditor/releases)

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

## 七、备注

* \[已解决]升级 G6 到 3.5.0 后，发现 G6 底层有 [bug](https://github.com/antvis/G6/issues/1613)：调用addItem方法报错：`p.getType is not a function`。该 bug 导致编辑（连线）功能不可用，需等待下个小版本的修复。—— 2020.06.02
* \[已解决]由于 G6 在 3.3.x 版本作了 breaking change，且遗留了一些 bug。本项目先暂停更新。预计 6 月份或 G6 底层这些重要 bug 修复后，继续跟进。—— 2020.03.01