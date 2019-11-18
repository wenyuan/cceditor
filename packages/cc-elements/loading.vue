<template>
  <div class="model-overlay">
    <div class="cc-loading">
      <svg class="circular" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="none" stroke="#409EFF" stroke-width="5%" stroke-linecap="round"/>
      </svg>
    </div>
    <span class="loading-text">{{ loadingText }}</span>
  </div>
</template>

<script>
export default {
  name: 'CcLoading',
  props: {
    loadingText: {
      type: String,
      default: '加载中...'
    }
  }
}
</script>

<style lang="scss" scoped>
.model-overlay {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  z-index: 1000;
  overflow: auto;
  background-color: transparent;
}

.cc-loading {
  position: absolute;
  width: 50px;
  top: 45%;
  left: 50%;

  &:before {
    content: '';
    display: block;
    padding-top: 100%;
  }

  .circular {
    position: absolute;
    top: 0;
    left: 0;
    animation: rotate 2s linear infinite;
  }

  circle {
    animation: circle-dash 1.5s ease-in-out infinite;
  }
}

@keyframes circle-dash {
  0% {
    stroke-dasharray: 1, 125;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 100, 125;
    stroke-dashoffset: -25px;
  }
  100% {
    stroke-dasharray: 100, 125;
    stroke-dashoffset: -125px;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  position: absolute;
  top: calc(45% + 60px);
  left: calc(50% - 10px);
  color: #409EFF;
  font-size: 14px;
}
</style>
