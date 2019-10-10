<template>
  <div class="about">
    <h1 class="title">可视化图形编辑组件库</h1>
    <p class="description">
      CCEditor，一套基于 G6 和 Vue2.5 的可视化图形编辑组件库。<br/>
      提供了一系列图可视化解决方案，适用于对图有
      <el-tooltip placement="right" effect="light" popper-class="description-tooltip">
        <span slot="content">节点和连线的拖拽等鼠标键盘事件，<br/>节点和连线的动态参数配置和数据绑定等。</span>
        <span class="tips">复杂交互需求</span>
      </el-tooltip>
      的场景。<br/>
      简单、易用，在开箱即用的基础上，可以很方便的进行 <span class="tips">业务定制</span> 和 <span class="tips">功能扩展</span>。
    </p>
    <div class="demo-preview">
      <img :src="require('@/assets/images/demo_topology.gif')"/>
    </div>
  </div>
</template>

<script>

export default {
  name: 'about',
  components: {},
  data() {
    return {
      graph: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.about {
  width: 100%;
  height: 100%;
  background: #F8FAFE;

  .title {
    padding: 50px 0 0 0;
    font-size: 34px;
    line-height: 48px;
    color: #555;
  }

  .description {
    margin: 20px 0 5px;
    font-size: 18px;
    line-height: 36px;
    color: #888;
    .tips {
      color: #409eff;
    }
  }

  .demo-preview {
    background: #F8FAFE;
    margin: 20px 0 5px;
    img {
      padding: 0 20px;
    }
  }
}
</style>


<style lang="scss">
.description-tooltip {
  background: hsla(0, 0%, 100%, .8) !important;
  border: 1px solid #eeeeee !important;
  /*-webkit-box-shadow: 0 0 3px rgba(0, 0, 0, .2);*/
  /*box-shadow: 0 0 3px rgba(0, 0, 0, .2);*/
  border-radius: 4px;
  line-height: 18px;
}

// 去掉边框箭头的黑框
.el-tooltip__popper.is-light.description-tooltip .popper__arrow {
  border-color: #ddd transparent !important; // placement="top"时
}

.el-tooltip__popper.is-light.description-tooltip .popper__arrow {
  border-color: transparent #ddd !important; //placement="left/right"时
}
</style>