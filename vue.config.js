let path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  // 修改src为examples
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  chainWebpack: config => {
    // 模块路径别名
    config.resolve.alias
      .set('@', resolve('examples')); // key,value自行定义，比如.set('@@', resolve('src/components'))
    // 扩展 webpack 配置，使 packages 加入编译
    config.module
      .rule('js')
      .include
      .add(path.resolve(__dirname, 'packages'))
      .end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        // 修改它的选项...
        return options;
      });
  }
};
