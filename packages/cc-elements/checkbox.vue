<template>
  <div class="cc-checkbox" :class="{ 'checkbox-checked': checkVal }">
    <input
      id="checkbox"
      type="checkbox"
      v-model="checkVal"
      @change="handleChange"
    />
    <label for="checkbox"></label>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'CcCheckbox',
  data() {
    return {
      checkVal: false
    }
  },
  methods: {
    handleChange() {
      this.$emit('change', this.checkVal)
    }
  }
}
</script>

<style lang="scss" scoped>
.cc-checkbox {
  display: inline-block;
  color: #606266;
  font-size: 14px;

  input[type='checkbox'] + label {
    margin: 0 8px;
    cursor: pointer;
  }

  input[type='checkbox'] + label::before {
    content: '\a0';
    display: inline-block;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    line-height: 0.9;
    background-color: #fff;
    z-index: 1;
    -webkit-transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
    transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
  }

  input[type='checkbox']:checked + label::before {
    content: '\2714';
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
  }

  input[type='checkbox'] {
    opacity: 0;
    outline: 0;
    position: absolute;
    margin: 0;
    width: 0;
    height: 0;
    z-index: -1;
  }
}

.checkbox-checked {
  color: #409eff;
}
</style>
