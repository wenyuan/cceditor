<template>
  <div class="cc-dropdown" @mouseover="onMouseOver" @mouseout="onMouseOut">
    <span><a href="javascript:void(0);">{{ dropdownItems[activeIndex].label }}</a></span>
    <div class="cc-dropdown-menu" ref="dropdownMenu" @mouseover="onMouseOver">
      <ul>
        <li
          v-for="(dropdownItem, index) in dropdownItems"
          :key="index"
          @click="onItemClick(index, $event)"
        >
          <a href="javascript:void(0);">{{ dropdownItem.label }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CCDropdownList',
  props: {
    dropdownItems: {
      type: Array,
      default() {
        return [
          { value: 0, label: '未选择' },
          { value: 1, label: '选项一' },
          { value: 2, label: '选项二' },
          { value: 3, label: '选项三' }
        ]
      }
    },
    defaultIndex: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      activeIndex: this.defaultIndex,
      timeout: null
    }
  },
  watch: {
    activeIndex() {
      this.$emit('change', this.dropdownItems[this.activeIndex])
    }
  },
  methods: {
    onMouseOver() {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.$refs.dropdownMenu.style.display = 'block'
    },
    onMouseOut() {
      this.timeout = setTimeout(() => {
        this.$refs.dropdownMenu.style.display = 'none'
      }, 300)
    },
    onItemClick(index) {
      this.$refs.dropdownMenu.style.display = 'none'
      if (index !== this.activeIndex) {
        this.activeIndex = index
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cc-dropdown {
  position: relative;
  display: inline-block;
  min-width: 100px;
  text-align: center;
  a {
    color: #000;
    text-decoration: none;
  }
  ul,
  li {
    list-style: none;
  }
  span {
    display: block;
    z-index: 2;
    height: 30px;
    line-height: 30px;
    background-color: transparent;
    font-size: 14px;
    border-radius: 5px;
    -webkit-transition: all .2s ease-in;
    transition: all .2s ease-in;
  }
  span a:after{
    content: " ";
    display: inline-block;
    width: 0;
    height: 0;
    font-size: 0;
    line-height: 0;
    border-bottom: solid 6px #000;
    border-left: solid 4px transparent;
    border-right: solid 4px transparent;
    vertical-align: 3px;
    margin-left: 10px;
    -webkit-transition: all .2s ease-in;
    transition: all .2s ease-in;
  }
}

.cc-dropdown-menu {
  position: absolute;
  display: none;
  top: 50px;
  left: 0;
  right: 0;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  z-index: 1;

  /* 一个很重要的三角形*/
  li:first-child:before {
    display: block; /* 独占一行 */
    content: " ";
    font-size: 0;
    line-height: 0;
    margin: 0 auto; /* 居中 */
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.2); /* 配合整体一样的投影 */
    background-color: #fff;
    width: 10px;
    height: 10px;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg); /* 一个正方形倾斜四十五度就是三角了但是要把下半部分藏起来 */
    position: relative;
    top: -5px; /* 露出上半部分*/
    z-index: 1; /* 隐藏下半部分 */
    -webkit-transition: all .2s ease-in;
    transition: all .2s ease-in;
  }
  li a {
    color: #888;
    line-height: 46px;
    border-bottom: solid 1px #eee;
    font-size: 14px;
    display: block;
    background-color: #fff; /* 要有背景色才能盖住呀*/
    position: relative;
    z-index: 2; /* 这里很重要 要挡住三角形的下半部分*/
    -webkit-transition: all .2s ease-in;
    transition: all .2s ease-in;
  }
  /* 以下两块：控制第一个和最后一个li要圆角，因为最外边的div没有overflow 也不可以overflow*/
  li:first-child a{
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    margin-top: -10px;
  }
  li:last-child a{
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-bottom: none;
  }
  /*hover事件给了li，先改变三角 再改变a*/
  li:hover:before{
    background-color: #ecf5ff;
  }
  li:hover a {
    background-color: #ecf5ff;
    color: #66b1ff;
  }
}

.cc-dropdown:hover span{
  background-color: transparent;
}
.cc-dropdown:hover span a:after {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}
</style>
