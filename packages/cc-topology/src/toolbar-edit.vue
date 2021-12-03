<template>
  <div class="toolbar">
    <div class="pull-right">
      <div class="graph-ops">
        <i class="iconfont icon-undo" title="撤销" :class="$parent.disableUndo ? 'disabled':''"
           @click="$parent.$parent.undoHandler"></i>
        <i class="iconfont icon-redo" title="重做" :class="$parent.disableRedo ? 'disabled':''"
           @click="$parent.$parent.redoHandler"></i>
        <span class="separator"></span>
        <i class="iconfont icon-copy" title="复制" :class="$parent.disableCopy ? 'disabled':''"
           @click="$parent.$parent.copyHandler"></i>
        <i class="iconfont icon-paste" title="粘贴" :class="$parent.disablePaste ? 'disabled':''"
           @click="$parent.$parent.pasteHandler"></i>
        <i class="iconfont icon-clear" title="删除" :class="$parent.disableDelete ? 'disabled':''"
           @click="$parent.$parent.deleteHandler"></i>
        <span class="separator"></span>
        <i class="iconfont icon-zoom-in" id="zoom-in" title="放大" @click="$parent.$parent.zoomInHandler"></i>
        <i class="iconfont icon-zoom-out" title="缩小" @click="$parent.$parent.zoomOutHandler"></i>
        <i class="iconfont icon-fit" title="适应画布" @click="$parent.$parent.autoZoomHandler"></i>
        <i class="iconfont icon-actualsize" title="实际尺寸" @click="$parent.$parent.resetZoomHandler"></i>
        <span class="separator"></span>
        <el-dropdown @command="$parent.$parent.changeEdgeShapeHandler" trigger="click">
          <span class="el-dropdown-link">
            {{$parent.$parent.currentEdgeShape.label}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="edgeShape in $parent.$parent.edgeShapeList"
              :command="edgeShape.guid"
              :key="edgeShape.guid">
              {{edgeShape.label}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-checkbox @change="$parent.$parent.enableMinimapHandler" style="margin-left: 8px; vertical-align: middle;">导航器</el-checkbox>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ToolbarEdit'
}
</script>

<style lang="scss" scoped>
.toolbar {
  position: absolute;
  width: 100%;
  color: #333;
  text-align: left;
  vertical-align: middle;
  line-height: 42px;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  z-index: 999;

  .graph-ops {
    display: inline-block;
    vertical-align: middle;
    margin: 0 16px;

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
      vertical-align: middle;
    }
  }

  .el-button {
    margin: 0 5px;
  }
}
</style>
<style lang="scss">
.graph-ops {
  .el-checkbox__input {
    vertical-align: baseline;

    .el-checkbox__inner {
      color: #a8a8a8 !important;
      background-color: transparent !important;
    }
  }

  .el-checkbox__label {
    vertical-align: text-bottom;
  }
}
</style>
