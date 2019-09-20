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
  // 强制内联CSS
  // 默认true: 使用CSS分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用 <style> 方式内联至 html 文件中
  css: { extract: false },
  chainWebpack: config => {
    // 模块路径别名
    config.resolve.alias
      .set('@', path.resolve('examples'))
      .set('~', path.resolve('packages'));
    config.module
      .rule('eslint')
      .exclude.add(path.resolve('lib'))
      .end()
      .exclude.add(path.resolve('examples/docs'))
      .end();
    // 一种折中的办法：将图片资源转换成 base64 编码内联，解决图片路径的问题
    // 要求尽可能地使用小尺寸图片，此处限制在10kb
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        options.limit = 10240;
        return options;
      });
    // 扩展 webpack 配置，使 packages 加入编译
    config.module
      .rule('js')
      .include.add(path.resolve(__dirname, 'packages'))
      .end()
      .include.add(path.resolve(__dirname, 'examples'))
      .end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        // 修改它的选项...
        return options;
      });
  }
};
