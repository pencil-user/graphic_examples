const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');
const mySettings = require("./mySettings.json");

module.exports = {
  entry: mySettings.reduce((prev, current) => ({ ...prev, [current.name]: current.path }), {}), //{index: './src/index.ts', index2: './src/index2.ts'},
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },

  plugins: mySettings.map((value)=> new HtmlWebpackPlugin({
    inject : true,
    title: value.label,
    template: value.template,
    filename: `${value.name}.html`,
    chunks: [value.name]
  })),

  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 4000,
  },
};