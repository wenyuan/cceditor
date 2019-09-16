<template>
  <el-row class="toolbar">
    <el-col :span="3">
      &nbsp;
    </el-col>
    <el-col :span="18">
      <div class="graph-ops">
        <i class="iconfont icon-zoom-in" id="zoom-in" title="放大" @click="$parent.zoomInHandler"></i>
        <i class="iconfont icon-zoom-out" title="缩小" @click="$parent.zoomOutHandler"></i>
        <i class="iconfont icon-fit" title="适应画布" @click="$parent.autoZoomHandler"></i>
        <i class="iconfont icon-actual-size" title="实际尺寸" @click="$parent.resetZoomHandler"></i>
        <span class="separator"></span>
        <el-checkbox @change="$parent.enableMinimapHandler">导航器</el-checkbox>
        <i class="iconfont icon-marquee" id="multi-select" title="框选" @click="$parent.multiSelectHandler"></i>
      </div>
      当前模式：{{ $parent.graphMode }}
    </el-col>
    <el-col :span="3" style="text-align: right;">
      <el-button size="mini" @click="$parent.changeModeHandler('edit')">编辑</el-button>
      <el-button size="mini" @click="$parent.getGraphData">获取json数据</el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'ToolbarEdit'
};
</script>

<style lang="scss" scoped>
.toolbar {
  color: #333;
  text-align: left;
  vertical-align: middle;
  line-height: 42px;
  background-color: #ffffff;
  border: 1px solid #E9E9E9;
  box-shadow: 0 8px 12px 0 rgba(0, 52, 107, 0.04);

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
  }
}
</style>