<template>
  <button
    class="cc-button"
    @click="handleClick"
    :disabled="buttonDisabled"
    :class="[
      type ? 'cc-button--' + type : '',
      buttonSize ? 'cc-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-plain': plain
      }
    ]"
  >
    <span><slot></slot></span>
  </button>
</template>

<script>
export default {
  name: 'CcButton',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plain: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonSize() {
      return this.size
    },
    buttonDisabled() {
      return this.disabled
    }
  },
  methods: {
    handleClick(evt) {
      this.$emit('click', evt)
    }
  }
}
</script>

<style lang="scss" scoped>
.cc-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: .1s;
  transition: .1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}

.cc-button:focus, .cc-button:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

.cc-button--mini, .cc-button--mini.is-round {
  padding: 7px 15px;
}

.cc-button--mini, .cc-button--small {
  font-size: 12px;
  border-radius: 3px;
}
</style>
