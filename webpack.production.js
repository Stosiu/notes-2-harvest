const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
    sourceMapFilename: '[file].map',
    libraryTarget: 'umd',
  },
  mode: 'production',
  devtool: 'source-map',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.build.json'
            }
          }
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '~': path.resolve('src')
    }
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  optimization: {
    minimize: true,
  },
}
