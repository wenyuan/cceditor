<template>
  <el-row class="toolbar">
    <el-col :span="3">
      <!--<el-checkbox class="edge-enabled" title="连线模式" @change="$parent.enableEdgeHandler"></el-checkbox>-->
      <el-dropdown class="edge-shape" trigger="click" @command="$parent.changeEdgeShape">
        <span class="el-dropdown-link">
          {{ $parent.currentEdgeShape.label }}<i class="iconfont icon-arrow-dropdown" style="padding-left: 5px;"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="edgeShape in $parent.edgeShapeList"
            :key="edgeShape.guid"
            :command="edgeShape.guid"
          >
            {{ edgeShape.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
    <el-col :span="14">
      <div class="graph-ops">
        <i class="iconfont icon-undo" title="撤销" :class="$parent.disableUndo ? 'disabled':''"
           @click="$parent.undoHandler"></i>
        <i class="iconfont icon-redo" title="重做" :class="$parent.disableRedo ? 'disabled':''"
           @click="$parent.redoHandler"></i>
        <span class="separator"></span>
        <i class="iconfont icon-copy" title="复制" :class="$parent.disableCopy ? 'disabled':''"
           @click="$parent.copyHandler"></i>
        <i class="iconfont icon-paste" title="粘贴" :class="$parent.disablePaste ? 'disabled':''"
           @click="$parent.pasteHandler"></i>
        <i class="iconfont icon-clear" title="删除" :class="$parent.disableDelete ? 'disabled':''"
           @click="$parent.deleteHandler"></i>
        <span class="separator"></span>
        <i class="iconfont icon-zoom-in" id="zoom-in" title="放大" @click="$parent.zoomInHandler"></i>
        <i class="iconfont icon-zoom-out" title="缩小" @click="$parent.zoomOutHandler"></i>
        <i class="iconfont icon-fit" title="适应画布" @click="$parent.autoZoomHandler"></i>
        <i class="iconfont icon-actualsize" title="实际尺寸" @click="$parent.resetZoomHandler"></i>
        <span class="separator"></span>
        <i class="iconfont icon-roi-select" id="multi-select" title="框选" @click="$parent.multiSelectHandler"></i>
      </div>
    </el-col>
    <el-col :span="7" style="text-align: right; padding-right: 5px;">
      <el-button size="mini" @click="$parent.changeModeHandler('preview')">预览</el-button>
      <el-button size="mini" @click="$parent.autoLayout">自动布局</el-button>
      <el-button size="mini" @click="$parent.getGraphData">获取json数据</el-button>
      <el-button size="mini" @click="$parent.refreshGraph">刷新页面数据</el-button>
    </el-col>
  </el-row>
</template>

<script>
import { Row, Col, Dropdown, DropdownMenu, DropdownItem, Button } from 'element-ui'

export default {
  name: 'ToolbarEdit',
  components: {
    // element-ui的组件
    'el-row': Row,
    'el-col': Col,
    'el-dropdown': Dropdown,
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem,
    'el-button': Button
  }
}
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

  .edge-shape {
    width: 100%;
    /*margin-right: 20px;*/
    line-height: 25px;
    text-align: center;
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