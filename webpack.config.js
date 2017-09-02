const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const extractCSSFromVue = new ExtractTextPlugin('styles.css')
const extractCSSFromSASS = new ExtractTextPlugin('index.css')

module.exports = {
  entry: {
    main: './src/main.js',
    setup: './src/setup.js'
    // vendor: [
    //   'vue',
    //   'vue-router',
    //   'vuex'
    // ]
  },
  // output：模块的输出文件，其中有如下参数：
  // filename: 打包后的文件名
  // path: 打包文件存放的绝对路径。
  // publicPath: 网站运行时的访问路径。
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: '[name].js'
  },
  resolveLoader: {
    moduleExtensions: ['-loader']
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue',
        options: {
          preserveWhitespace: false,
          postcss: [
            require('autoprefixer')({
              browsers: ['last 3 versions']
            })
          ],
          loaders: {
            sass: extractCSSFromVue.extract({
              loader: 'css!sass!',
              fallbackLoader: 'vue-style-loader'
            })
          }
        }
      },
      {
        test: /\.scss$/,
        loader: extractCSSFromSASS.extract(['css', 'sass'])
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    extractCSSFromVue,
    extractCSSFromSASS,
    new CopyWebpackPlugin([
      {from: './src/assets/img', to: './'}
    ])
  ],
  resolve: {
    // 模块别名定义，方便后续直接引用别名，无须多写长长的地址
    alias: {
      'vue$': 'vue/dist/vue'// 后面直接引用 require(“vue$”)即可引用到模块
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    proxy: {
      '/': {
        target: 'http://localhost:3000/'
      }
    }
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({// 压缩代码
      compress: {
        warnings: false
      }
      // ,
      // except: ['$super', '$', 'exports', 'require']    //排除关键字
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
