const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin } = require('webpack');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/, // Add TypeScript support
        exclude: /node_modules/,
        use: 'ts-loader', // Use ts-loader for TypeScript files
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'], // Add .ts and .tsx extensions
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ],
};