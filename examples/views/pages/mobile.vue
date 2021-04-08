<template>
  <div class="mobile">
    <el-container>
      <el-header>
        <div class="navbar-brand">
          <img id="logo" src="@/assets/logo.png" width="38px" height="38px" alt="CCEditor"/>
          <span> CCEditor </span>
        </div>
      </el-header>
      <el-main>
        <div class="demo-item" @click="clickDemoItem" v-for="(demo, index) in demoList" :key="index">
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
        </div>
      </el-main>
      <el-footer height="45px">
        <div class="copyright">
          <ul>
            <li class="nav-item">
              <span>CCEditor 0.1.0</span>
            </li>
            <li>
              <span>|</span>
            </li>
            <li class="nav-item">
              <span>ChainCloud FE</span>
            </li>
          </ul>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Mobile',
  data() {
    return {
      demoList: [
        {
          title: '拓扑图',
          developer: 'wenyuan',
          description: '拓扑网络编辑器<br/>',
          imgSrc: require('@/assets/images/topology.png'),
          route: {
            name: 'DemoTopology'
          }
        }
      ]
    }
  },
  methods: {
    clickDemoItem() {
      this.$message({
        dangerouslyUseHTMLString: true,
        message: '<div style="text-align: center">请使用PC端预览Demo编辑器效果。<br/><br/>—— by wenyuan</div></div>',
        type: 'info',
        center: true,
        duration: 3000,
        showClose: false,
        offset: 100
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-header {
  position: fixed;
  width: 100%;
  line-height: 60px;
  text-align: center;
  background-color: #FDFDFD;
  box-shadow: 0 2px 8px rgba(229, 229, 229, 0.5);

  .navbar-brand {
    display: inline-block;
    margin-right: 18px;
    margin-left: 8px;
    padding: 0 0 0 8px;
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
}

.el-main {
  margin-top: 60px;
  .demo-item {
    margin: 10px 0 20px;
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
  line-height: 45px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  background-color: #06080A;
  border: none;
  border-top: 1px solid rgba(197, 203, 217, 0.3);

  .copyright {
    text-align: center;

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
</style>
