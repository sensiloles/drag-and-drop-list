import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import postcssImport from 'postcss-import';
import postcssUrl from 'postcss-url';
import postcssPresetEnv from 'postcss-preset-env';
import postcssReporter from 'postcss-reporter';
import postcssBrowserReporter from 'postcss-browser-reporter';

const isProduction =
  process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV === 'production';
const sourcePath = path.join(__dirname, './src');
const outPath = path.join(__dirname, './build');

module.exports = {
  context: sourcePath,
  devtool: isProduction ? 'eval-source-map' : 'cheap-module-eval-source-map',
  entry: ['react-hot-loader/patch', path.resolve('./src/index.tsx')],
  output: {
    path: outPath,
    filename: isProduction ? '[contenthash].js' : '[hash].js',
    chunkFilename: isProduction ? '[name].[contenthash].js' : '[name].[hash].js'
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // (jsnext:main directs not usually distributable es6 format, but es6 sources)
    mainFields: ['module', 'browser', 'main'],
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },
  devServer: {
    contentBase: sourcePath,
    hot: true,
    inline: true,
    historyApiFallback: {
      disableDotRule: true
    },
    stats: 'minimal',
    clientLogLevel: 'warning'
  },
  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: 'empty',
    net: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        include: sourcePath,
        use: [
          !isProduction && {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              cacheDirectory: true,
              plugins: [
                '@babel/plugin-transform-runtime',
                '@babel/plugin-transform-arrow-functions',
                'react-hot-loader/babel'
              ]
            }
          },
          isProduction && {
            loader: 'ts-loader'
          }
        ].filter(Boolean)
      },
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            query: {
              modules: true,
              sourceMap: !isProduction,
              importLoaders: 1,
              localIdentName: isProduction
                ? '[hash:base64:5]'
                : '[local]__[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                postcssImport({ addDependencyTo: webpack }),
                postcssUrl(),
                postcssPresetEnv({
                  /* use stage 2 features (defaults) */
                  stage: 2
                }),
                postcssReporter(),
                postcssBrowserReporter({
                  disabled: isProduction
                })
              ]
            }
          }
        ]
      },
      { test: /\.html$/, use: 'html-loader' },
      { test: /\.(a?png|svg)$/, use: 'url-loader?limit=10000' },
      {
        test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2)$/,
        use: 'file-loader'
      }
    ]
  },
  optimization: {
    splitChunks: {
      name: true,
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          filename: isProduction
            ? 'vendor.[contenthash].js'
            : 'vendor.[hash].js',
          priority: -10
        }
      }
    },
    runtimeChunk: true
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      DEBUG: false
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[hash].css'
    }),
    new HtmlWebpackPlugin({
      template: 'assets/index.html',
      minify: {
        minifyJS: true,
        minifyCSS: true,
        removeComments: true,
        useShortDoctype: true,
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true
      },
      append: {
        head: '<script src="//cdn.polyfill.io/v3/polyfill.min.js"></script>'
      }
    })
  ]
};
