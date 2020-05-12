const path = require('path');
const webpack = require('webpack');
module.exports = {
  entry: path.resolve(__dirname, 'src/index'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "ide-sdk-api.js",
    library:"IdeSdkApi",
    libraryTarget:'umd'
  },
  // devtool: 'cheap-module-eval-source-map',
  module: {
      rules: [
          {
              test: /\.(js|jsx)$/,
              use: {
                  loader: 'babel-loader',
                  options: {
                      presets: ['env', 'es2015', 'stage-0']
                  }
              }
          }
      ]
  },
  // plugins:[
  //     new webpack.optimize.UglifyJsPlugin({
  //        compress: {warnings: false}
  //     })
  // ],
  // externals: {
  //     react: {
  //         root: 'React',
  //         commonjs2: 'react',
  //         commonjs: 'react',
  //         amd: 'react',
  //     },
  //     'react-dom': {
  //         root: 'ReactDOM',
  //         commonjs2: 'react-dom',
  //         commonjs: 'react-dom',
  //         amd: 'react-dom',
  //     }
  // },
  // resolve: {
  //   extensions: ['', '.js', '.jsx']
  // }
};