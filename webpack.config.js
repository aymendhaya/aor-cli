var path = require('path');

const config = {
  context: path.resolve(__dirname, 'src'),
  entry: './aor.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /src/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  node: {
    fs: 'empty'
  }
};
module.exports = config;
