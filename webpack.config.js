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
    loaders: []
  },
  {
    test: /\.css$/,
    loader: "style-loader!css-loader"
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
    context: context,
    entry: entry,
    module: {
      loaders: loaders
    },
    output: output
  },
  production: {
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
