<template>
  <div class="header-bar">
    <el-row>
      <el-col :span="8" style="text-align: left">
        <router-link to="/">
          <div class="navbar-brand">
            <img id="logo" src="@/assets/logo.png" width="38px" height="38px" alt="CCEditor"/>
            <span> CCEditor </span>
          </div>
        </router-link>
      </el-col>
      <el-col :span="8" style="text-align: center">
        <div class="navbar-title">&nbsp;</div>
      </el-col>
      <el-col :span="8" style="text-align: right">
        <div class="navbar-btns">
          <el-button type="text" @click="home">首页</el-button>
          <el-button type="text" @click="about">关于CCEditor</el-button>
          <el-button type="text" @click="tutorial">使用教程</el-button>
          <el-button type="text" @click="$message('敬请期待...')">其它</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'HeadBar',

  methods: {
    home() {
      this.$router.push({
        path: '/'
      })
    },
    about() {
      this.$router.push({
        path: '/about'
      })
    },
    tutorial() {
      this.$message({
        dangerouslyUseHTMLString: true,
        message: '<div style="text-align: left">时间原因，暂未编写。<br/><br/>目前【开发方式】和【使用方式】可先参考 README.md。 <br/><br/><div style="text-align: right">—— by wenyuan</div></div>',
        type: 'info',
        center: true,
        duration: 5000,
        showClose: false,
        offset: 100
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.header-bar {
  .navbar-brand {
    display: inline-block;
    margin: 0 18px 0 35px;
    /*padding: 0 0 0 8px;*/
    line-height: 22px;
    font-size: 20px;

    img {
      vertical-align: middle;
    }

    span {
      vertical-align: middle;
      /*font-family: "Microsoft YaHei";*/
      color: #06080A;
    }
  }

  .navbar-title {
    vertical-align: middle;
    text-align: center;
    font-size: 20px;
  }

  .navbar-btns {
    vertical-align: middle;
    text-align: right;
    .el-button:last-child {
      margin-right: 20px;
    }

    .el-button--text {
      color: #06080A;
    }
  }
}
</style>
