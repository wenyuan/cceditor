<template>
  <div class="pages-layout">
    <el-container>
      <el-header height="60px">
        <header-bar></header-bar>
      </el-header>
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
    .el-header {
      padding: 0;
      line-height: 60px;
      text-align: center;
      background-color: #FDFDFD;
      box-shadow: 0 2px 8px rgba(229, 229, 229, 0.5);
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
}
</style>
