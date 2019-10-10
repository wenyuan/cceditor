<template>
  <div class="pages-layout">
    <el-container>
      <header-bar></header-bar>
      <el-main>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
      <el-footer height="60px">
        <footer-bar></footer-bar>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import HeaderBar from '../../components/HeaderBar'
import FooterBar from '../../components/FooterBar'

export default {
  components: {
    'header-bar': HeaderBar,
    'footer-bar': FooterBar
  },
  data() {
    return {
      demoList: [
        {
          title: '拓扑图',
          developer: 'winyuan',
          description: '拓扑网络编辑器<br/>',
          imgSrc: require('@/assets/images/demo-topology.png'),
          route: {
            name: 'DemoTopology'
          }
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.pages-layout {
  margin: 0;
  padding: 0;
  height: 100%;
  text-align: center;

  .el-container {
    height: 100%;
  }

  .el-main {
    margin: 0;
    padding: 0;
    text-align: center;
  }

  .el-footer {
    width: 100%;
    line-height: 55px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.45);
    background-color: #06080A;
    border: none;
    border-top: 1px solid rgba(197, 203, 217, 0.3);
  }
}
</style>
