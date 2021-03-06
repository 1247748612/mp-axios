const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

console.log(path.resolve(__dirname, '../'))

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  context: path.resolve(__dirname, '../'),
  /**
   * 遍历当前路径下所有文件夹，将文件夹中的 app.ts 文件作为入口文件
   */
  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    const fullDir = path.join(__dirname, dir)

    // 文件夹名前_为需要排除的
    if (dir.startsWith('_')) {
      return entries
    }

    // 判断是否是文件夹
    if (fs.statSync(fullDir).isDirectory()) {
      const entry = path.join(fullDir, 'app.ts')

      // 判断 app.ts 文件是否存在
      if (fs.existsSync(entry)) {
        entries[dir] = ['webpack-hot-middleware/client', entry]
      }
    }

    return entries
  }, {}),

  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/build/'
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.css?$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}
