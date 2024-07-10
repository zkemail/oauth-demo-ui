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
    publicPath: '/'
  },
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    // proxy: {
    //   '/api': {
    //     target: process.env.REACT_APP_RELAYER_HOST,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': '/api',
    //     },
    //     // onProxyReq: (proxyReq, req, res) => {
    //     //   proxyReq.setHeader('Origin', 'https://frontend.com');
    //     // },
    //   }
    // }
    // before: function (app, server, compiler) {
    //   app.use((req, res, next) => {
    //     res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    //     res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    //     res.setHeader("Access-Control-Allow-Origin", "*");
    //     next();
    //   });
    // },
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
  devServer: {
    historyApiFallback: true,
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