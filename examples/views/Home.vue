<template>
  <div class="home">
    <el-container>
      <el-header height="60px">
        <el-row :gutter="20">
          <el-col :span="8" style="text-align: left">
            <a class="navbar-brand" href="http://www.chain2cloud.com/" target="_blank">
              <img id="logo" src="@/assets/logo.png" width="38px" height="38px" alt="CCEditor"/>
              <span> CCEditor </span>
            </a>
          </el-col>
          <el-col :span="8" style="text-align: center">
            <div class="navbar-title">&nbsp;</div>
          </el-col>
          <el-col :span="8" style="text-align: right">
            <div class="navbar-btns">
              <el-button type="text" @click="about">关于CCEditor</el-button>
              <el-button type="text" @click="$message('正在玩命开发中...')">使用教程</el-button>
              <el-button type="text" @click="$message('正在玩命开发中...')">Demo演示</el-button>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="8" v-for="(demo, index) in demoList" :key="index">
            <router-link :to="demo.route">
              <el-card shadow="hover" :body-style="{ padding: '0px' }">
                <img :src="demo.imgSrc"
                     class="image">
                <div style="padding: 14px;">
                  <el-popover
                    placement="bottom"
                    :title="demo.title"
                    width="200"
                    trigger="hover">
                    <div><span v-html="demo.description"></span></div>
                    <span slot="reference">{{ demo.title }}</span>
                  </el-popover>
                  <div class="bottom clearfix">
                    <span class="developer">Developer: {{ demo.developer }}</span>
                  </div>
                </div>
              </el-card>
            </router-link>
          </el-col>
        </el-row>
      </el-main>
      <el-footer height="60px">
        <div class="links">
          <ul>
            <li>
              <a href="javascript:void(0);">
                <i class="fab fa-github"></i>
              </a>
            </li>
            <li>
              <a href="javascript:void(0);">
                <i class="fab fa-weixin"></i>
              </a>
            </li>
            <li>
              <a href="javascript:void(0);">关于我们</a>
            </li>
          </ul>
        </div>
        <div class="copyright">
          <ul>
            <li class="nav-item">
              <span>ChainCloud FE</span>
            </li>
            <li>
              <span>|</span>
            </li>
            <li class="nav-item">
              <span>Copyright © 无锡畅云网络有限公司</span>
            </li>
          </ul>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {},
  data() {
    return {
      demoList: [
        {
          title: '拓扑图',
          developer: 'winyuan',
          description: '拓扑网络编辑器<br/>',
          imgSrc: 'https://gw.alipayobjects.com/zos/rmsportal/qgoVLcrWRmctqgnrDRXW.png',
          route: {
            name: 'DemoTopology'
          }
        }
      ]
    }
  },
  methods: {
    about() {
      this.$message({
        dangerouslyUseHTMLString: true,
        message: '<div style="text-align: center"><strong>CCEditor</strong> 由畅云网络前端团队开发，用于提供一系列图可视化解决方案。<br/><br/>它提供了各种简单、易用、完备、强大的图可视化组件，<br/><br/>在开箱即用的基础上，可以很方便的进行业务定制。</div>',
        type: 'info',
        center: true,
        duration: 30000,
        showClose: true,
        offset: 100
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  margin: 0;
  padding: 0;
  height: 100%;
  text-align: center;

  a {
    text-decoration: none;
  }

  .el-container {
    height: 100%;
  }

  .el-header {
    line-height: 60px;
    text-align: center;
    background-color: #FDFDFD;
    box-shadow: 0 2px 8px rgba(229, 229, 229, 0.5);

    .navbar-brand {
      display: inline-block;
      margin-right: 18px;
      padding: 0 0 0 8px;
      line-height: 22px;
      font-size: 20px;

      img {
        vertical-align: middle;
      }

      span {
        vertical-align: middle;
        font-family: "Microsoft YaHei";
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

      .el-button--text {
        color: #06080A;
      }
    }
  }

  .el-main {
    margin: 0;
    padding: 0;
    text-align: center;

    .el-col {
      padding: 20px 30px;
    }

    .bottom {
      margin-top: 13px;
      line-height: 12px;
    }

    .developer {
      padding: 0;
      float: right;
      color: #409EFF;
    }

    .image {
      width: 100%;
      display: block;
    }

    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }

    .clearfix:after {
      clear: both
    }

  }

  .el-footer {
    width: 100%;
    line-height: 60px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.45);
    background-color: #06080A;
    border: none;
    border-top: 1px solid rgba(197, 203, 217, 0.3);

    .links {
      float: left;

      ul {
        padding-left: 60px;
      }

      li {
        display: inline;
        padding: 10px;
      }

      i {
        font-size: 16px;
      }

      a {
        color: rgba(255, 255, 255, 0.45);
      }
    }

    .copyright {
      float: right;

      ul {
        padding-right: 60px;
      }

      li {
        display: inline;
        padding: 5px;
      }

      i {
        font-size: 16px;
      }

      a {
        color: rgba(255, 255, 255, 0.45);
      }
    }
  }
}
</style>
