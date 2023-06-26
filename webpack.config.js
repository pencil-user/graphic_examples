const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');
const mySettings = require("./mySettings.json");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  //context: __dirname,
  entry: mySettings.reduce((prev, current) => ({ ...prev, [current.name]: current.path }), {}), //{index: './src/index.ts', index2: './src/index2.ts'},
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|jp2|webp)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
      // {
      //   test: /\.glsl$/,
      //   loader: 'webpack-glsl'
      // },
      // {
      //   test: /\.gltf/,
      //   type: 'asset/resource'
      // }

    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },

  plugins: [

    ...mySettings.map((value) => new HtmlWebpackPlugin({
      inject: true,
      title: value.label,
      template: value.template,
      filename: `${value.name}.html`,
      chunks: [value.name]
    },
    )),

    new CopyWebpackPlugin(
      {
        patterns: [
          {
            from: "./public", to: './public',
            toType: 'dir'
          },
        ]
      },
    ),

  ],

  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 4000,
  },
};