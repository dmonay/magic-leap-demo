const webpack = require('webpack');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const jsSourcePath = path.join(__dirname, './client/source/js');
const buildPath = path.join(__dirname, './client/build');
const imgPath = path.join(__dirname, './client/source/assets');
const sourcePath = path.join(__dirname, './client/source');

let jsEntry = ['./index.js'];

// Common plugins
const plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity,
    filename: 'vendor-bundle.js'
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(nodeEnv)
    }
  }),
  new webpack.NamedModulesPlugin(),
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: [
        autoprefixer({
          browsers: ['last 3 version', 'ie >= 10']
        })
      ],
      context: sourcePath
    }
  })
];

// Common rules
const rules = [
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: ['babel-loader']
  },
  {
    test: /\.(jpg|ico|otf|eot|woff|woff2|ttf)$/,
    include: imgPath,
    // <limit use url-loader to return a Data URL; >limit, use file-loader to copy the file
    // if no limit provided, defaults to url-loader
    use: 'url-loader?limit=20480&name=assets/[name].[ext]'
  },
  {
    test: /\.(svg|gif|png)$/,
    include: imgPath,
    use: 'file-loader?name=assets/[name].[ext]'
  }
];

plugins.push(
  new ExtractTextPlugin('style-bundle.css'),
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
    'window.Tether': 'tether',
    tether: 'tether',
    Tether: 'tether'
  }),
  // Fixes warning in moment-with-locales.min.js
  new webpack.IgnorePlugin(/\.\/locale$/)
);

if (isProduction) {
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true
      },
      output: {
        comments: false
      }
    })
  );
}

if (!isProduction) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  jsEntry.push(
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true&__webpack_public_path=http://webpack:8080'
  );
}

rules.push({
  test: /\.(scss|css)$/,
  loader: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: 'css-loader!postcss-loader!sass-loader'
  })
});

module.exports = {
  context: jsSourcePath,
  entry: {
    js: jsEntry,
    vendor: ['bootstrap', 'd3', 'jquery', 'moment', 'react-dom', 'react']
  },
  output: {
    path: buildPath,
    publicPath: '',
    filename: 'app-bundle.js'
  },
  module: {
    rules
  },
  resolve: {
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx', '.css'],
    modules: [path.resolve(__dirname, 'node_modules'), jsSourcePath]
  },
  plugins,
  stats: 'none'
};
