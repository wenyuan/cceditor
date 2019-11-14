<template>
  <div class="toolbar">
    <div class="left">&nbsp;</div>
    <div class="center">
      <div class="graph-ops">
        <i class="iconfont icon-zoom-in" id="zoom-in" title="放大" @click="$parent.zoomInHandler"></i>
        <i class="iconfont icon-zoom-out" title="缩小" @click="$parent.zoomOutHandler"></i>
        <i class="iconfont icon-fit" title="适应画布" @click="$parent.autoZoomHandler"></i>
        <i class="iconfont icon-actualsize" title="实际尺寸" @click="$parent.resetZoomHandler"></i>
        <span class="separator"></span>
        <cc-checkbox @change="$parent.enableMinimapHandler">导航器</cc-checkbox>
        <el-dropdown class="auto-refresh" trigger="click" @command="toggleAutoRefresh">
        <span class="el-dropdown-link">
          {{ currentRefreshOption.label }}<span class="iconfont icon-arrow-dropdown" style="padding-left: 5px;"></span>
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="refreshOption in refreshOptions"
              :key="refreshOption.label"
              :command="refreshOption.value"
            >
              {{ refreshOption.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="right" style="text-align: right;">
      <cc-button size="mini" @click="$parent.manualRefreshHandler">刷新</cc-button>
      <cc-button size="mini" @click="$parent.changeModeHandler('edit')">编辑</cc-button>
    </div>
  </div>
</template>

<script>
import { Checkbox, Button } from '../../cc-elements'

export default {
  name: 'ToolbarEdit',
  components: {
    // element-ui的组件
    // 'el-row': Row,
    // 'el-col': Col,
    'cc-checkbox': Checkbox,
    'cc-button': Button
  },
  data() {
    return {
      refreshOptions: [
        { value: -1, label: '不自动刷新' },
        { value: 10000, label: '10秒自动刷新' },
        { value: 30000, label: '30秒自动刷新' },
        { value: 60000, label: '60秒自动刷新' }
      ],
      currentRefreshOption: { value: -1, label: '不自动刷新' }
    }
  },
  methods: {
    toggleAutoRefresh(command) {
      this.currentRefreshOption = this.refreshOptions.filter(function(item){
        return item.value === command
      })[0]
      this.$parent.autoRefreshHandler(command)
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  /*height: 42px;*/
  color: #333;
  text-align: left;
  vertical-align: middle;
  line-height: 42px;
  background-color: #ffffff;
  border: 1px solid #E9E9E9;
  box-shadow: 0 8px 12px 0 rgba(0, 52, 107, 0.04);
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;

  .left {
    display: inline-block;
    width: 10%;
  }

  .center {
    display: inline-block;
    width: 60%;
  }

  .right {
    display: inline-block;
    width: 30%;
  }

  .edge-enabled {
    width: 40%;
    text-align: center;
  }

  .edge-type {
    width: 60%;
    line-height: 25px;
    text-align: left;
  }

  .graph-ops {
    display: inline-block;
    vertical-align: middle;
    margin-left: 20px;

    i {
      width: 20px;
      height: 20px;
      margin: 0 6px;
      line-height: 20px;
      color: #a8a8a8;
      text-align: center;
      border-radius: 2px;
      display: inline-block;
      border: 1px solid rgba(2, 2, 2, 0);
    }

    i:hover {
      cursor: pointer;
      border: 1px solid #E9E9E9;
    }

    .disabled {
      color: rgba(0, 0, 0, 0.25);
    }

    .disabled:hover {
      cursor: not-allowed;
      border: 1px solid rgba(2, 2, 2, 0);
    }

    .icon-select {
      background-color: #EEEEEE;
    }

    .separator {
      margin: 4px;
      border-left: 1px solid #E9E9E9;
    }

    .auto-refresh {
      margin: 0 8px 0 12px;
    }

    .cc-checkbox {
      margin: 0 6px;
    }
  }

  .cc-button {
    margin: 0 5px;
  }
}
</style>
