<template>
  <el-row class="toolbar">
    <el-col :span="3">
      <el-checkbox class="edge-enabled" title="连线模式" @change="$parent.enableEdgeHandler"></el-checkbox>
      <el-dropdown class="edge-type" trigger="click" @command="$parent.changeEdgeType">
        <span class="el-dropdown-link">
          {{ $parent.currentEdgeType.label }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="edgeType in $parent.edgeTypeList"
            :key="edgeType.guid"
            :command="edgeType.guid"
          >
            {{ edgeType.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
    <el-col :span="15">
      <div class="graph-ops">
        <i class="fas fa-reply" title="撤销" :class="$parent.disableUndo ? 'disabled':''"
           @click="$parent.undoHandler"></i>
        <i class="fas fa-share" title="重做" :class="$parent.disableRedo ? 'disabled':''"
           @click="$parent.redoHandler"></i>
        <span class="separator"></span>
        <i class="fas fa-copy" title="复制" :class="$parent.disableCopy ? 'disabled':''" @click="$parent.copyHandler"></i>
        <i class="fas fa-paste" title="粘贴" :class="$parent.disablePaste ? 'disabled':''"
           @click="$parent.pasteHandler"></i>
        <i class="far fa-trash-alt" title="删除" :class="$parent.disableDelete ? 'disabled':''"
           @click="$parent.deleteHandler"></i>
        <span class="separator"></span>
        <i class="fas fa-search-plus" id="zoom-in" title="放大" @click="$parent.zoomInHandler"></i>
        <i class="fas fa-search-minus" title="缩小" @click="$parent.zoomOutHandler"></i>
        <i class="fas fa-compress" title="适应画布" @click="$parent.autoZoomHandler"></i>
        <i class="fas fa-expand" title="实际尺寸" @click="$parent.resetZoomHandler"></i>
        <span class="separator"></span>
        <i class="fas fa-vector-square" id="multi-select" title="多选" @click="$parent.multiSelectHandler"></i>
      </div>
      当前模式：{{ $parent.graphMode }}
    </el-col>
    <el-col :span="6" style="text-align: right;">
      <el-button size="mini" @click="$parent.changeModeHandler('preview')">预览</el-button>
      <el-button size="mini" @click="$parent.autoLayout">自动布局</el-button>
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
  /*z-index: 3;*/
  /*width: 100%;*/
  /*height: 42px;*/
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
    /*margin-right: 20px;*/
    line-height: 25px;
    text-align: left;
    /*border-right: 1px solid #E6E9ED;*/
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