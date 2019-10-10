<template>
  <div class="footer-bar">
    <div class="links">
      <ul>
        <li>
          <a href="https://github.com/winyuan" target="_blank">
            <i class="iconfont icon-github"></i>
          </a>
        </li>
        <li>
          <a href="javascript:void(0);">
            <i class="fab fa-weixin"></i>
          </a>
        </li>
        <li>
          <a href="javascript:void(0);">更新日志</a>
        </li>
        <li>
          <a href="https://github.com/winyuan/style-guide" target="_blank">代码规范</a>
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
          <span>CCEditor 0.1.0</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FooterBar',

  methods: {
    home() {
      this.$router.push({
        path: '/'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.footer-bar {
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
</style>
