var webpack = require('webpack');

var context = __dirname + '/src';
var entry = {
  javascript: './app.js',
  html: './index.html'
};
var loaders = [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel',
    query: {
      plugins: ['transform-es2015-arrow-functions']
    }
  },
  {
    test: /\.css$/,
    loader: 'style-loader!css-loader'
  },
  {
    test: /\.html$/,
    loader: 'file?name=[name].[ext]',
  }
];
var output = {
  filename: 'app.js',
  path: __dirname + '/dist',
};

var environments = {
  development: {
    devtool: 'eval',
    context: context,
    entry: entry,
    module: {
      loaders: loaders
    },
    output: output
  },
  production: {
    devtool: 'cheap-module-source-map',
    context: context,
    entry: entry,
    module: {
      loaders: loaders
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({minimize: true})
    ],
    output: output
  }
}

module.exports = environments[process.env.NODE_ENV] || environments.development;
