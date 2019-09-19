<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
}

body, html {
  height: 100%;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  /*overflow-x: hidden;*/
  /*overflow-y: hidden;*/
}
</style>
