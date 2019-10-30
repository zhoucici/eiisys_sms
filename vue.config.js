const path = require('path')

module.exports = {

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './src/assets/less/var.less'),
      ]
    }
  },
  devServer: {
    proxy: {
        '/eiisys_sms': {
            target: 'http://122.112.204.156:8290',  // 测试地址
            changeOrigin: true,
            ws: true,
            pathRewrite: {
              '^/eiisys_sms': ''
            }
        }
    }
  }
}
