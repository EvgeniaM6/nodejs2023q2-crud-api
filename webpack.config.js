const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const EslintPlugin = require('eslint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';
  const config = {
    target: 'node',
    entry: './src/index.ts',
    plugins: [
      new CleanWebpackPlugin(),
      new EslintPlugin({ extensions: 'ts' }),
      new CopyWebpackPlugin({
        patterns: [
            { from: 'src/database', to: '../database' }
        ]
    })
    ],
    devtool: isProduction ? false : 'inline-source-map',
    resolve: {
      extensions: ['.ts', '.js', '.json'],
    },
    devServer: {
      static: './dist',
      historyApiFallback: true,
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist/script'),
      clean: true,
      globalObject: 'this',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader'
        },
        {
          test: /\.json$/i,
          loader: 'json5-loader',
          type: 'javascript/auto',
        }
      ]
    },
    optimization: {
      runtimeChunk: 'single',
    },
    mode: isProduction ? 'production' : 'development',
    resolve: {
      fallback: {
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
      },
      extensions: ['.ts', '.js', '.json'],
    }
  };
  return config;
};
