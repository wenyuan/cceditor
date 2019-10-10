<template>
  <div class="home">
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
  </div>
</template>

<script>
export default {
  name: 'Home',

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
</style>
